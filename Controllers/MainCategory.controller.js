const {MainCategory}=require("../database/connection");
const {Op}=require("sequelize");

const findall=async(req,res)=>{
    try{
        const mainCategories=await MainCategory.findAll();
        res.status(200).json(mainCategories);
    }catch(err){
        res.status(404).json({message:"an error exist",success:false});
    }
};

const findAllCategory=async()=>{
    return await MainCategory.findAll();
}

const create=async(req,res)=>{
    try{
        const newMainCategory=await MainCategory.create(req.body);
        res.status(200).json(newMainCategory);
    }catch(err){
        res.status(404).json({message:"an error exist",success:false});
    }
};

const findOneCategoryByName = async (name) => {
    try {
        return await MainCategory.findOne({ where: { main_category_name: name } });
    } catch (err) {
        console.error(`Error finding category by name: ${name}`, err);
        throw err;
    }
}

const createManyCategory = async (categories) => {
    try {
        const categoryNames = categories.map(category => category.main_category_name);

        const existingCategories = await MainCategory.findAll({
            where: {
                main_category_name: {
                    [Op.in]: categoryNames
                }
            }
        });
        const existingCategoryNames = existingCategories.map(category => category.main_category_name);
        const newCategories = categories.filter(category => !existingCategoryNames.includes(category.main_category_name));

        console.log(newCategories);
        if (newCategories.length > 0) {
            await MainCategory.bulkCreate(newCategories);
            console.log("New categories added:", newCategories);
        } else {
            console.log("No new categories to add.");
        }
    } catch (err) {
        console.log(err);
    }
};

const findOneById=async(req,res)=>{
    try{
        const category=await MainCategory.findOneByPk(req.params.id);
        res.status(200).json(newMainCategory);
    }catch(err){
        res.status(404).json({message:"an error exist",success:false});
    }
}


const updateOneById = async (req, res) => {
    try {
        const id = req.params.id;
        const [updatedRows] = await MainCategory.update(req.body, {
            where: { id: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Category not found", success: false });
        }

        const updatedCategory = await MainCategory.findByPk(id);
        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(500).json({ message: "An error occurred", success: false });
    }
}

const deleteOneById = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedRows = await MainCategory.destroy({
            where: { id: id }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: "Category not found", success: false });
        }

        res.status(200).json({ message: "Category deleted successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "An error occurred", success: false });
    }
}


module.exports={findOneById,findall,create,findOneCategoryByName,createManyCategory,findAllCategory,updateOneById,deleteOneById};