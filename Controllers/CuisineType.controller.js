const { where,sequelize,Op } = require("sequelize");
const { CuisineType } = require("../database/connection");

const findAll = async (req, res) => {
    try {
        const cuisineTypes = await CuisineType.findAll();
        res.status(200).json(cuisineTypes);
    } catch (err) {
        res.status(404).json({ message: "An error occurred", success: false });
    }
};

const findAllCuisineTypes = async () => {
    return await CuisineType.findAll();
};

const findOneCusineTypeByName = async (name) => {
    try {
        return await CuisineType.findOne({ where: { cuisine_type: name } });
    } catch (err) {
        console.error(`Error finding cuisine type by name: ${name}`, err);
        throw err;
    }
}


const create = async (req, res) => {
    try {
        const newCuisineType = await CuisineType.create(req.body);
        res.status(200).json(newCuisineType);
    } catch (err) {
        res.status(404).json({ message: "An error occurred", success: false });
    }
};

const createManyCuisineType = async (cuisineTypes) => {
    try {
        const cuisineTypeNames = cuisineTypes.map(cuisine => cuisine.cuisine_type);

        const existingCuisineTypes = await CuisineType.findAll({
            where: {
                cuisine_type: {
                    [Op.in]: cuisineTypeNames
                }
            }
        });
        const existingCuisineTypeNames = existingCuisineTypes.map(cuisine => cuisine.cuisine_type);

        const newCuisineTypes = cuisineTypes.filter(cuisine => !existingCuisineTypeNames.includes(cuisine.cuisine_type));

        console.log(newCuisineTypes);
        if (newCuisineTypes.length > 0) {
            await CuisineType.bulkCreate(newCuisineTypes);
            console.log("New cuisine types added:", newCuisineTypes);
        } else {
            console.log("No new cuisine types to add.");
        }
    } catch (err) {
        console.log(err);
    }
};

const findOneById = async (req, res) => {
    try {
        const cuisineType = await CuisineType.findByPk(req.params.id);
        res.status(200).json(cuisineType);
    } catch (err) {
        res.status(404).json({ message: "An error occurred", success: false });
    }
};

const updateOneById = async (req, res) => {
    try {
        const id = req.params.id;
        const [updatedRows] = await CuisineType.update(req.body, {
            where: { id: id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "CuisineType not found", success: false });
        }

        const updatedCuisineType = await CuisineType.findByPk(id);
        res.status(200).json(updatedCuisineType);
    } catch (err) {
        res.status(500).json({ message: "An error occurred", success: false });
    }
}

const deleteOneById = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedRows = await CuisineType.destroy({
            where: { id: id }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: "CuisineType not found", success: false });
        }

        res.status(200).json({ message: "CuisineType deleted successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "An error occurred", success: false });
    }
}



module.exports = { findAll, create, createManyCuisineType, findOneById, findAllCuisineTypes,findOneCusineTypeByName,updateOneById ,deleteOneById};
