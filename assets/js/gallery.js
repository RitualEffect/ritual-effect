// Wait for the DOM to finish loading before running

document.addEventListener("DOMContentLoaded", function() {

    // Set initial active image and image counters

    const carousels = document.querySelectorAll('.gallery-carousel');

    carousels.forEach(carousel => {
        setActiveImage(carousel);
        setCounters(carousel);
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

    // Add event listeners to 'previous' buttons

    /* Add touch event listeners to image carousels for swiping between images. */
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
 * @param {HTMLElement} carousel - Target image carousel div element 
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
 * Get parent element of passed-in, targeted
 * carousel div.
 * 
 * Get thumnail buttons from carousel div.
 * 
 * Pass both to setImageCount and setImageIndex
 * functions.
 * 
 * @param {HTMLElement} carousel - Target image carousel div element
 */
function setCounters(carousel) {
    let parent = carousel.parentElement;
    let imageList = carousel.querySelector('.gallery-thumbnails');
    
    setImageCount(parent, imageList);
    setImageIndex(parent, imageList);
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
 * @param {HTMLElement} parent - Parent element of target image carousel
 * @param {HTMLElement} imageList - Thumbnail image buttons of target image carousel
 */
function setImageCount(parent, imageList) {
    let imageListId = imageList.id;
    let imageArray = Array.from(imageList.querySelectorAll('.gallery-thumb-btn'));
    
    let counts = parent.querySelectorAll(`.${imageListId}-count`);
    counts.forEach(count => {
        count.innerHTML = imageArray.length;
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
 * image and return that image's index number.
 * 
 * Set returned index as displayed current image
 * number in each span.
 * 
 * @param {HTMLElement} parent - Parent element of target image carousel
 * @param {HTMLElement} imageList - Thumbnail image buttons of target image carousel 
 */
function setImageIndex(parent, imageList) {
    let imageListId = imageList.id;
    let imageArray = Array.from(imageList.querySelectorAll('.gallery-thumb-btn'));
    let indexSpan = parent.querySelector(`.${imageListId}-index`);
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
 * Pass target button toupdateActiveImage function
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