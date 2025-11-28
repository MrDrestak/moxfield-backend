import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// FUNCION: Extraer datos de Moxfield (binder o lista)
async function fetchMoxfield(url) {
  const apiUrl = url.replace("https://www.moxfield.com/", "https://api.moxfield.com/");

  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error("Error fetching Moxfield");
  return await res.json();
}

const memory = {
  seller1: null,
  seller2: null,
  buyer: null,
};

// --- ENDPOINTS ---------------------------

app.post("/save/seller1", async (req, res) => {
  try {
    const data = await fetchMoxfield(req.body.url);
    memory.seller1 = data;
    res.json({ status: "ok", saved: "seller1" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/save/seller2", async (req, res) => {
  try {
    const data = await fetchMoxfield(req.body.url);
    memory.seller2 = data;
    res.json({ status: "ok", saved: "seller2" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/save/buyer", async (req, res) => {
  try {
    const data = await fetchMoxfield(req.body.url);
    memory.buyer = data;
    res.json({ status: "ok", saved: "buyer" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/compare", (req, res) => {
  if (!memory.seller1 || !memory.seller2 || !memory.buyer) {
    return res.status(400).json({ error: "Falta algún usuario por importar" });
  }

  const buyerCards = Object.keys(memory.buyer.cards || {});
  const seller1Cards = Object.keys(memory.seller1.cards || {});
  const seller2Cards = Object.keys(memory.seller2.cards || {});

  res.json({
    seller1Matches: buyerCards.filter((c) => seller1Cards.includes(c)),
    seller2Matches: buyerCards.filter((c) => seller2Cards.includes(c)),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
