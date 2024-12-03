const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.render("index", { weatherData: null, error: null });
});

app.post("/", function (req, res) {
    const query = req.body.cityName;
    const apiKey = "158800bb116458e49b56b785a5380714";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {
            const weatherData = JSON.parse(data);

            if (response.statusCode === 200) {
                const temp = weatherData.main.temp;
                const weatherDescription = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

                res.render("index", {
                    weatherData: {
                        city: query,
                        temp: temp,
                        description: weatherDescription,
                        icon: imageURL
                    },
                    error: null
                });
            } else {
                res.render("index", { weatherData: null, error: "City not found or API error" });
            }
        });
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.");
});
