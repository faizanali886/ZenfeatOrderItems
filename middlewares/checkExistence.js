const { CuisineType } = require("../database/connection");
const { MainCategory } = require("../database/connection");
const { OrderItem } = require("../database/connection");

const checkCuisineTypeExists = async (req, res, next) => {
    try {
        const { cuisine_type } = req.body;
        const existingCuisineType = await CuisineType.findOne({ where: { cuisine_type:cuisine_type } });

        if (existingCuisineType) {
            return res.status(409).json({ message: "CuisineType already exists", success: false });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: "An error occurred while checking CuisineType", success: false });
    }
};

const checkMainCategoryExists = async (req, res, next) => {
    try {
        const { main_category_name } = req.body;
        const existingMainCategory = await MainCategory.findOne({ where: { main_category_name:main_category_name } });

        if (existingMainCategory) {
            return res.status(409).json({ message: "MainCategory already exists", success: false });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: "An error occurred while checking MainCategory", success: false });
    }
};

const checkOrderItemExists = async (req, res, next) => {
    try {
        const { order_item_name } = req.body;
        const existingOrderItem = await OrderItem.findOne({ where: { order_item_name:order_item_name } });

        if (existingOrderItem) {
            return res.status(409).json({ message: "OrderItem already exists", success: false });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: "An error occurred while checking OrderItem", success: false });
    }
};

module.exports = { checkCuisineTypeExists,checkMainCategoryExists,checkOrderItemExists };
