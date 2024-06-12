const {OrderItem}=require("../database/connection");
const {Op}=require("sequelize");

const findAll=async(req,res)=>{
    const orderItems=await OrderItem.findAll();
    try{
        res.status(202).json(orderItems);
    }catch(err){
        res.status(404).json({message:"an error exist",success:false});
    }
}

const findAllOrderItems=async()=>{
    return await OrderItem.findAll();
}

const create=async(req,res)=>{
    const newOrderItem=await OrderItem.create(req.body);

    try{
        res.status(202).json(newOrderItem);
    }
    catch(err){
        res.status(404).json({message:"an error exist",success:false});
    }
};


const createManyOrderItem = async (orderItems) => {
    try {
        const orderItemNames = orderItems.map(order => order.order_item_name);

        const existingOrderItems = await OrderItem.findAll({
            where: {
                order_item_name: {
                    [Op.in]: orderItemNames
                }
            }
        });

        const existingOrderItemNames = existingOrderItems.map(order => order.order_item_name);

        const newOrderItems = orderItems.filter(order => !existingOrderItemNames.includes(order.order_item_name));

        console.log(newOrderItems);
        if (newOrderItems.length > 0) {
            await OrderItem.bulkCreate(newOrderItems);
            console.log("New order items added:", newOrderItems);
        } else {
            console.log("No new order items to add.");
        }
    } catch (err) {
        console.error("An error occurred while creating order items:", err);
        throw err;
    }
};


const findOneById=async(req,res)=>{
    const id=req.params.id;
    const Item=await OrderItem.findByPk(id);
    try{
        res.status(202).json(Item);
    }catch(err){
        res.status(404).json({message:"an error exist",success:false});
    }
}

const findOneByOrderItemName = async (req, res) => {
    try {
        const name = req.params.name;
        const item = await OrderItem.findOne({ where: { order_item_name:name } });
        if (!item) {
            return res.status(404).json({ message: "OrderItem not found", success: false });
        }
        res.status(202).json(item);
    } catch (err) {
        res.status(404).json({ message: "An error exists", success: false });
    }
}

const updateOneById = async (req, res) => {
    try {
        const id = req.params.id;
        const [updatedRows] = await OrderItem.update(req.body, {
            where: { id: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "OrderItem not found", success: false });
        }

        const updatedItem = await OrderItem.findByPk(id);
        res.status(202).json(updatedItem);
    } catch (err) {
        res.status(500).json({ message: "An error occurred", success: false });
    }
}

const deleteOneById = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedRows = await OrderItem.destroy({
            where: { id: id }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: "OrderItem not found", success: false });
        }

        res.status(202).json({ message: "OrderItem deleted successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "An error occurred", success: false });
    }
}

const addCategoryToAOrderItem = async (req, res) => {
    const id = req.params.id;
    const category = req.body.category;
    try {
        const orderItem = await OrderItem.findByPk(id);
        console.log(orderItem)
        
        if (!orderItem) {
            return res.status(404).json({ message: "OrderItem not found", success: false });
        }

        if (orderItem.main_categories.includes(category)) {
            return res.status(500).json({ message: "Category already exists", success: false });
        }
        orderItem.main_categories=[...orderItem.main_categories,category];
        await orderItem.save();

        return res.status(200).json({ message: "Added new category successfully!", success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred", success: false });
    }
}

const addCuisineTypeToOrderItem = async (req, res) => {
    const id = req.params.id;
    const cuisineTypeId = req.body.cuisineTypeId;
    try {
        const orderItem = await OrderItem.findByPk(id);
        
        if (!orderItem) {
            return res.status(404).json({ message: "OrderItem not found", success: false });
        }

        if (!orderItem.cuisine_types) {
            orderItem.cuisine_types = [];
        }

        if (orderItem.cuisine_types.includes(cuisineTypeId)) {
            return res.status(500).json({ message: "Cuisine type already exists", success: false });
        }
        orderItem.cuisine_types=[...orderItem.cuisine_types,cuisineTypeId];
        await orderItem.save();
        return res.status(200).json({ message: "Added new CuisineType to OrderItem successfully!", success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred", success: false });
    }
}



module.exports={create,createManyOrderItem,findAll,findOneById,findOneByOrderItemName,findAllOrderItems,updateOneById,deleteOneById,addCategoryToAOrderItem,addCuisineTypeToOrderItem};