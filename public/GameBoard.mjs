function gameBoard(canvas, context) {
    this.canvas = canvas;
    this.context = context;

    this.rank = `Rank : 0 / 0`;

    this.gameName = "The Collector"
    this.instruction = "Controls : WASD"

    this.drawMap = () => {
        context.fillStyle = '#1E1E1E';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.font = '20px Black Ops One';
        context.fillText(this.instruction, 10, 30);
        context.fillText(this.gameName, canvas.width / 2 - 70, 30);
        context.fillText(this.rank, canvas.width - 150, 30);

        context.fillRect(0, 50, canvas.width, 1);

        let img = new Image()
        img.src = ("assets/map.jpg")
        context.drawImage(img, 0, 50, canvas.width, canvas.height - 50);
    }

    this.setRank = (value) => {
        this.rank = value;
    }

    this.clear = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    this.refresh = () => {
        this.clear();
        this.drawMap();
    }


    this.getRandomPos = (adjustment) => {
        let x = Math.floor(Math.random() * ((canvas.width - adjustment)));
        let y = Math.floor(Math.random() * ((canvas.height - adjustment) - 50) + 50);
        return { x, y }
    }







}

export default gameBoard