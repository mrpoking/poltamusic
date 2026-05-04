import { domStation, storeStation } from './exportMyStation.js'
import { restoreLastTrack } from '../function/exportFunction/restoreLastTrack.js'
import { playTrack } from '../function/exportFunction/playTrack.js'
import { deleteTrack } from '../userInteraction/deleteTrack.js'
import { hasValidShuffleOrder, restoreShuffleFromStorage } from '../function/exportFunction/shuffleState.js'


export const noResultsLayout = document.createElement('li')
noResultsLayout.classList.add('no-results-layout')
noResultsLayout.textContent = 'No Results...'
noResultsLayout.style.display = 'none'


export function renderPlaylist()
{
  domStation.userPlaylistLayout.innerHTML = ''
  domStation.userPlaylistLayout.appendChild(noResultsLayout)

  storeStation.trackMetadataArray = []

  const list = hasValidShuffleOrder()
    ? (storeStation.shuffledIndexes)
    : (storeStation.tracksArray.map((_, trackIndex) => trackIndex))

  list.forEach(trackIndex =>
  {
    const track = storeStation.tracksArray[trackIndex]
    if (!track)
    {
      return
    }

    const li = document.createElement('li')
    li.dataset.trackIndex = String(trackIndex)

    const row = document.createElement('div')
    row.className = 'delete-track-button-wrapper'

    const deleteButton = document.createElement('button')
    deleteButton.type = 'button'
    deleteButton.className = 'delete-track-button'
    deleteButton.innerHTML = '<div class="delete-track-icon"></div>'
    deleteButton.addEventListener('click', event => deleteTrack(event, track.id))

    const title = document.createElement('span')
    title.textContent = track.name
    title.className = 'playlist-track-title'

    row.appendChild(deleteButton)
    row.appendChild(title)
    li.appendChild(row)

    if (trackIndex === storeStation.currentTrackIndex)
    {
      li.classList.add('active-track')
    }

    li.onclick = () =>
    {
      storeStation.currentTrackIndex = trackIndex

      playTrack(trackIndex, { allowWhilePlayOne: storeStation.isPlayOneTrackMode })
      renderPlaylist()
    }

    storeStation.trackMetadataArray.push(li)
    domStation.userPlaylistLayout.appendChild(li)
  })
}


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
      }, 50)

      if (domStation.searchTrackBar.value.length > 0)
      {
        domStation.searchTrackBar.dispatchEvent(new Event('input'))
      }
    }
  }
}