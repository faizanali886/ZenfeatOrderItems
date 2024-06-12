const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const OrderItem = sequelize.define("OrderItem", {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, allowNull: false },
        photo_url: { type: DataTypes.TEXT, allowNull: false },
        order_item_name: { type: DataTypes.STRING, allowNull: false ,unique:true},
        description: { type: DataTypes.TEXT, allowNull: true },
        cuisine_types: {
            type: DataTypes.JSON,
            allowNull: true,
            get() {
                const value = this.getDataValue('cuisine_types');
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue('cuisine_types', JSON.stringify(value));
            }
        },
        ingredients: {
            type: DataTypes.JSON,
            allowNull: true,
            get() {
                const value = this.getDataValue('ingredients');
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue('ingredients', JSON.stringify(value));
            }
        },
        main_categories: {
            type: DataTypes.JSON,
            allowNull: true,
            get() {
                const value = this.getDataValue('main_categories');
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue('main_categories', JSON.stringify(value));
            }
        }
    });

    return OrderItem;
};
