const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
    const CuisineType = sequelize.define("CuisineType", {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4 },
        cuisine_type: { type: DataTypes.STRING,unique:true }
    });

    return CuisineType;
};
