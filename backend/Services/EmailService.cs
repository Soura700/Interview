// using backend.Interfaces;
// using MailKit.Net.Smtp;
// using MimeKit;

// namespace backend.Services;

// public class EmailService : IEmailService
// {
//     private readonly IConfiguration _config;

//     public EmailService(IConfiguration config)
//     {
//         _config = config;
//     }

//     public async Task SendEmailAsync(string to, string subject, string body)
//     {
//         var email = new MimeMessage();
//         email.From.Add(MailboxAddress.Parse(_config["EmailSettings:From"]));
//         email.To.Add(MailboxAddress.Parse(to));
//         email.Subject = subject;
//         email.Body = new TextPart("plain") { Text = body };

//         using var smtp = new SmtpClient();
//         await smtp.ConnectAsync(
//             _config["EmailSettings:SmtpServer"],
//             int.Parse(_config["EmailSettings:Port"]),
//             MailKit.Security.SecureSocketOptions.StartTls
//         );

//         await smtp.AuthenticateAsync(
//             _config["EmailSettings:Username"],
//             _config["EmailSettings:Password"]
//         );

//         await smtp.SendAsync(email);
//         await smtp.DisconnectAsync(true);
//     }
// }



// // kxyd yzlh mqho fvsr


using backend.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                // Create Email
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(_config["EmailSettings:From"]));
                email.To.Add(MailboxAddress.Parse(to));
                email.Subject = subject;
                email.Body = new TextPart("plain") { Text = body };

                using var smtp = new SmtpClient();

                // Connect to Gmail SMTP using STARTTLS
                await smtp.ConnectAsync(
                    _config["EmailSettings:SmtpServer"],
                    int.Parse(_config["EmailSettings:Port"]),
                    SecureSocketOptions.StartTls
                );

                // Authenticate using Gmail App Password (not normal password)
                await smtp.AuthenticateAsync(
                    _config["EmailSettings:Username"],
                    _config["EmailSettings:Password"]
                );

                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                Console.WriteLine($"✅ Email sent successfully to {to}");
            }
            catch (MailKit.Security.AuthenticationException ex)
            {
                Console.WriteLine("❌ Authentication failed: " + ex.Message);
                Console.WriteLine("➡ Check Gmail App Password or 2-Step Verification settings.");
                throw; // Optional: rethrow to let API handle it
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Failed to send email: " + ex.Message);
                throw;
            }
        }

        public async Task SendEmailWithAttachmentAsync(string to, string subject, string body, byte[] pdfBytes, string fileName)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(_config["EmailSettings:From"]));
                email.To.Add(MailboxAddress.Parse(to));
                email.Subject = subject;

                var builder = new BodyBuilder
                {
                    TextBody = body
                };

                // 📎 Attach PDF
                builder.Attachments.Add(fileName, pdfBytes, ContentType.Parse("application/pdf"));

                email.Body = builder.ToMessageBody();

                using var smtp = new SmtpClient();

                await smtp.ConnectAsync(
                    _config["EmailSettings:SmtpServer"],
                    int.Parse(_config["EmailSettings:Port"]),
                    SecureSocketOptions.StartTls
                );

                await smtp.AuthenticateAsync(
                    _config["EmailSettings:Username"],
                    _config["EmailSettings:Password"]
                );

                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                Console.WriteLine($"📨 Offer letter sent to: {to}");
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Failed to send attachment email: " + ex.Message);
                throw;
            }
        }

    }
}
