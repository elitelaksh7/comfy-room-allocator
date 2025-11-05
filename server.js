
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';

const app = express();
const port = 3000;

const mongoURI = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "comfy-room-allocator";

if (!mongoURI) {
  console.error("❌ MONGODB_URI environment variable is required!");
  process.exit(1);
}

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
        foreignField: 'roomId',
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

app.post('/api/rooms', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const { roomNumber, floor, totalBeds } = req.body;
    const newRoom = {
      roomNumber,
      floor: parseInt(floor, 10),
      totalBeds: parseInt(totalBeds, 10)
    };
    
    const result = await db.collection('rooms').insertOne(newRoom);
    const insertedRoom = await getRoomsWithOccupancy({ _id: result.insertedId });
    res.status(201).json(insertedRoom[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating room', error: error.message });
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
    await db.collection('students').updateMany({ roomId: new ObjectId(id) }, { $set: { roomId: null } });
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
    const students = await db.collection('students').aggregate([
      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          as: 'roomData'
        }
      },
      {
        $addFields: {
          roomNumber: { $arrayElemAt: ['$roomData.roomNumber', 0] }
        }
      },
      {
        $project: {
          roomData: 0
        }
      }
    ]).toArray();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

app.post('/api/students', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const { studentId, name, email, roomId } = req.body;
    const newStudent = {
      studentId,
      name,
      email,
      roomId: roomId ? new ObjectId(roomId) : null
    };
    
    const result = await db.collection('students').insertOne(newStudent);
    const insertedStudent = await db.collection('students').aggregate([
      { $match: { _id: result.insertedId } },
      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          as: 'roomData'
        }
      },
      {
        $addFields: {
          roomNumber: { $arrayElemAt: ['$roomData.roomNumber', 0] }
        }
      },
      {
        $project: {
          roomData: 0
        }
      }
    ]).toArray();
    res.status(201).json(insertedStudent[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Student ID format' });
    }
    const { studentId, name, email, roomId } = req.body;

    const updateData = {
      studentId,
      name,
      email,
      roomId: roomId ? new ObjectId(roomId) : null
    };

    const updateResult = await db.collection('students').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const updatedStudent = await db.collection('students').aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          as: 'roomData'
        }
      },
      {
        $addFields: {
          roomNumber: { $arrayElemAt: ['$roomData.roomNumber', 0] }
        }
      },
      {
        $project: {
          roomData: 0
        }
      }
    ]).toArray();
    res.status(200).json(updatedStudent[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Student ID format' });
    }
    
    const result = await db.collection('students').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
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
