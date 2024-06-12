const {Router}=require("express");
const {findAll,create,findOneById,findOneByOrderItemName,updateOneById,deleteOneById,addCategoryToAOrderItem,addCuisineTypeToOrderItem}=require("../Controllers/OrderItem.controller");
const {checkOrderItemExists}=require("../middlewares/checkExistence");
const {onStartPing}=require("../middlewares/onStartPing");

const router=Router();

router.get("/findall",findAll);
router.get("/findOne/:id",findOneById);
router.get("/findOneByOrderItemName/:name",findOneByOrderItemName);
router.post("/create",checkOrderItemExists,onStartPing,create);
router.post("/addCategory/:id",onStartPing,addCategoryToAOrderItem);
router.post("/addCuisineType/:id",onStartPing,addCuisineTypeToOrderItem);
router.put("/updateOneById/:id",onStartPing,updateOneById);
router.delete("/deleteOneById/:id",onStartPing,deleteOneById);

module.exports=router;