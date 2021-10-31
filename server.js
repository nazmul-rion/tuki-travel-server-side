const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;


// API URI : https://lit-springs-32062.herokuapp.com/

// Middleware  
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pmzhh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("database connection succesfully");
        const database = client.db("TravelDB");
        const packageCollection = database.collection("packages");
        const orderCollection = database.collection("orders");

        //-----GET API-----//

        // Get all packages 
        app.get("/allpackages", async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

        // Get all orders 
        app.get("/allorders", async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });


        //-----POST API-----//

        // add package API
        app.post('/addpackages', async (req, res) => {
            const result = await packageCollection.insertOne(req.body);
            res.json(result);
        });

        // add Order API
        app.post('/addorder', async (req, res) => {
            const result = await orderCollection.insertOne(req.body);
            res.json(result);
        });


        //-----UPDATE API-----//

        // UPDATE Single ORDER by ID 
        app.put('/allorders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: 'Confirmed'
                }
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        });


        //-----DELETE API-----//

        // Delete Single Order by ID
        app.delete('/allorders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {

    res.send("server running");

});

app.listen(port, () => {
    console.log(`My Server listening at http://localhost:${port}`)
})