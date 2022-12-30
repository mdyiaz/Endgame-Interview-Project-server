const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express();


app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p9sgcbw.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run (){

    try{

        const postCollection = client.db('Endgame-Interview-project').collection('allPost');
        const userCollection = client.db('Endgame-Interview-project').collection('users');
        const commentCollection = client.db('Endgame-Interview-project').collection('comment');





// post status______________________________________________________________
        app.post('/post', async(req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);
        })



        

        // saver users data___________________________________
        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })




        // load all post in media file_____________________________
        app.get('/post', async(req, res) => {
            const query = {};
            const post = await postCollection.find(query).toArray();
            res.send(post);
        })



         // post comment___________________________________
         app.post('/comment', async(req, res) => {
            const comment = req.body;
            const result = await commentCollection.insertOne(comment);
            res.send(result);
        })



        // get all comment_______
         app.get('/comment', async(req, res) => {
            const query = {};
            const result = await commentCollection.find(query).toArray();
            res.send(result);
        })




        
        // getting specific post Details_________________________________________
        app.get('/post/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const post = await postCollection.findOne(query);
                res.send(post);
        })



        // implement like option____________________________
        app.patch('/likes', async(req, res) => {
            const id = req.query.id;
            const body = req.body;
            console.log(id, body);
            const filter = {_id: ObjectId(id)}
            const option = {upsert:true};
            const update = {$set:{like:body.like}}
            const result = await postCollection.updateOne(filter, update, option);
            res.send(result);
        })












    }












    finally{

    }

}
run().catch(error => console.error(error));






// testing the server______________________________________________
app.get('/', async(req, res) => {
    res.send('Server is running');
})


app.listen(port, () => console.log(`Don't worry your server is running on ${port}`))