const { MongoClient } = require("mongodb");
const express = require("express");
const uri = "mongodb+srv://codyking04:xbsYjbT03CcLrgen@ase220.hct6otj.mongodb.net/?retryWrites=true&w=majority";

const app = express();
const client = new MongoClient(uri);

client.connect();

app.get("/post/:id", (req, res) => {

});

app.post("/post", (req, res) => {

});

app.put("/post/:id", (req, res) => {

});

app.delete("/post/:id", (req, res) => {

});

app.listen(3000);