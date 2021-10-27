const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


const app = express();

//middleware 
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hgh42.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('studentManagement');
        const studentCollection = database.collection('students');

        //GET API
        app.get('/students', async (req, res) => {
            const cursor = studentCollection.find({});
            const students = await cursor.toArray();
            res.send(students);
        });
        //GET API for single student
        app.get('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const student = await studentCollection.findOne(query);
            res.send(student);
        })

        //POST API for create new user
        app.post('/students', async (req, res) => {
            const student = req.body;
            console.log(student);
            const result = await studentCollection.insertOne(student);
            console.log(result);
            res.json(result);
        });

        //UPDATE API for edit a student details
        app.put('/students/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStudent = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedStudent.name,
                    email: updatedStudent.email,
                    phone: updatedStudent.phone,
                    studenId: updatedStudent.studenId
                },
            };

            const result = await studentCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        //DELETE API
        app.delete('/students/:id', async (req, res) => {
            const id = req.params.id;
            console.log('deleted student', id);
            const query = { _id: ObjectId(id) };
            const result = await studentCollection.deleteOne(query);
            res.json(result);
        });


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('HELLO, From student management system server');
});

app.listen(port, () => {
    console.log('Listening from port:', port);
});