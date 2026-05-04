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
  if (!tracksArraySize || (storeStation.shuffledIndexes.length !== tracksArraySize))
  {
    return false
  }

  if ((new Set(storeStation.shuffledIndexes)).size !== tracksArraySize)
  {
    return false
  }

  return storeStation.shuffledIndexes.every(index => (Number.isInteger(index) && (index >= 0) && (index < tracksArraySize)))
}


export function persistShuffleState()
{
  if (hasValidShuffleOrder())
  {
    localStorage.setItem(SHUFFLE_ORDER_KEY, JSON.stringify(storeStation.shuffledIndexes))
    localStorage.setItem(SHUFFLE_POS_KEY, String(storeStation.shuffleIndex))
    localStorage.setItem(SHUFFLE_MODE_KEY, storeStation.isShuffleTrackMode ? '1' : '0')

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

    if (!Array.isArray(order) || (order.length !== tracksArraySize))
    {
      clearShuffleStorage()

      storeStation.shuffledIndexes = []
      storeStation.shuffleIndex = 0
      storeStation.isShuffleTrackMode = false

      domStation.shuffleTrackButton.classList.remove('shuffle-track-button-selected')
      return
    }

    const valid = order.every(index => (Number.isInteger(index) && (index >= 0) && (index < tracksArraySize)))
    if (!valid || ((new Set(order)).size !== tracksArraySize))
    {
      clearShuffleStorage()
      
      storeStation.shuffledIndexes = []
      storeStation.shuffleIndex = 0
      storeStation.isShuffleTrackMode = false

      domStation.shuffleTrackButton.classList.remove('shuffle-track-button-selected')
      return
    }

    storeStation.shuffledIndexes = order
    storeStation.shuffleIndex = Math.min(Math.max(0, posRaw), (tracksArraySize - 1))
    storeStation.isShuffleTrackMode = (localStorage.getItem(SHUFFLE_MODE_KEY) === '1')

    domStation.shuffleTrackButton.classList.toggle('shuffle-track-button-selected', storeStation.isShuffleTrackMode)
  }

  catch
  {
    clearShuffleStorage()

    storeStation.shuffledIndexes = []
    storeStation.shuffleIndex = 0
    storeStation.isShuffleTrackMode = false
    
    domStation.shuffleTrackButton.classList.remove('shuffle-track-button-selected')
  }
}


export function clearShuffleMode()
{
  storeStation.isShuffleTrackMode = false
  storeStation.shuffledIndexes = []
  storeStation.shuffleIndex = 0

  domStation.shuffleTrackButton.classList.remove('shuffle-track-button-selected')
  clearShuffleStorage()
}


export function pauseShufflePlayback()
{
  storeStation.isShuffleTrackMode = false
  domStation.shuffleTrackButton.classList.remove('shuffle-track-button-selected')

  persistShuffleState()
}


export function resumeShufflePlaybackIfOrdered()
{
  if (!hasValidShuffleOrder())
  {
    return
  }

  storeStation.isShuffleTrackMode = true
  domStation.shuffleTrackButton.classList.add('shuffle-track-button-selected')

  persistShuffleState()
}


export function syncShuffleIndexToTrack(trackIndex)
{
  if (!hasValidShuffleOrder() || (trackIndex < 0))
  {
    return
  }

  const position = storeStation.shuffledIndexes.indexOf(trackIndex)
  if (position !== -1)
  {
    storeStation.shuffleIndex = position
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
    const position = storeStation.shuffledIndexes.indexOf(storeStation.currentTrackIndex)
    if (position === -1)
    {
      return storeStation.shuffledIndexes[0]
    }

    const nextPosition = ((position + 1) % tracksArraySize)
    return storeStation.shuffledIndexes[nextPosition]
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
    const position = storeStation.shuffledIndexes.indexOf(storeStation.currentTrackIndex)
    if (position === -1)
    {
      return storeStation.shuffledIndexes[tracksArraySize - 1]
    }

    const prevPosition = ((position - 1) + tracksArraySize) % tracksArraySize
    return storeStation.shuffledIndexes[prevPosition]
  }

  let previousIndex = (storeStation.currentTrackIndex - 1)
  if (previousIndex < 0)
  {
    previousIndex = (tracksArraySize - 1)
  }

  return previousIndex
}