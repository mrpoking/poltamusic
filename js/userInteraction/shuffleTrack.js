import { domStation, storeStation } from '../myStation/exportMyStation.js'
import { renderPlaylist } from '../function/loadPlaylist/renderPlaylist.js'
import { persistShuffleState } from '../function/exportFunction/shuffleState.js'


domStation.shuffleTrackButton.addEventListener('click', () =>
{
  if (storeStation.isShuffleTrack)
  {
    shuffleTrack()
    persistShuffleState()

    renderPlaylist()

    console.log('Shuffled Playlist Again!')
    return
  }

  storeStation.isShuffleTrack = true
  storeStation.isPlayOneTrack = false
  storeStation.isReplayTrack = false

  domStation.playOneTrackButton.classList.remove('play-one-track-button-selected')
  domStation.replayTrackButton.classList.remove('replay-track-button-selected')
  domStation.shuffleTrackButton.classList.add('shuffle-track-button-selected')

  shuffleTrack()
  persistShuffleState()

  renderPlaylist()
  console.log('Shuffle Playlist: On')
})


export function shuffleTrack()
{
  const tracksArray = storeStation.tracksArray.map((_, trackIndex) => trackIndex)

  const randomBuffer = new Uint32Array(tracksArray.length)
  crypto.getRandomValues(randomBuffer)

  for (let trackIndex = (tracksArray.length - 1); trackIndex > 0; trackIndex--)
  {
    const randomIndex = (randomBuffer[trackIndex] % (trackIndex + 1))
    ;[tracksArray[trackIndex], tracksArray[randomIndex]] = [tracksArray[randomIndex], tracksArray[trackIndex]]
  }

  const start = (crypto.getRandomValues(new Uint32Array(1))[0] % tracksArray.length)
  const rotated = tracksArray.slice(start).concat(tracksArray.slice(0, start))

  storeStation.shuffledTracksArray = rotated
  if (storeStation.currentTrackIndex >= 0)
  {
    const getShuffleTrackIndex = rotated.indexOf(storeStation.currentTrackIndex)
    storeStation.shuffleTrackIndex = Math.max(0, getShuffleTrackIndex)
  }

  else
  {
    storeStation.shuffleTrackIndex = 0
  }
}