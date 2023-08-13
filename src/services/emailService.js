const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

const sendMail = async (to, subject, text, html) => {
    try {
        await transporter.sendMail({
            from: `"Love Keeper Team" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });
        console.log({ message: "이메일을 보냈습니다." });
    } catch (error) {
        console.error("Error in sendMail.", error);
        throw new Error("Failed to send email");
    }
};

module.exports = { sendMail };
