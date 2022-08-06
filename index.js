// const express = require('express')
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.MONGO_URL);///env-environmental variables
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World')
})

const PORT=5000;
//const MONGO_URL="mongodb://localhost";//node 16 & before


//if v-16+

// const MONGO_URL="mongodb://127.0.0.1";
// mongodb+srv://rhagavi:rhagavi@cluster0.ubm2h.mongodb.net

 MONGO_URL = process.env.MONGO_URL;
//  const MONGO_URL="mongodb+srv://rhagavi:rhagR123@cluster0.ubm2h.mongodb.net";

async function createConnection() {
        const client = new MongoClient(MONGO_URL);
        await client.connect();
        console.log("Mongodb is connected ✌😊");
        return client;
      }
      
      const client = await createConnection();
      app.use(express.json());
       


    app.get("/movies", async function(req,res)
    {
        //  
         if(req.query.rating)
         {
            req.query.rating=+req.query.rating;
         }
         console.log(req.query);

         const movies=await client
         .db('movie')
         .collection("movie")
         .find(req.query)
         .toArray();
         res.send(movies);
    });

    //find returns a cursor
    //cursor is  a pagination
    //pagination sends back more
    //its bad for database to send that much results
    //if if wanted to convert a cursor to array to avoid
    //pagination
//we can convert using (to- array)

    app.get("/movies/:id", async function(req,res)
    {
        
        const id =  req.params.id;
        // console.log(req.params,id);
        // const movie=movies.find((mv)=>mv.id===id);
        // console.log(movie);
        const movie=await client
        .db("movie")
        .collection("movie")
        .findOne({id:id});
        movie?
        res.send(movie):res.status(404)
        .send({msg:"movie not found"});
    });

    app.post("/movies/", async function (req,res)
    {
//body->json
//middleware-express.json
        const data=req.body;
        const result=await client
        .db("movie")
        .collection("movie")
        .insertMany(data);
        res.send(data);
    });

app.delete("/movies/:id",async function(req,res)
{
const id=req.params.id
const result= await client
.db("movie")
.collection("movie")
.deleteOne({id:id});
result.deletedCount>0
?res.send({msg:"movie successfully deleted"}):res.status(404).send({msg:"movie not found"});
}
)




app.listen(PORT,()=>console.log(`App started in ${PORT}`));
