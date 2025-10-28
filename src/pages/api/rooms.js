
import { Room } from "@/models/Room";
import { connectToDB } from "@/lib/db";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "GET") {
    try {
      const rooms = await Room.find({});
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rooms" });
    }
  } else if (req.method === "POST") {
    try {
      const room = await Room.create(req.body);
      res.status(201).json(room);
    } catch (error) {
      res.status(400).json({ error: "Failed to create room" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, ...data } = req.body;
      const room = await Room.findByIdAndUpdate(id, data, { new: true });
      res.status(200).json(room);
    } catch (error) {
      res.status(400).json({ error: "Failed to update room" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      await Room.findByIdAndDelete(id);
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete room" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
