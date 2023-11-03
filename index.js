const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uprfadf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //TODO: start here

    const courseCollection = client.db("courseDB").collection("courses");

    app.get("/api/courses", async (req, res) => {
      try {
        const allCourses = await courseCollection.find().toArray();
        if (allCourses.length === 0) {
          res.status(404).json({ message: "Course not found" });
        } else {
          res.status(200).json(allCourses);
        }
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/api/courses/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const course = await courseCollection.findOne(query);
        if (!course) {
          res.status(404).json({ message: "Course not found" });
        } else {
          res.status(200).json(course);
        }
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    ////////////////////////////////////////////////////////////////
    {
      /* TODO: End here */
    }
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("courseDB server is running");
});

app.listen(port, () => {
  console.log(`courseDB server is listening on port ${port}`);
});
