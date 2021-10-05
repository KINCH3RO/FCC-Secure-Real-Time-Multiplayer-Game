
class Collectible {

  constructor({ x = 10, y = 10, value = 1, id, width = 35, height = 35, context }) {

    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.width = width;
    this.height = height;
    this.context = context
 

  }

  draw() {
    let img = new Image()
    img.src = "assets/collectible.png"
    this.context.shadowBlur = 20;
    this.context.shadowColor = "black";
    this.context.drawImage(img, this.x, this.y, this.width, this.height);
  }

  getRandomPos() {
    this.x = Math.floor(Math.random() * ((640 - this.width)));
    this.y = Math.floor(Math.random() * ((480 - this.width) - 50) + 50);
    
  }
}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch (e) { }

export default Collectible;
