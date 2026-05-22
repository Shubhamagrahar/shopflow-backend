import prisma from "../../config/prisma.js";

export const createProduct = async(req, res)=>{
    try{
        const {name, description, price, stock, images, categoryId} = req.body;

        const exist = await prisma.product.findFirst({
            where : {name},
        });

        if(exist){
            return res.status(400).json({
                success: false,
                message: "Product already exist",
            });
        }

        const checkCategory = await prisma.category.findUnique({
            where: {id: categoryId}
        });

        if(!checkCategory){
            return res.status(400).json({
                success: false,
                message: "Category not found",
            });
        }
        const product = await prisma.product.create({
            data : {name, description, price, stock, images, categoryId}
        });

        if(product){
            return res.status(200).json({
                success: true,
                message: "Product created successfully",
                data: product,
            });
        }

    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllProduct = async (req, res)=>{
    try{
        const product = await prisma.product.findMany({
            where: {isActive: true},
            include: {_count : {select: {product: true}}}
        });
        return res.status(200).json({
            success: true,
            data: product,
        });
    }catch (error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const updateProduct = async (req, res)=>{
    try{
        const {id} = req.params;
        const {name, description, price, stock, images, categoryId, isActive} = req.body;

        const existingProduct = await prisma.product.findUnique({
            where: {id: parseInt(id)},
        });

        if(!existingProduct){
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if(!existingProduct.isActive){
            return res.status(400).json({
                success: false,
                message: "Deleted Product cannot be updated",
            });
        }

        const product = await prisma.product.update({
            where : {id: parseInt(id)},
            data: {name, description, price, stock, images, categoryId, isActive},
        });

        return res.status(200).json({
            success: true,
            message: "Product updated",
            data: product
        });
    }catch (error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const getProduct = async (req, res)=>{
    try{
        const {id} = req.params;
        const exist = await prisma.product.findUnique({
            where : {id: parseInt(id)},
        });

        if(!exist){
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        if(!exist.isActive){
            return res.status(400).json({
                success: false,
                message: "Product already deleted",
            });
        }
        return res.status(200).json({
            success: true,
            data: exist
        });
    }catch (error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

export const deleteProduct = async (req, res)=>{
    try{
        const {id} = req.params;
        const exist = await prisma.product.findUnique({
            where: {id: parseInt(id)},
        });
        if(!exist){
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        const deleteProduct = await prisma.product.update({
            where: {id: parseInt(id)},
            data: {isActive: false},
        });
        if(deleteProduct){
            return res.status(200).json({
                success: true,
                message: "Product deleted",
            });
        }
    }catch (error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};