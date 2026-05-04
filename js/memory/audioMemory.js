import { domStation, storeStation } from '../myStation/exportMyStation.js'
import { updateUI } from '../function/updateElement/updateUI.js'
import { preloadNext } from '../function/exportFunction/preloadNext.js'
import { playTrack } from '../function/exportFunction/playTrack.js'
import { shuffleTrack } from '../userInteraction/shuffleTrack.js'
import { getNextPlaylistTrackIndex } from '../function/exportFunction/shuffleState.js'


domStation.audioFromTrack.addEventListener('ended', () => 
{
  if (storeStation.isShuffleTrackMode)
  {
    if (!storeStation.tracksArray.length)
    {
      return
    }

    if (!storeStation.shuffledIndexes.length)
    {
      shuffleTrack()
    }

    const len = storeStation.shuffledIndexes.length
    const nextPos = ((storeStation.shuffleIndex + 1) % len)
    storeStation.shuffleIndex = nextPos
    const safeIndex = storeStation.shuffledIndexes[nextPos]

    storeStation.currentTrackIndex = safeIndex

    playTrack(safeIndex)

    domStation.audioFromTrack.pause()
    domStation.audioFromTrack.currentTime = 0

    updateUI()
    preloadNext()

    console.log('Shuffle next:', storeStation.tracksArray[safeIndex]?.name)

    return
  }

  if (storeStation.isPlayOneTrackMode)
  {
    if (!storeStation.tracksArray.length)
    {
      return
    }

    const nextIndex = getNextPlaylistTrackIndex()
    if (nextIndex === null)
    {
      return
    }

    const nextTrack = storeStation.tracksArray[nextIndex]

    const current = storeStation.tracksArray[storeStation.currentTrackIndex]
    if (current)
    {
      localStorage.setItem('seek_track_' + current.id, 0)
    }

    storeStation.currentTrackIndex = nextIndex

    const finishPlayOneCue = () =>
    {
      domStation.audioFromTrack.pause()
      domStation.audioFromTrack.currentTime = 0

      const pauseTrackIcon = `<div class="pause-track-icon"></div>`
      domStation.playPauseTrackButton.innerHTML = pauseTrackIcon

      updateUI()
      preloadNext()

      console.log('Ready next track (Paused):', nextTrack?.name || 'Unknown')
    }

    const playOnePreloadOk = (storeStation.nextTrackURL?.startsWith('blob:') && (storeStation.nextPreloadedTrackIndex === nextIndex))
    if (playOnePreloadOk)
    {
      if (storeStation.currentTrackURL)
      {
        URL.revokeObjectURL(storeStation.currentTrackURL)
      }

      storeStation.currentTrackURL = storeStation.nextTrackURL
      storeStation.nextTrackURL = null
      storeStation.nextPreloadedTrackIndex = -1

      domStation.audioFromTrack.src = storeStation.currentTrackURL
      finishPlayOneCue()
    }

    else
    {
      playTrack(nextIndex, { allowWhilePlayOne: true }).then(finishPlayOneCue)
    }

    return
  }

  if (storeStation.isReplayTrackMode)
  {
    domStation.audioFromTrack.currentTime = 0
    domStation.audioFromTrack.play()

    console.log('Replaying Track:', (storeStation.tracksArray[storeStation.currentTrackIndex]?.name || 'Unknown'))
    return
  }

  const current = storeStation.tracksArray[storeStation.currentTrackIndex]
  if (current)
  {
    localStorage.setItem('seek_track_' + current.id, 0)
  }

  if (!storeStation.tracksArray.length)
  {
    return
  }

  const nextIndex = getNextPlaylistTrackIndex()
  if (nextIndex === null)
  {
    return
  }

  const preloadMatchesNext = (storeStation.nextTrackURL && (storeStation.nextPreloadedTrackIndex === nextIndex) && storeStation.nextTrackURL.startsWith('blob:'))
  if (preloadMatchesNext)
  {
    storeStation.currentTrackIndex = nextIndex
    if (storeStation.currentTrackURL)
    {
      URL.revokeObjectURL(storeStation.currentTrackURL)
    }

    storeStation.currentTrackURL = storeStation.nextTrackURL
    storeStation.nextTrackURL = null
    storeStation.nextPreloadedTrackIndex = -1

    domStation.audioFromTrack.src = storeStation.currentTrackURL
    domStation.audioFromTrack.play().catch(err =>
    {
      console.log('Play Failed:', err)
    })

    updateUI()
    preloadNext()
  }

  else
  {
    playTrack(nextIndex)
    console.log('Playing Next Track:', storeStation.tracksArray[nextIndex].name)
  }
})


domStation.audioFromTrack.addEventListener('timeupdate', () => 
{
  if (!Number.isNaN(domStation.audioFromTrack.duration)) 
  {
    domStation.seekBar.max = domStation.audioFromTrack.duration
    domStation.seekBar.value = domStation.audioFromTrack.currentTime

    if ((storeStation.currentTrackIndex !== -1) && (storeStation.tracksArray[storeStation.currentTrackIndex]))
    {
      const track = storeStation.tracksArray[storeStation.currentTrackIndex]
      localStorage.setItem('seek_track_' + track.id, domStation.audioFromTrack.currentTime)
    }
  }
})


domStation.audioFromTrack.addEventListener('error', () => 
{
  const error = domStation.audioFromTrack.error
  if (!error || (error.code === 1))
  {
    return
  }

  console.log('Audio Error:', error)
})


domStation.seekBar.addEventListener('input', () => 
{
  domStation.audioFromTrack.currentTime = domStation.seekBar.value
})


const savedVolume = (Number(localStorage.getItem('volumeLevel')) || 0.5)
domStation.audioFromTrack.volume = savedVolume
domStation.volumeBar.value = (savedVolume * 10)

domStation.volumeBar.addEventListener('input', () => 
{
  const value = Math.max(0, Math.min(1, Number(domStation.volumeBar.value) / 10))
  domStation.audioFromTrack.volume = value;

  if ((storeStation.currentTrackIndex !== -1) && storeStation.tracksArray[storeStation.currentTrackIndex])
  {
    const track = storeStation.tracksArray[storeStation.currentTrackIndex]
    localStorage.setItem(('volume_track_' + track.id), value)
  }

  else
  {
    localStorage.setItem('volumeLevel', value);
  }
})