// Wait for the DOM to finish loading before running

document.addEventListener("DOMContentLoaded", function() {

    // Set initial active image and image counters

    const carousels = document.querySelectorAll('.gallery-carousel');

    carousels.forEach(carousel => {
        setActiveImage(carousel);
        setImageCount(carousel);
        setImageIndex(carousel);
    });

    // Add event listeners to thumbnail buttons

    const thumbButtons = document.querySelectorAll('.gallery-thumb-btn');

    thumbButtons.forEach(button => {
        button.addEventListener('click', e => {
            let targetButton = e.target.closest('button');
            if (!targetButton) return;
            
            setImageFromThumb(targetButton);
        });
    });

    // Add event listeners to 'next' buttons

    const nextButtons = document.querySelectorAll('.next-btn');

    nextButtons.forEach(button => {
        button.addEventListener('click', e => {
            let targetButton = e.target.closest('button');
            if (!targetButton) return;

            nextImage(targetButton);
        });
    });

    // Add event listeners to 'previous' buttons

    const prevButtons = document.querySelectorAll('.prev-btn');

    prevButtons.forEach(button => {
        button.addEventListener('click', e => {
            let targetButton = e.target.closest('button');

            previousImage(targetButton);
        });
    });

    /* Add touch event listeners to image carousels for swiping between images. */

    const imageViews = document.querySelectorAll('.gallery-active-section');

    imageViews.forEach(view => {
        let startX = null;

        view.addEventListener('touchstart', e => {
            startX = e.changedTouches[0].clientX;
        });

        view.addEventListener('touchend', e => {
            let endX = e.changedTouches[0].clientX;
            
            handleSwipe(view, endX, startX);
        });
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
    let imageContainer = carousel.querySelector('.gallery-thumbnails');

    let countSpans = parent.querySelectorAll(`.${imageContainer.id}-count`);
    let imageArray = Array.from(imageContainer.querySelectorAll('.gallery-thumb-btn'));

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
    let parent = carousel.parentElement;
    let imageContainer = carousel.querySelector('.gallery-thumbnails');

    let indexSpan = parent.querySelector(`.${imageContainer.id}-index`);
    let imageArray = Array.from(imageContainer.querySelectorAll('.gallery-thumb-btn'));
    let activeImageIndex;

    for (let image of imageArray) {
        if (image.classList.contains('active-thumb')) {
            activeImageIndex = imageArray.indexOf(image);
        }
    }
    indexSpan.innerHTML = activeImageIndex + 1;
}

/**
 * Iterate over thumbnail buttons to remove active
 * class.
 * 
 * Assign active class to target thumbnail.
 * 
 * Pass updated elements to setActiveImage and
 * setImageIndex functions. 
 * 
 * @param {HTMLElement} targetButton - Target thumbnail button passed in from event handler function
 * @param {HTMLElement} imageList - Thumbnail image buttons of target image carousel 
 */
function updateActiveImage(targetButton, imageList) {
    let buttons = imageList.querySelectorAll('.gallery-thumb-btn');
    
    buttons.forEach(button => {
        button.classList.remove('active-thumb');
    });
    targetButton.classList.add('active-thumb');
    
    let carousel = imageList.parentElement;
    let parent = carousel.parentElement;

    setActiveImage(carousel);
    setImageIndex(parent, imageList);
}

/**
 * Get element containing target thumbnail button's
 * siblings.
 * 
 * Get target carousel's main image container.
 * 
 * Apply CSS animation to container (1s duration).
 * 
 * Pass target button to updateActiveImage function
 * after 500ms.
 * 
 * Remove animation 50ms after completion.
 * 
 * @param {HTMLElement} targetButton - Target thumbnail button passed in from event listener 
 */
function setImageFromThumb(targetButton) {
    let imageList = targetButton.parentElement;
    let mainImage = imageList.parentElement.querySelector('.gallery-active-img-wrap');

    mainImage.classList.add('img-fade');
    setTimeout(function() {
        updateActiveImage(targetButton, imageList);
    }, 500);
    setTimeout(function() {
        mainImage.classList.remove('img-fade');
    }, 1050);
}

/**
 * Get target arrow button's icon and target
 * carousel's main image container.
 * 
 * Get element containing target thumbnail button's
 * siblings and construct iterable array from it.  
 * 
 * Get current active thumbnail button.
 * 
 * Set active thumbnail to next thumbnail in list or,
 * if current active thumbnail is last in array, set
 * active thumbnail to first in array.
 * 
 * Apply CSS animations to main image container 
 * (1s duration) and CSS transition to arrow button
 * (0.5s duration).
 * 
 * Pass new active button to updateActiveImage function
 * after 500ms and remove transition from arrow button.
 * 
 * Remove animation from container 50ms after
 * completion.
 * 
 * @param {HTMLElement} targetButton - Target right arrow button passed in from event listener 
 */
function nextImage(targetButton) {
    let rightButton = targetButton.querySelector('i');
    let mainImage = targetButton.parentElement.parentElement.querySelector('.gallery-active-img-wrap');
    let imageList = targetButton.parentElement.parentElement.nextElementSibling;
    let imageArray = Array.from(imageList.querySelectorAll('.gallery-thumb-btn'));
    let activeImageButton = imageList.querySelector('.active-thumb');
    let newActiveImageButton;

    if (activeImageButton === imageArray[imageArray.length - 1]) {
        newActiveImageButton = imageArray[0];
    } else {
        newActiveImageButton = activeImageButton.nextElementSibling;
    }

    rightButton.classList.add('highlight-right');
    mainImage.classList.add('img-slide-left');
    setTimeout(function() {
        updateActiveImage(newActiveImageButton, imageList);
        rightButton.classList.remove('highlight-right');
    }, 500);
    setTimeout(function() {
        mainImage.classList.remove('img-slide-left');
    }, 1050);
}

/**
 * Get target arrow button's icon and target
 * carousel's main image container.
 * 
 * Get element containing target thumbnail button's
 * siblings and construct iterable array from it.  
 * 
 * Get current active thumbnail button.
 * 
 * Set active thumbnail to previous thumbnail in list
 * or, if current active thumbnail is first in array,
 * set active thumbnail to last in array.
 * 
 * Apply CSS animations to main image container 
 * (1s duration) and CSS transition to arrow button
 * (0.5s duration).
 * 
 * Pass new active button to updateActiveImage function
 * after 500ms and remove transition from arrow button.
 * 
 * Remove animation from container 50ms after
 * completion.
 * 
 * @param {HTMLElement} targetButton - Target left arrow button passed in from event listener 
 */
function previousImage(targetButton) {
    let leftButton = targetButton.querySelector('i');
    let mainImage = targetButton.parentElement.parentElement.querySelector('.gallery-active-img-wrap');
    let imageList = targetButton.parentElement.parentElement.nextElementSibling;
    let imageArray = Array.from(imageList.querySelectorAll('.gallery-thumb-btn'));
    let activeImageButton = imageList.querySelector('.active-thumb');
    let newActiveImageButton;

    if (activeImageButton === imageArray[0]) {
        newActiveImageButton = imageArray[imageArray.length - 1];
    } else {
        newActiveImageButton = activeImageButton.previousElementSibling;
    }

    leftButton.classList.add('highlight-left');
    mainImage.classList.add('img-slide-right');
    setTimeout(function() {
        updateActiveImage(newActiveImageButton, imageList);
        leftButton.classList.remove('highlight-left');
    }, 500);
    setTimeout(function() {
        mainImage.classList.remove('img-slide-right');
    }, 1050);
}

/**
 * Get target carousel's next and previous buttons
 * by querying main image viewport element.
 * 
 * Compare touchend and touchstart coordinates to
 * determine whether user swiped right or left.
 * 
 * If left, pass next button to nextImage function.
 * 
 * If right, pass previous button to previousImage
 * function.
 * 
 * @param {HTMLElement} view - Target carousel main image viewport
 * @param {number} endX - X-axis coordinate passed in by touchend event listener
 * @param {number} startX - X-axis coordinate passed in by touchstart event listener
 */
function handleSwipe(view, endX, startX) {
    let nextButton = view.querySelector('.next-btn');
    let prevButton = view.querySelector('.prev-btn');

    if (endX < startX) {
        nextImage(nextButton);
    } else if (endX > startX) {
        previousImage(prevButton);
    }
}