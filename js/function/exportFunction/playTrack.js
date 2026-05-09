import { domStation, storeStation } from '../../myStation/exportMyStation.js'
import { getTrackData } from './getTrackData.js'
import { updateUI } from '../updateElement/updateUI.js'
import { preloadNext } from './preloadNext.js'
import { syncShuffleIndexToTrack } from './shuffleState.js'
import { syncMediaSessionTrack, syncPlayPauseButtonIcon } from '../../userInteraction/mediaSession.js'


export async function playTrack(index, options = {})
{
  const { allowWhilePlayOne = false } = options
  if (storeStation.isPlayOneTrack && !allowWhilePlayOne)
  {
    return
  }

  const token = ++storeStation.loadToken
  const meta = storeStation.tracksArray[index]

  if (!meta)
  {
    return
  }

  storeStation.preloadToken++
  storeStation.nextPreloadedTrackIndex = -1

  if (storeStation.nextTrackURL)
  {
    URL.revokeObjectURL(storeStation.nextTrackURL)
    storeStation.nextTrackURL = null
  }

  domStation.audioFromTrack.pause()
  domStation.audioFromTrack.removeAttribute('src')
  domStation.audioFromTrack.load()

  const track = await getTrackData(meta.id)
  if (!track?.data)
  {
    console.error('Invalid Audio Data!')
    console.log('Invalid Audio Data!')

    return
  }

  if (token !== storeStation.loadToken)
  {
    return
  }

  if (storeStation.currentTrackURL)
  {
    URL.revokeObjectURL(storeStation.currentTrackURL)
  }

  const savedSeek = Number(localStorage.getItem('seek_track_' + meta.id))
  if (!Number.isNaN(savedSeek))
  {
    domStation.audioFromTrack.currentTime = savedSeek
  }

  const blob = (track.data instanceof Blob) 
    ? (track.data) 
    : (new Blob([track.data], { type: meta.type }))

  storeStation.currentTrackIndex = index
  storeStation.currentTrackURL = URL.createObjectURL(blob)

  domStation.audioFromTrack.src = storeStation.currentTrackURL
  domStation.audioFromTrack.play()
    .then(() =>
    {
      storeStation.needsMediaGestureToPlay = false
      syncPlayPauseButtonIcon()
    })

    .catch(() =>
    {
      storeStation.needsMediaGestureToPlay = true
      syncPlayPauseButtonIcon()
    })

  const savedVolumeString = localStorage.getItem('volume_track_' + meta.id)
  if (savedVolumeString === null) 
  {
    const globalVolume = (Number(localStorage.getItem('volumeLevel')) || 0.5)
    domStation.audioFromTrack.volume = globalVolume
    domStation.volumeBar.value = (globalVolume * 10)
  } 
  
  else 
  {
    const savedSongVolume = Number(savedVolumeString)
    domStation.audioFromTrack.volume = savedSongVolume
    domStation.volumeBar.value = (savedSongVolume * 10)
  }

  const name = meta.name.replace(/\.(mp3|mp4)$/i, '')
  document.title = name
  document.getElementById('trackNameWrapper').textContent = name

  syncMediaSessionTrack(name)

  localStorage.setItem('lastSongIndex', index)
  storeStation.trackMetadataArray.forEach(item => item.classList.remove('active-track'))

  const activeRow = storeStation.trackMetadataArray.find(list => list && (Number(list.dataset.trackIndex) === index))
  if (activeRow)
  {
    activeRow.classList.add('active-track')
  }

  syncShuffleIndexToTrack(index)
  
  preloadNext()
  updateUI()
}