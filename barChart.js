const express = require ('express');
const mongoose = require ('mongoose');
  

const app = express();
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

    saleDate: Date
});

const Transaction = mongoose.model('Transaction', transactionSchema);



app.get('/bar-chart', async (req, res) => {
    try {
        const { month } = req.query;
        const initDate = new Date(new Date().getFullYear(), month - 1, 1);
        const finlDate = new Date(new Date().getFullYear(), month, 0, 23, 59, 59);

        const priceRanges = [
            { range: '0 - 100', min: 0, max: 100 },
            { range: '101 - 200', min: 101, max: 200 },
            { range: '201 - 300', min: 201, max: 300 },
            { range: '301 - 400', min: 301, max: 400 },
            { range: '401 - 500', min: 401, max: 500 },
            { range: '501 - 600', min: 501, max: 600 },
            { range: '601 - 700', min: 601, max: 700 },
            { range: '701 - 800', min: 701, max: 800 },
            { range: '801 - 900', min: 801, max: 900 },
            { range: '901 - above', min: 901, max: Number.MAX_SAFE_INTEGER }
        ];


        const barChartData = [];


        for (const range of priceRanges) {
            const count = await Transaction.countDocuments({
                'product.price': { $gte: range.min, $lte: range.max },
                saleDate: {
                    $gte: initDate,
                    $lte: finlDate
                }
            });

            barChartData.push({ range: range.range, count });

        }

        res.status(200).json({ barChartData });
    } catch (error) {
        console.error('Error while fetching bar chart data:', error);
        res.status(500).json({ error: 'Failed to fetch queried bar chart data' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
