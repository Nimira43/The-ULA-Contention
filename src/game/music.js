const TRACKS = [
  '/music/Track01.ogg',
  '/music/Track02.mp3',
  '/music/Track03.ogg',
  '/music/Track04.wav',
  '/music/Track05.wav',
  '/music/Track06.wav',
  '/music/Track07.mp3',
  '/music/Track08.ogg',
]

export function createMusicPlayer(volume = 0.8 )  {
  const audio = new Audio()     
  audio.volume = volume
  let index = 0
  let started = false

  function playCurrent() {
    audio.src = TRACKS[index]
    audio.play().catch(() => {})
  }

  audio.addEventListener('ended', () => {
    index = (index + 1) % TRACKS.length
    playCurrent()
  })

  return {
    start() {
      if (started) return
      started = true
      playCurrent()
    },
    stop() {
      audio.pause()
    },
    setVolume(v) {
      audio.volume = v
    },
  }
}