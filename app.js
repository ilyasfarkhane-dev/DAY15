const http = require("http");
const hostname = "127.0.0.1";
const port = 8000;
const url = require("url");


const cities = [
  { name: "New York", lat: 40.7128, lng: -74.006 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Paris", lat: 48.8566, lng: 2.3522 },
  { name: "Tokyo", lat: 35.6895, lng: 139.6917 },
  { name: "Sydney", lat: -33.8651, lng: 151.2099 },
  { name: "Rome", lat: 41.9028, lng: 12.4964 },
  { name: "Cairo", lat: 30.0444, lng: 31.2357 },
  { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729 },
  { name: "Dubai", lat: 25.2048, lng: 55.2708 },
  { name: "Rabat", lat: 34.0209, lng: -6.8416 },
];

async function getWeather(selectedCity) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lng}&current_weather=true`
    );
    const data = await response.json();
    const temp = `${selectedCity.name} : ${data.current_weather.temperature}${data.current_weather_units.temperature}`;
    return temp;
  } catch (error) {
    console.log(error);
  }
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;
  if (path === "/weather") {
    const city = query.city;
    if (city) {
      const selectedCity = cities.find(
        (c) => c.name.toLowerCase() === city.toLowerCase()
      );
      if (selectedCity) {
        const weaterData = await getWeather(selectedCity);

        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });

        res.end(weaterData);
      } else {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Ville non trouvée");
      }
    } else {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Le paramètre de ville est manquant");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
