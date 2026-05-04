import { domStation, storeStation } from '../myStation/exportMyStation.js'
import { pauseShufflePlayback, resumeShufflePlaybackIfOrdered } from '../function/exportFunction/shuffleState.js'
import { renderPlaylist } from '../myStation/loadPlaylist.js'


domStation.replayTrackButton.addEventListener('click', () =>
{
  storeStation.isReplayTrackMode = !storeStation.isReplayTrackMode
  domStation.replayTrackButton.classList.toggle('replay-track-button-selected', storeStation.isReplayTrackMode)

  if (storeStation.isReplayTrackMode)
  {
    storeStation.isPlayOneTrackMode = false
    domStation.playOneTrackButton.classList.remove('play-one-track-button-selected')
    
    pauseShufflePlayback()
    renderPlaylist()

    console.log('Replay The Track: On')
  }

  else
  {
    resumeShufflePlaybackIfOrdered()
    renderPlaylist()

    console.log('Replay The Track: Off')
  }
})