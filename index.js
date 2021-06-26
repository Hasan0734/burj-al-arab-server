const express = require("express");
const port = 5000;
const bodyParsers = require("body-parser");
const cors = require("cors");
const app = express();
const { MongoClient } = require("mongodb");
const admin = require("firebase-admin");
app.use(cors());
app.use(bodyParsers.json());
require('dotenv').config()

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qa72p.mongodb.net/burj?retryWrites=true&w=majority`;
  

const serviceAccount = require('./configs/generateToken.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("burj").collection("booking");

  app.post("/addBooking", (req, res) => {
    const newBooking = req.body;
    collection.insertOne(newBooking).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/bookings", (req, res) => {
    const bearer = req.headers.authorization;
    if (bearer && bearer.startsWith("Bearer ")) {
      const idToken = bearer.split(" ")[1];
     admin
     .auth()
     .verifyIdToken(idToken)
     .then((decodedToken) => {
       let tokenEmail = decodedToken.email;
       const queryEmail = req.query.email
       if (tokenEmail == queryEmail) {
        collection.find({email: queryEmail})
        .toArray((err, documents) => {
          res.status(200).send(documents)
        })
       }
       else{
        res.status(401).send('Unauthorized access')
       }
     })
     .catch((error) => {
      console.log(error)
      res.status(401).send('Unauthorized access')

     });
    }
    else{
      res.status(401).send('Unauthorized access')
    }
  });
});
app.listen(port);
