function clampCardToScreen() 
{
  const userControlsLayout = document.querySelector('.user-controls-layout')
  const rectangle = userControlsLayout.getBoundingClientRect()

  let newLeft = rectangle.left
  let newTop = rectangle.top

  if (rectangle.left < 0)
  {
    newLeft = 0
  }

  if (rectangle.top < 0) 
  {
    newTop = 0
  }

  if (rectangle.right > window.innerWidth)
  {
    newLeft = (window.innerWidth - rectangle.width)
  }

  if (rectangle.bottom > window.innerHeight)
  {
    newTop = (window.innerHeight - rectangle.height)
  }

  userControlsLayout.style.left = (newLeft + 'px')
  userControlsLayout.style.top = (newTop + 'px')

  localStorage.setItem("controlsPos", JSON.stringify ({
    left: userControlsLayout.style.left,
    top: userControlsLayout.style.top
  }))
}


window.addEventListener('resize', clampCardToScreen)
window.addEventListener('load', clampCardToScreen)


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
  {
    return
  }

  isDragging = true
  
  event.preventDefault()

  const rectangle = controls.getBoundingClientRect()
  offsetX = (event.clientX - rectangle.left)
  offsetY = (event.clientY - rectangle.top)

  controls.style.cursor = "grabbing"
}


function onDrag(event) 
{
  if (!isDragging)
  {
    return
  }

  event.preventDefault();

  let newLeft = (event.clientX - offsetX)
  let newTop = (event.clientY - offsetY)

  newLeft = Math.max(0, Math.min((window.innerWidth - controls.offsetWidth), newLeft))
  newTop = Math.max(0, Math.min((window.innerHeight - controls.offsetHeight), newTop))

  controls.style.left = (newLeft + 'px')
  controls.style.top = (newTop + 'px')
}


function stopDrag() 
{
  if (!isDragging)
  {
    return
  }

  isDragging = false;
  
  controls.style.cursor = ''

  localStorage.setItem("controlsPos", JSON.stringify ({
    left: controls.style.left,
    top: controls.style.top
  }))
}


controls.addEventListener('pointerdown', startDrag)
document.addEventListener('pointermove', onDrag)
document.addEventListener('pointerup', stopDrag)


const elementToResize = document.querySelector('.user-controls-layout')
const resizer = document.createElement('div');
const savedSize = JSON.parse(localStorage.getItem('controlSize'))


const minWidth = 120;
const minHeight = 45;
const maxWidth = 300;
const maxHeight = 250;


resizer.style.right = 0;
resizer.style.bottom = 0;
resizer.style.width = '0.625em'
resizer.style.height = '0.625em'
resizer.style.cursor = 'se-resize'
resizer.style.position = 'absolute'


if (savedSize)
{
  elementToResize.style.width = savedSize.width
  elementToResize.style.height = savedSize.height
}


elementToResize.appendChild(resizer);
resizer.addEventListener('mousedown', initResize, false);


function initResize() 
{
  addEventListener('mousemove', Resize, false)
  addEventListener('mouseup', stopResize, false)
}


function Resize(e) 
{
  elementToResize.style.width = (Math.max(minWidth, Math.min(maxWidth, e.clientX - elementToResize.offsetLeft)) + 'px')
  elementToResize.style.height = (Math.max(minHeight, Math.min(maxHeight, e.clientY - elementToResize.offsetTop)) + 'px')
}


function stopResize() 
{
  removeEventListener('mousemove', Resize, false);
  removeEventListener('mouseup', stopResize, false);

  localStorage.setItem('controlSize', JSON.stringify({
    width: elementToResize.style.width,
    height: elementToResize.style.height
  }))
}