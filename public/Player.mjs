let canvasW = 640;
let canvasH = 480;



class Player {
  constructor({ x = 100, y = 100, score = 0, width = 25, height = 25, id, mine }) {
    this.x = x;
    this.y = y;
    this.width = 40,
      this.height = 40;
    this.score = score;
    this.id = id;
    this.mine = mine;
    this.movmentDir = {}
    this.speed = 5;
    this.canvasW = canvasW;
    this.canvasH = canvasH;



  }

  drawPlayer(collectible, socket,context, collectSound) {
    Object.keys(this.movmentDir).forEach(dir => {
      if (this.movmentDir[dir]) {
        this.movePlayer(dir, this.speed)
      }
    })


    let picturePath = this.mine ? "assets/player.png" : "assets/Enemy.png"
    let img = new Image()
    img.src = (picturePath)
    context.shadowBlur = 20;
    context.shadowColor = "black";
    context.drawImage(img, this.x, this.y, this.width, this.height);

    if (this.collision(collectible)) {
      collectSound.play()
      collectible.id = this.id;
      socket.emit("newCollectible", collectible, this.id)
    }





    // if (this.mine) {
    //   context.fillStyle = 'white';
    // } else {
    //   context.fillStyle = 'red';
    // }
    // context.fillRect(this.x, this.y, this.width, this.height);


  }

  movePlayer(dir, speed) {


    this.x += dir == "right" && this.x < this.canvasW - this.width ? speed : dir == "left" && this.x > 0 ? -speed : 0;
    this.y += dir == "up" && this.y > 50 ? -speed : dir == "down" && this.y < this.canvasH - this.height ? speed : 0;

  }

  collision(item) {

    if (item.x + item.width > this.x && this.x + this.width > item.x && this.y + this.height > item.y && item.y + item.height > this.y) {
      return true
    }
    return false;


  }


  calculateRank(arr) {
    let maxRank = arr.length
    let sortedArray = arr.sort((a, b) => {
      return b.score - a.score
    })
    let mainPlayerIndex = sortedArray.indexOf(sortedArray.find(player => player.id == this.id))
    console.log(arr);
    return `Rank: ${mainPlayerIndex + 1}/${maxRank}`
  }
}

export default Player;
