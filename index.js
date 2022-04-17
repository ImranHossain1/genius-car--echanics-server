const express = require('express');
require('dotenv').config()
const cors= require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = 5000;
const ObjectId = require('mongodb').ObjectId;
//middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.m9khx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        // console.log('connected to database')
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");
        //GET API for many service
        app.get('/services', async(req, res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET API for single service
        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;
            //console.log('getting specifiq id', id);
            const query = {_id : ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        //POST API
        app.post('/services', async(req,res)=>{
            const service = req.body;

            console.log('hit the post api', service)
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })
        //DELETE API
        app.delete('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result =await servicesCollection.deleteOne(query);
            res.json(result);
        })
        
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req,res)=>{
    res.send('Running Genious Server');
})

app.listen(port, ()=>{
    console.log('Running Genious Server on port', port);
})