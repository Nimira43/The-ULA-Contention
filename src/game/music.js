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

export function createMusicPlayer(volume = 0.5) {
  const audio = new Audio()
  audio.volume = volume
  let index = 0

  function playCurrent() {
    audio.src = TRACKS[index]
    return audio.play()
  }

  audio.addEventListener('ended', () => {
    index = (index + 1) % TRACKS.length
    playCurrent().catch(() => {})
  })

  return {
    start() {
      const attempt = audio.src ? audio.play() : playCurrent()
      if (attempt && attempt.catch) attempt.catch(() => {})
    },
    stop() {
      audio.pause()
    },
    setVolume(v) {
      audio.volume = v
    },
  }
}