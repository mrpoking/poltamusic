import { dom, store } from './stateExport.js'
import { playSong } from './function.js'

const { playPreviousTrackButton, playPauseTrackButton, playNextTrackButton, audioFromTrack } = dom

playPreviousTrackButton.addEventListener('click', () => 
{
    if (store.tracks.length < 2) 
        return

    let previousIndex = store.currentTrackIndex - 1
    if (previousIndex < 0)
        previousIndex = store.tracks.length - 1

    playSong(previousIndex)
    console.log('Playing Previous Track:', store.tracks[previousIndex].name)
})

playPauseTrackButton.addEventListener('click', () => 
{
    if (store.currentTrackIndex === -1 || !audioFromTrack.src)
        return

    if (audioFromTrack.paused) 
    {
        audioFromTrack.play().catch(() => {})
        playPauseTrackButton.textContent = '❚❚'

        console.log('Playing Track:', store.tracks[store.currentTrackIndex]?.name || 'Unknown')
    } 

    else 
    {
        audioFromTrack.pause()
        playPauseTrackButton.textContent = '▶︎'

        console.log('Pausing Track:', store.tracks[store.currentTrackIndex]?.name || 'Unknown')
    }
})

playNextTrackButton.addEventListener('click', () =>
{
    if (store.tracks.length < 2) 
        return

    const nextIndex = (store.currentTrackIndex + 1) % store.tracks.length
    playSong(nextIndex)

    console.log('Playing Next Track:', store.tracks[nextIndex].name)
})

const controls = document.querySelector('.user-controls-layout')
const saved = JSON.parse(localStorage.getItem("controlsPos"))

let offsetX = 0
let offsetY = 0
let isDragging = false

if (saved) 
{
    controls.style.left = saved.left
    controls.style.top = saved.top
}

function startDrag(event) 
{
    if (!event.target.closest('.drag-handle')) 
        return

    isDragging = true
    event.preventDefault()

    const rect = controls.getBoundingClientRect()
    offsetX = event.clientX - rect.left
    offsetY = event.clientY - rect.top

    controls.style.cursor = "grabbing"
}

function onDrag(event) 
{
    if (!isDragging) 
        return

    event.preventDefault();

    let newLeft = event.clientX - offsetX
    let newTop = event.clientY - offsetY

    newLeft = Math.max(0, Math.min(window.innerWidth - controls.offsetWidth, newLeft))
    newTop = Math.max(0, Math.min(window.innerHeight - controls.offsetHeight, newTop))

    controls.style.left = newLeft + "px"
    controls.style.top = newTop + "px"
}

function stopDrag() 
{
    if (!isDragging) 
        return

    isDragging = false;
    controls.style.cursor = ""

    localStorage.setItem("controlsPos", JSON.stringify ({
        left: controls.style.left,
        top: controls.style.top
    }))
}

controls.addEventListener('pointerdown', startDrag)
document.addEventListener('pointermove', onDrag)
document.addEventListener('pointerup', stopDrag)

const elementToResize = document.querySelector('.user-controls-layout');
const resizer = document.createElement('div');
const savedSize = JSON.parse(localStorage.getItem('controlSize'))

const minWidth = 120;
const minHeight = 45;
const maxWidth = 300;
const maxHeight = 250;

resizer.style.right = 0;
resizer.style.bottom = 0;
resizer.style.width = '0.625em';
resizer.style.height = '0.625em';
resizer.style.cursor = 'se-resize';
resizer.style.position = 'absolute';

if (savedSize)
{
    elementToResize.style.width = savedSize.width
    elementToResize.style.height = savedSize.height
}

elementToResize.appendChild(resizer);
resizer.addEventListener('mousedown', initResize, false);

function initResize() 
{
   window.addEventListener('mousemove', Resize, false);
   window.addEventListener('mouseup', stopResize, false);
}

function Resize(e) 
{
   elementToResize.style.width = Math.max(minWidth, Math.min(maxWidth, e.clientX - elementToResize.offsetLeft)) + 'px';
   elementToResize.style.height = Math.max(minHeight, Math.min(maxHeight, e.clientY - elementToResize.offsetTop)) + 'px';
}

function stopResize() 
{
    window.removeEventListener('mousemove', Resize, false);
    window.removeEventListener('mouseup', stopResize, false);

    localStorage.setItem('controlSize', JSON.stringify ({
        width: elementToResize.style.width,
        height: elementToResize.style.height
    }))
}
