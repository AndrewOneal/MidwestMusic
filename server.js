const { MongoClient } = require("mongodb");
const ObjectID = require("mongodb").ObjectId;
const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;
const uri = "mongodb+srv://codyking04:xbsYjbT03CcLrgen@ase220.hct6otj.mongodb.net/?retryWrites=true&w=majority";

const app = express();
const client = new MongoClient(uri);
app.use(bodyParser.json());

async function connect() {
    let connection = await client.connect();
    return connection;
}

async function find(db, database, collection, criteria) {
    let dbo = db.db(database);
    let result = await dbo.collection(collection).find(criteria).toArray();
    return result;
}

async function insert(db, database, collection, document) {
    let dbo=db.db(database);
    let result=await dbo.collection(collection).insertOne(document);
    console.log(result);
    return result;
}

app.get("/post", async (req, res) => {
    let result = await find(db, "Assignment6", "Posts", {});
    res.json(result);
});

app.post("/post", async (req, res) => {
    console.log(req.body);
	let result=await insert(db,'Assignment6','Posts',req.body);
	res.json(result);
});

app.put("/post/:id", (req, res) => {

});

app.delete("/post/:id", (req, res) => {

});

async function start(){
	db=await connect();
	console.log('mongoDB connected');
	app.listen(port,()=>{
	  console.log(`App listening on port ${port}`);
	});
}

start();