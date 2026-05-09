import { domStation, storeStation } from '../myStation/exportMyStation.js'
import { pauseShufflePlayback, resumeShufflePlaybackIfOrdered } from '../function/exportFunction/shuffleState.js'
import { renderPlaylist } from '../function/loadPlaylist/renderPlaylist.js'


function refreshPlaylistView()
{
  const isSearching = (domStation.searchTrackBar.value.trim().length > 0)
  if (!isSearching)
  {
    renderPlaylist()
  }
}


domStation.playOneTrackButton.addEventListener('click', () =>
{
  storeStation.isPlayOneTrack = !storeStation.isPlayOneTrack
  domStation.playOneTrackButton.classList.toggle('play-one-track-button-selected', storeStation.isPlayOneTrack)

  if (storeStation.isPlayOneTrack)
  {
    storeStation.isReplayTrack = false
    domStation.replayTrackButton.classList.remove('replay-track-button-selected')

    pauseShufflePlayback()
    refreshPlaylistView()

    console.log('Play Until The End: On')
  }
  
  else
  {
    resumeShufflePlaybackIfOrdered()
    refreshPlaylistView()

    console.log('Play Until The End: Off')
  }
})