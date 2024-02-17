const express = require ('express');
const axios = require ('axios');


const app = express ();
const PORT = process.env.PORT || 3000;



app.get('/combined-data', async (req, res) => {
 
   try {
     
        const response1 = await axios.get('./Transaction/data');
        const data1 = response1.data;

      
        const response2 = await axios.get('./Statistics/data');
        const data2 = response2.data;

        const response3 = await axios.get('../Chart/data');
        const data3 = response3.data;

        
        const combinedData = {
            TransactionData: data1,
           StatisticsData: data2,
            ChartData: data3
        };


        
        res.status(200).json(combinedData);
    }
 catch (error) {
        console.error('Error while fetching combined data:', error);
        res.status(500).json({ error: 'Failed to fetch queried combined data' });
    }

});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
