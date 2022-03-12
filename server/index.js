const express = require("express");
const { loadImage, createCanvas, Image } = require("canvas");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const ws = require("ws");
const http = require("http");
const multer = require("multer");
const upload = multer({ dest: path.join(__dirname, "uploads") });
const Jimp = require("jimp");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/get-img/:id", (req, res, next) => {
  const id = req.params.id.split("-");
  res.download(path.join(__dirname, `./images/${id[0]}/${id[1]}.png`));
});

app.post("/upl-img", upload.single("img"), (req, res, next) => {
  const fileName = req.file.filename;
  const ps = +req.body.ps;
  const defColor = req.body.dc;
  Jimp.read(path.join(__dirname, "uploads", fileName))
    .then((img) => {
      const art = [];
      const cs = img.getWidth() / ps;
      const rs = img.getHeight() / ps;
      for (let i = 0; i < rs; i++) {
        const row = [];
        for (let j = 0; j < cs; j++) {
          let color = Jimp.intToRGBA(
            img.getPixelColor(j * ps + ps / 2, i * ps + ps / 2)
          );
          if (color.a === 0) {
            color = "rgb(49, 49, 49)";
          } else {
            color = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
          }

          row.push({
            xpos: j,
            ypos: i,
            color: color,
          });
        }
        art.push(row);
      }
      res.json(art);
      fs.unlink(path.join(__dirname, "uploads", fileName), (err) => {});
    })
    .catch((err) => {});
});

app.get("*", (req, res, next) => {
  res.send(path.resolve(__dirname, "../client/build", "index.html"));
});

const server = http.createServer(app);

const wss = new ws.Server({ server });

const uid = function () {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

wss.on("connection", (ws) => {
  const dirName = uid();
  fs.mkdirSync(path.join(__dirname, "images", dirName));
  ws.on("message", (data) => {
    const artData = JSON.parse(data);

    const canvasWidth = artData.ps * artData.cs;
    const canvasHeight = artData.ps * artData.rs;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const context = canvas.getContext("2d");

    for (let i = 0; i < artData.rs; i++) {
      for (let j = 0; j < artData.cs; j++) {
        context.fillStyle =
          artData.img.rows[i][j].color === artData.dc
            ? "transparent"
            : artData.img.rows[i][j].color;
        context.fillRect(
          j * artData.ps,
          i * artData.ps,
          artData.ps,
          artData.ps
        );
      }
    }

    const id = uid();

    const url = path.join(__dirname, "images", dirName, id + ".png");
    const buf = canvas.toBuffer();
    fs.writeFile(url, buf, (err) => {
      if (err) {
        return;
      }
      ws.send(JSON.stringify({ id: dirName + "-" + id }));
    });
  });

  ws.on("close", (c, r) => {
    fs.readdir(path.join(__dirname, "images", dirName), (err, files) => {
      if (err) return;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        fs.unlinkSync(path.join(__dirname, "images", dirName, file));
      }
      fs.rmdir(path.join(__dirname, "images", dirName), (err) => {
        if (err) {
        }
      });
    });
  });
});

server.listen(PORT);
