const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;

// Middleware pour gérer les requêtes JSON
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("index", { weather: null });
});

// Route principale pour récupérer la météo
app.get("/weather", async (req, res) => {
  const city = req.query.q;

  if (!city) {
    return res.render("index", {
      weather: null,
      error: "Veuillez fournir une ville.",
    });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      }
    );

    const data = response.data;
    const weather = {
      city: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    };

    res.render("index", { weather, error: null });
  } catch (error) {
    let errorMessage = "Erreur serveur.";
    if (error.response && error.response.status === 404) {
      errorMessage = "Ville non trouvée.";
    }
    res.render("index", { weather: null, error: errorMessage });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
