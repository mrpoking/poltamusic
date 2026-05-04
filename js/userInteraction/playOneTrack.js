import { domStation, storeStation } from '../myStation/exportMyStation.js'
import { pauseShufflePlayback, resumeShufflePlaybackIfOrdered } from '../function/exportFunction/shuffleState.js'
import { renderPlaylist } from '../myStation/loadPlaylist.js'


domStation.playOneTrackButton.addEventListener('click', () =>
{
  storeStation.isPlayOneTrackMode = !storeStation.isPlayOneTrackMode
  domStation.playOneTrackButton.classList.toggle('play-one-track-button-selected', storeStation.isPlayOneTrackMode)

  if (storeStation.isPlayOneTrackMode)
  {
    storeStation.isReplayTrackMode = false
    domStation.replayTrackButton.classList.remove('replay-track-button-selected')

    pauseShufflePlayback()
    renderPlaylist()

    console.log('Play Until The End: On')
  }
  
  else
  {
    resumeShufflePlaybackIfOrdered()
    renderPlaylist()
    console.log('Play Until The End: Off')
  }
})