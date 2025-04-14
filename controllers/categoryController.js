const categoryService = require('../services/categoryService');
const { validateCategory, validateCategoryId } = require('../validations/categoryValidation');

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { error } = validateCategoryId.validate(req.params);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const category = await categoryService.getCategoryById(+req.params.id);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { error } = validateCategory.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        console.log(req.body);
        const category = await categoryService.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { error: categoryIdError } = validateCategoryId.validate(req.params);
        const { error: categoryError } = validateCategory.validate(req.body);

        if (categoryIdError || categoryError) {
            return res.status(400).json({
                message: categoryIdError ? categoryIdError.details[0].message : categoryError.details[0].message
            });
        }

        const category = await categoryService.updateCategory(+req.params.id, req.body);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { error } = validateCategoryId.validate(req.params);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const category = await categoryService.deleteCategory(+req.params.id);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
