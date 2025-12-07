import jwt from 'jsonwebtoken';
import { User } from '../models/auth/User.js';
import { Admin } from '../models/auth/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy token xác thực'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Kiểm tra xem user hoặc admin có tồn tại không
        const user = await User.findById(decoded.id);
        const admin = await Admin.findById(decoded.id);

        if (!user && !admin) {
             return res.status(403).json({
                success: false,
                message: 'Token không hợp lệ hoặc người dùng không tồn tại'
            });
        }

        if (user) {
            req.user = user;
        }
        
        if (admin) {
            req.admin = admin;
        }

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(403).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn'
        });
    }
};
