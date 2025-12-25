import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/auth/User.js';
import { Role } from '../models/auth/Role.js';
import dotenv from 'dotenv';
import { loginSchema, signUpSchema } from '../validators/auth/authValidator.js';

dotenv.config();

export const registerUser = async (req, res, next) => {
    const { userName, passWord, email, address, DoB, phoneNum } = req.body;
    try {
        const { value, error } = signUpSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                message: error.details[0].message 
            });
        }

        const existingUser = await User.findOne({
            $or: [{ userName }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Tên đăng nhập hoặc Email đã tồn tại!'
            });
        }

        const hashPassword = await bcrypt.hash(passWord, 10);
        const newUser = new User({
            userName,
            passWord: hashPassword,
            email,
            DoB,
            phoneNum
        });
        await newUser.save();

        return res.status(201).json({
            message: 'Đăng ký tài khoản thành công!',
            user: {
                userName: newUser.userName
            }
        });
    } catch(error) {
        console.error("Lỗi đăng ký tài khoản:", error);
        return next(error);
    }        
}

export const loginUser = async (req, res, next) => {
    const { userName, passWord } = req.body;
    try {
        const { value, error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const user = await User.findOne({ userName });
        if (!user || !(await bcrypt.compare(passWord, user.passWord))) {
            return res.status(401).json({
                message: 'Tên đăng nhập hoặc mật khẩu không chính xác!'
            });
        }
        
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Đăng nhập thành công!',
            token
        });
    } catch(error) {
        console.error("Lỗi đăng nhập:", error);
        return next(error);
    }
}
