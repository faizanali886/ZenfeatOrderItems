const express = require("express");
const dotenv = require("dotenv");
const bodyParser=require("body-parser");
const { onConnect } = require("./database/connection");
const {saveOrderItemDataToDb}=require("./database/createResource");
const {startPing,client,hasOrderItems}=require("./Controllers/search.controller");
const searchRouter = require("./Routers/search.router");
const orderItemRouter=require("./Routers/OrderItem.router");
const maincategoryRouter=require("./Routers/MainCategory.router");
const cuisineTypeRouter=require("./Routers/CuisineType.router");

dotenv.config();

const app = express();
const PORT=process.env.PORT || 8080;

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.post("/createResource",(req,res)=>{
    try{
        saveOrderItemDataToDb(req,res)
        .then(()=>{startPing(client)})
        .catch(err=>{console.log(err)});
    }
    catch(err){
        res.status(404).json({message:"an error occured",success:false});
    }
})

app.use("/search", searchRouter);
app.use("/orderItem",orderItemRouter);
app.use("/mainCategory",maincategoryRouter);
app.use("/cuisineType",cuisineTypeRouter);

onConnect().then(async() => {
    const dataExist = await hasOrderItems();

    if (dataExist) {
        startPing(client);
    } else {
        console.log("No data found. Skipping Elasticsearch setup.");
    }

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log("Failed to start server:", err);
});
