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
  res.render("index", { weather: null, errorMessage: null });
});

// Route principale pour récupérer la météo
app.get("/weather", async (req, res) => {
  const city = req.query.q;

  if (!city) {
    return res
      .status(400)
      .render("index", {
        weather: null,
        errorMessage: "Veuillez fournir une ville.",
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

    // Si tout va bien, on envoie les données à la vue
    res.render("index", {
      weather: {
        city: data.name,
        temperature: Math.round(data.main.temp), // On arrondit la température
        description: data.weather[0].description,
        icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      },
      errorMessage: null, // Pas d'erreur, on définit errorMessage à null
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.render("index", {
        weather: null,
        errorMessage: "Ville non trouvée.",
      });
    }
    res.render("index", { weather: null, errorMessage: "Erreur serveur." });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
