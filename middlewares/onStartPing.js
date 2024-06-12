const {client,startPing}=require("../Controllers/search.controller");

const onStartPing=async(req,res,next)=>{
    try{
        startPing(client);
        next();
    }

    catch(err){
        res.status(500).json({ message: "An error occurred", success: false });
    }
}

module.exports={onStartPing};