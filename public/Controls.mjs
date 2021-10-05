function setUpControls(player, socket) {


    this.getDirection = (event) => {
        let keycode = event.which;
        if (keycode == 83 || keycode == 40) return "down"
        if (keycode == 68 || keycode == 39) return "right"
        if (keycode == 90 || keycode == 38) return "up"
        if (keycode == 81 || keycode == 37) return "left"
    }

    document.onkeydown = (e) => {

        let direction = this.getDirection(e)

        if (direction) {

            player.movmentDir[direction] = true
            socket.emit("playerMove", {x:player.x,y:player.y,id:player.id,dir:player.movmentDir})
        }
    }

    document.onkeyup = (e) => {

        let direction = this.getDirection(e)

        if (direction) {

            player.movmentDir[direction] = false
            socket.emit("playerMove", {x:player.x,y:player.y,id:player.id,dir:player.movmentDir})
        }
      
      
    }




}

export default setUpControls