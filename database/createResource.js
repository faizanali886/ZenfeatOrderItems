const { createManyCategory, findOneCategoryByName} = require("../Controllers/MainCategory.controller");
const { createManyCuisineType, findOneCusineTypeByName} = require("../Controllers/CuisineType.controller");
const { createManyOrderItem } = require("../Controllers/OrderItem.controller");

const categoryData = require("../data/categories.json");
const cuisineTypeData = require("../data/cuisineType.json");
const orderItemData = require("../data/orderItem.json");

async function saveOrderItemDataToDb(req, res) {
    try {
        
        await createManyCategory(categoryData);
        await createManyCuisineType(cuisineTypeData);

        const updatedOrderItems = [];

        for (const orderItem of orderItemData) {
            let category_ids = [];
            let cuisine_type_ids = [];
        
            const categories = orderItem.main_categories.split(";");
            const cuisine_types = orderItem.cuisine_types.split(";");
        
            for (const category of categories) {
                const categoryRecord = await findOneCategoryByName(category);
                if (categoryRecord) {
                    let main_category_id = categoryRecord.id;
                    category_ids.push(main_category_id);
                } else {
                    console.log(`Category ${category} not found`);
                }
            }
        
            for (const cuisine_type of cuisine_types) {
                const cuisineTypeRecord = await findOneCusineTypeByName(cuisine_type);
                if (cuisineTypeRecord) {
                    let cuisine_type_id = cuisineTypeRecord.id;
                    cuisine_type_ids.push(cuisine_type_id);
                } else {
                    console.log(`CuisineType ${cuisine_type} not found`);
                }
            }
        
            updatedOrderItems.push({
                ...orderItem,
                main_categories: category_ids,
                cuisine_types: cuisine_type_ids
            });
        }
        

        await createManyOrderItem(updatedOrderItems);

        res.json(updatedOrderItems);

    }catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message, success: false });
    }
    
}

module.exports = { saveOrderItemDataToDb };
