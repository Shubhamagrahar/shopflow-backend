import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const register = async (req, res)=>{
    try{
        const {name, email, password, phone} = req.body;

        const existingUser = await prisma.user.findUnique({
            where : {email},
        });

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data:{
                name,
                email,
                password: hashedPassword,
                phone,
            },
        });

        const {password: _, ...userWithoutPassword} = user;

        return res.status(201).json({
            success:true,
            message: "User Registered Successfully",
            data: userWithoutPassword,
        });
    }catch (error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const login = async (req, res)=>{
    try{
        const {email, password} = req.body;

        const user = await prisma.user.findUnique({
            where: {email},
        });

        if(!user){
            return res.status(401).json({
                success:false,
                message: "User not Found",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({
                success:false,
                message: "Invalid Credentials",
            });
        }

        const accesssToken = jwt.sign(
            {id: user.id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        );

        const refreshToken = jwt.sign(
            {id: user.id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN}
        );
        await prisma.user.update({
            where: {id: user.id},
            data: {refreshToken},
        });

        const {password: _, ...userWithoutPassword } = user;

        return res.status(200).json({
            success: true,
            message: "Login Successfull",
            data: {
                user: userWithoutPassword,
                accesssToken,
                refreshToken,
            },
        });
    }catch (error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};