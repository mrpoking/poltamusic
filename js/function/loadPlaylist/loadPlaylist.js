import { domStation, storeStation } from '../../myStation/exportMyStation.js'
import { restoreShuffleFromStorage } from '../../function/exportFunction/shuffleState.js'
import { restoreLastTrack } from '../exportFunction/restoreLastTrack.js'
import { renderPlaylist } from './renderPlaylist.js'


export const noResultsLayout = document.createElement('li')
noResultsLayout.classList.add('no-results-layout')
noResultsLayout.textContent = 'No Results...'
noResultsLayout.style.display = 'none'


export function loadPlaylist() 
{
  domStation.searchTrackBar.value = ''

  storeStation.tracksArray = []
  storeStation.trackMetadataArray = []

  storeStation.loadToken++
  storeStation.preloadToken++

  storeStation.isPlaylistLoaded = false
  storeStation.userInteractedEarly = false

  domStation.userPlaylistLayout.innerHTML = ''
  domStation.userPlaylistLayout.appendChild(noResultsLayout)

  const transaction = storeStation.playlistDB.transaction('tracks', 'readonly')
  const trackStore = transaction.objectStore('tracks')

  trackStore.openCursor().onsuccess = event =>
  {
    const cursor = event.target.result
    if (cursor)
    {
      const track = cursor.value
      storeStation.tracksArray.push({
        id: track.id,
        name: track.name.replace(/\.(mp3|mp4)$/i, ''),
        type: track.type,
      })

      cursor.continue()
    }
    
    else
    {
      storeStation.isPlaylistLoaded = true

      setTimeout(() =>
      {
        restoreShuffleFromStorage()
        restoreLastTrack()

        renderPlaylist()
      }, 45)

      if (domStation.searchTrackBar.value.length > 0)
      {
        domStation.searchTrackBar.dispatchEvent(new Event('input'))
      }
    }
  }
}