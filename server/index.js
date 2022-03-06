const express = require("express");
const { loadImage, createCanvas, Image } = require("canvas");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const ws = require("ws");
const http = require("http");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, "../build")));

app.get("/get-img/:id", (req, res, next) => {
  const id = req.params.id;
  console.log("something");
  res.download(`./images/${id}.png`);
});

app.get("*", (req, res, next) => {
  res.send(path.resolve(__dirname, "../build", "index.html"));
});

const server = http.createServer(app);

const wss = new ws.Server({ server });

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const artData = JSON.parse(data);

    if (artData.type === "DELETE_IMG") {
      const path = "./images/" + data.id + ".png";
      return fs.unlink(path, (err) => {
        if (err) {
          console.log(err.message);
        }
      });
    }

    const canvasWidth = 10 * artData.cs;
    const canvasHeight = 10 * artData.rs;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const context = canvas.getContext("2d");

    for (let i = 0; i < artData.rs; i++) {
      for (let j = 0; j < artData.cs; j++) {
        context.fillStyle =
          artData.img.rows[i][j].color === artData.dc
            ? "transparent"
            : artData.img.rows[i][j].color;
        context.fillRect(j * 10, i * 10, 10, 10);
      }
    }

    const uid = function () {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    const id = uid();

    const url = path.join("images", id + ".png");
    const buf = canvas.toBuffer();

    fs.writeFile(url, buf, (err) => {
      if (err) {
        return console.log(err.message);
      }
      ws.send(JSON.stringify({ id: id }));
    });
  });
});

server.listen(PORT, () => console.log(`listen on port ${PORT}`));
