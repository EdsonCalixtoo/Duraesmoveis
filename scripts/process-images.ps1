Add-Type -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public class BatchProcessor2
{
    public static void ProcessImage(string srcPath, string destSquare, string destGallery, int squareSize, float cropYRatio, float cropXRatio, float sat, float cont, float bright)
    {
        using (Image src = Image.FromFile(srcPath))
        {
            int cropX = 0, cropY = 0;
            int cropW = src.Width, cropH = src.Height;

            if (src.Width > src.Height)
            {
                cropW = src.Height;
                cropH = src.Height;
                cropX = (int)((src.Width - cropW) * cropXRatio);
            }
            else
            {
                cropW = src.Width;
                cropH = src.Width;
                cropY = (int)((src.Height - cropH) * cropYRatio);
            }

            using (Bitmap dest = new Bitmap(squareSize, squareSize, PixelFormat.Format24bppRgb))
            {
                using (Graphics g = Graphics.FromImage(dest))
                {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.CompositingQuality = CompositingQuality.HighQuality;

                    float rw = 0.299f, gw = 0.587f, bw = 0.114f;
                    float s = sat;
                    float c = cont;
                    float b = bright;
                    float t = 0.5f * (1.0f - c) + b;
                    float invSat = 1.0f - s;

                    float[][] matrix = new float[][]
                    {
                        new float[] { (invSat * rw + s) * c, invSat * rw * c,       invSat * rw * c,       0f, 0f },
                        new float[] { invSat * gw * c,       (invSat * gw + s) * c, invSat * gw * c,       0f, 0f },
                        new float[] { invSat * bw * c,       invSat * bw * c,       (invSat * bw + s) * c, 0f, 0f },
                        new float[] { 0f,                    0f,                    0f,                    1f, 0f },
                        new float[] { t,                     t,                     t,                     0f, 1f }
                    };

                    using (ImageAttributes ia = new ImageAttributes())
                    {
                        ia.SetColorMatrix(new ColorMatrix(matrix), ColorMatrixFlag.Default, ColorAdjustType.Bitmap);
                        Rectangle destRect = new Rectangle(0, 0, squareSize, squareSize);
                        g.DrawImage(src, destRect, cropX, cropY, cropW, cropH, GraphicsUnit.Pixel, ia);
                    }
                }

                SaveJpeg(dest, destSquare, 96L);
            }

            // Gallery
            int galW = src.Width;
            int galH = src.Height;
            if (galW > 1600 || galH > 1600)
            {
                float scale = Math.Min(1600f / galW, 1600f / galH);
                galW = (int)(galW * scale);
                galH = (int)(galH * scale);
            }

            using (Bitmap destGal = new Bitmap(galW, galH, PixelFormat.Format24bppRgb))
            {
                using (Graphics g = Graphics.FromImage(destGal))
                {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.CompositingQuality = CompositingQuality.HighQuality;

                    float rw = 0.299f, gw = 0.587f, bw = 0.114f;
                    float s = sat;
                    float c = cont;
                    float b = bright;
                    float t = 0.5f * (1.0f - c) + b;
                    float invSat = 1.0f - s;

                    float[][] matrix = new float[][]
                    {
                        new float[] { (invSat * rw + s) * c, invSat * rw * c,       invSat * rw * c,       0f, 0f },
                        new float[] { invSat * gw * c,       (invSat * gw + s) * c, invSat * gw * c,       0f, 0f },
                        new float[] { invSat * bw * c,       invSat * bw * c,       (invSat * bw + s) * c, 0f, 0f },
                        new float[] { 0f,                    0f,                    0f,                    1f, 0f },
                        new float[] { t,                     t,                     t,                     0f, 1f }
                    };

                    using (ImageAttributes ia = new ImageAttributes())
                    {
                        ia.SetColorMatrix(new ColorMatrix(matrix), ColorMatrixFlag.Default, ColorAdjustType.Bitmap);
                        Rectangle destRect = new Rectangle(0, 0, galW, galH);
                        g.DrawImage(src, destRect, 0, 0, src.Width, src.Height, GraphicsUnit.Pixel, ia);
                    }
                }

                SaveJpeg(destGal, destGallery, 96L);
            }
        }
    }

    private static void SaveJpeg(Bitmap bmp, string path, long quality)
    {
        ImageCodecInfo jpegCodec = null;
        foreach (ImageCodecInfo codec in ImageCodecInfo.GetImageEncoders())
        {
            if (codec.MimeType == "image/jpeg")
            {
                jpegCodec = codec;
                break;
            }
        }
        EncoderParameters ep = new EncoderParameters(1);
        ep.Param[0] = new EncoderParameter(Encoder.Quality, quality);
        bmp.Save(path, jpegCodec, ep);
    }
}
'@ -ReferencedAssemblies System.Drawing

$items = @(
    @{
        src = "public/images/WhatsApp Image 2026-11-09 at 20.23.29.jpeg";
        slug = "prod-ombrelone-lateral-articulado";
        cropY = 0.5; cropX = 0.5; sat = 1.10; cont = 1.05; bright = 0.02
    },
    @{
        src = "public/images/WhatsApp Image 2026-11-09 at 20.23.30.jpeg";
        slug = "prod-ombrelone-floreira-detalhe";
        cropY = 0.35; cropX = 0.5; sat = 1.08; cont = 1.04; bright = 0.02
    },
    @{
        src = "public/images/WhatsApp Image 2026-11-09 at 20.25.18 (2).jpeg";
        slug = "prod-conjunto-mesa-vidro-poltronas";
        cropY = 0.52; cropX = 0.5; sat = 1.10; cont = 1.05; bright = 0.03
    },
    @{
        src = "public/images/WhatsApp Image 2026-11-09 at 20.26.34.jpeg";
        slug = "prod-espreguicadeira-fibra-marrom";
        cropY = 0.5; cropX = 0.30; sat = 1.12; cont = 1.06; bright = 0.03
    },
    @{
        src = "public/images/WhatsApp Image 2026-11-09 at 20.26.35 (1).jpeg";
        slug = "prod-espreguicadeira-wave-champagne";
        cropY = 0.35; cropX = 0.5; sat = 1.10; cont = 1.05; bright = 0.02
    },
    @{
        src = "public/images/WhatsApp Image 2026-11-09 at 20.26.36 (1).jpeg";
        slug = "prod-espreguicadeira-grafite-trio";
        cropY = 0.5; cropX = 0.55; sat = 1.12; cont = 1.05; bright = 0.02
    },
    @{
        src = "public/images/WhatsApp Image 2026-11-09 at 20.26.36 (2).jpeg";
        slug = "prod-espreguicadeira-corda-terracota";
        cropY = 0.50; cropX = 0.5; sat = 1.12; cont = 1.06; bright = 0.02
    },
    @{
        src = "public/images/WhatsApp Image 2026-11-09 at 20.26.37 (1).jpeg";
        slug = "prod-espreguicadeira-nautica-areia";
        cropY = 0.60; cropX = 0.5; sat = 1.10; cont = 1.06; bright = 0.03
    },
    @{
        src = "public/images/WhatsApp Image 2026-11-09 at 20.21.19.jpeg";
        slug = "prod-conjunto-mesa-ripada-preta";
        cropY = 0.45; cropX = 0.5; sat = 1.12; cont = 1.06; bright = 0.03
    }
)

foreach ($item in $items) {
    $slug = $item["slug"]
    $destSq = "public/images/products/$slug.jpg"
    $destGal = "public/images/products/$slug-gallery.jpg"
    [BatchProcessor2]::ProcessImage($item["src"], $destSq, $destGal, 1200, [float]$item["cropY"], [float]$item["cropX"], [float]$item["sat"], [float]$item["cont"], [float]$item["bright"])
    Write-Output "Processed: $slug -> Square & Gallery"
}
