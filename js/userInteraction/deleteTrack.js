import { domStation, storeStation } from '../myStation/exportMyStation.js'
import { playTrack } from '../function/exportFunction/playTrack.js'
import { persistShuffleState } from '../function/exportFunction/shuffleState.js'


function mapIndexAfterDelete(playOldIndex, indexToDelete)
{
  if (playOldIndex > indexToDelete)
  {
    return (playOldIndex - 1)
  }

  return playOldIndex
}


export function deleteTrack(event, id)
{
  event.stopPropagation()

  const indexToDelete = storeStation.tracksArray.findIndex(t => t.id === id)
  if (indexToDelete === -1)
  {
    return
  }

  const isCurrent = (indexToDelete === storeStation.currentTrackIndex)
  if (!confirm('Delete This Track?'))
  {
    return
  }

  const oldLen = storeStation.tracksArray.length

  let playNewIndex = 0
  if (isCurrent && (oldLen > 1))
  {
    let playOldIndex
    if (
      storeStation.isShuffleTrackMode
      &&
      (storeStation.shuffledIndexes.length >= 2)
    )
    {
      const position = storeStation.shuffledIndexes.indexOf(indexToDelete)
      if (position !== -1)
      {
        const nextPosition = ((position + 1) % storeStation.shuffledIndexes.length)
        playOldIndex = storeStation.shuffledIndexes[nextPosition]
      }

      else
      {
        playOldIndex = ((indexToDelete + 1) % oldLen)
      }
    }

    else
    {
      playOldIndex = ((indexToDelete >= (oldLen - 1)) ? (0) : (indexToDelete + 1))
    }

    playNewIndex = mapIndexAfterDelete(playOldIndex, indexToDelete)
  }

  const transaction = storeStation.playlistDB.transaction('tracks', 'readwrite')
  transaction.objectStore('tracks').delete(id)
  transaction.oncomplete = () =>
  {
    if (isCurrent)
    {
      if (storeStation.currentTrackURL)
      {
        URL.revokeObjectURL(storeStation.currentTrackURL)
        storeStation.currentTrackURL = null
      }

      if (storeStation.nextTrackURL)
      {
        URL.revokeObjectURL(storeStation.nextTrackURL)
        storeStation.nextTrackURL = null
        storeStation.nextPreloadedTrackIndex = -1
      }
    }

    if (storeStation.isShuffleTrackMode && storeStation.shuffledIndexes.length)
    {
      storeStation.shuffledIndexes = storeStation.shuffledIndexes
        .filter(i => i !== indexToDelete)
        .map(i => ((i > indexToDelete) ? (i - 1) : i))

      if (storeStation.currentTrackIndex > indexToDelete)
      {
        storeStation.currentTrackIndex--
      }

      storeStation.shuffleIndex = storeStation.shuffledIndexes.indexOf(storeStation.currentTrackIndex)
      if (storeStation.shuffleIndex < 0)
      {
        storeStation.shuffleIndex = 0
      }

      persistShuffleState()
    }

    const importLoad = import('../myStation/loadPlaylist.js')

    if (isCurrent && (oldLen > 1))
    {
      importLoad.then(({ loadPlaylist }) =>
      {
        loadPlaylist()
        setTimeout(() => playTrack(playNewIndex, { allowWhilePlayOne: true }), 40)
      })
    }

    else if (isCurrent && (oldLen === 1))
    {
      if (storeStation.currentTrackURL)
      {
        URL.revokeObjectURL(storeStation.currentTrackURL)
        storeStation.currentTrackURL = null
      }

      if (storeStation.nextTrackURL)
      {
        URL.revokeObjectURL(storeStation.nextTrackURL)
        storeStation.nextTrackURL = null
        storeStation.nextPreloadedTrackIndex = -1
      }

      domStation.audioFromTrack.pause()
      domStation.audioFromTrack.src = ''

      storeStation.currentTrackIndex = -1
      importLoad.then(({ loadPlaylist }) => loadPlaylist())
    }

    else
    {
      importLoad.then(({ loadPlaylist }) => loadPlaylist())
    }
  }
}