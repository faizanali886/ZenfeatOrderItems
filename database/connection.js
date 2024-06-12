const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();


const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST,
    dialect: "postgres",
    port: 5432
});

const OrderItem = require("../models/OrderItem.model")(sequelize);
const MainCategory = require("../models/MainCategory.model")(sequelize);
const CuisineType = require("../models/cuisineType.model")(sequelize);

const onConnect = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to database successfully!");
        
        await OrderItem.sync({ force: false });
        await MainCategory.sync({ force: false });
        await CuisineType.sync({ force: false });

    } catch (err) {
        console.log("There is an error while connecting the database");
        console.error(err);
    }
};

module.exports = { sequelize, onConnect, OrderItem, MainCategory, CuisineType };
