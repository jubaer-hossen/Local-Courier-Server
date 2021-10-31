const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// deshi_courier
// pVtSmhvn0XlGxadt

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zxw1d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        // console.log('connected to database');
        const database = client.db('Couriers');
        const servicesCollection = database.collection('services');
        const orderCollection = database.collection('orders');

        // Get Api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        });

        // Get Order Api
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        });

        // Get Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getind one id', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // POST API
        app.post('/AddNewService', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            // console.log(result);
            res.json(result);
        });

        // ADD ORDERS API
        app.post('/shipping', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await orderCollection.insertOne(service);
            // console.log(result);
            res.json(result);
        });

        // UPDATE API
        app.put('/allOrders/:id', async (req, res) => {
            const id = req.params.id;
            const updateOrder = req.body;
            const filter = {_id: ObjectId(id)}
            const option = { upsert: true }
            const updateDoc = {
                $set: {
                    orderCondition: 
                }
            }
            const result = await orderCollection.updateOne(filter, updateDoc, option)
            console.log(id, 'updated order');
            res.json(result);
        });

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        });

        // DELETE Order API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

        // ADD ORDERS API
        // app.post('/orders', async (req, res) => {
        //     const order = req.body;
        //     console.log('order', order);
        //     res.send('order processed');
        // });
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
