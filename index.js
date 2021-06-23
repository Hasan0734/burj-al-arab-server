const express = require('express');
const app = express();
const pass = 'Hasan07++##';
const port = 5000;




const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://burjAlArab:Hasan07++##@cluster0.ppwsz.mongodb.net/burjAlArab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("burjAlArab").collection("bookings");
  // perform actions on the collection object
  client.close();
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port);