import { domStation, storeStation } from '../../myStation/exportMyStation.js'
import { noResultsLayout } from '../../function/loadPlaylist/loadPlaylist.js'
import { playTrack } from '../exportFunction/playTrack.js'
import { deleteTrack } from '../../userInteraction/deleteTrack.js'
import { hasValidShuffleOrder } from '../exportFunction/shuffleState.js'


export function renderPlaylist()
{
  domStation.userPlaylistLayout.innerHTML = ''
  domStation.userPlaylistLayout.appendChild(noResultsLayout)

  storeStation.trackMetadataArray = []

  const validPlayList = hasValidShuffleOrder()
    ? (storeStation.shuffledTracksArray)
    : (storeStation.tracksArray.map((_, trackIndex) => trackIndex))

  validPlayList.forEach(trackIndex =>
  {
    const track = storeStation.tracksArray[trackIndex]
    if (!track)
    {
      return
    }

    const list = document.createElement('li')
    list.dataset.trackIndex = String(trackIndex)

    const division = document.createElement('div')
    division.className = 'delete-track-button-wrapper'

    const deleteButton = document.createElement('button')
    deleteButton.type = 'button'
    deleteButton.className = 'delete-track-button'
    deleteButton.innerHTML = '<div class="delete-track-icon"></div>'
    deleteButton.addEventListener('click', event => deleteTrack(event, track.id))

    const span = document.createElement('span')
    span.className = 'playlist-track-title'
    span.textContent = track.name
    
    division.appendChild(deleteButton)
    division.appendChild(span)

    list.appendChild(division)

    if (trackIndex === storeStation.currentTrackIndex)
    {
      list.classList.add('active-track')
    }

    list.onclick = () =>
    {
      if (storeStation.isPlayOneTrack)
      {
        return
      }

      const isCurrentTrack = (trackIndex === storeStation.currentTrackIndex)
      const hasCurrentSource = Boolean(domStation.audioFromTrack.src)

      if (isCurrentTrack && hasCurrentSource)
      {
        if (domStation.audioFromTrack.paused)
        {
          domStation.audioFromTrack.play().catch(() => {})
        }

        return
      }
      
      const track = storeStation.tracksArray[trackIndex]
      if (track)
      {
        localStorage.setItem('seek_track_' + track.id, 0)
      }

      playTrack(trackIndex, { allowWhilePlayOne: storeStation.isPlayOneTrack }).then(() =>
      {
        const isSearching = (domStation.searchTrackBar.value.trim().length > 0)
        if (isSearching)
        {
          storeStation.trackMetadataArray.forEach(item => item.classList.remove('active-track'))
          list.classList.add('active-track')
          
          return
        }

        renderPlaylist()
      })
    }

    storeStation.trackMetadataArray.push(list)
    domStation.userPlaylistLayout.appendChild(list)
  })
}