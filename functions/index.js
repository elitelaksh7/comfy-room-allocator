
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { MongoClient, ObjectId } from "mongodb";

initializeApp();

const mongoDbUri = "mongodb+srv://vedaanth09:vedaanth@cluster0.pdurjjo.mongodb.net/?appName=Cluster0";
const dbName = "hostel-management";

let db;

async function getDb() {
  if (!db) {
    const client = new MongoClient(mongoDbUri);
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}

async function getCollection(collectionName) {
    const db = await getDb();
    return db.collection(collectionName);
}

// Student Functions
export const getStudents = onCall(async () => {
    const studentsCollection = await getCollection("students");
    const students = await studentsCollection.find({}).toArray();
    return students.map(s => ({ ...s, id: s._id.toString() }));
});

export const addStudent = onCall(async (request) => {
    const { name, studentId, room } = request.data;
    if (!name || !studentId || !room) {
        throw new HttpsError('invalid-argument', 'The function must be called with "name", "studentId", and "room" arguments.');
    }
    const studentsCollection = await getCollection("students");
    const result = await studentsCollection.insertOne({ name, studentId, room });
    return { success: true, id: result.insertedId.toString() };
});

export const updateStudent = onCall(async (request) => {
    const { id, name, studentId, room } = request.data;
    if (!id || !name || !studentId || !room) {
        throw new HttpsError('invalid-argument', 'The function must be called with "id", "name", "studentId", and "room" arguments.');
    }
    const studentsCollection = await getCollection("students");
    await studentsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name, studentId, room } }
    );
    return { success: true };
});

export const deleteStudent = onCall(async (request) => {
    const { id } = request.data;
    if (!id) {
        throw new HttpsError('invalid-argument', 'The function must be called with an "id" argument.');
    }
    const studentsCollection = await getCollection("students");
    await studentsCollection.deleteOne({ _id: new ObjectId(id) });
    return { success: true };
});


// Room Functions
export const getRooms = onCall(async () => {
    const roomsCollection = await getCollection("rooms");
    const rooms = await roomsCollection.find({}).toArray();
    return rooms.map(r => ({ ...r, id: r._id.toString() }));
});

export const addRoom = onCall(async (request) => {
    const { roomNumber, floor, totalBeds, occupiedBeds } = request.data;
    if (!roomNumber || !floor || !totalBeds || occupiedBeds === undefined) {
        throw new HttpsError('invalid-argument', 'The function must be called with "roomNumber", "floor", "totalBeds", and "occupiedBeds" arguments.');
    }
    const roomsCollection = await getCollection("rooms");
    const result = await roomsCollection.insertOne({ roomNumber, floor, totalBeds, occupiedBeds });
    return { success: true, id: result.insertedId.toString() };
});

export const updateRoom = onCall(async (request) => {
    const { id, roomNumber, floor, totalBeds, occupiedBeds } = request.data;
    if (!id || !roomNumber || !floor || !totalBeds || occupiedBeds === undefined) {
        throw new HttpsError('invalid-argument', 'The function must be called with "id", "roomNumber", "floor", "totalBeds", and "occupiedBeds" arguments.');
    }
    const roomsCollection = await getCollection("rooms");
    await roomsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { roomNumber, floor, totalBeds, occupiedBeds } }
    );
    return { success: true };
});

export const deleteRoom = onCall(async (request) => {
    const { id } = request.data;
    if (!id) {
        throw new HttpsError('invalid-argument', 'The function must be called with an "id" argument.');
    }
    const roomsCollection = await getCollection("rooms");
    await roomsCollection.deleteOne({ _id: new ObjectId(id) });
    return { success: true };
});
