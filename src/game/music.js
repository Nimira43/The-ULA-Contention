const TRACKS = [
  '/music/Track01.mp3',
  '/music/Track02.ogg',
  '/music/Track03.wav',
  '/music/Track04.mp3',
  '/music/Track05.ogg',
  '/music/Track06.wav',
  '/music/Track07.ogg',
  '/music/Track09.wav',
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