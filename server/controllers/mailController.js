import sendEmail from "../utils/mailer.js";

export const sendMail = async (req, res) => {
    try {
        const html = req.query?.html;

        const { email, subject, message } = req.body;
        if (!email || !subject || !message) {
            return res.status(400).json({ message: "Email, subject and message are required" });
        }
        if (html) {
            await sendEmail(email, subject, message, true);
        } else {
            await sendEmail(email, subject, message);
        }
        
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email: ", error);
        res.status(500).json({ message: "Error sending email", error });
    }
}
