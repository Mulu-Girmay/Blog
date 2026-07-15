const nodemailer = require("nodemailer");

// Configure email transporter
// For testing, we'll use Ethereal (fake SMTP)
// For production, use SendGrid, Mailgun, or your SMTP provider

let transporter;

// Initialize email transporter
const initTransporter = () => {
  // For development - use Ethereal (fake email service)
  if (process.env.NODE_ENV === "development" || !process.env.SMTP_HOST) {
    return nodemailer.createTestAccount().then((account) => {
      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
    });
  }

  // For production - use real SMTP
  return Promise.resolve(
    nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }),
  );
};

// Send email
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!transporter) {
      transporter = await initTransporter();
    }

    const mailOptions = {
      from:
        process.env.FROM_EMAIL || '"Your Law Blog" <noreply@yourlawblog.com>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Plain text fallback
    };

    const info = await transporter.sendMail(mailOptions);

    // Log preview URL for Ethereal
    if (process.env.NODE_ENV === "development") {
      console.log(
        "📧 Email sent! Preview URL:",
        nodemailer.getTestMessageUrl(info),
      );
    }

    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};

// Send question answered notification
const sendQuestionAnsweredNotification = async (question, answer) => {
  const subject = "✅ Your Legal Question Has Been Answered";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Georgia, serif; color: #2C2C2C; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #B8860B; }
        .header h1 { font-family: "Playfair Display", serif; color: #8B3A3A; }
        .content { padding: 30px 0; }
        .question-box { background: #FDF6E3; padding: 20px; border-left: 4px solid #8B3A3A; margin: 20px 0; }
        .answer-box { background: #FFF8EE; padding: 20px; border-left: 4px solid #B8860B; margin: 20px 0; }
        .footer { text-align: center; padding: 20px 0; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
        .btn { display: inline-block; background: #8B3A3A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>⚖️ Your Law Blog</h1>
        <p style="color: #666;">Legal clarity in a complex world</p>
      </div>
      
      <div class="content">
        <h2>Your Question Has Been Answered!</h2>
        <p>Hi,</p>
        <p>Great news! Your legal question has been answered by our legal expert.</p>
        
        <div class="question-box">
          <h3>📝 Your Question:</h3>
          <p><strong>Subject:</strong> ${question.subject}</p>
          <p>${question.question}</p>
        </div>
        
        <div class="answer-box">
          <h3>💡 Answer:</h3>
          <p>${answer}</p>
          ${question.answeredBy ? `<p><em>Answered by: ${question.answeredBy}</em></p>` : ""}
        </div>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="${process.env.SITE_URL || "http://localhost:3000"}/profile" class="btn">View Your Questions</a>
        </p>
        
        <p style="color: #666; font-size: 14px;">
          This is for informational purposes only and does not constitute legal advice.
        </p>
      </div>
      
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Your Law Blog. All rights reserved.</p>
        <p style="font-size: 12px;">
          You received this because you asked a question on our blog.
          <br>To unsubscribe, update your notification settings in your <a href="${process.env.SITE_URL || "http://localhost:3000"}/profile">profile</a>.
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: question.email,
    subject,
    html,
  });
};

// Send new post notification to all subscribers
const sendNewPostNotification = async (post, subscribers) => {
  const subject = `📰 New Article: ${post.title}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Georgia, serif; color: #2C2C2C; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #B8860B; }
        .header h1 { font-family: "Playfair Display", serif; color: #8B3A3A; }
        .content { padding: 30px 0; }
        .post-box { background: #FDF6E3; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .post-box h2 { font-family: "Playfair Display", serif; color: #2C2C2C; }
        .post-meta { color: #666; font-size: 14px; }
        .footer { text-align: center; padding: 20px 0; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
        .btn { display: inline-block; background: #8B3A3A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>⚖️ Your Law Blog</h1>
        <p style="color: #666;">Legal clarity in a complex world</p>
      </div>
      
      <div class="content">
        <h2>New Article Published!</h2>
        <p>Hi,</p>
        <p>We've just published a new article that you might find interesting:</p>
        
        <div class="post-box">
          <h2>${post.title}</h2>
          <p class="post-meta">
            📂 ${post.category || "General"} • 📖 ${post.readTime || 3} min read
          </p>
          <p>${post.excerpt || ""}</p>
        </div>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="${process.env.SITE_URL || "http://localhost:3003"}/post/${post.slug}" class="btn">Read Full Article</a>
        </p>
        
        <p style="color: #666; font-size: 14px;">
          This is for informational purposes only and does not constitute legal advice.
        </p>
      </div>
      
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Your Law Blog. All rights reserved.</p>
        <p style="font-size: 12px;">
          You received this because you subscribed to new post notifications.
          <br>To unsubscribe, update your notification settings in your <a href="${process.env.SITE_URL || "http://localhost:3000"}/profile">profile</a>.
        </p>
      </div>
    </body>
    </html>
  `;

  // Send to all subscribers
  const results = [];
  for (const subscriber of subscribers) {
    try {
      await sendEmail({
        to: subscriber.email,
        subject,
        html,
      });
      results.push({ email: subscriber.email, success: true });
    } catch (error) {
      results.push({
        email: subscriber.email,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
};

module.exports = {
  sendEmail,
  sendQuestionAnsweredNotification,
  sendNewPostNotification,
  initTransporter,
};
