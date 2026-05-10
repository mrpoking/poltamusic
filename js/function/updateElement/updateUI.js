import { storeStation } from '../../myStation/exportMyStation.js'


export function updateUI() 
{
  const meta = storeStation.tracksArray[storeStation.currentTrackIndex]
  if (!meta)
  {
    return
  }

  const name = meta.name.replace(/\.(mp3|mp4)$/i, '')
  document.title = name

  const wrapper = document.getElementById('trackNameWrapper')
  if (wrapper)
  {
    wrapper.textContent = name
  }

  storeStation.trackMetadataArray.forEach(item =>
  {
    if (item)
    {
      item.classList.remove('active-track')
    }
  })

  const activeItem = storeStation.trackMetadataArray.find(item => 
    (item)
    && 
    (Number(item.dataset.trackIndex) === storeStation.currentTrackIndex)
  )
  if (activeItem)
  {
    activeItem.classList.add('active-track')
  }
}