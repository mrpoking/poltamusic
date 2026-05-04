import { storeStation } from '../../myStation/exportMyStation.js'
import { getTrackData } from './getTrackData.js'
import { getNextPlaylistTrackIndex } from './shuffleState.js'


export function preloadNext()
{
  if (storeStation.tracksArray.length < 2)
  {
    return
  }

  const token = ++storeStation.preloadToken
  
  const nextIndex = getNextPlaylistTrackIndex()
  if (nextIndex === null)
  {
    return
  }

  const nextMeta = storeStation.tracksArray[nextIndex]
  getTrackData(nextMeta.id).then(track => 
  {
    if ((token !== storeStation.preloadToken) || (!track?.data))
    {
      return
    }

    if (storeStation.nextTrackURL)
    {
      URL.revokeObjectURL(storeStation.nextTrackURL)
    }

    try 
    {
      const blob = (track.data instanceof Blob) ? (track.data) : (new Blob([track.data], { type: nextMeta.type }))
      storeStation.nextTrackURL = URL.createObjectURL(blob)
      storeStation.nextPreloadedTrackIndex = nextIndex
    }
    
    catch (error) 
    {
      storeStation.nextTrackURL = null
      storeStation.nextPreloadedTrackIndex = -1
      console.error('Preload Error:', error)
    }
  })
}