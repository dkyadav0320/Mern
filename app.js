const express = require ("express");
const mongoose = require ("mongoose");
const axios =require ("axios");

const app = express();
const PORT =process.env.PORT || 3000;
mongoose.connect("mongodb://localhost:27017/MERN", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db= mongoose.connection;
const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
});
const Database = mongoose.model("Database", itemSchema);

app.get("/initialize-db", async (req, res) => {
        try {
            await Database.deleteMany({});
            const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
            const jsonData = response.data;
            await Database.insertMany(jsonData);

            res.status(200),json({message: "Database initialised successfully!!"});
        }
        catch (error) {
            console.error("Error initialising database:", error);
            res.status(500).json({error:"Database initialisation got failed"});
        }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
