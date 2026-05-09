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

  const indexToDelete = storeStation.tracksArray.findIndex(track => track.id === id)
  if (indexToDelete === -1)
  {
    return
  }

  const isCurrentTrack = (indexToDelete === storeStation.currentTrackIndex)
  if (!confirm('Delete This Track?!'))
  {
    return
  }

  const oldTracksArraySize = storeStation.tracksArray.length

  let playNewTrackIndex = 0
  if (isCurrentTrack && (oldTracksArraySize > 1))
  {
    let playOldTrackIndex
    if 
    (
      (storeStation.isShuffleTrack)
      &&
      (storeStation.shuffledTracksArray.length >= 2)
    )
    {
      const trackPosition = storeStation.shuffledTracksArray.indexOf(indexToDelete)
      if (trackPosition !== -1)
      {
        const nextTrackPosition = ((trackPosition + 1) % storeStation.shuffledTrackArray.length)
        playOldTrackIndex = storeStation.shuffledTracksArray[nextTrackPosition]
      }

      else
      {
        playOldTrackIndex = ((indexToDelete + 1) % oldTracksArraySize)
      }
    }

    else
    {
      playOldTrackIndex = ((indexToDelete >= (oldTracksArraySize - 1)) ? (0) : (indexToDelete + 1))
    }

    playNewTrackIndex = mapIndexAfterDelete(playOldTrackIndex, indexToDelete)
  }

  const transaction = storeStation.playlistDB.transaction('tracks', 'readwrite')
  transaction.objectStore('tracks').delete(id)

  transaction.oncomplete = () =>
  {
    if (isCurrentTrack)
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

    if 
    (
      (storeStation.isShuffleTrack)
      && 
      (storeStation.shuffledTracksArray.length)
    )
    {
      storeStation.shuffledTracksArray = storeStation.shuffledTracksArray.filter(index => index !== indexToDelete).map(index => ((index > indexToDelete) ? (index - 1) : index))
      if (storeStation.currentTrackIndex > indexToDelete)
      {
        storeStation.currentTrackIndex--
      }

      storeStation.shuffleTrackIndex = storeStation.shuffledTracksArray.indexOf(storeStation.currentTrackIndex)
      if (storeStation.shuffleTrackIndex < 0)
      {
        storeStation.shuffleTrackIndex = 0
      }

      persistShuffleState()
    }

    const importLoad = import('../function/loadPlaylist/loadPlaylist.js')
    if 
    (
      (isCurrentTrack)
      &&
      (oldTracksArraySize > 1)
    )
    {
      importLoad.then(({ loadPlaylist }) =>
      {
        loadPlaylist()
        setTimeout(() => playTrack(playNewTrackIndex, { allowWhilePlayOne: true }), 40)
      })
    }

    else if 
    (
      (isCurrentTrack )
      && 
      (oldTracksArraySize === 1)
    )
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