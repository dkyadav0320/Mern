const express = require ('express');
const mongoose = require ('mongoose');


const app = express ();
const PORT = process.env.PORT || 3000;


mongoose.connect('mongodb://localhost:27017/MERN', {
  	  useNewUrlParser: true,
    		useUnifiedTopology: true
});

const db = mongoose.connection;


const transactionSchema = new mongoose.Schema ({
    product: {
        title: String,
        description: String,
        price: Number
    },
    
});

const Transaction = mongoose.model ('Transaction', transactionSchema);



app.get('/transactions', async (req, res) => {
    try {
        const { search = '', page = 1, perPage = 10 } = req.query;
        const skip = (page - 1) * perPage;
        
        let query = {};
        if (search) {
            query = {
                $or: [
                    { 'product.title': { $regex: search, $options: 'i' } },
                    { 'product.description': { $regex: search, $options: 'i' } },
                    { 'product.price': { $regex: search, $options: 'i' } }
                ]
            };
        }

        const transactions = await Transaction.find(query)
                                            .skip (skip)
                                            .limit (parseInt(perPage))
                                            .exec ();

        res.status(200).json({ transactions });
    } catch (error) {
        console.error('Error while fetching the queried transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions details' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
