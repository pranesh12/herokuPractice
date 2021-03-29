const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const { ObjectID } = require("bson");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
console.log(process.env.DB_USER, process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qlian.mongodb.net/volunter?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const eventCollection = client.db("volunter").collection("events");
  app.post("/addEvent", (req, res) => {
    const newEvent = req.body;
    console.log(newEvent);
    eventCollection.insertOne(newEvent).then((result) => {
      console.log(result.insertedCount);
    });
  });

  app.get("/events", (req, res) => {
    eventCollection.find({}).toArray((err, itmes) => {
      res.send(itmes);
    });
  });

  app.delete("/deleteEvent/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    console.log(id);
    eventCollection.findOneAndDelete({ _id: id }).then((document) => {
      console.log(document);
    });
  });

  console.log("database connected");
});

app.listen(5055, () => {
  console.log("App is running on 5055");
});
