import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend OK");
});

app.post("/save/:seller", (req, res) => {
  const { seller } = req.params;
  const { url } = req.body;

  console.log("Seller:", seller);
  console.log("URL:", url);

  res.json({
    status: "ok",
    seller,
    url
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
