import {Router} from "express";

import {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCategory
} from "../../controllers/admin/category.controller.js";

const router = Router();

router.post("/", createCategory);
router.get("/", getAllCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.get("/:id", getCategory);

export default router;