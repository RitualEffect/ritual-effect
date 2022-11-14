// Wait for the DOM to finish loading before running

document.addEventListener('DOMContentLoaded', function() {

    /* Get all music players from the page and if found, pass each
       one to handler function */

    const players = document.querySelectorAll('.music-player');
    
    if (players.length > 0) {
        for (let player of players) {
               handleMusicPlayer(player);
        }
    }

});

/* --------------- Music player functions --------------- */

// Utility functions

/**
 * Construct and return dictionary object of all tracklists, with
 * key names corresponding to music player ids and values an array
 * of objects containing each sample track's information.
 * Calling function can then dynamically extract specific tracklist
 * for each player based on player's id.
 * 
 * @returns {Object} tracklists
 */
 function constructTracklists() {
    /* Hardcode details of all sample tracks by album / mini player
       as array of objects (each object's key must match id of
       corresponding mini player and can be added to with that
       stipulation in mind as new albums added to music page) */
    const sampleTracks = {
    // 'Fossils' sample tracks
    'fossils-player': [
            {
                'name': 'Decomposition',
                'artist': 'Ritual Effect',
                'album': 'Fossils',
                'src': 'fossils/10_decomposition.mp3',
                'img': 'album-art/fossils_cover.jpg',
                'duration': '04:13'
            },
            {
                'name': 'Smear Campaign',
                'artist': 'Ritual Effect',
                'album': 'Fossils',
                'src': 'fossils/01_smear_campaign.mp3',
                'img': 'album-art/fossils_cover.jpg',
                'duration': '04:26'
            },
            {
                'name': 'Stem Cell',
                'artist': 'Ritual Effect',
                'album': 'Fossils',
                'src': 'fossils/04_stem_cell.mp3',
                'img': 'album-art/fossils_cover.jpg',
                'duration': '04:40'
            }
        ],
        // 'Too Late to Turn Back' sample tracks
        'too-late-player': [
            {
                'name': 'Brand New',
                'artist': 'Ritual Effect',
                'album': 'Too Late to Turn Back',
                'src': 'too-late-to-turn-back/01_brand_new.mp3',
                'img': 'album-art/too_late_to_turn_back_art.jpg',
                'duration': '03:57'
            }
        ]
    };

    /* Dynamically construct array of all sample track objects from
       sampleTracks array (for full featured player) */
    const rePlayer = [];
    for (let tracks in sampleTracks) {
        rePlayer.push(...sampleTracks[tracks]);
    }
    /* Dynamically construct and return object containing all
       tracklists (all done to avoid using 'evil' eval() method!) */
    const tracklists = {};
    for (let tracks in sampleTracks) {
        tracklists[`${tracks}`] = sampleTracks[tracks];
    }
    tracklists['re-player'] = rePlayer;

    return tracklists;
}

/**
 * Convert passed-in number of seconds into string for display in
 * form of 'minutes:seconds'
 * 
 * @param {number} time - Time in seconds to be converted.
 * @returns {string} String for display.
 */
function timeDisplay(time) {
    let mins = Math.floor(time / 60);
    let secs = Math.round(time % 60);
    let displayedMins;
    let displayedSecs;

    mins < 10 ? displayedMins = `0${mins}` : displayedMins = mins;
    secs < 10 ? displayedSecs = `0${secs}` : displayedSecs = secs;

    return `${displayedMins}:${displayedSecs}`;
}

// Main handler function

/**
 * Handle all main functionality of each specific, passed-in music
 * player.
 * 
 * @param {HTMLElement} player - Element containing music player to be handled.
 */
function handleMusicPlayer(player) {
    // Call function to construct object containing all tracklists
    const tracklists = constructTracklists();
    /* Extract appropriate tracklist for passed-in player based on
       player id */  
    const tracklist = tracklists[player.id];
    // Set initial track index number
    let trackIndex = 0;
    // Get audio element
    const audio = player.querySelector('audio');
    // Get all range sliders
    const sliders = player.querySelectorAll('input[type="range"]');
    // Get seek slider
    const seekSlider = player.querySelector('.seek-slider');
    /* Get active track time display span ('let' for setting) on
       mini player tracklist buttons */
    let activeTimeDisplay = player.querySelector('.active-time');
    // Get all control buttons
    const controlButtons = player.querySelectorAll('.player-ctrl-btn');
    // Get vinyl record mockup div
    const record = player.querySelector('.player-vinyl');
    // Get album sleeve mockup div
    const sleeve = player.querySelector('.player-album-art');
    // Get volume setting display span
    const volumeDisplay = player.querySelector('.volume-output');
    // Get loop info window display span
    const loopStatusWindow = player.querySelector('.loop-info');
    // Get tracklist container div
    const tracklistContainer = player.querySelector('.tracklist');
    // Set initial audio volume
    let volumeSetting = 25;
    // Set initial play state
    let isPlaying = false;
    // Set initial seek state
    let seek = false;
    // Set initial seek setting
    let seekValue = 0;
    // Set initial tracklist state
    let startTracks = true;
    // Set initial loop status
    let loopStatus = null;
    if (loopStatusWindow) {
        loopStatusWindow.innerHTML = "Looping Off";
    }

    // Initialise player...
    // Call function to dynamically add player's tracklist buttons
    addTracklistButtons(tracklist, tracklistContainer);
    // Load first track
    loadTrack(player, audio, tracklist, trackIndex);
    // Set initial volume
    handleVolume(audio, volumeSetting, volumeDisplay);
    
    // Loop through control buttons
    for (let button of controlButtons) {
        // Get button icon
        let buttonIcon = button.querySelector('i.fas');
        // Add 'click' event listener to button
        button.addEventListener('click', e => {
            // Only target entire button element
            let targetButton = e.target.closest('button');
            if (!targetButton) return;
            // Button handlers
            if (targetButton.classList.contains('play-pause-btn')) {
                // Play/pause button handler...
                // Check/set if at beginning of tracklist
                if (startTracks) {
                    trackIndex = 0;
                    loadTrack(player, audio, tracklist, trackIndex);
                    startTracks = false;
                }
                // Play
                if (!isPlaying) {
                    isPlaying = true;
                    // Mini player - basic functionality
                    if (player.classList.contains('mini-player')) {
                        playPause(audio, buttonIcon, isPlaying);
                    // Full featured player - vinyl mockup, etc.
                    } else {
                        handlePlay(audio, buttonIcon, sleeve, record);
                    }
                // Pause
                } else {
                    isPlaying = false;
                    playPause(audio, buttonIcon, isPlaying);
                    // Stop vinyl mockup rotation
                    if (record) {
                        record.classList.remove('playing');
                    }
                }
            } else if (targetButton.classList.contains('stop-btn')) {
                // Stop button handler...
                // Not present in mini player
                isPlaying = false;
                let buttonIcon = player.querySelector('.play-pause-btn i.fas');
                playPause(audio, buttonIcon, isPlaying);
                // Reset relevant displays
                handleStop(audio, sleeve, record, seekSlider, activeTimeDisplay);
            } else if (targetButton.classList.contains('prev-track-btn') || targetButton.classList.contains('next-track-btn')) {
                // Previous / next buttons handler...
                // Signal no longer at start of tracklist
                startTracks = false;
                // Set and load new track
                trackIndex = prevNext(targetButton, tracklist.length, trackIndex);
                loadTrack(player, audio, tracklist, trackIndex);
                // Reset vinyl mockup if appropriate
                if (record) {
                    record.classList.add('stopped');
                }
                // Continue playback if appropriate
                if (isPlaying) {
                    setTimeout(() => {
                        if (record) {
                            record.classList.remove('stopped');
                        }
                        audio.play();
                    }, 500);
                }
            } else if (targetButton.classList.contains('mute-btn')) {
                // Mute button handler
                handleMute(e, audio, buttonIcon);
            } else if (targetButton.classList.contains('loop-btn')) {
                // Loop button handler...
                // Not present in mini player
                // Loop current track - 1st click
                if (!loopStatus) {
                    loopStatus = 'track';
                    audio.loop = true;
                    loopStatusWindow.innerHTML = "Track Looped";
                // Loop tracklist - 2nd click
                } else if (loopStatus === 'track') {
                    loopStatus = 'all';
                    audio.loop = false;
                    loopStatusWindow.innerHTML = "Tracklist Looped";
                // Toggle loops off - 3rd click
                } else if (loopStatus === 'all') {
                    loopStatus = null;
                    audio.loop = false;
                    loopStatusWindow.innerHTML = "Looping Off";
                }
            /** Add more control button handlers here **/ 
            } else return; // in case of redundant buttons
        });
    }
    
    // Loop through sliders
    for (let slider of sliders) {
        // Set initial state of each slider
        if (slider.classList.contains('volume-slider')) {
            slider.value = volumeSetting;
        } else if (slider.classList.contains('seek-slider')) {
            slider.value = seekValue;
        }
        handleSlider(slider);
        // Add 'input' event listener to slider
        slider.addEventListener('input', e => {
            let targetSlider = e.target;
            // Only target range inputs
            if (!targetSlider.type === 'range') return;
                
            if (targetSlider.classList.contains('volume-slider')) {
                // Volume slider handler...
                // Set volume level based on returned slider value
                volumeSetting = handleSlider(targetSlider);
                handleVolume(audio, volumeSetting, volumeDisplay);
                // Set mute button icon appropriate to volume level
                const muteIcon = player.querySelector('.mute-btn i.fas');
                // Call function to unmute if volume changed
                handleMute(e, audio, muteIcon)
            } else if (targetSlider.classList.contains('seek-slider')) {
                // Seek slider handler...
                // Not present in mini player
                // Set seek position based on returned slider value
                seekValue = handleSlider(targetSlider);
                handleSeek(seekValue, audio);
            }
        });
    }

    /* 'Click' event listener for tracklist buttons (set on
        container div with event delegation to handle dynamically
        created buttons) */
    tracklistContainer.addEventListener('click', e => {
        if (e.target) {
            let targetButton = e.target.closest('button');
            /* No action if button not yet created or if set to
               active (i.e. selector for currently playing track -
               avoids accidental restart of track) */
            if (!targetButton || targetButton.classList.contains('active-btn')) return;
            // Set and load track based on button's track number
            if (targetButton.classList.contains('tracklist-btn')) {
                trackIndex = (parseInt(targetButton.querySelector('.track-num').innerHTML)) -1;
                loadTrack(player, audio, tracklist, trackIndex);
                /* Set if at beginning of tracklist based on track
                   index number (in case track selected before
                   first instance of play/pause button click) */
                if (trackIndex != 0) {
                    startTracks = false;
                }
                // Continue playback if appropriate
                if (isPlaying) {
                    audio.play();
                }
            }
        }
    });

    /* Audio 'canplay' listener for events that rely on audio track
       being loaded, particularly: update of tracklist buttons;
       analyser collection of frequency data for visualiser (eventually) */
    audio.addEventListener('canplay', () => {
        // Get tracklist buttons
        const listButtons = tracklistContainer.querySelectorAll('.tracklist-btn');
        // Check if created yet
        if (listButtons.length > 0) {
            // Loop through buttons
            for (let button of listButtons) {
                // Set identifier to match corresponding track
                const buttonIndex = (parseInt(button.querySelector('.track-num').innerHTML)) - 1;
                /* Set button's current time display to be passed
                   to handleTrackTimeUpdate as 'active' if button
                   index matches current track */
                if (player.classList.contains('mini-player') && buttonIndex === trackIndex) {
                    activeTimeDisplay = button.querySelector('.track-time');
                }
                // Get track duration for display
                const trackLength = tracklist[buttonIndex].duration;
                // Call function to update button
                handleTracklist(button, buttonIndex, trackIndex, trackLength);
            }
        }
        /* Reset time display and seek position for newly loaded
           track (in case track changed while playback paused) */
            handleTrackTimeUpdate(audio, seekSlider, activeTimeDisplay);
    });
    // Time update listener for audio track
    audio.addEventListener('timeupdate', () => {
        // Check if track playing
        if (audio.currentTime > 0) {
            // Call function to update time display/seek slider
            handleTrackTimeUpdate(audio, seekSlider, activeTimeDisplay);
        }
    });
    // Seek event listeners for seek slider control of vinyl mockup
    // ... while seeking ...
    audio.addEventListener('seeking', () => {
        seek = true;
        if (record) {
            handleRecordSeek(audio, record, seek);
        }
    });
    // ... when finished seeking ...
    audio.addEventListener('seeked', () => {
        seek = false;
        if (record && isPlaying) {
            handleRecordSeek(audio, record, seek);
        }
    });
    // Audio ended listener for when audio track finishes
    audio.addEventListener('ended', () => {
        // Set up next track
        trackIndex++;
        // Check if at end of tracklist
        if (trackIndex > tracklist.length -1) {
            // Get play/pause button icon in case update required
            let buttonIcon = player.querySelector('.play-pause-btn i.fas');
            // If not looped, stop track
            if (!loopStatus) {
                isPlaying = false;
                playPause(audio, buttonIcon, isPlaying);
                // Update displays if not mini player
                if (!player.classList.contains('mini-player')) {
                    handleStop(audio, sleeve, record, seekSlider, activeTimeDisplay);
                }
                // Set to begin again at start of tracklist
                startTracks = true;
            // If looped, load first track and continue playback
            } else if (loopStatus === 'all') {
                trackIndex = 0;
                loadTrack(player, audio, tracklist, trackIndex);
                audio.play();
            }
        // If not at end of tracklist, play next track
        } else {
            loadTrack(player, audio, tracklist, trackIndex);
            audio.play();
        }
    });
}

// Specific handler functions

/**
 * Dynamically create tracklist button for each track object in
 * tracklist array using info contained therein and construct
 * interactive tracklist.
 * 
 * @param {Array} tracklist - Array of objects containing track information.
 * @param {HTMLElement} tracklistContainer - Container div for tracklist buttons.
 */
function addTracklistButtons(tracklist, tracklistContainer) {
    for (let track of tracklist) {
        // Main button element
        const button = document.createElement('button');
        button.classList.add('tracklist-btn');
        button.setAttribute('tabindex', '-1');
        // Track number container span
        const numTextSpan = document.createElement('span');
        numTextSpan.classList.add('num-span');
        /* Track number span - used for comparison to tracklist
           index number so MUST contain only digit */
        const numberSpan = document.createElement('span');
        const trackNum = tracklist.indexOf(track);
        if (trackNum === 0) {
            button.classList.add('first-focus');
        }
        numberSpan.classList.add('track-num');
        numberSpan.innerHTML = trackNum + 1;
        // Span for 'dot, space' after number - for aesthetics
        const dotSpan = document.createElement('span');
        dotSpan.innerHTML = '. ';
        // Track name span
        const nameSpan = document.createElement('span');
        nameSpan.classList.add('track-name');
        nameSpan.innerHTML = track.name;
        // Track duration span
        const lengthSpan = document.createElement('span');
        lengthSpan.classList.add('track-length');
        lengthSpan.innerHTML = track.duration;
        /* Add all elements to button in correct order, appropriate
           to each player type */
        numTextSpan.appendChild(numberSpan);
        numTextSpan.appendChild(dotSpan)
        button.appendChild(numTextSpan);
        if (tracklistContainer.classList.contains('re-list-btns')) {
            // Album art image for full-featured player
            const image = document.createElement('img');
            image.src = `./assets/images/${track.img}`;
            image.alt = 'Album art';
            button.appendChild(image);
        }
        button.appendChild(nameSpan);
        if (tracklistContainer.classList.contains('mini-player-tracklist')) {
            // Track time/duration container for mini player
            const timesSpan = document.createElement('span');
            timesSpan.classList.add('track-times');
            // Current time span - updated programatically
            const trackTime = document.createElement('span');
            trackTime.classList.add('track-time');
            trackTime.innerHTML = '00:00'
            // Span for separating 'slash'
            const slashSpan = document.createElement('span');
            slashSpan.innerHTML = ' &#47; ';
            timesSpan.appendChild(trackTime);
            timesSpan.appendChild(slashSpan);
            timesSpan.appendChild(lengthSpan);
            button.appendChild(timesSpan);
        }
        if (tracklistContainer.classList.contains('re-list-btns')) {
            lengthSpan.classList.add('track-info');
            button.appendChild(lengthSpan);
        }
        // Add button to container div
        tracklistContainer.appendChild(button);
    }
}

/**
 * Load audio source and update player's display/visual elements.
 * 
 * @param {HTMLElement} player - Music player container element.
 * @param {HTMLAudioElement} audio - Audio element for handling mp3 files.
 * @param {Array} tracklist - Array of objects containing track information.
 * @param {number} trackIndex - Array index of current track info.
 */
function loadTrack(player, audio, tracklist, trackIndex) {
    // Get current track info object from array
    const track = tracklist[trackIndex];
    // Get all display/visual elements to be updated
    const albumCover = player.querySelector('.album-cover');
    const recordImage = player.querySelector('.vinyl-inset');
    const trackTitle = player.querySelector('.curr-track-name');
    const artist = player.querySelector('.curr-track-artist');
    const album = player.querySelector('.curr-track-album');
    const lengthDisplay = player.querySelector('.active-length');
    const infoWindow = player.querySelector('.tracklist-info');
    // Set audio source
    audio.src = `./assets/audio/${track.src}`;
    /* Update display/visual elements - if statements to prevent
       'null setting' errors when function called on mini player */
    if (albumCover) {
        albumCover.src = `./assets/images/${track.img}`;
    }
    if (recordImage) {
        recordImage.src = `./assets/images/${track.img}`;
    }
    if (trackTitle) {
        trackTitle.innerHTML = `${track.name}`;
    }
    if (artist) {
        artist.innerHTML = `${track.artist}`;
    }
    if (album) {
        album.innerHTML = `${track.album}`;
    }
    if (infoWindow) {
        infoWindow.innerHTML = `Track ${trackIndex + 1} of ${tracklist.length}`;
    }
    /* One-time event listener to prevent update of display to 'NaN'
       returned by audio.duration before event fires */
    audio.addEventListener('durationchange', () => {
        let trackLength = audio.duration;
        if (lengthDisplay) {
            lengthDisplay.innerHTML = timeDisplay(trackLength);
        }
    }, {once: true});
}

/**
 * Play or pause current audio track and switch button icon.
 * 
 *  @param {HTMLAudioElement} audio - Audio element for handling mp3 files. 
 * @param {HTMLElement} buttonIcon - Play/pause button icon.
 * @param {boolean} isPlaying - Boolean variable indicating audio play state.
 */
function playPause(audio, buttonIcon, isPlaying) {
    if (isPlaying) {
        buttonIcon.classList.replace('fa-play', 'fa-pause');
        audio.play();
    } else {
        buttonIcon.classList.replace('fa-pause', 'fa-play');
        audio.pause();
    }
}

/**
 * Handle timing of current audio track playback and animation of
 * vinyl record & album cover mockups.
 * 
 *  @param {HTMLAudioElement} audio - Audio element for handling mp3 files. 
 * @param {HTMLElement} buttonIcon - Play/pause button icon.
 * @param {HTMLElement} sleeve - Div element containing album cover mockup.
 * @param {HTMLElement} record - Div element containing vinyl record mockup.
 */
function handlePlay(audio, buttonIcon, sleeve, record) {
    // Set playback state for playPause function
    let isPlaying = true;
    /* Add/remove CSS classes to set appropriate animations in
       motion based on whether playback beginning or resuming while
       also timing playback to complement animation effects */
    if (sleeve.classList.contains('stopped')) {
        // ... begin playback (after half a second) ...
        setTimeout(() => {
            // Remove cover
            sleeve.classList.replace('stopped', 'playing');
            // ... when record visible ...
            sleeve.addEventListener('animationend', () => {
                // Start rotating
                record.classList.remove('stopped');
                record.classList.add('playing');
                // Remove sleeve from DOM
                sleeve.classList.add('hidden');
                // Play
                playPause(audio, buttonIcon, isPlaying);
            }, {once: true});
        }, 500);
    } else {
        // ... resume playback (after pause) ...
        record.classList.remove('stopped');
        record.classList.add('playing');
        playPause(audio, buttonIcon, isPlaying);
    }
    // In case rotation angle of record set by seek
    if (record.hasAttribute('style')) {
        record.removeAttribute('style');
    }
}

/**
 * Reset audio track time to zero and display/visual elements to
 * initial states.
 * 
 * @param {HTMLAudioElement} audio - Audio element for handling mp3 files. 
 * @param {HTMLElement} sleeve - Div element containing album cover mockup.
 * @param {HTMLElement} record - Div element containing vinyl record mockup. 
 * @param {HTMLElement} slider - Range input representing 'seek' slider.
 * @param {HTMLElement} timeDisplay - Div element containing current track time display.
 */
function handleStop(audio, sleeve, record, slider, timeDisplay) {
    // Bring back album cover
    sleeve.classList.add('stopped');
    sleeve.classList.remove('hidden', 'playing');
    // Pause record rotation
    record.classList.remove('playing');
    // ... when record hidden ...
    sleeve.addEventListener('animationend', () => {
        // Reset current time, time display and seek slider
        audio.currentTime = 0;
        handleTrackTimeUpdate(audio, slider, timeDisplay);
        // Reset record to 0deg rotation
        record.classList.add('stopped');
        record.removeAttribute('style');
    }, {once: true});
}

/**
 * Update and return tracklist array index number based on current
 * track number and whether 'previous track' or 'next track' button
 * passed in by 'click' event handler.
 * 
 * @param {HTMLElement} button - Previous track or next track button.
 * @param {number} listLength - Length of tracklist array.
 * @param {number} trackIndex - Array index number to be updated.
 * @returns {number} Updated array index number.
 */
function prevNext(button, listLength, trackIndex) {
    // Set previous track index number
    if (button.classList.contains('prev-track-btn')) {
        trackIndex--;
        // If current track is first in tracklist, go to last
        if (trackIndex < 0) {
            trackIndex = listLength -1;
        }
    // Set next track index number
    } else {
        // If current track is last in tracklist, go to first
        trackIndex++;
        if (trackIndex > listLength -1) {
            trackIndex = 0;
        }
    }
    return trackIndex;
}

/**
 * Update passed-in range input's background gradient width based
 * on current value at time of 'input' event firing and return
 * value.
 * 
 * @param {HTMLElement} slider - Range input representing either 'volume control' or 'seek' slider.
 * @returns {number} Range input's current value.
 */
function handleSlider(slider) {
    // Get slider's max, min and value attributes
    const max = slider.max;
    const min = slider.min;
    let value = slider.value;
    /* Set background gradient width to follow slider
       thumb */
    let backgroundWidth = (value - min) * 100 / (max - min);
    slider.style.backgroundSize = `${backgroundWidth}% 100%`;
    return value;
}

/**
 * Set audio track's current time based on range input value passed
 * in by 'input' event handler.
 * 
 * @param {number} seekValue - 'Seek' range input value returned by handleSlider function.
 * @param {HTMLAudioElement} audio - Audio element for handling mp3 files. 
 */
function handleSeek(seekValue, audio) {
    let trackLength = audio.duration;
    /* Check that audio.duration is set to avoid non-finite number
       (NaN) being set as audio.currentTime, thus preventing
       'failed to set...' error being thrown */
    if (trackLength > 0) {
        let seekTime = (seekValue / 100) * trackLength;
        audio.currentTime = seekTime;
    }
}

/**
 * Set vinyl record mockup's angle of rotation based on current
 * track time (as set by 'seek' range input) and assumed rotation
 * speed of 33.3rpm.
 * 
 * @param {HTMLAudioElement} audio - Audio element for handling mp3 files.
 * @param {HTMLElement} record - Div element containing vinyl record mockup. 
 * @param {boolean} seek - Boolean variable set when either 'seeking' or 'seeked' events fire.
 */
function handleRecordSeek(audio, record, seek) {
    // Get current track time
    let time = audio.currentTime;
    /* Calculate appropriate angle of rotation...
       33.3rpm => full 360deg rotation every 1.8s => 1deg rotation
       every 5ms. 1s / 5ms = 200 => current time * 200 = total deg
       rotated at current time. Total deg % 360 = current angle.
    */
    let angleRotation = (Math.floor(time) * 200) % 360;
    /* If seeking, remove rotation animation & set angle to match
       current time */
    if (seek) {
        record.classList.add('stopped');
        record.style.transform = `rotate(${angleRotation}deg)`;
    }
    // Resume animation state when seeking done
    if (!seek) {
        record.classList.remove('stopped');
        record.removeAttribute('style');
    }
}

/**
 * Update 'seek' range input value, its backround gradient and
 * current track time display as 'timeupdate' event fires.
 * 
 * @param {HTMLAudioElement} audio - Audio element for handling mp3 files.
 * @param {HTMLElement} seekSlider - Range input representing 'seek' slider. 
 * @param {HTMLElement} timeDisplayText - Div element containing current track time display. 
 */
function handleTrackTimeUpdate(audio, seekSlider, timeDisplayText) {
    // Get current track time and current track duration
    let trackTime = audio.currentTime;
    let trackLength = audio.duration;
    // Initialise variable to hold calculated range input value
    let timeSetting;
    // Calculate and update range input value...
    /* Avoid 'NaN' returned by audio.duration if track duration not
       set in time - alternative method to 'durationchange' event
       listener used by loadTrack function */
    if (trackLength > 0) {
        timeSetting = (trackTime / trackLength) * 100;
    } else {
        timeSetting = 0;
    }
    /* Avoid 'null setting' error when function called on mini
       player */
    if (seekSlider) {
        seekSlider.value = timeSetting;
        handleSlider(seekSlider);
    }
    // Update current time display
    timeDisplayText.innerHTML = timeDisplay(trackTime);
}

/**
 * Update and set audio volume and setting display.
 * 
 * @param {HTMLAudioElement} audio - Audio element for handling mp3 files. 
 * @param {number} setting - Current volume setting integer determined by either code or 'volume' range input value.
 * @param {HTMLElement} display - Div element containing volume setting display.
 */
function handleVolume(audio, setting, display) {
    // Update audio volume setting
    audio.volume = setting / 100;
    // Update volume setting display;
    display.innerHTML = setting;
}

/**
 * Toggle audio.muted property and switch mute button icon based on
 * mute button clicks or changes to 'volume' range input value.
 * 
 * @param {event} event - Either a 'click' on the mute button or 'input' on the 'volume' range input. 
 * @param {HTMLAudioElement} audio - Audio element for handling mp3 files.  
 * @param {HTMLElement} buttonIcon - Mute button icon.
 */
function handleMute(event, audio, buttonIcon) {
    /* Toggle mute and switch button icon on click if current audio
       volume not set to 0 */
    if (event.type === 'click' && audio.volume != 0) {
        if (buttonIcon.classList.contains('fa-volume-up')) {
            buttonIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
            audio.muted = true;
        } else if (buttonIcon.classList.contains('fa-volume-mute')) {
            buttonIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
            audio.muted = false;
        }
    /* Un-mute audio if volume setting changed and switch button
       icon as volume set to 0 or not */
    } else if (event.type === 'input') {
        audio.muted = false;
        audio.volume == 0 ? buttonIcon.classList.replace('fa-volume-up', 'fa-volume-mute') : buttonIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
    }
}

/**
 * Update or reset tracklist buttons' display/info when current
 * track's 'canplay' event fires. 
 * 
 * @param {HTMLElement} button - Tracklist button.
 * @param {number} buttonIndex - Integer for comparison with tracklist array index number, based on button's 'track number'.
 * @param {number} trackIndex - Tracklist array index number.
 * @param {string} trackLength - Tracklist array 'track info' object's 'duration' value to be (re)set on button.
 */
function handleTracklist(button, buttonIndex, trackIndex, trackLength) {
    /* Get spans containing button's track name and either current
       time or info/duration displays, depending on player type */
    const trackName = button.querySelector('.track-name');
    const trackTime = button.querySelector('.track-time');
    const trackInfo = button.querySelector('.track-info');
    // Update button displays if matching current track
    if (buttonIndex === trackIndex) {
        button.classList.add('active-btn');
        trackName.classList.add('active-name');
        if (trackTime) {
            trackTime.classList.add('active-time');
        }
        if (trackInfo) {
            trackInfo.innerHTML = 'Loaded';
        }
    // Reset button displays if not matching current track
    } else {
        button.classList.remove('active-btn');
        trackName.classList.remove('active-name');
        if (trackTime) {
            trackTime.classList.remove('active-time');
            trackTime.innerHTML = '00:00';
        }
        if (trackInfo) {
            trackInfo.innerHTML = trackLength;
        }
    }
}
