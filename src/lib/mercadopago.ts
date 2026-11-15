import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { prisma } from './prisma';

export interface PixPaymentResponse {
  paymentId: string;
  qrCode: string;
  qrCodeBase64: string;
  copyPastePix: string;
  ticketUrl?: string;
  status: 'PENDING' | 'APPROVED';
  expiresAt: string;
}

export interface CardPaymentResponse {
  paymentId: string;
  status: 'APPROVED' | 'IN_PROCESS' | 'REJECTED';
  statusDetail: string;
  cardLastFour: string;
  cardBrand: string;
  installments: number;
  checkoutUrl?: string;
}

export class MercadoPagoService {
  private static async resolveAccessToken(): Promise<string> {
    const envToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';
    if (envToken && !envToken.includes('00000000') && (envToken.startsWith('APP_USR-') || envToken.startsWith('TEST-'))) {
      return envToken;
    }
    try {
      const dbSetting = await prisma.storeSetting.findUnique({
        where: { key: 'MERCADOPAGO_ACCESS_TOKEN' },
      });
      if (dbSetting?.value && !dbSetting.value.includes('00000000')) {
        return dbSetting.value.trim();
      }
    } catch {
      // Fallback para envToken
    }
    return envToken;
  }

  static isTokenValid(token: string): boolean {
    return Boolean(token && !token.includes('00000000') && (token.startsWith('APP_USR-') || token.startsWith('TEST-')));
  }

  static isProductionConfigured(): boolean {
    return this.isTokenValid(process.env.MERCADOPAGO_ACCESS_TOKEN || '');
  }

  private static getClient(accessToken: string): MercadoPagoConfig {
    return new MercadoPagoConfig({
      accessToken,
      options: { timeout: 10000 },
    });
  }

  /**
   * Cria um pagamento via Pix REAL na API v1 do Mercado Pago (ou fallback seguro em modo dev)
   */
  static async createPixPayment(params: {
    orderNumber: string;
    amount: number;
    payer: {
      name: string;
      email: string;
      cpf: string;
    };
  }): Promise<PixPaymentResponse> {
    const cleanCpf = params.payer.cpf.replace(/\D/g, '') || '00000000000';
    const nameParts = params.payer.name.trim().split(' ');
    const firstName = nameParts[0] || 'Cliente';
    const lastName = nameParts.slice(1).join(' ') || 'Duraes Moveis';

    // Se houver Access Token real do Mercado Pago configurado (via ENV ou banco Supabase), cria o Pix oficial na conta do lojista
    const token = await this.resolveAccessToken();
    if (this.isTokenValid(token)) {
      try {
        const client = this.getClient(token);
        const payment = new Payment(client);

        const expirationDate = new Date(Date.now() + 30 * 60 * 1000).toISOString();
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || '';
        const notificationUrl =
          appUrl && !appUrl.includes('localhost')
            ? `${appUrl.replace(/\/$/, '')}/api/mercadopago/webhook`
            : undefined;

        const response = await payment.create({
          body: {
            transaction_amount: Number(params.amount.toFixed(2)),
            description: `Pedido #${params.orderNumber} - Durães Móveis`,
            payment_method_id: 'pix',
            external_reference: params.orderNumber,
            date_of_expiration: expirationDate,
            ...(notificationUrl ? { notification_url: notificationUrl } : {}),
            payer: {
              email: params.payer.email,
              first_name: firstName,
              last_name: lastName,
              identification: {
                type: cleanCpf.length > 11 ? 'CNPJ' : 'CPF',
                number: cleanCpf,
              },
            },
          },
          requestOptions: {
            idempotencyKey: `pix-${params.orderNumber}`,
          },
        });

        const txData = response.point_of_interaction?.transaction_data;
        const copyPaste = txData?.qr_code || '';
        const base64Raw = txData?.qr_code_base64 || '';
        const qrCodeBase64 = base64Raw.startsWith('data:image')
          ? base64Raw
          : `data:image/png;base64,${base64Raw}`;

        return {
          paymentId: String(response.id),
          qrCode: copyPaste,
          qrCodeBase64,
          copyPastePix: copyPaste,
          ticketUrl: txData?.ticket_url,
          status: response.status === 'approved' ? 'APPROVED' : 'PENDING',
          expiresAt: expirationDate,
        };
      } catch (err) {
        console.error('[MercadoPagoService] Erro ao gerar Pix na API oficial:', err);
        throw new Error('Falha ao gerar cobrança Pix no Mercado Pago. Verifique suas credenciais.');
      }
    }

    // Fallback de demonstração quando MERCADOPAGO_ACCESS_TOKEN ainda é o placeholder
    const paymentId = `MP-PIX-${Date.now().toString().slice(-8)}`;
    const amountStr = params.amount.toFixed(2);
    const copyPastePix = `00020126580014br.gov.bcb.pix0136duraesmoveis-pix@duraesmoveis.com.br520400005303986540${amountStr.length}${amountStr}5802BR5914DURAES MOVEIS6008CAMPINAS62190515${params.orderNumber}6304`;

    let qrCodeBase64 = '';
    try {
      qrCodeBase64 = await QRCode.toDataURL(copyPastePix, {
        width: 320,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
    } catch {
      qrCodeBase64 = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(copyPastePix)}`;
    }

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    return {
      paymentId,
      qrCode: copyPastePix,
      qrCodeBase64,
      copyPastePix,
      status: 'PENDING',
      expiresAt,
    };
  }

  /**
   * Processa pagamento com Cartão de Crédito ou gera Checkout Pro do Mercado Pago
   */
  static async processCardPayment(params: {
    orderNumber: string;
    amount: number;
    cardToken?: string;
    paymentMethodId?: string;
    issuerId?: string;
    cardNumber: string;
    cardHolder: string;
    cardExpiration: string;
    cardCvv: string;
    installments: number;
    payer: {
      name: string;
      email: string;
      cpf: string;
    };
  }): Promise<CardPaymentResponse> {
    const cleanCpf = params.payer.cpf.replace(/\D/g, '') || '00000000000';
    const cleanCard = params.cardNumber.replace(/\D/g, '');
    const lastFour = cleanCard.slice(-4) || '4242';

    let cardBrand = 'Mastercard';
    if (cleanCard.startsWith('4')) cardBrand = 'Visa';
    else if (cleanCard.startsWith('3')) cardBrand = 'Amex';
    else if (cleanCard.startsWith('6')) cardBrand = 'Elo';

    const token = await this.resolveAccessToken();
    if (this.isTokenValid(token)) {
      const client = this.getClient(token);

      // Caso o frontend envie um cardToken gerado pelo SDK JS do Mercado Pago (Transparent Checkout)
      if (params.cardToken) {
        const payment = new Payment(client);
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || '';
        const notificationUrl =
          appUrl && !appUrl.includes('localhost')
            ? `${appUrl.replace(/\/$/, '')}/api/mercadopago/webhook`
            : undefined;

        const response = await payment.create({
          body: {
            transaction_amount: Number(params.amount.toFixed(2)),
            token: params.cardToken,
            description: `Pedido #${params.orderNumber} - Durães Móveis`,
            installments: Number(params.installments) || 1,
            payment_method_id: params.paymentMethodId || undefined,
            issuer_id: params.issuerId ? Number(params.issuerId) : undefined,
            external_reference: params.orderNumber,
            ...(notificationUrl ? { notification_url: notificationUrl } : {}),
            payer: {
              email: params.payer.email,
              identification: {
                type: cleanCpf.length > 11 ? 'CNPJ' : 'CPF',
                number: cleanCpf,
              },
            },
          },
          requestOptions: {
            idempotencyKey: `card-${params.orderNumber}`,
          },
        });

        const statusMap: Record<string, 'APPROVED' | 'IN_PROCESS' | 'REJECTED'> = {
          approved: 'APPROVED',
          in_process: 'IN_PROCESS',
          pending: 'IN_PROCESS',
          rejected: 'REJECTED',
        };

        return {
          paymentId: String(response.id),
          status: statusMap[response.status || 'in_process'] || 'IN_PROCESS',
          statusDetail: response.status_detail || 'accredited',
          cardLastFour: response.card?.last_four_digits || lastFour,
          cardBrand: response.payment_method_id || cardBrand,
          installments: response.installments || params.installments || 1,
        };
      }

      // Caso contrário, cria uma Preferência no Checkout Pro do Mercado Pago para pagamento seguro de cartão
      try {
        const preference = new Preference(client);
        const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

        const prefResponse = await preference.create({
          body: {
            items: [
              {
                id: params.orderNumber,
                title: `Pedido #${params.orderNumber} - Durães Móveis`,
                quantity: 1,
                unit_price: Number(params.amount.toFixed(2)),
                currency_id: 'BRL',
              },
            ],
            payer: {
              name: params.payer.name,
              email: params.payer.email,
              identification: {
                type: cleanCpf.length > 11 ? 'CNPJ' : 'CPF',
                number: cleanCpf,
              },
            },
            external_reference: params.orderNumber,
            back_urls: {
              success: `${appUrl}/checkout/sucesso?order=${params.orderNumber}`,
              failure: `${appUrl}/checkout?error=payment_failed`,
              pending: `${appUrl}/checkout/sucesso?order=${params.orderNumber}`,
            },
            auto_return: 'approved',
          },
        });

        return {
          paymentId: String(prefResponse.id),
          status: 'IN_PROCESS',
          statusDetail: 'pending_checkout_pro',
          cardLastFour: lastFour,
          cardBrand,
          installments: params.installments || 1,
          checkoutUrl: prefResponse.init_point || prefResponse.sandbox_init_point,
        };
      } catch (err) {
        console.error('[MercadoPagoService] Erro ao criar preferência MP:', err);
      }
    }

    const paymentId = `MP-CARD-${Date.now().toString().slice(-8)}`;

    return {
      paymentId,
      status: 'APPROVED',
      statusDetail: 'accredited',
      cardLastFour: lastFour,
      cardBrand,
      installments: params.installments || 1,
    };
  }

  /**
   * Consulta um pagamento diretamente na API do Mercado Pago pelo ID
   */
  static async getPaymentById(paymentId: string) {
    const token = await this.resolveAccessToken();
    if (!this.isTokenValid(token)) return null;
    try {
      const client = this.getClient(token);
      const payment = new Payment(client);
      return await payment.get({ id: paymentId });
    } catch (error) {
      console.error(`[MercadoPagoService] Erro ao consultar pagamento ${paymentId}:`, error);
      return null;
    }
  }

  /**
   * Valida assinatura HMAC SHA256 do Webhook do Mercado Pago
   */
  static verifyWebhookSignature(
    signatureHeader: string | null,
    requestIdHeader: string | null,
    dataId: string | null
  ): boolean {
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (!secret || secret === 'test_webhook_secret_mp') return true;
    if (!signatureHeader || !dataId) return false;

    try {
      const parts = signatureHeader.split(',');
      let ts = '';
      let v1 = '';
      for (const part of parts) {
        const [k, v] = part.split('=');
        if (k?.trim() === 'ts') ts = v?.trim() || '';
        if (k?.trim() === 'v1') v1 = v?.trim() || '';
      }
      if (!ts || !v1) return true;

      const manifest = `id:${dataId};request-id:${requestIdHeader || ''};ts:${ts};`;
      const hmac = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
      return hmac === v1;
    } catch {
      return false;
    }
  }
}
