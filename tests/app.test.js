const request = require("supertest");
const app = require("../server"); // Assure-toi que ton fichier Express exporte l'app
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

describe("Gestion des erreurs dans /weather", () => {
  test("Retourne une erreur 400 si aucune ville n'est fournie", async () => {
    const response = await request(app).get("/weather");
    expect(response.statusCode).toBe(400);
    expect(response.text).toContain("Veuillez fournir une ville.");
  });

  test("Retourne une erreur 404 si la ville n'est pas trouvée", async () => {
    axios.get.mockRejectedValueOnce({
      response: { status: 404 },
    });

    const response = await request(app)
      .get("/weather")
      .query({ q: "VilleInexistante" });
    expect(response.statusCode).toBe(404);
    expect(response.text).toContain("Ville non trouvée.");
  });

  test("Retourne une erreur 500 si l'API est indisponible", async () => {
    axios.get.mockRejectedValueOnce(new Error("API indisponible"));

    const response = await request(app).get("/weather").query({ q: "Paris" });
    expect(response.statusCode).toBe(500);
    expect(response.text).toContain("Erreur serveur.");
  });
});
