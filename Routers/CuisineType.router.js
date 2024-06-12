const { Router } = require("express");
const { findAll, create, createMany, findOneById,updateOneById,deleteOneById } = require("../Controllers/CuisineType.controller");
const {checkCuisineTypeExists}=require("../middlewares/checkExistence");

const router = Router();

router.get("/findall", findAll);
router.get("/findOneById/:id", findOneById);
router.post("/create",checkCuisineTypeExists,create);
router.put("/updateOneById/:id",updateOneById);
router.delete("/deleteOneById/:id",deleteOneById);

module.exports = router;
