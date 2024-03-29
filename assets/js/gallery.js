// Wait for the DOM to finish loading before running

document.addEventListener('DOMContentLoaded', function() {

    /* Get all the image carousels from the DOM and iterate
       over them */

    const carousels = document.querySelectorAll('.gallery-carousel');

    carousels.forEach(carousel => {
        
        /* Set each carousel's initial active image,
           image counts and image index number */

        setActiveImage(carousel);
        setImageCount(carousel);
        setImageIndex(carousel);

        // Add click event listeners to each carousel

        handleClicks(carousel);

        // Add touch event listeners to each carousel

        handleTouches(carousel);

    });

});

// Event handler functions

/**
 * Get main carousel image, active thumbnail image
 * and main image anchor tag elements from passed-in,
 * targeted carousel div.
 * 
 * Set main image src and alt properties from
 * active thumbnail image.
 * 
 * Set main image anchor tag href property from
 * active thumbnail image src (creates link to open
 * main image in new tab).
 * 
 * @param {HTMLElement} carousel - Target image carousel div element.
 */
function setActiveImage(carousel) {
    let activeImage = carousel.querySelector('.gallery-active-img');
    let activeThumb = carousel.querySelector('.active-thumb .gallery-thumb-img');
    let activeImageLink = carousel.querySelector('.gallery-active-img-link');

    activeImage.src = activeThumb.src;
    activeImage.alt = activeThumb.alt;
    activeImageLink.href = activeThumb.src;
}

/**
 * Get id property of thumbnail buttons' container
 * element.
 * 
 * Construct iterable array of thumbnail buttons.
 * 
 * Use thumbnail container id as string template
 * literal to get corresponding span elements in
 * which image totals to be displayed.
 * 
 * Set thumbnail array length as displayed image
 * total in each span.
 * 
 * @param {HTMLElement} carousel - Target image carousel div element.
 */
function setImageCount(carousel) {
    let parent = carousel.parentElement;
    let imagesContainer = carousel.querySelector('.gallery-thumbnails');
    let countSpans = parent.querySelectorAll(`.${imagesContainer.id}-count`);
    let imageArray = Array.from(imagesContainer.querySelectorAll('.gallery-thumb-btn'));

    countSpans.forEach(countSpan => {
        countSpan.innerHTML = imageArray.length;
    });
}

/**
 * Get id property of thumbnail buttons' container
 * element.
 * 
 * Construct iterable array of thumbnail buttons.
 * 
 * Use thumbnail container id as string template
 * literal to get corresponding span element in
 * which current image number to be displayed.
 * 
 * Iterate over thumbnail array to find current active
 * image and get that image's index number.
 * 
 * Use index number to display current image number.
 * 
 * @param {HTMLElement} carousel - Target image carousel div element.
 */
function setImageIndex(carousel) {
    let imagesContainer = carousel.querySelector('.gallery-thumbnails');
    let indexSpan = carousel.querySelector(`.${imagesContainer.id}-index`);
    let imageArray = Array.from(imagesContainer.querySelectorAll('.gallery-thumb-btn'));
    let activeImageIndex;

    for (let image of imageArray) {
        if (image.classList.contains('active-thumb')) {
            activeImageIndex = imageArray.indexOf(image);
        }
    }
    indexSpan.innerHTML = activeImageIndex + 1;
}

/**
 * Get all carousel's button elements and iterate over them.
 * 
 * Add 'click' event listener to each button, only if HTML
 * button element.
 * 
 * Limit click events to max 2 per second.
 * 
 * Pass targeted button element to handleCarouselButtons function.
 * 
 * @param {HTMLElement} carousel - Target image carousel div element. 
 */
function handleClicks(carousel) {
    const buttons = carousel.querySelectorAll('button');

        buttons.forEach(button => {
            // Throttling variable to limit click events
            let enableClick = true;

            button.addEventListener('click', e => {
                // Only run if throttling allows
                if (!enableClick) return;
                enableClick = false;

                // Only target button elements
                let targetButton = e.target.closest('button');
                if (targetButton) {
                    handleCarouselButtons(targetButton);
                } else return;

                /* Only register click events every 600ms
                   (i.e. limit user to max 2 clicks/second) */
                setTimeout(function() {
                    enableClick = true;
                }, 600);
            });
        });
}

/**
 * Check type of button by class attribute and pass to
 * appropriate function.
 * 
 * @param {HTMLElement} targetButton - Target button passed in by click event.
 * @returns {} Nothing. Exits function if target button not correct type.
 */
function handleCarouselButtons(targetButton) {
    if (targetButton.classList.contains('gallery-thumb-btn')) {
        setImageFromThumb(targetButton);
    } else if (targetButton.classList.contains('next-btn')) {
        nextImage(targetButton);
    } else if (targetButton.classList.contains('prev-btn')) {
        previousImage(targetButton);
    } else return;
}

/**
 * Iterate over thumbnail buttons to remove active
 * class.
 * 
 * Assign active class to target thumbnail.
 * 
 * Pass updated carousel div to setActiveImage and
 * setImageIndex functions. 
 * 
 * @param {HTMLElement} activeImageButton - Target thumbnail button passed in from calling function.
 */
function updateActiveImage(activeImageButton) {
    let imagesContainer = activeImageButton.parentElement;
    let buttons = imagesContainer.querySelectorAll('.gallery-thumb-btn');
    
    buttons.forEach(button => {
        button.classList.remove('active-thumb');
    });
    activeImageButton.classList.add('active-thumb');
    
    let carousel = imagesContainer.parentElement;

    setActiveImage(carousel);
    setImageIndex(carousel);
}

/**
 * Get target thumbnail button's main image container.
 * 
 * Apply CSS animation to container (500ms duration).
 * 
 * Pass target button to updateActiveImage function
 * after 150ms.
 * 
 * Remove animation 50ms after completion.
 * 
 * @param {HTMLElement} targetButton - Target thumbnail button passed in from event listener.
 */
function setImageFromThumb(targetButton) {
    let carousel = targetButton.closest('.gallery-carousel');
    let mainImageContainer = carousel.querySelector('.gallery-active-img-wrap');

    mainImageContainer.classList.add('img-fade');
    setTimeout(function() {
        updateActiveImage(targetButton);
    }, 150);
    setTimeout(function() {
        mainImageContainer.classList.remove('img-fade');
    }, 550);
}

/**
 * Get target arrow button's icon and target
 * carousel's main image container.
 * 
 * Pass target button to setImageFromArrow function to
 * update active thumbnail button.
 * 
 * Apply CSS animation to main image container (500ms duration)
 * and CSS transition to arrow button (500ms duration).
 * 
 * Pass active thumbnail button to updateActiveImage
 * function after 200ms (40% of animation's duration).
 * 
 * Remove animation from container and transition from arrow
 * button 50ms after completion.
 * 
 * @param {HTMLElement} targetButton - Target right arrow button passed in from event listener. 
 */
function nextImage(targetButton) {
    let carousel = targetButton.closest('.gallery-carousel');
    let buttonIcon = targetButton.querySelector('i');
    let mainImageContainer = carousel.querySelector('.gallery-active-img-wrap');

    let activeImageButton = setImageFromArrow(targetButton);

    buttonIcon.classList.add('highlight-right');
    mainImageContainer.classList.add('img-slide-left');
    setTimeout(function() {
        updateActiveImage(activeImageButton);
    }, 200);
    setTimeout(function() {
        mainImageContainer.classList.remove('img-slide-left');
        buttonIcon.classList.remove('highlight-right');
    }, 550);
}

/**
 * Get target arrow button's icon and target
 * carousel's main image container.
 * 
 * Pass target button to setImageFromArrow function to
 * update active thumbnail button.
 * 
 * Apply CSS animation to main image container (500ms duration)
 * and CSS transition to arrow button (500ms duration).
 * 
 * Pass active thumbnail button to updateActiveImage
 * function after 200ms (40% of animation's duration).
 * 
 * Remove animation from container and transition from arrow
 * button 50ms after completion.
 * 
 * @param {HTMLElement} targetButton - Target left arrow button passed in from event listener. 
 */
function previousImage(targetButton) {
    let carousel = targetButton.closest('.gallery-carousel');
    let buttonIcon = targetButton.querySelector('i');
    let mainImageContainer = carousel.querySelector('.gallery-active-img-wrap');

    let activeImageButton = setImageFromArrow(targetButton);

    buttonIcon.classList.add('highlight-left');
    mainImageContainer.classList.add('img-slide-right');
    setTimeout(function() {
        updateActiveImage(activeImageButton);
    }, 200);
    setTimeout(function() {
        mainImageContainer.classList.remove('img-slide-right');
        buttonIcon.classList.remove('highlight-left');
    }, 550);
}

/**
 * Construct iterable array of thumbnail buttons.
 * 
 * Get current active thumbnail button.
 * 
 * If target button is 'next image' button,
 * set active thumbnail to next thumbnail in list or,
 * if current active thumbnail is last in array, set
 * active thumbnail to first in array.
 * 
 * If target button is 'previous image' button,
 * set active thumbnail to previous thumbnail in list
 * or, if current active thumbnail is first in array,
 * set active thumbnail to last in array.
 * 
 * @param {HTMLElement} targetButton - Target arrow button passed in from calling function.
 * @returns {HTMLElement} newActiveImageButton - New active thumbnail button.
 */
function setImageFromArrow(targetButton) {
    let carousel = targetButton.closest('.gallery-carousel');
    let imageArray = Array.from(carousel.querySelectorAll('.gallery-thumb-btn'));
    let activeImageButton = carousel.querySelector('.active-thumb');
    let newActiveImageButton;

    if (targetButton.classList.contains('next-btn')) {
        if (activeImageButton === imageArray[imageArray.length - 1]) {
            newActiveImageButton = imageArray[0];
        } else {
            newActiveImageButton = activeImageButton.nextElementSibling;
        }
    } else if (targetButton.classList.contains('prev-btn')) {
        if (activeImageButton === imageArray[0]) {
            newActiveImageButton = imageArray[imageArray.length - 1];
        } else {
            newActiveImageButton = activeImageButton.previousElementSibling;
        }
    }
    return newActiveImageButton;
}

/**
 * Get target carousel's main image viewport & add touch event
 * listeners to it:
 * 
 * 'touchstart' - Record x & y coordinates and time of first touch;
 * 
 * 'touchmove' - Determine if swiping horizontally or vertically.
 * If condition met for valid horizontal swipe, return true and
 * prevent page scrolling for duration of touch.
 * 
 * 'touchend' - Limit touch events to max 2 per second. Record x
 * coordinate at end of touch. If horizontal swipe, prevent click
 * events in viewport, pass start & end x coordinates and time of
 * first touch to handleSwipe function, get returned swipe
 * direction and pass to handleSwipeDirection function.
 * 
 * @param {HTMLElement} carousel - Target image carousel div element. 
 */
function handleTouches(carousel) {
    // Target carousel's main image viewport
    const view = carousel.querySelector('.gallery-active-section');
    // Throttling variable to limit click events
    let enableSwipe = true;
    // Starting X and Y coordinates
    let startX = null;
    let startY = null;
    // Swiping horizontally?
    let swipingX = false;
    // Time of first touch
    let startTime;

    view.addEventListener('touchstart', e => {
        // Record x and y coordinates of first touch
        startX = e.changedTouches[0].clientX;
        startY = e.changedTouches[0].clientY;
        // Record time of first touch
        startTime = new Date().getTime();
    });

    view.addEventListener('touchmove', e => {
        // To prevent error when maths operations applied:
        if (startX === null || startY === null) return;
        
        // Track distance of touch across screen
        let currentX = e.changedTouches[0].clientX;
        let currentY = e.changedTouches[0].clientY;
        let currentDistX = startX - currentX;
        let currentDistY = startY - currentY;
        // Maximum y-axis distance allowed for horizontal swipe
        let tolerance = 100;

        // Only run if swiping horizontally within tolerance
        if (Math.abs(currentDistX) > Math.abs(currentDistY) && Math.abs(currentDistY) <= tolerance && e.cancelable) {
            swipingX = true; // Horizontal swipe
            // Prevent scrolling when inside image viewport
            e.preventDefault();
        }
    });

    view.addEventListener('touchend', e => {
        // Only run if throttling allows
        if (!enableSwipe) return;
        enableSwipe = false;
        // To prevent error when maths operations applied:
        if (startX === null || startY === null) return;

        // Record x coordinate of touch leaving screen
        let endX = e.changedTouches[0].clientX;

        // Only run if swiping horizontally
        if (swipingX && e.cancelable) {
            // Direction of swipe returned by handleSwipe function
            let swipeDirection = handleSwipe(startX, startTime, endX);

            handleSwipeDirection(view, swipeDirection);
            // Reset x and y coordinates
            startX = null;
            startY = null;
            // Prevent click events inside image viewport
            e.preventDefault();
            // Reset swiping state to restore defaults after each swipe
            swipingX = false;
        }

        /* Only register touchend events every 600ms
           (i.e. limit user to max 2 swipes/second) */
        setTimeout(function() {
            enableSwipe = true;
        }, 600);
    });
}

/**
 * If conditions met for valid horizontal swipe, return swipe
 * direction.
 * 
 * @param {number} startX - X coordinate passed in by touchstart event listener.
 * @param {number} startTime - Time recorded by touchstart event listener.
 * @param {number} endX - X coordinate passed in by touchend event listener.
 * @returns {string} swipeDirection - Direction ('left' or 'right') determined by difference between startX and endX.
 */
function handleSwipe(startX, startTime, endX) {
    // Get distance moved horizontally
    let distX = startX - endX;
    // Minimum distance in pixels required for valid swipe
    let threshold = 100;
    // Get time since first touch
    let elapsedTime = new Date().getTime() - startTime;
    // Minimum touch duration in ms required for valid swipe
    let allowedTime = 300;
    // Direction of swipe
    let swipeDirection;

    // Only run if conditions met for valid horizontal swipe
    if (Math.abs(distX) >= threshold && elapsedTime <= allowedTime) {
        /* Ternary if statement. Set direction of swipe
           if dist moved + or - */
        swipeDirection = (distX > 0) ? 'left' : 'right';
    }
    return swipeDirection;
}

/**
 * Get target carousel's next and previous buttons
 * by querying main image viewport element.
 * 
 * If passed in swipe direction is left, pass next
 * button to nextImage function.
 * 
 * If right, pass previous button to previousImage
 * function.
 * 
 * @param {HTMLElement} view - Target carousel main image viewport.
 * @param {string} swipeDirection - Direction ('left' or 'right') passed in by touchend event listener.
 */
function handleSwipeDirection(view, swipeDirection) {
    let nextButton = view.querySelector('.next-btn');
    let prevButton = view.querySelector('.prev-btn');

    if (swipeDirection === 'left') {
        nextImage(nextButton);
    } else if (swipeDirection === 'right') {
        previousImage(prevButton);
    } else return; // exit function if direction undefined/falsy
}