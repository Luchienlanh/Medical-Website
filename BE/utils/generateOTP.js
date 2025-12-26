/**
 * Tạo mã OTP 6 chữ số ngẫu nhiên
 * @returns {string} Mã OTP 6 chữ số
 */
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
