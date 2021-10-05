function AudioController(src, loop = false, volume = 1) {
  this.audioPlayer = new Audio()
  this.audioPlayer.src = src
  this.audioPlayer.volume = volume;
  this.audioPlayer.loop = loop;


  this.play = () => {
    this.audioPlayer.src = src
    this.audioPlayer.play()

  }

  this.stop = () => {
    this.audioPlayer.pause()

  }
  this.setVolume = (value) => {
    this.audioPlayer.volume = value;
  }

}

export default AudioController
