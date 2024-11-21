const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
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
    return res.status(400).render("index", {
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

    res.render("index", {
      weather: {
        city: data.name,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      },
      errorMessage: null,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Gestion d'une ville introuvable
      return res
        .status(404)
        .render("index", { weather: null, errorMessage: "Ville non trouvée." });
    }

    // Gestion d'une erreur serveur/API
    return res
      .status(500)
      .render("index", { weather: null, errorMessage: "Erreur serveur." });
  }
});

module.exports = app;

// Lancer le serveur seulement si ce fichier est exécuté directement
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
  });
}
