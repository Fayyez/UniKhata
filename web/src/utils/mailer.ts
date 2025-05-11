import axiosInstance from './axios';

export default async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  await axiosInstance.post('/api/mailer/send', {
    to,
    subject,
    html: body
  });
} 