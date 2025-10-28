
import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const port = 5000;

const mongoURI = "mongodb+srv://vedaanth09:vedaanth@cluster0.pdurjjo.mongodb.net/?appName=Cluster0";
const dbName = "hostel";

// --- Corrected CORS Configuration ---
// This configuration dynamically allows the specific origin of the frontend request,
// which is necessary for the cloud IDE's security and authentication model.
// It explicitly sets credentials to true, which is required for cross-origin requests
// that include cookies or authorization headers.
app.use(cors({
    origin: true, 
    credentials: true
}));

app.use(express.json());

let db;

// --- Sample Data ---
const sampleRooms = [
  { roomNumber: "ACR-101", type: "ACR", floor: 1, totalBeds: 3, occupants: ["S001", "S002", "S003"] },
  { roomNumber: "ACR-102", type: "ACR", floor: 1, totalBeds: 3, occupants: ["S004", "S005"] },
  { roomNumber: "NCR-103", type: "NCR", floor: 1, totalBeds: 4, occupants: [] },
  { roomNumber: "NCR-201", type: "NCR", floor: 2, totalBeds: 2, occupants: ["S006"] },
  { roomNumber: "NCR-202", type: "NCR", floor: 2, totalBeds: 4, occupants: ["S007", "S008"] },
  { roomNumber: "ACR-203", type: "ACR", floor: 2, totalBeds: 2, occupants: [] },
  { roomNumber: "ACR-301", type: "ACR", floor: 3, totalBeds: 4, occupants: ["S009"] }
];
const sampleStudents = [
  { studentId: "S001", name: "Arjun Sharma", email: "arjun.sharma@example.com", roomNumber: "ACR-101" },
  { studentId: "S002", name: "Priya Patel", email: "priya.patel@example.com", roomNumber: "ACR-101" },
  { studentId: "S003", name: "Rohan Das", email: "rohan.das@example.com", roomNumber: "ACR-101" },
  { studentId: "S004", name: "Sneha Reddy", email: "sneha.reddy@example.com", roomNumber: "ACR-102" },
  { studentId: "S005", name: "Vikram Singh", email: "vikram.singh@example.com", roomNumber: "ACR-102" },
  { studentId: "S006", name: "Anjali Iyer", email: "anjali.iyer@example.com", roomNumber: "NCR-201" },
  { studentId: "S007", name: "Karan Malhotra", email: "karan.malhotra@example.com", roomNumber: "NCR-202" },
  { studentId: "S008", name: "Natasha Rao", email: "natasha.rao@example.com", roomNumber: "NCR-202" },
  { studentId: "S009", name: "Aditya Joshi", email: "aditya.joshi@example.com", roomNumber: "ACR-301" }
];

// --- Database Connection and Setup ---
MongoClient.connect(mongoURI)
  .then(async (client) => {
    console.log("Connected to MongoDB Atlas!");
    db = client.db(dbName);

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes('rooms')) {
      console.log("Creating 'rooms' collection and inserting sample data...");
      await db.collection('rooms').insertMany(sampleRooms);
    }
    if (!collectionNames.includes('students')) {
      console.log("Creating 'students' collection and inserting sample data...");
      await db.collection('students').insertMany(sampleStudents);
    }
  })
  .catch(error => console.error("Could not connect to MongoDB:", error));


// --- API Endpoints ---
app.get('/api/dashboard', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");

  try {
    const rooms = await db.collection('rooms').find().sort({ floor: 1, roomNumber: 1 }).toArray();

    const floorsMap = {};
    for (const room of rooms) {
      const floorNum = room.floor;
      if (!floorsMap[floorNum]) {
        floorsMap[floorNum] = {
          floorNumber: floorNum,
          rooms: []
        };
      }

      const processedRoom = {
        ...room,
        id: room._id.toString(),
        occupiedBeds: room.occupants.length
      };
      floorsMap[floorNum].rooms.push(processedRoom);
    }

    const floorsArray = Object.values(floorsMap);
    res.json(floorsArray);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error });
  }
});

app.get('/api/students', async (req, res) => {
  if (!db) return res.status(503).send("Database not connected");

  try {
    const students = await db.collection('students').find().toArray();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
