import { domStation, storeStation } from '../../myStation/exportMyStation.js'


const SHUFFLE_MODE_KEY = 'shuffleTrackMode'
const SHUFFLE_ORDER_KEY = 'shuffledIndexes'
const SHUFFLE_POS_KEY = 'shuffleIndex'


function clearShuffleStorage()
{
  localStorage.removeItem(SHUFFLE_MODE_KEY)
  localStorage.removeItem(SHUFFLE_ORDER_KEY)
  localStorage.removeItem(SHUFFLE_POS_KEY)
}


export function hasValidShuffleOrder()
{
  const tracksArraySize = storeStation.tracksArray.length
  if 
  (
    (!tracksArraySize)
    || 
    (storeStation.shuffledTracksArray.length !== tracksArraySize)
  )
  {
    return false
  }

  if 
  (
    ((new Set(storeStation.shuffledTracksArray)).size !== tracksArraySize)
  )
  {
    return false
  }

  return storeStation.shuffledTracksArray.every(index => 
  (
    (Number.isInteger(index))
    && 
    (index >= 0) 
    && 
    (index < tracksArraySize)
  )
  )
}


export function persistShuffleState()
{
  if (hasValidShuffleOrder())
  {
    localStorage.setItem(SHUFFLE_ORDER_KEY, JSON.stringify(storeStation.shuffledTracksArray))
    localStorage.setItem(SHUFFLE_POS_KEY, String(storeStation.shuffleTrackIndex))
    localStorage.setItem(SHUFFLE_MODE_KEY, storeStation.isShuffleTrack ? ('1') : ('0'))

    return
  }

  clearShuffleStorage()
}


export function restoreShuffleFromStorage()
{
  if (!storeStation.tracksArray.length)
  {
    return
  }

  const rawOrder = localStorage.getItem(SHUFFLE_ORDER_KEY)
  if (!rawOrder)
  {
    return
  }

  try
  {
    const order = JSON.parse(rawOrder)
    const posRaw = Number(localStorage.getItem(SHUFFLE_POS_KEY))
    const tracksArraySize = storeStation.tracksArray.length

    if 
    (
      (!Array.isArray(order))
      || 
      (order.length !== tracksArraySize)
    )
    {
      clearShuffleStorage()

      storeStation.shuffledTracksArray = []
      storeStation.shuffleTrackIndex = 0
      storeStation.isShuffleTrack = false

      domStation.shuffleTrackButton.classList.remove('shuffle-track-button-selected')
      return
    }

    const valid = order.every(index => 
    (
      (Number.isInteger(index))
      && 
      (index >= 0) 
      && 
      (index < tracksArraySize))
    )
    if 
    (
      (!valid)
      || 
      ((new Set(order)).size !== tracksArraySize)
    )
    {
      clearShuffleStorage()
      
      storeStation.shuffledTracksArray = []
      storeStation.shuffleTrackIndex = 0
      storeStation.isShuffleTrack = false

      domStation.shuffleTrackButton.classList.remove('shuffle-track-button-selected')
      return
    }

    storeStation.shuffledTracksArray = order
    storeStation.shuffleTrackIndex = Math.min(Math.max(0, posRaw), (tracksArraySize - 1))
    storeStation.isShuffleTrack = (localStorage.getItem(SHUFFLE_MODE_KEY) === '1')

    domStation.shuffleTrackButton.classList.toggle('shuffle-track-button-selected', storeStation.isShuffleTrackMode)
  }


  catch
  {
    clearShuffleStorage()

    storeStation.shuffledTracksArray = []
    storeStation.shuffleTrackIndex = 0
    storeStation.isShuffleTrack = false
    
    domStation.shuffleTrackButton.classList.remove('shuffle-track-button-selected')
  }
}


export function clearShuffleMode()
{
  storeStation.isShuffleTrack = false
  storeStation.shuffledTracksArray = []
  storeStation.shuffleTrackIndex = 0

  domStation.shuffleTrackButton.classList.remove('shuffle-track-button-selected')
  clearShuffleStorage()
}


export function pauseShufflePlayback()
{
  storeStation.isShuffleTrack = false
  domStation.shuffleTrackButton.classList.remove('shuffle-track-button-selected')

  persistShuffleState()
}


export function resumeShufflePlaybackIfOrdered()
{
  if (!hasValidShuffleOrder())
  {
    return
  }

  storeStation.isShuffleTrack = true
  domStation.shuffleTrackButton.classList.add('shuffle-track-button-selected')

  persistShuffleState()
}


export function syncShuffleIndexToTrack(trackIndex)
{
  if 
  (
    (!hasValidShuffleOrder())
    || 
    (trackIndex < 0)
  )
  {
    return
  }

  const trackPosition = storeStation.shuffledTracksArray.indexOf(trackIndex)
  if (trackPosition !== -1)
  {
    storeStation.shuffleTrackIndex = trackPosition
    persistShuffleState()
  }
}


export function getNextPlaylistTrackIndex()
{
  const tracksArraySize = storeStation.tracksArray.length
  if (tracksArraySize < 2)
  {
    return null
  }

  if (hasValidShuffleOrder())
  {
    const trackPosition = storeStation.shuffledTracksArray.indexOf(storeStation.currentTrackIndex)
    if (trackPosition === -1)
    {
      return storeStation.shuffledTracksArray[0]
    }

    const nextPosition = ((trackPosition + 1) % tracksArraySize)
    return storeStation.shuffledTracksArray[nextPosition]
  }

  return ((storeStation.currentTrackIndex + 1) % tracksArraySize)
}


export function getPreviousPlaylistTrackIndex()
{
  const tracksArraySize = storeStation.tracksArray.length
  if (tracksArraySize < 2)
  {
    return null
  }

  if (hasValidShuffleOrder())
  {
    const trackPosition = storeStation.shuffledTracksArray.indexOf(storeStation.currentTrackIndex)
    if (trackPosition === -1)
    {
      return storeStation.shuffledTracksArray[tracksArraySize - 1]
    }

    const previousPosition = ((trackPosition - 1) + tracksArraySize) % tracksArraySize
    return storeStation.shuffledTracksArray[previousPosition]
  }

  let previousIndex = (storeStation.currentTrackIndex - 1)
  if (previousIndex < 0)
  {
    previousIndex = (tracksArraySize - 1)
  }

  return previousIndex
}