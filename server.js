
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
  .then(client => {
    console.log("✅ Successfully connected to MongoDB Atlas!");
    db = client.db(dbName);
  })
  .catch(error => console.error("❌ Could not connect to MongoDB:", error));

// --- Room Management Endpoints ---

const getRoomsWithOccupancy = async (filter = {}) => {
  if (!db) throw new Error("Database not connected");

  return await db.collection('rooms').aggregate([
    { $match: filter },
    {
      $lookup: {
        from: 'students',
        localField: '_id',
        foreignField: 'room',
        as: 'occupants'
      }
    },
    {
      $addFields: {
        occupiedBeds: { $size: '$occupants' }
      }
    },
    { $sort: { floor: 1, roomNumber: 1 } }
  ]).toArray();
};

app.get('/api/rooms', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const rooms = await getRoomsWithOccupancy();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
});

// --- Dashboard Vacancy Endpoint (NEW) ---
app.get('/api/dashboard', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const rooms = await getRoomsWithOccupancy();
    const totalBeds = rooms.reduce((sum, room) => sum + room.totalBeds, 0);
    const occupiedBeds = rooms.reduce((sum, room) => sum + room.occupiedBeds, 0);
    const vacancy = totalBeds > 0 ? ((totalBeds - occupiedBeds) / totalBeds) * 100 : 0;

    res.json({
      totalBeds,
      occupiedBeds,
      vacancy: vacancy.toFixed(1) 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
});

app.put('/api/rooms/:id', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Room ID format' });
    }
    const { roomNumber, floor, totalBeds } = req.body;

    const updateResult = await db.collection('rooms').updateOne(
      { _id: new ObjectId(id) },
      { $set: { 
          roomNumber, 
          floor: parseInt(floor, 10), 
          totalBeds: parseInt(totalBeds, 10) 
        }
      }
    );

    if (updateResult.matchedCount === 0) {
        return res.status(404).json({ message: 'Room not found' });
    }
    
    const updatedRoom = await getRoomsWithOccupancy({ _id: new ObjectId(id) });
    res.status(200).json(updatedRoom[0]);

  } catch (error) {
    res.status(500).json({ message: 'Error updating room', error: error.message });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Room ID format' });
    }
    await db.collection('students').updateMany({ room: new ObjectId(id) }, { $unset: { room: "" } });
    const result = await db.collection('rooms').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
});

// --- Student Management Endpoints ---

app.get('/api/students', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const students = await db.collection('students').find().toArray();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// --- Request Management Endpoints ---

app.get('/api/requests', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const requests = await db.collection('requests').find({}).toArray();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

app.put('/api/requests/:id', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Request ID format' });
    }

    const updateResult = await db.collection('requests').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: 'after' }
    );

    if (!updateResult.value) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json(updateResult.value);
  } catch (error) {
    res.status(400).json({ error: "Failed to update request" });
  }
});


// --- Start Server ---
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
