require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const http = require('http')
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');
const collectible = require('./public/Collectible.mjs')
const helmet = require('helmet')
const app = express();
const cors = require('cors');
app.use(cors({origin: '*'})); 
app.use(bodyParser.urlencoded({ extended: true }));
//helmet security
app.use(helmet.noSniff())
app.use(helmet.xssFilter())
app.use(helmet.noCache())
app.use((req, res, next) => {
  res.setHeader('x-powered-by', 'PHP 7.4.3')
  next();
})

//end helmet security
const httpserver = http.createServer(app)
const io = socket(httpserver)

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});



//game logic
let Players = []
let collectibleId = 1;
let collectibeVariant = new collectible({ id: collectibleId })
collectibeVariant.getRandomPos()
io.on("connection", socket => {


  socket.emit("start", Players, collectibeVariant)

  socket.on("disconnect", () => {
    Players.splice(Players.indexOf(Players.find(x => x.id == socket.id)), 1)
    io.emit("playerLeft", socket.id)
   // console.log("player disconnected with id " + socket.id);

  })
  socket.on("addPlayer", (data) => {
    Players.push(data)
    io.emit("updateScore", Players)
    io.emit("addPlayer", data)
  })

  socket.on("playerMove", (data) => {
    let targetedIndex = Players.indexOf(Players.find(x => x.id == data.id))
    Players[targetedIndex].x = data.x
    Players[targetedIndex].y = data.y
    io.emit("playerMove", data)
  })

  socket.on("newCollectible", (destroyedColl, playerid) => {


    collectibleId++;
    collectibeVariant = new collectible({ id: collectibleId })
    collectibeVariant.getRandomPos()
    io.emit("newCollectible", collectibeVariant)
    let targetedIndex = Players.indexOf(Players.find(x => x.id == playerid))

    if (targetedIndex != -1) {

      Players[targetedIndex].score += destroyedColl.value
      io.emit("updateScore", Players)
    }

  })


})

//end game logic

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = httpserver.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing
