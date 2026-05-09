import { domStation, storeStation } from '../myStation/exportMyStation.js'
import { noResultsLayout } from '../function/loadPlaylist/loadPlaylist.js'


domStation.searchTrackBar.addEventListener('input', () =>
{
  if (!storeStation.isPlaylistLoaded)
  {
    return
  }

  clearTimeout(storeStation.searchTrackTimeout)

  const value = domStation.searchTrackBar.value.toLowerCase()
  storeStation.searchTrackTimeout = setTimeout(() =>
  {
    let trackHasFound = false
    storeStation.trackMetadataArray.forEach(data =>
    {
      const trackIndex = Number(data.dataset.trackIndex)
      const track = storeStation.tracksArray[trackIndex]
      const isMatching = track.name.toLowerCase().includes(value)

      data.style.display = (isMatching) ? ('') : ('none')
      
      if (isMatching)
      {
        trackHasFound = true
      }
    })

    noResultsLayout.style.display = (trackHasFound) ? ('none') : ('')
    storeStation.isTrackFound = trackHasFound
  }, 145)
})