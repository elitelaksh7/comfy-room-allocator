
import { Request } from "@/models/Request";
import { connectToDB } from "@/lib/db";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "GET") {
    try {
      const requests = await Request.find({});
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, status } = req.body;
      const request = await Request.findByIdAndUpdate(id, { status }, { new: true });
      res.status(200).json(request);
    } catch (error) {
      res.status(400).json({ error: "Failed to update request" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
