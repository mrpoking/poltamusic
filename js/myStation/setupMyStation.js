import { domStation, storeStation } from './exportMyStation.js'


const 
{
  playOneTrackButton,
  replayTrackButton,
  shuffleTrackButton,

  searchTrackBar,
  uploadTrack,

  playPreviousTrackButton,
  playPauseTrackButton,
  playNextTrackButton,

  audioFromTrack,

  volumeBar,
  seekBar,

  userPlaylistLayout,
} = domStation


Object.assign(domStation, 
{
  playOneTrackButton,
  replayTrackButton,
  shuffleTrackButton,

  searchTrackBar,
  uploadTrack,

  playPreviousTrackButton,
  playPauseTrackButton,
  playNextTrackButton,

  audioFromTrack,

  volumeBar,
  seekBar,

  userPlaylistLayout,
})


storeStation.tracksArray = []
storeStation.trackMetadataArray = []

storeStation.currentTrackIndex = -1
storeStation.currentTrackURL = null
storeStation.nextTrackURL = null
storeStation.nextPreloadedTrackIndex = -1

storeStation.playlistDB = null
storeStation.loadToken = 0
storeStation.preloadToken = 0

storeStation.isPlaylistLoaded = false
storeStation.isTrackFound = false
storeStation.searchTrackTimeout = null

storeStation.volumeBeforeMute = null

storeStation.isPlayOneTrackMode = false
storeStation.isReplayTrackMode = false
storeStation.isShuffleTrackMode = false

storeStation.shuffledIndexes = []
storeStation.shuffleIndex = 0

storeStation.userInteractedEarly = false
storeStation.needsMediaGestureToPlay = false