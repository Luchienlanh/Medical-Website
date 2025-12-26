import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Tạo transporter với Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // App Password từ Google
    }
});

/**
 * Gửi email chứa mã OTP
 * @param {string} email - Email người nhận
 * @param {string} otp - Mã OTP
 */
export const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Mã xác thực đổi mật khẩu - MedicalW',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Xác thực đổi mật khẩu</h2>
                <p>Bạn đã yêu cầu đổi mật khẩu. Đây là mã xác thực của bạn:</p>
                <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
                    <h1 style="color: #4CAF50; letter-spacing: 5px; margin: 0;">${otp}</h1>
                </div>
                <p style="color: #666;">Mã có hiệu lực trong <strong>5 phút</strong>.</p>
                <p style="color: #999; font-size: 12px;">Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};
