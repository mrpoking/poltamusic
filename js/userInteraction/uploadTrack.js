import { domStation } from '../myStation/exportMyStation.js'
import { loadPlaylist } from '../myStation/loadPlaylist.js'
import { saveTrack } from '../function/exportFunction/saveTrack.js'


const validFileTypes = new Set(['audio/mpeg', 'audio/mp4'])


domStation.uploadTrack.addEventListener('change', async event => 
{
  const files = Array.from(event.target.files)
  for (let file of files) 
  {
    if (!validFileTypes.has(file.type))
    {
      console.log(`Unsupported File Type: ${ file.type } (${ file.name })`)
      alert(`Invalid File Type: ${ file.type }, (${ file.name })`)
      continue
    }

    await saveTrack(file)
  }

  loadPlaylist()
})