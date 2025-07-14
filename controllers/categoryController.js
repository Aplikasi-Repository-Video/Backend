const categoryService = require('../services/categoryService');
const { validateCategory, validateCategoryId } = require('../validations/categoryValidation');

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil semua kategori',
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil semua kategori',
            error: error.message
        });
    }
};

const getCategoriesWithVideos = async (req, res) => {
    try {
        const categories = await categoryService.getCategoriesWithVideos();
        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil semua kategori dengan video',
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil semua kategori dengan video',
            error: error.message
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { error } = validateCategoryId.validate(req.params);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const category = await categoryService.getCategoryById(+req.params.id);
        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil kategori',
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil kategori',
            error: error.message
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const { error } = validateCategory.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const category = await categoryService.createCategory(req.body);
        res.status(201).json({
            success: true,
            message: 'Berhasil membuat kategori',
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat membuat kategori',
            error: error.message
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { error: categoryIdError } = validateCategoryId.validate(req.params);
        const { error: categoryError } = validateCategory.validate(req.body);

        if (categoryIdError || categoryError) {
            return res.status(400).json({
                success: false,
                message: categoryIdError ? categoryIdError.details[0].message : categoryError.details[0].message
            });
        }

        const category = await categoryService.updateCategory(+req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Berhasil memperbarui kategori',
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat memperbarui kategori',
            error: error.message
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { error } = validateCategoryId.validate(req.params);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const category = await categoryService.deleteCategory(+req.params.id);
        res.status(200).json({
            success: true,
            message: 'Berhasil menghapus kategori',
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus kategori',
            error: error.message
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoriesWithVideos
};
