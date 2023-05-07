const { MongoClient } = require("mongodb");
const ObjectID = require("mongodb").ObjectId;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 3000;
const uri = "mongodb+srv://codyking04:xbsYjbT03CcLrgen@ase220.hct6otj.mongodb.net/?retryWrites=true&w=majority";
const fs = require('fs');

const app = express();
const client = new MongoClient(uri);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

async function connect() {
    // Connecting to atlas database.
    let connection = await client.connect();
    return connection;
}

async function find(db, database, collection, criteria) {
    // Fetching database and setting it to dbo.
    let dbo = db.db(database);
    // Finding documents that match criteria from the collection and returning result as array.
    let result = await dbo.collection(collection).find(criteria).toArray();
    return result;
}

async function insert(db, database, collection, document) {
    // Fetching database and setting it to dbo.
    let dbo = db.db(database);
    // Inserting new document into collection and returning result.
    let result = await dbo.collection(collection).insertOne(document);
    console.log(result);
    return result;
}

async function update(db, database, collection, criteria, document) {
    //Fetching database and setting it to dbo.
    let dbo = db.db(database);
    // Updating document in collection and returningr result.
    let result = await dbo.collection(collection).updateOne(criteria, document);
    return result;
}

async function remove(db, database, collection, document) {
    // Fetching database and setting it to dbo.
    let dbo = db.db(database);

    // deleting a document then returning result.
    let result = await dbo.collection(collection).deleteOne(document);
    console.log(result);
}

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/index');
  });

app.get('/index', async (req, res) => {
    try {
        // Requesting the Posts collection and storing the result.
        let result = await find(db, "FinalProject", "Posts", {});
    
        fs.readFile('templates/index.html', 'utf-8', (err, htmlTemplate) => {
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          }
    
          // Modify the HTML template to include the data
          const renderedHtml = htmlTemplate.replace('{{data}}', JSON.stringify(result));
    
          // Send the modified HTML content to the client
          res.send(renderedHtml);
        });
      } catch (error) {
        console.error('Error:', error);
        res.sendStatus(500);
      }
    });

app.get('/aboutus', (req, res) => {
    fs.readFile('public/about-us.html', 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.send(data);
      }
    });
  });

  app.get('/detail/:id', async (req, res) => {
    let result = await find(db, "FinalProject", "Posts", {"_id": new ObjectID(req.params.id)});
    let concert = result[0];
    
    let html = fs.readFileSync('templates/detail.html', 'utf-8');
    html = html.replace('{{band}}', concert.band || '');
    html = html.replace('{{venue}}', concert.venue || '');
    html = html.replace('{{city}}', concert.city || '');
    html = html.replace('{{state}}', concert.state || '');
    html = html.replace('{{date}}', concert.date || '');
    html = html.replace('{{desc}}', concert.desc || '');
    html = html.replace('{{imgurl}}', concert.imgurl || '');
    html = html.replace('{{author}}',concert.author || '');
    res.send(html);

    });

app.get('/create', async (req, res) => {
    let html = fs.readFileSync('templates/create.html', 'utf8');
    res.send(html);
});

app.post('/create', async (req, res) => {

    const { band, venue, city, state, date, desc, imgurl, author } = req.body;

    // Create a new post object
    const newPost = {
      band,
      venue,
      city,
      state,
      date,
      desc,
      imgurl,
      author
    };
    insert(db, "FinalProject", "Posts", newPost);
    
});

app.put("/post/:id", async (req, res) => {
    // Updating document in Posts collection and responding with result of request.
    let result = await update(db, "FinalProject", "Posts", {"_id": new ObjectID(req.params.id)}, {$set: req.body});
    res.json(result);
});

app.delete("/post/:id", async (req, res) => {
    // Deleting document in Posts collection and responding with result of request.
    let result = await remove(db, "FinalProject", "Posts", {"_id": new ObjectID(req.params.id)});
    res.json(result);
});

async function start(){
	db = await connect();
	console.log('mongoDB connected');
	app.listen(port,() => {
	  console.log(`App listening on port ${port}`);
	});
}

start();