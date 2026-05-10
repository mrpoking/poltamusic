import { domStation, storeStation } from '../myStation/exportMyStation.js'


const playTrackIconHtml = `<div class="play-track-icon"></div>`
const pauseTrackIconHtml = `<div class="pause-track-icon"></div>`

let initialized = false


export function syncPlayPauseButtonIcon()
{
  const audio = domStation.audioFromTrack
  if 
  (
    (storeStation.currentTrackIndex === -1) 
    && 
    (!audio.src)
  )
  {
    return
  }

  domStation.playPauseTrackButton.innerHTML = (audio.paused) 
    ? (pauseTrackIconHtml) 
    : (playTrackIconHtml)
}


function updatePositionState()
{
  if 
  (
    (!('mediaSession' in navigator))
    || 
    (!('setPositionState' in navigator.mediaSession))
  )
  {
    return
  }

  const audio = domStation.audioFromTrack
  const duration = audio.duration
  
  if 
  (
    (!duration)
    ||
    (!Number.isFinite(duration))
  )
  {
    return
  }

  try
  {
    navigator.mediaSession.setPositionState({
      duration,
      playbackRate: (audio.playbackRate || 1),
      position: Math.min(Math.max(0, audio.currentTime), duration),
    })
  }

  catch
  {
    /* Some Browsers Reject Until Metadata Is Ready */
  }
}


export function syncMediaSessionTrack(displayTitle)
{
  if (!('mediaSession' in navigator))
  {
    return
  }

  const title = 
  (
    (displayTitle?.trim())
    ||
    ('My Music')
  )

  try
  {
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: 'My Music',
      album: 'Playlist',
    })
  }

  catch (error)
  {
    console.warn('MediaSession Metadata:', error)
  }

  updatePositionState()
}


export function setupMediaSession()
{
  if 
  (
    (!('mediaSession' in navigator))
    || 
    (initialized)
  )
  {
    return
  }

  initialized = true

  const audio = domStation.audioFromTrack
  const safePlay = () =>
  {
    audio.play().catch(() => {}).finally(() => syncPlayPauseButtonIcon())
  }

  navigator.mediaSession.setActionHandler('play', () =>
  {
    safePlay()
    console.log('Playing:', storeStation.tracksArray[storeStation.currentTrackIndex]?.name || 'Unknown')
  })

  navigator.mediaSession.setActionHandler('pause', () =>
  {
    audio.pause()
    console.log('Pausing:', storeStation.tracksArray[storeStation.currentTrackIndex]?.name || 'Unknown')
  })

  navigator.mediaSession.setActionHandler('nexttrack', () =>
  {
    if (storeStation.isPlayOneTrack)
    {
      if 
      (
        (audio.paused)
        &&
        (audio.src)
      )
      {
        safePlay()
      }

      return
    }

    if 
    (
      (storeStation.needsMediaGestureToPlay)
      && 
      (audio.paused)
      && 
      (audio.src)
    )
    {
      safePlay()
      return
    }

    domStation.playNextTrackButton.click()
  })


  navigator.mediaSession.setActionHandler('previoustrack', () =>
  {
    if (storeStation.isPlayOneTrack)
    {
      return
    }

    domStation.playPreviousTrackButton.click()
  })

  try
  {
    navigator.mediaSession.setActionHandler('seekto', event =>
    {
      if 
      (
        (event.seekTime != null) 
        && 
        (Number.isFinite(event.seekTime))
      )
      {
        audio.currentTime = event.seekTime
        updatePositionState()
      }
    })
  }

  catch
  {
    /* Some Browsers Reject Until Metadata Is Ready */
  }

  audio.addEventListener('play', () =>
  {
    storeStation.needsMediaGestureToPlay = false
    navigator.mediaSession.playbackState = 'playing'

    syncPlayPauseButtonIcon()
    updatePositionState()
  })

  audio.addEventListener('pause', () =>
  {
    navigator.mediaSession.playbackState = 'paused'
    syncPlayPauseButtonIcon()
  })

  audio.addEventListener('loadedmetadata', updatePositionState)
  audio.addEventListener('durationchange', updatePositionState)
  audio.addEventListener('seeked', updatePositionState)

  navigator.mediaSession.playbackState = (audio.paused) ? ('paused') : ('playing')
  syncPlayPauseButtonIcon()
}