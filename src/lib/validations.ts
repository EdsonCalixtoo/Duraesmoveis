import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme sua senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Informe sua senha'),
});

export const addressSchema = z.object({
  zipCode: z.string().min(8, 'CEP inválido'),
  street: z.string().min(2, 'Logradouro é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'UF inválida'),
});

export const checkoutSchema = z.object({
  // Identificação
  name: z.string().min(3, 'Nome completo é obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone com DDD é obrigatório'),
  cpf: z.string().min(11, 'CPF é obrigatório'),
  // Endereço
  zipCode: z.string().min(8, 'CEP é obrigatório'),
  street: z.string().min(2, 'Endereço é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'UF é obrigatória'),
  // Envio
  shippingMethodId: z.string().min(1, 'Selecione uma forma de envio'),
  // Pagamento
  paymentMethod: z.enum(['PIX', 'CREDIT_CARD', 'BOLETO']),
  // Cartão (se aplicável)
  cardNumber: z.string().optional(),
  cardHolder: z.string().optional(),
  cardExpiration: z.string().optional(),
  cardCvv: z.string().optional(),
  installments: z.number().min(1).max(12).default(1),
  // Cupons e notas
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(3, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  subject: z.string().min(2, 'Assunto é obrigatório'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().min(1).max(5),
  title: z.string().min(2, 'Título é obrigatório'),
  comment: z.string().min(5, 'Comentário deve ter no mínimo 5 caracteres'),
});

export const productSchema = z.object({
  name: z.string().min(3, 'Nome do produto é obrigatório'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  price: z.number().positive('Preço deve ser maior que zero'),
  originalPrice: z.number().positive().optional().nullable(),
  discountPercent: z.number().min(0).max(100).default(0),
  sku: z.string().min(3, 'SKU é obrigatório'),
  stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  shortDescription: z.string().optional().nullable(),
  description: z.string().min(10, 'Descrição detalhada é obrigatória'),
  materials: z.string().optional().nullable(),
  dimensions: z.string().optional().nullable(),
  weightKg: z.number().positive().optional().nullable(),
  images: z.array(z.string().url()).min(1, 'Ao menos uma imagem é obrigatória'),
});

export const couponSchema = z.object({
  code: z.string().min(3, 'Código do cupom deve ter pelo menos 3 caracteres').toUpperCase(),
  description: z.string().optional().nullable(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().positive('Valor do desconto deve ser positivo'),
  minOrderValue: z.number().min(0).default(0),
  maxUses: z.number().int().positive().optional().nullable(),
  active: z.boolean().default(true),
});
