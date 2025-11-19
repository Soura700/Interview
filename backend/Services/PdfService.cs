using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;

namespace backend.Services
{
    public class PdfService
    {
        public byte[] GenerateOfferLetter(string fullName, string email)
        {
            using (var ms = new MemoryStream())
            {
                PdfDocument doc = new PdfDocument();
                PdfPage page = doc.AddPage();
                var gfx = XGraphics.FromPdfPage(page);

                // FONTS
                var titleFont = new XFont("Verdana", 26, XFontStyle.Bold);
                var headerFont = new XFont("Verdana", 20, XFontStyle.Bold);
                var textFont = new XFont("Verdana", 14, XFontStyle.Regular);
                var boldTextFont = new XFont("Verdana", 14, XFontStyle.Bold);

                double margin = 50;
                double y = margin;

                // TITLE
                gfx.DrawString(
                    "OFFICIAL OFFER LETTER",
                    titleFont,
                    XBrushes.DarkRed,
                    new XRect(0, y, page.Width, 40),
                    XStringFormats.TopCenter
                );

                y += 70;

                // GREETING
                gfx.DrawString($"Dear {fullName},", headerFont, XBrushes.Black, margin, y);
                y += 40;

                // LONG PARAGRAPH → Split manually
                string body =
                    "We are pleased to inform you that you have been successfully selected for a position in our organization.\n" +
                    "Your performance throughout the interview process was truly impressive.\n\n" +
                    "Our HR team will contact you shortly with details regarding onboarding, documentation, and joining dates.\n\n" +
                    "Below are your registered details:";

                y = DrawMultilineText(gfx, body, textFont, margin, y, page.Width - margin * 2, 22);

                // REGISTERED EMAIL
                gfx.DrawString($"Registered Email: {email}", boldTextFont, XBrushes.DarkRed, margin, y + 20);
                y += 60;

                // CLOSING
                string closing =
                    "We are excited to welcome you to our team.\n" +
                    "Should you have any questions, feel free to reach out.\n\n" +
                    "Warm Regards,\nHR Team";

                DrawMultilineText(gfx, closing, textFont, margin, y, page.Width - margin * 2, 22);

                doc.Save(ms);
                return ms.ToArray();
            }
        }

        // SAFE LINE-BY-LINE DRAWING
        private double DrawMultilineText(
            XGraphics gfx,
            string text,
            XFont font,
            double x,
            double y,
            double maxWidth,
            double lineHeight)
        {
            string[] lines = text.Split('\n');

            foreach (var line in lines)
            {
                // Add wrapping for wide text
                var words = line.Split(' ');
                string currentLine = "";

                foreach (var word in words)
                {
                    string testLine = currentLine + word + " ";

                    var size = gfx.MeasureString(testLine, font);
                    if (size.Width > maxWidth)
                    {
                        gfx.DrawString(currentLine, font, XBrushes.Black, new XPoint(x, y));
                        y += lineHeight;
                        currentLine = word + " ";
                    }
                    else
                    {
                        currentLine = testLine;
                    }
                }

                gfx.DrawString(currentLine, font, XBrushes.Black, new XPoint(x, y));
                y += lineHeight;
            }

            return y;
        }
    }
}