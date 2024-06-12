const {Router}=require("express");
const {findall,findOneById,create,updateOneById,deleteOneById}=require("../Controllers/MainCategory.controller");
const {checkMainCategoryExists}=require("../middlewares/checkExistence");

const router=Router();

router.get("/findall",findall);
router.get("/findOneById/:id",findOneById);
router.post("/create",checkMainCategoryExists,create);
router.put("/updateOneById/:id",updateOneById);
router.delete("/deleteOneById/:id",deleteOneById);

module.exports=router;