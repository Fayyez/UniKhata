import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function sendEmail(to, subject, body) {
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDR, pass: process.env.EMAIL_PWD
    }
    });

    const mailOptions = {
        from: '"' + process.env.EMAIL_UNAME + '" <' + process.env.EMAIL_ADDR + '>', // Sender name and email
        to,
        subject,
        text: body,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export default sendEmail;