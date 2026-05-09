export const domStation = 
{
  themeSwitchButton: document.getElementById('themeSwitchButton'),

  playOneTrackButton: document.getElementById('playOneTrackButton'),
  replayTrackButton: document.getElementById('replayTrackButton'),
  shuffleTrackButton: document.getElementById('shuffleTrackButton'),

  searchTrackBar: document.getElementById('searchTrackBar'),
  uploadTrack: document.getElementById('upload-track'),
  
  playPreviousTrackButton: document.getElementById('playPreviousTrackButton'),
  playPauseTrackButton: document.getElementById('playPauseTrackButton'),
  playNextTrackButton: document.getElementById('playNextTrackButton'),

  audioFromTrack: document.getElementById('audioFromTrack'),

  volumeBar: document.getElementById('volumeBar'),
  seekBar: document.getElementById('seekBar'),

  userPlaylistLayout: document.getElementById('userPlaylistLayout'),
}


export const storeStation = 
{
  playlistDB: null,

  tracksArray: [],
  trackMetadataArray: [],

  currentTrackIndex: -1,
  currentTrackURL: null,

  nextTrackURL: null,
  nextPreloadedTrackIndex: -1,

  loadToken: 0,
  preloadToken: 0,

  isPlaylistLoaded: false,
  isTrackFound: false,

  searchTrackTimeout: null,
  volumeBeforeMute: null,

  isPlayOneTrack: false,
  isReplayTrack: false,
  isShuffleTrack: false,

  shuffledTracksArray: [],
  shuffleTrackIndex: 0,

  userInteractedEarly: false,
  needsMediaGestureToPlay: false,
}