const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
    const MainCategory = sequelize.define("MainCategory", {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4 },
        main_category_name: { type: DataTypes.STRING ,unique:true}
    });

    return MainCategory;
};
