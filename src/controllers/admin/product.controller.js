import prisma from "../../config/prisma.js";

export const createProduct = async(req, res)=>{
    try{
        const {name, description, price, stock, images, categoryId} = req.body;
        if(!name || !name.trim()){
            return res.status(400).json({
                success: false,
                message: "Product name is required",
            });
        }

        if(isNaN(price) || Number(price)<0){
            return res.status(400).json({
                success: false,
                message: "Valid price is required",
            });
        }

        if(isNaN(stock) || Number(stock)<0){
            return res.status(400).json({
                success: false,
                message: "Valid Stock is required",
            });
        }

        const exist = await prisma.product.findFirst({
            where : {name: name.trim()},
        });

        if(exist){
            return res.status(400).json({
                success: false,
                message: "Product already exist",
            });
        }

        const checkCategory = await prisma.category.findUnique({
            where: {id: parseInt(categoryId)}
        });

        if(!checkCategory){
            return res.status(400).json({
                success: false,
                message: "Category not found",
            });
        }
        const product = await prisma.product.create({
             data: {
                name: name.trim(),
                description,
                price: Number(price),
                stock: Number(stock),
                images,
                categoryId: parseInt(categoryId),
            },
        });

        if(product){
            return res.status(201).json({
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
            include: {
                category: true,
                _count : {select: {orderItems: true}}
            }
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

        if(!name || !name.trim()){
            return res.status(400).json({
                success: false,
                message: "Product name is required",
            });
        }

        if(isNaN(stock) || Number(stock) < 0){
            return res.status(400).json({
                success: false,
                message: "Valid Stock is required",
            });
        }

        if(isNaN(price) || Number(price)< 0){
            return res.status(400).json({
                success: false,
                message: "Valid price is required",
            });
        }

        const checkCategory = await prisma.category.findUnique({
            where: {id: parseInt(categoryId)}
        });

        if(!checkCategory){
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

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
           data: {
                name: name.trim(),
                description,
                price: Number(price),
                stock: Number(stock),
                images,
                categoryId: parseInt(categoryId),
            },
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
            return res.status(404).json({
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

        if(!exist.isActive){
            return res.status(404).json({
                success: false,
                message: "Product already deleted",
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
   
