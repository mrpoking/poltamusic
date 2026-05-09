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


domStation.replayTrackButton.addEventListener('click', () =>
{
  storeStation.isReplayTrack = !storeStation.isReplayTrack
  domStation.replayTrackButton.classList.toggle('replay-track-button-selected', storeStation.isReplayTrack)

  if (storeStation.isReplayTrack)
  {
    storeStation.isPlayOneTrack = false
    domStation.playOneTrackButton.classList.remove('play-one-track-button-selected')
    
    pauseShufflePlayback()
    refreshPlaylistView()

    console.log('Replay The Track: On')
  }

  else
  {
    resumeShufflePlaybackIfOrdered()
    refreshPlaylistView()

    console.log('Replay The Track: Off')
  }
})