import { domStation, storeStation } from '../myStation/exportMyStation.js'
import { playTrack } from '../function/exportFunction/playTrack.js'
import { getNextPlaylistTrackIndex, getPreviousPlaylistTrackIndex } from '../function/exportFunction/shuffleState.js'


storeStation.volumeBeforeMute = (storeStation.volumeBeforeMute) ?? (domStation.audioFromTrack.volume)
document.addEventListener('keydown', event =>
{
  const playTrackIcon = `<div class="play-track-icon"></div>`
  const pauseTrackIcon = `<div class="pause-track-icon"></div>`

  if (event.target.matches('input, textarea, [contenteditable="true"]'))
  {
    return
  }

  if (event.key === 'ArrowUp') 
  {        
    event.preventDefault()

    if (storeStation.isPlayOneTrack)
    {
      console.log('Cannot Play The Previous Track (Play One Song Until The End: On')
      return
    }

    domStation.playPreviousTrackButton.click()
    console.log('Playing Previous Track:', (storeStation.tracksArray[((storeStation.currentTrackIndex - 1) + storeStation.tracksArray.length) % storeStation.tracksArray.length].name))
  }

  else if (event.key === 'ArrowDown') 
  {
    event.preventDefault()

    if (storeStation.isPlayOneTrack)
    {
      console.log('Cannot Play The Next Track (Play One Song Until The End: On')
      return
    }

    domStation.playNextTrackButton.click()
    console.log('Playing Next Track:', (storeStation.tracksArray[(storeStation.currentTrackIndex + 1) % storeStation.tracksArray.length].name))
  }


  else if ((event.key === 'ArrowLeft') && event.shiftKey)
  {
    event.preventDefault();

    let newVolume = (domStation.audioFromTrack.volume - 0.01)
    if (newVolume < 0)
    {
      newVolume = 0
    }

    domStation.audioFromTrack.volume = newVolume
    domStation.volumeBar.value = newVolume

    localStorage.setItem(('volume_track_' + storeStation.tracksArray[storeStation.currentTrackIndex]?.id), newVolume)
    console.log('Volume Down:', (Math.round(newVolume * 100) + '%'))
  }


  else if ((event.key === 'ArrowRight') && event.shiftKey)
  {
    event.preventDefault();

    let newVolume = (domStation.audioFromTrack.volume + 0.01)
    if (newVolume > 1)
    {
      newVolume = 1
    }

    domStation.audioFromTrack.volume = newVolume
    domStation.volumeBar.value = newVolume

    localStorage.setItem(('volume_track_' + storeStation.tracksArray[storeStation.currentTrackIndex]?.id), newVolume)
    console.log('Volume Up:', (Math.round(newVolume * 100) + '%'))
  }


  else if (event.key === 'ArrowLeft')
  {
    event.preventDefault();

    let newSeek = (domStation.audioFromTrack.currentTime - 3)
    if (newSeek < 0)
    {
      newSeek = 0
    }

    domStation.audioFromTrack.currentTime = newSeek
    domStation.seekBar.value = newSeek

    console.log('Seek Backward:', (Math.round(newSeek) + ' seconds'))
  }


  else if (event.key === 'ArrowRight')
  {
    event.preventDefault()

    let newSeek = (domStation.audioFromTrack.currentTime + 3)
    if (newSeek > domStation.audioFromTrack.duration)
    {
      newSeek = domStation.audioFromTrack.duration
    }

    domStation.audioFromTrack.currentTime = newSeek
    domStation.seekBar.value = newSeek

    console.log('Seek Forward:', (Math.round(newSeek) + ' seconds'))
  }


  else if (event.code === 'Space')
  {
    event.preventDefault()

    if (domStation.audioFromTrack.paused)
    {
      domStation.audioFromTrack.play()
      domStation.playPauseTrackButton.innerHTML = playTrackIcon

      console.log('Playing:', (storeStation.tracksArray[storeStation.currentTrackIndex]?.name || 'Unknown'))
    }

    else
    {
      domStation.audioFromTrack.pause()
      domStation.playPauseTrackButton.innerHTML = pauseTrackIcon

      console.log('Pausing:', (storeStation.tracksArray[storeStation.currentTrackIndex]?.name || 'Unknown'))
    }
  }


  else if (event.key === 'm')
  {
    event.preventDefault()

    if (domStation.audioFromTrack.volume > 0)
    {
      storeStation.volumeBeforeMute = domStation.audioFromTrack.volume

      domStation.audioFromTrack.volume = 0
      domStation.volumeBar.value = 0

      console.log('Track Muted!')
    }

    else
    {
      const restored = (storeStation.volumeBeforeMute) ?? (Number(localStorage.getItem('volume_track_' + storeStation.tracksArray[storeStation.currentTrackIndex]?.id)))

      domStation.audioFromTrack.volume = restored
      domStation.volumeBar.value = (restored * 10)

      console.log('Track Unmuted, Volume Restored to:', restored)
    }
  }
})


domStation.playPreviousTrackButton.addEventListener('click', () => 
{
  if (storeStation.isPlayOneTrack)
  {
    console.log('Cannot Play The Previous Track (Play One Song Until The End: On')
    return
  }


  if (storeStation.tracksArray.length < 2)
  {
    return
  }


  const previousIndex = getPreviousPlaylistTrackIndex()
  if (previousIndex === null)
  {
    return
  }


  playTrack(previousIndex)
  console.log('Playing Previous Track:', storeStation.tracksArray[previousIndex].name)
})


domStation.playPauseTrackButton.addEventListener('click', event => 
{
  const playTrackIcon = `<div class="play-track-icon"></div>`
  const pauseTrackIcon = `<div class="pause-track-icon"></div>`

  if 
  (
    (storeStation.currentTrackIndex === -1) 
    || 
    !domStation.audioFromTrack.src
  )
  {
    return
  }

  if (domStation.audioFromTrack.paused) 
  {
    event.preventDefault()

    domStation.audioFromTrack.play().catch(() => {})
    domStation.playPauseTrackButton.innerHTML = playTrackIcon

    console.log('Playing:', storeStation.tracksArray[storeStation.currentTrackIndex]?.name || 'Unknown')
  } 

  else 
  {
    event.preventDefault()

    domStation.audioFromTrack.pause()
    domStation.playPauseTrackButton.innerHTML = pauseTrackIcon

    console.log('Pausing:', storeStation.tracksArray[storeStation.currentTrackIndex]?.name || 'Unknown')
  }
})


domStation.playNextTrackButton.addEventListener('click', () =>
{
  if (storeStation.isPlayOneTrack)
  {
    console.log('Cannot Play The Next Track (Play One Song Until The End: On')
    return
  }

  if (storeStation.tracksArray.length < 2)
  {
    return
  }

  const nextTrackIndex = getNextPlaylistTrackIndex()
  if (nextTrackIndex === null)
  {
    return
  }

  playTrack(nextTrackIndex)
  console.log('Playing Next Track:', storeStation.tracksArray[nextTrackIndex].name)
})