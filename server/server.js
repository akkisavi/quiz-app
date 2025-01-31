import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());

app.get("/api/quiz", async (req, res) => {
  try {
    const response = await axios.get("https://api.jsonserve.com/Uw5CrX");
    res.json(response.data);  // Directly send the data as a response
    console.log(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quiz data" });
    console.error("Error fetching quiz data:", error);
  }
});

app.listen(5000, () => console.log("Server is running on port 5000"));
