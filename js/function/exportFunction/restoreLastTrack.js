import { storeStation } from '../../myStation/exportMyStation.js'
import { playTrack } from './playTrack.js'


export function restoreLastTrack() 
{
  if (storeStation.userInteractedEarly)
  {
    return
  }

  const savedIndex = Number(localStorage.getItem('lastSongIndex'))
  if 
  (
    (!Number.isNaN(savedIndex))
    &&
    (savedIndex >= 0)
    &&
    (savedIndex < storeStation.tracksArray.length)
  )
  {
    playTrack(savedIndex)
    console.log('Restoring Last Played Track:', storeStation.tracksArray[savedIndex].name)
  }
}