import prisma from "../../config/prisma.js";

export const createCategory = async (req, res) =>{
    try{
        const {name, description, image} = req.body;

        const existing = await prisma.category.findUnique({
            where: {name},
        });

        if(existing){
            return res.status(400).json({
                success:false,
                message: "Category already Exist",
            });
        }

        const category = await prisma.category.create({
            data: {name, description, image},
        });

        return res.status(201).json({
            success: true,
            message: "Category created",
            data: category,
        });
    }catch (error){
        return res.status(500).json({success: false, message:error.message});
    }
};

export const getAllCategories = async(req, res)=>{
    try{
        const categories = await prisma.category.findMany({
            where : {isActive: true},
            include: {_count: {select : {products: true}}},
        });

        return res.status(200).json({
            success: true,
            data: categories,
        });
    }catch (error){
        return res.status(500).json({success: false, message: error.message});
    }
};

export const updateCategory = async (req, res)=>{
    try{
        const {id} = req.params;
        const {name, description, image, isActive} = req.body;

        const existingCategory = await prisma.category.findUnique({
            where: {id: parseInt(id)},
        });
        if(!existingCategory){
            return res.status(404).json({
                success: false,
                message: "Category not Found",
            });
        }
        if(!existingCategory.isActive){
            return res.status(400).json({
                success: false,
                message: "Deleted category can not be updated",
            });
        }

        const category = await prisma.category.update({
            where: {id: parseInt(id)},
            data: {name, description, image, isActive},
        });

        return res.status(200).json({
            success: true,
            message: "Category Updated",
            data: category,
        });
    }catch (error){
        return res.status(500).json({success: false, message: error.message});
    }
};

export const deleteCategory = async (req,res)=>{
    try{
        const {id} = req.params;
        await prisma.category.update({
            where: {id: parseInt(id)},
            data: {isActive: false},
        });

        return res.status(200).json({
            success: true,
            message: "Category deleted",
        });
    }catch (error){
        return res.status(500).json({
            success:false,
            message: error.message,
        });
    }
};

export const getCategory = async(req, res)=>{
    try{
        const {id} = req.params;
        const exist = await prisma.category.findUnique({
            where : {id : parseInt(id)}
        });

        if(!exist){
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        if(!exist.isActive){
            return res.status(400).json({
                success: false,
                message: "Category already deleted",
            });
        }
        return res.status(200).json({
            success: true,
            data: exist
        });
    }catch (error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};