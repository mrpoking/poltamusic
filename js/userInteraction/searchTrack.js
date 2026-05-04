import { domStation, storeStation } from '../myStation/exportMyStation.js'
import { noResultsLayout } from '../myStation/loadPlaylist.js'


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
    storeStation.trackMetadataArray.forEach(li =>
    {
      const trackIndex = Number(li.dataset.trackIndex)
      const track = storeStation.tracksArray[trackIndex]
      const match = track.name.toLowerCase().includes(value)

      li.style.display = match ? '' : 'none'
      if (match)
      {
        trackHasFound = true
      }
    })

    noResultsLayout.style.display = trackHasFound ? 'none' : ''
    storeStation.isTrackFound = trackHasFound
  }, 150)
})