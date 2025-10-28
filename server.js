
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';

const app = express();
const port = 5000;

const mongoURI = "mongodb+srv://vedaanth09:vedaanth@cluster0.pdurjjo.mongodb.net/?appName=Cluster0";
const dbName = "hostel";

app.use(cors());
app.use(express.json());

let db;

MongoClient.connect(mongoURI)
  .then(async (client) => {
    console.log("Connected to MongoDB Atlas!");
    db = client.db(dbName);
  })
  .catch(error => console.error("Could not connect to MongoDB:", error));

// --- API Endpoints ---

// Dashboard
app.get('/api/dashboard', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const rooms = await db.collection('rooms').find().sort({ floor: 1, roomNumber: 1 }).toArray();
    const floorsMap = {};
    for (const room of rooms) {
      const floorNum = room.floor;
      if (!floorsMap[floorNum]) {
        floorsMap[floorNum] = { floorNumber: floorNum, rooms: [] };
      }
      const processedRoom = { ...room, id: room._id.toString(), occupiedBeds: room.occupants.length };
      floorsMap[floorNum].rooms.push(processedRoom);
    }
    res.json(Object.values(floorsMap));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error });
  }
});

// Rooms
app.get('/api/rooms', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const rooms = await db.collection('rooms').find().toArray();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error });
  }
});

app.post('/api/rooms', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const { roomNumber, floor, totalBeds } = req.body;
    if (!roomNumber || !floor || !totalBeds) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newRoom = { 
      roomNumber,
      floor: parseInt(floor),
      totalBeds: parseInt(totalBeds),
      occupants: [] 
    };
    const result = await db.collection('rooms').insertOne(newRoom);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ message: 'Error adding room', error });
  }
});

app.put('/api/rooms/:id', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const { id } = req.params;
    const { roomNumber, floor, totalBeds } = req.body;
    if (!roomNumber || !floor || !totalBeds) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const result = await db.collection('rooms').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { roomNumber, floor: parseInt(floor), totalBeds: parseInt(totalBeds) } },
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).json({ message: 'Room not found' });
    res.json(result.value);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ message: 'Error updating room', error });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const { id } = req.params;
    const result = await db.collection('rooms').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ message: 'Error deleting room', error });
  }
});

// Students
app.get('/api/students', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const students = await db.collection('students').find().toArray();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error });
  }
});

app.post('/api/students', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const { name, studentId, roomNumber } = req.body;
    if (!name || !studentId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newStudent = { name, studentId, roomNumber };
    const result = await db.collection('students').insertOne(newStudent);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: 'Error adding student', error });
  }
});

app.put('/api/students/:id', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const { id } = req.params;
    const { name, studentId, roomNumber } = req.body;
    if (!name || !studentId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const result = await db.collection('students').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, studentId, roomNumber } },
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).json({ message: 'Student not found' });
    res.json(result.value);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: 'Error updating student', error });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const { id } = req.params;
    const result = await db.collection('students').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: 'Error deleting student', error });
  }
});

// Requests
app.get('/api/requests', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const requests = await db.collection('requests').find().toArray();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
