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

    sold: Boolean,
    saleDate: Date
});


const Transaction = mongoose.model ('Transaction', transactionSchema);



app.get('/statistics', async (req, res) => {
    try {
        const { month, year } = req.query;
        const initDate = new Date(year, month - 1, 1);
        const finlDate = new Date(year, month, 0, 23, 59, 59);

        const totalSaleAmount = await Transaction.aggregate([
            {
                $match: {
                    sold: true,
                    saleDate: {
                        $gte: initDate,
                        $lte: finlDate
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$product.price' }
                }
            }
        ]);

        const totalSoldItems = await Transaction.countDocuments ({
            sold: true,
            saleDate: {
                $gte: initDate,
                $lte: finlDate
            }
        });


        const totalRemItems = await Transaction.countDocuments ({
            sold: false
        });


        res.status(200).json({
            totalSaleAmount: totalSaleAmount.length ? totalSaleAmount[0].totalAmount : 0,
            totalSoldItems,
            totalRemItems

        });

    } catch (error) {
        console.error('Error while fetching the statistics:', error);
        res.status(500).json({ error: 'Failed to fetch queried statistics' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
