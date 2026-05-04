import { storeStation } from '../../myStation/exportMyStation.js'


export function getTrackData(id)
{
  return new Promise(resolve => 
  {
    const transaction = storeStation.playlistDB.transaction('tracks', 'readonly')
    const trackStore = transaction.objectStore('tracks')
    const request = trackStore.get(id)

    request.onsuccess = event => resolve(event.target.result)
    request.onerror = () => resolve(null)
  })
}