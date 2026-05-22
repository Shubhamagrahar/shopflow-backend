import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const protect = async(req, res, next)=>{
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                message: "Access Denied. No token provided",
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: {id: decoded.id},
        });

        if(!user || !user.isActive){
            return res.status(401).json({
                success: false,
                message: "User Not Found or inactive",
            });
        }

        req.user = user;
        next();

    }catch (error){
        return res.status(401).json({
            success: false,
            message: "Invalid or expired Token",
        });
    }
};

export const restrictTo = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "Acess Denied. Insufficient permissions",
            });
        }
        next();
    };
};