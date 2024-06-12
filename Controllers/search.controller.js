const elasticSearch = require("@elastic/elasticsearch");
const { findAllCuisineTypes } = require("./CuisineType.controller");
const { findAllCategory } = require("./MainCategory.controller");
const { findAllOrderItems } = require("./OrderItem.controller");

require("dotenv").config();

const client = new elasticSearch.Client({
    node:"http://localhost:9200"
});

const hasOrderItems = async () => {
    const orderItems = await findAllOrderItems();
    return orderItems && orderItems.length > 0;
};


const startPing = async (client) => {
    try {
        await client.ping({});
        console.log("Connected to Elasticsearch successfully!");

        await onCreateIndex("order-name");
        await onCreateIndex("category");
        await onCreateIndex("cusine-type");

        await client.indices.putMapping({
            index: "order-name",
            body: {
                properties: {
                    order_item_name: { type: "text" },
                    main_categories: { type: "keyword" },
                    cuisine_types: { type: "keyword" }
                }
            }
        });

        await client.indices.putMapping({
            index: "category",
            body: {
                properties: {
                    id: { type: "text" },
                    main_category_name: { type: "text" }
                }
            }
        });

        await client.indices.putMapping({
            index: "cusine-type",
            body: {
                properties: {
                    id: { type: "text" },
                    cuisine_type: { type: "text" }
                }
            }
        });

        const orderItemData = await findAllOrderItems();
        const mainCategoryData = await findAllCategory();
        const cuisineTypeData = await findAllCuisineTypes();

        await onSavingBulk(orderItemData, "order-name");
        await onSavingBulk(mainCategoryData, "category");
        await onSavingBulk(cuisineTypeData, "cusine-type");

    } catch (err) {
        console.log("Error exists", err);
    }
};

const searchOn = async (IndexName, key, value) => {
    try {
        const { hits } = await client.search({
            index: IndexName,
            body: {
                query: {
                    match: {
                        [key]: value
                    }
                }
            }
        });
        return hits.hits.map(hit => hit._source);
    } catch (err) {
        console.log(`Search error on index ${IndexName} for key ${key} with value ${value}:`, err);
        return [];
    }
};

const searchOnArray = async (IndexName, key, value) => {
    try {
        const { hits } = await client.search({
            index: IndexName,
            body: {
                query: {
                    terms: {
                        [key]: [value]
                    }
                }
            }
        });
        return hits.hits.map(hit => hit._source);
    } catch (err) {
        console.log(`Search error on index ${IndexName} for key ${key} with value ${value}:`, err);
        return [];
    }
};


const search = async (req, res) => {
    const param = req.body.searchText.toLowerCase();

    try {
        const orderItemResults = await searchOn("order-name", "order_item_name", param);
        const categoryResults = await searchOn("category", "main_category_name", param);
        const cuisineResults = await searchOn("cusine-type", "cuisine_type", param);

        let results = orderItemResults;

        if (categoryResults.length > 0) {
            const categoryId = categoryResults[0].id;
            const categoryOrders = await searchOnArray("order-name", "main_categories", categoryId);
            results = results.concat(categoryOrders);
        }

        if (cuisineResults.length > 0) {
            const cuisineId = cuisineResults[0].id;
            const cuisineOrders = await searchOnArray("order-name", "cuisine_types", cuisineId);
            results = results.concat(cuisineOrders);
        }

        const uniqueResults = Array.from(new Set(results.map(a => JSON.stringify(a)))).map(a => JSON.parse(a));
        
        if (uniqueResults.length === 0) {
            return res.status(404).json({ message: "There is no result about your search!", success: false });
        }

        return res.status(200).json(uniqueResults);

    } catch (err) {
        console.log("Search error:", err);
        return res.status(500).json({ message: "An error occurred during the search process.", success: false });
    }
};

const onSavingBulk = async (data, indexName) => {
    const bulkBody = data.flatMap(item => [{ index: { _index: indexName } }, item]);

    try {
        await client.bulk({ body: bulkBody });
        console.log(`Data indexed successfully to ${indexName}`);
    } catch (err) {
        console.log(`Bulk index error for index ${indexName}:`, err);
    }
};


const deleteIndex = async (indexName) => {
    try {
        await client.indices.delete({ index: indexName });
        console.log(`Index ${indexName} deleted successfully`);
    } catch (err) {
        console.log(`Error deleting index ${indexName}:`, err);
    }
};

const onCreateIndex = async (index) => {
    try {
        await deleteIndex(index);
        await client.indices.get({ index });
    } catch (err) {
        await client.indices.create({ index });
    }
};

module.exports = { startPing, search, client,hasOrderItems };
