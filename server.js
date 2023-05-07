const { MongoClient } = require("mongodb");
const ObjectID = require("mongodb").ObjectId;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const port = 3000;
const uri = "mongodb+srv://codyking04:xbsYjbT03CcLrgen@ase220.hct6otj.mongodb.net/?retryWrites=true&w=majority";
const saltRounds = 10;
const jwt_salt = "privatekey";
const jwt_expiration = 1800000;
const fs = require('fs');

const app = express();
const client = new MongoClient(uri);
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: "http://127.0.0.1:5500", exposedHeaders: ["set-cookie"]}));
app.use(cookieParser());
// Middleware checks for valid JSON.
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status == 400 && "body" in err) {
        console.log(err);
        res.statusCode = 400;
        res.json({message: "Invalid JSON"});
    }
    else {
        next();
    }
});

const setUserID = async function (req, res, next) {
    // Getting userID from user that matches token cookie.
    let result = await find(db, "FinalProject", "Users", {"jwt": req.cookies.token});
    let UserID = JSON.stringify(result[0]._id).replace(/"|'/g, '');

    // Storing UserID in body to put in document later.
    req.body.UserID = UserID;

    // Moving to next middleware.
    next();
}

const verifyToken = function (req, res, next) {
    // Checking if token is stored.
    if (req.cookies.token == undefined) {
        res.statusCode = 403;
        res.json({message: "User is not logged in"});
    }
    // Moving to next middleware if token is stored.
    else {
        next();
    }
}

const verifyUser = async function (req, res, next) {
    // Finding document that matches id given as request parameter.
    let result = await find(db, "FinalProject", "JSONBlob", {"_id": new ObjectID(req.params.id)});
    // Getting userID from user that matches token cookie.
    let UserID = await find(db, "FinalProject", "Users", {"jwt": req.cookies.token});
    UserID = JSON.stringify(UserID[0]._id).replace(/"|'/g, '');

    // Checking if any documents are found that match id given as request parameter.
    if (result.length == 0) {
        res.statusCode = 404;
        res.json({message: "Document does not exist"});
    }
    // Checking if user is owner of document.
    else if (UserID != result[0].UserID) {
        res.statusCode = 403;
        res.json({message: "User is not owner of document"});
    }
    // Moving to next middleware if document exists and user is owner of document.
    else {
        next();
    }
}

const checkValidID = (req, res, next) => {
    // Checking if ObjectID is valid.
    try {
        new ObjectID(req.params.id);
        next();
    }
    // Logging error, responding with 400 status, and sending back error message if ObjectID is invalid.
    catch (error) {
        console.log(error);
        res.statusCode = 400;
        res.json({message: "Invalid JSONBlob ID"});
    }
}

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

app.get('/', async (req, res) => {
    // Requesting the Posts collection and sending it back in the response.
    let result = await find(db, "FinalProject", "Posts", {});
    // res.json(result);
    res.send(fs.readFileSync('./templates/index.html', 'utf-8'));
})

app.get("/post", async (req, res) => {
    
    let result = await find(db, "FinalProject", "Posts", {});
    res.json(result);
});

app.post("/post", async (req, res) => {
    // Inserting document into Posts collection and responding with result of request.
	let result = await insert(db,'FinalProject','Posts',req.body);
	res.json(result);
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

app.post("/auth/signup", async (req, res) => {
    // Checking if user already has an account.
    let result = await find(db, "FinalProject", "Users", {email: req.body.email});

    if (result.length > 0) {
        // Sending 406 status code and error message if user already has an account.
        res.status(406);
        res.json({message: "User already exists"});
    }
    else {
        // Generating JSON web token with user email.
        let token = jwt.sign({id: req.body.email}, jwt_salt, {expiresIn: jwt_expiration});

        // Hashing password.
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
        
        // Inserting hashed password into Users collection.
        insert(db, "FinalProject", "Users", {name: req.body.name, email: req.body.email, password: req.body.password});

        res.cookie("token", token, {
            maxAge: 1200000,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        // Sending 201 status code and success message.
        res.status(201);
        res.json({message: "User created"});
    }
});

app.post("/auth/signin", async (req, res) => {
    // Checking if user has an account.
    let result = await find(db, "FinalProject", "Users", {"email": req.body.email});

    // Checking if any users are found.
    if (result.length == 0) {
        // Sending 406 status code and error message if not user is found.
        res.status(406);
        res.json({message: "User is not registered"});
    }
    else {
        // Comparing password to password hash stored in database.
        if (bcrypt.compareSync(req.body.password, result[0].password)) {
            // Generating JSON web token with user email.
            let token = jwt.sign({id: req.body.email}, jwt_salt, {expiresIn: jwt_expiration});
            // Getting UserID from the document ID of user in database.
            userID = result[0]._id.toString().replace('New ObjectId("','').replace('")','');

            // Updating user in database with JSON web token.
            await update(db, "FinalProject", "Users", {_id: new ObjectID(userID)}, {$set: {jwt: token}});

            // Sending 200 status code, setting token to cookie, and sending back success message.
            res.status(200);
            res.cookie("token", token, {
                maxAge: 1200000,
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });
            res.json({message: "User authenticated"});
        }
        else {
            // Sending 406 status code and error message if wrong password.
            res.status(406);
            res.json({message: "Wrong password"});
        }
    }
});

app.post("/auth/signout", (req, res) => {
    // Clearing token cookie and responding with success message.
    res.clearCookie("token");
    res.json({message: "User has been signed out"});
});

async function start(){
	db = await connect();
	console.log('mongoDB connected');
	app.listen(port,() => {
	  console.log(`App listening on port ${port}`);
	});
}

start();