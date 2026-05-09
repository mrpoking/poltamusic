import { storeStation } from '../../myStation/exportMyStation.js'
import { playTrack } from './playTrack.js'


export function restoreLastTrack() 
{
  if (storeStation.userInteractedEarly)
  {
    return
  }

  const savedLastTrackIndex = Number(localStorage.getItem('lastSongIndex'))
  if 
  (
    (!Number.isNaN(savedLastTrackIndex))
    &&
    (savedLastTrackIndex >= 0)
    &&
    (savedLastTrackIndex < storeStation.tracksArray.length)
  )
  {
    playTrack(savedLastTrackIndex)
    console.log('Restoring Last Played Track:', storeStation.tracksArray[savedLastTrackIndex].name)
  }
}