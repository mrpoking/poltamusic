import { storeStation } from '../../myStation/exportMyStation.js'


export function saveTrack(file) 
{
  return new Promise(resolve => 
  {
    const transaction = storeStation.playlistDB.transaction('tracks', 'readwrite')
    const trackStore = transaction.objectStore('tracks')
    const checkRequest = trackStore.getAll()

    checkRequest.onsuccess = () => 
    {
      if (checkRequest.result.some(track => track.name === file.name))
      {
        return resolve()
      }

      trackStore.add({
        name: file.name,
        data: file,
        type: file.type,
      })

      transaction.oncomplete = resolve
    }
  })
}