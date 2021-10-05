import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import GameBoard from './GameBoard.mjs';
import setUpControls from './Controls.mjs';
import AudioController from './AudioController.mjs';


const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');
const gameBoard = new GameBoard(canvas, context)
const gameMusic = new AudioController("assets/gameSounds/gameSound.mp3", true, 0.2)
const spawnSound = new AudioController("assets/gameSounds/spawn.wav", false, 1)
const collectSound = new AudioController("assets/gameSounds/collect.wav", false, 1)

gameBoard.drawMap()

let players = [];
let playesScoreArray = [];
let mainPlayerId = null
let prize = null;
let randomPlayerPos = gameBoard.getRandomPos(50)




socket.on("connect", () => {
    //play game music
    gameMusic.play()
    //retreiving  joined players
    socket.on("start", (data, coll) => {

        mainPlayerId = socket.id;
        data.forEach(player => {
            playesScoreArray.push(player)
            players.push(new Player({
                x: player.x,
                y: player.y,
                mine: player.id == mainPlayerId,
                context: context,
                id: player.id
            }))
        })
            


        //drawing the collectible
        if (coll) {
            prize = generateCollectible(coll.id, coll.x, coll.y)
        }
    })


    //invoking the main controllable player
    let mainPlayer = new Player({
        x: randomPlayerPos.x,
        y: randomPlayerPos.y,
        mine: true,
        context: context,
        id: socket.id
    })

    //sending player to the server
    socket.emit("addPlayer", mainPlayer)
    //receiveng new players
    socket.on("addPlayer", player => {
        let newPlayer = new Player({
            x: player.x,
            y: player.y,
            mine: player.id == mainPlayerId,
            context: context,
            id: player.id
        })


        if (newPlayer.id == mainPlayerId) {
            //setuping controls
            let Control = new setUpControls(newPlayer, socket)
        }
        players.push(newPlayer)
        //play spawn sound
        spawnSound.play()
        calculateScore();


    })
    //sync player movments
    socket.on("playerMove", ({ x, y, id, dir }) => {


        let targetedPlayerIndex = players.indexOf(players.find(player => player.id == id))
        if (targetedPlayerIndex != -1) {

            players[targetedPlayerIndex].movmentDir = dir
            players[targetedPlayerIndex].x = x
            players[targetedPlayerIndex].y = y


        }
    })

    //handle disconnect
    socket.on("playerLeft", id => {
        players.splice(players.indexOf(players.find(x => x.id == id)), 1)
    })

    //generate new collectible
    socket.on("newCollectible", coll => {
        console.log(coll);
        prize = generateCollectible(coll.id, coll.x, coll.y)
    })
    //update score
    socket.on("updateScore", (playersScoreData) => {

        
        playesScoreArray = playersScoreData;
        calculateScore()

    })




});




//frames
setInterval(() => {
    gameBoard.refresh()
    if (prize != null) {
        prize.draw()
    }

    players.forEach(player => player.drawPlayer(prize, socket,context,collectSound))
}, 4.5)


function calculateScore() {

    let mainPlayerIndex = players.indexOf(players.find(player => player.id == mainPlayerId))

    if (mainPlayerIndex != -1) {
        let value = players[mainPlayerIndex].calculateRank(playesScoreArray)
        gameBoard.setRank(value)
    }

}

function generateCollectible(id, x, y) {

    return new Collectible({
        x: x,
        y: y,
        id: id,
        context: context
    })

}











