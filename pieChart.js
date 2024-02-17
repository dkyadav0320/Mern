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
        category: String, 
        title: String,
        description: String,
        price: Number
    },

    saleDate: Date

});

const Transaction = mongoose.model('Transaction', transactionSchema);



app.get('/pie-chart', async (req, res) => {
    try {
        const { month } = req.query;
        const initDate = new Date(new Date().getFullYear(), month - 1, 1);
        const finlDate = new Date(new Date().getFullYear(), month, 0, 23, 59, 59);

        const pieChartData = await Transaction.aggregate ([
            {
                $match: {
                    saleDate: {
                        $gte: initDate,
                        $lte: finlDate
                    }
                }

            },

            {
                $group: {
                    _id: '$product.category',
                    count: { $sum: 1 }
                }
            }

        ]);

        const arrangededChartData = pieChartData.map (entry => ({
        		    category: entry._id,
        	    count: entry.count
        }));

        res.status(200).json({ pieChartData: arrangededChartData });
    } 

catch (error) {
        console.error('Error while fetching pie chart data:', error);
        res.status(500).json({ error: 'Failed to fetch queried pie chart data' });
    }

});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
