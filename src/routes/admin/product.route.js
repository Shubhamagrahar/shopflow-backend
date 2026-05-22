import {Router} from "express";

import {
    createProduct,
    getAllProduct,
    updateProduct,
    getProduct,
    deleteProduct
} from "../../controllers/admin/product.controller.js";

const router = Router();

router.post("/", createProduct);
router.get("/", getAllProduct);
router.put("/:id", updateProduct);
router.get("/:id", getProduct);
router.delete("/:id", deleteProduct);

export default router;