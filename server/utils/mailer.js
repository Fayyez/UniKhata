import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function sendEmail(to, subject, body, html = false) {
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDR, pass: process.env.EMAIL_PWD
    }
    });

    let mailOptions;

    if (html) {
        mailOptions = {
            from: '"' + process.env.EMAIL_UNAME + '" <' + process.env.EMAIL_ADDR + '>', // Sender name and email
            to,
            subject,
            html,
        };
    } else {
        mailOptions = {
            from: '"' + process.env.EMAIL_UNAME + '" <' + process.env.EMAIL_ADDR + '>', // Sender name and email
            to,
            subject,
            text: body,
        };
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export default sendEmail;