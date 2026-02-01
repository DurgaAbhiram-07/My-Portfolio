const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL === '*' ? '*' : (process.env.FRONTEND_URL || 'http://localhost:3000'),
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Rate limiting for contact form
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many contact requests from this IP, please try again later.'
});

// Email transporter configuration
let transporter;

if (process.env.EMAIL_SERVICE === 'gmail') {
    // Gmail with App Password
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
} else {
    // Generic SMTP configuration
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
}

// Verify transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email transporter error:', error.message);
        console.error('   Make sure your email credentials are correct');
        console.error('   For Gmail: Use an App Password, not your regular password');
    } else if (success) {
        console.log('✅ Email transporter ready to send messages');
    }
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Test email configuration
app.get('/api/test-email', async (req, res) => {
    try {
        const testMail = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Portfolio Test Email',
            html: '<h2>Test Email</h2><p>If you received this, your email configuration is working!</p>'
        };
        
        await transporter.sendMail(testMail);
        res.json({ 
            success: true, 
            message: 'Test email sent successfully!',
            email: process.env.EMAIL_USER
        });
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Test email failed',
            error: error.message,
            code: error.code
        });
    }
});

// Submit contact form
app.post('/api/contact', contactLimiter, async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email address' 
            });
        }

        // Send email notification (REQUIRED)
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            return res.status(500).json({ 
                success: false, 
                message: 'Email service not configured. Please contact admin.' 
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: `New Portfolio Contact from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><small>Received on ${new Date().toLocaleString()}</small></p>
            `
        };

        // Send confirmation email to user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting me!',
            html: `
                <h2>Thank you for reaching out!</h2>
                <p>Hi ${name},</p>
                <p>I've received your message and will get back to you as soon as possible.</p>
                <p><strong>Your message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <br>
                <p>Best regards,</p>
                <p>Durga Abhiram Pulicharla</p>
            `
        };

        try {
            console.log(`📧 Attempting to send emails for: ${name} (${email})`);
            await Promise.all([
                transporter.sendMail(mailOptions),
                transporter.sendMail(userMailOptions)
            ]);
            console.log(`✓ Emails sent successfully for: ${name} (${email})`);
        } catch (emailError) {
            console.error('❌ Email sending error:', emailError.message);
            console.error('Error code:', emailError.code);
            console.error('Error details:', emailError);
            
            // Provide specific error messages based on error type
            let errorMessage = 'Failed to send email. Please try again later.';
            if (emailError.code === 'EAUTH') {
                errorMessage = 'Email authentication failed. Check your email credentials.';
            } else if (emailError.message.includes('Invalid login') || emailError.message.includes('535')) {
                errorMessage = 'Invalid email credentials. For Gmail, use an App Password.';
            } else if (emailError.message.includes('getaddrinfo')) {
                errorMessage = 'Email server connection failed. Check your internet connection.';
            }
            
            return res.status(500).json({ 
                success: false, 
                message: errorMessage
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Message sent successfully! Check your email for confirmation.' 
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send message. Please try again later.' 
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n🚀 Portfolio Backend Server Started');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`🏠 Portfolio: http://localhost:${PORT}/index.html`);
    console.log(`📧 Messages: Sent directly to Gmail`);
    console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
