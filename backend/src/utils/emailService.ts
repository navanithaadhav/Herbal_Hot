import nodemailer from 'nodemailer';

const sendEmail = async (options: { email: string; subject: string; message: string; html?: string }) => {
    // If SMTP credentials are provided, use them. Otherwise, log to console (mock).
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `${process.env.FROM_NAME || 'Herbal Hot'} <${process.env.SENDER_EMAIL || process.env.FROM_EMAIL || 'noreply@herbalhot.com'}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent to: ${options.email}`);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Email could not be sent');
        }
    } else {
        // Mock email sending
        console.log('--- MOCK EMAIL SENDER ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log('--- END MOCK EMAIL ---');
        // Simulate checking verification link for dev convenience
        if (options.message.includes('verify-email')) {
            console.log('>>> VERIFICATION LINK DETECTED. CLICK TO VERIFY (DEV ONLY):');
            // Extract URL from message if possible or just rely on user checking logs
        }
    }
};

export default sendEmail;
