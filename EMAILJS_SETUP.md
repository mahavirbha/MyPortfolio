# EmailJS Setup Guide

EmailJS allows you to send emails directly from your frontend without needing a backend server. This is perfect for your portfolio!

## Steps to Setup EmailJS

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Click **"Sign Up"** and create a free account
3. Verify your email

### 2. Add Email Service
1. In EmailJS Dashboard, go to **Email Services**
2. Click **"Add Service"**
3. Select **Gmail** (or your email provider)
4. Click **"Connect Account"**
5. Authenticate with your Gmail account
6. Copy the **Service ID** (looks like `gmail` or `service_xxxxx`)

### 3. Create Email Template
1. Go to **Email Templates** in the Dashboard
2. Click **"Create New Template"**
3. Set **Template Name**: `portfolio_like_notification`
4. Set **Template ID**: `portfolio_like_notification`
5. In the template editor, paste this thank you message HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #cc4b2c, #8b3320); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; margin: -20px -20px 20px -20px; }
    .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
    .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
    .content { padding: 20px 0; }
    .message { font-size: 16px; line-height: 1.8; color: #555; margin-bottom: 20px; }
    .details { background: #f9f9f9; padding: 15px; border-left: 4px solid #cc4b2c; border-radius: 4px; margin: 20px 0; }
    .details p { margin: 8px 0; color: #666; }
    .cta-section { text-align: center; margin: 30px 0; }
    .cta-button { display: inline-block; background: #cc4b2c; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; }
    .footer { border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; text-align: center; color: #999; font-size: 12px; }
    .social-links { margin: 15px 0; }
    .social-links a { color: #cc4b2c; text-decoration: none; margin: 0 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You! 🎉</h1>
      <p>Your appreciation means a lot!</p>
    </div>
    
    <div class="content">
      <div class="message">
        <p>Hi {{user_name}},</p>
        <p>Thank you so much for liking my portfolio! 💖 Your support and appreciation mean the world to me and motivate me to continue creating amazing projects.</p>
        <p>I'm always excited to hear from visitors like you. If you'd like to discuss collaboration opportunities, have any questions, or just want to chat, feel free to reach out!</p>
      </div>
      
      <div class="details">
        <p><strong>📅 You liked on:</strong> {{liked_at}}</p>
        <p><strong>👤 Name:</strong> {{user_name}}</p>
      </div>
      
      <div class="cta-section">
        <p style="margin-bottom: 15px; color: #666;">Let's stay connected!</p>
        <div class="social-links">
          <a href="https://github.com/mahavirbha" style="color: #cc4b2c; text-decoration: none; margin: 0 10px; font-weight: bold;">🐙 GitHub</a> | 
          <a href="https://linkedin.com/in/mahavirbha" style="color: #cc4b2c; text-decoration: none; margin: 0 10px; font-weight: bold;">💼 LinkedIn</a> | 
          <a href="https://twitter.com" style="color: #cc4b2c; text-decoration: none; margin: 0 10px; font-weight: bold;">𝕏 Twitter</a>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>This is an automated message from my portfolio website.</p>
      <p>© 2025 Mahavirsinh. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

6. Click **"Save"**

### 4. Get Your Public Key
1. Go to **Account** in the Dashboard (top right menu)
2. Copy your **Public Key** (starts with `xxx_`)

### 5. Update Your Code
1. Open [src/js/modules/likeButton.js](src/js/modules/likeButton.js)
2. Find this line at the top:
   ```javascript
   const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';
   ```
3. Replace `YOUR_EMAILJS_PUBLIC_KEY` with your actual public key from step 4
4. If you used a different Service ID, update this line:
   ```javascript
   const EMAILJS_SERVICE_ID = 'gmail'; // Change if different
   ```

### 6. Test It
1. Save the file
2. Go to your portfolio website
3. Click the like button
4. Sign in with Google
5. Check your email (mahavirsinhchauhan00@gmail.com) - you should receive a notification!

## Troubleshooting

**No email received?**
- Check spam/junk folder
- Verify your email is connected in EmailJS Email Services
- Check the browser console for errors (F12)

**"EmailJS not loaded" error?**
- The script takes a moment to load - this is normal
- The next like attempt should work

**Want to change the recipient email?**
- Update the `to_email` value in `sendEmailNotification()` function in [src/js/modules/likeButton.js](src/js/modules/likeButton.js)

## Pricing
EmailJS free tier includes:
- ✅ 200 emails/month free
- ✅ Unlimited contacts
- ✅ Up to 5 email addresses
- Perfect for a portfolio!

## Resources
- [EmailJS Docs](https://www.emailjs.com/docs/)
- [Email Template Variables](https://www.emailjs.com/docs/template/create-email-template/)
