const request = require("supertest");
const app = require("../server");
const axios = require("axios");
let server;

beforeAll(() => {
  server = app.listen(3001, () => console.log("Test server running on 3001"));
});

afterAll(() => {
  server.close();
});

// Mock Axios pour simuler des erreurs
jest.mock("axios");
// Avec `jest.mock`, on remplace les fonctionnalités réelles d'Axios par des versions simulées pour pouvoir contrôler les réponses.

describe("Gestion des erreurs dans /weather", () => {
  // Bloc `describe` pour grouper tous les tests concernant les erreurs dans la route `/weather`.

  test("Retourne une erreur 400 si aucune ville n'est fournie", async () => {
    // Test pour vérifier qu'une requête sans paramètre retourne une erreur 400.

    const response = await request(app).get("/weather");
    // Envoi d'une requête GET sur la route `/weather` sans fournir de paramètre.

    expect(response.statusCode).toBe(400);
    // Vérifie que le code de statut HTTP est 400 (Bad Request).

    expect(response.text).toContain("Veuillez fournir une ville.");
    // Vérifie que la réponse contient le message d'erreur attendu.
  });

  test("Retourne une erreur 404 si la ville n'est pas trouvée", async () => {
    // Test pour vérifier qu'une ville inexistante retourne une erreur 404.

    axios.get.mockRejectedValueOnce({
      response: { status: 404 },
    });
    // Simule un appel à l'API OpenWeather qui échoue avec un statut 404.

    const response = await request(app)
      .get("/weather")
      .query({ q: "VilleInexistante" });
    // Envoi d'une requête GET sur `/weather` avec une ville fictive comme paramètre.

    expect(response.statusCode).toBe(404);
    // Vérifie que le code de statut HTTP est 404.

    expect(response.text).toContain("Ville non trouvée.");
    // Vérifie que la réponse contient le message "Ville non trouvée."
  });

  test("Retourne une erreur 500 si l'API est indisponible", async () => {
    // Test pour vérifier qu'une erreur interne du serveur (API indisponible) retourne une erreur 500.

    axios.get.mockRejectedValueOnce(new Error("API indisponible"));
    // Simule un appel à l'API OpenWeather qui échoue avec une erreur générique.

    const response = await request(app).get("/weather").query({ q: "Paris" });
    // Envoi d'une requête GET sur `/weather` avec une ville valide.

    expect(response.statusCode).toBe(500);
    // Vérifie que le code de statut HTTP est 500 (Internal Server Error).

    expect(response.text).toContain("Erreur serveur.");
    // Vérifie que la réponse contient le message "Erreur serveur."
  });
});
