// Wait for the DOM to finish loading before running

document.addEventListener('DOMContentLoaded', function() {

    // -------------------- Main menu

    /* Get main menu from the DOM and pass to handler functions if
       found */

    const menu = document.querySelector('#main-menu');

    if (menu) {
        // Set initial aria properties based on screen size
        handleMainMenuAria (menu);

        // Handle dropdown menu behaviour (event listeners)
        handleMainMenuDropdown(menu);
    }

    // ---------------------Music page

    /* Get all popup music players (sample tracks) from the page
       and if found, pass each one to handler function */

    const players = document.querySelectorAll('.music-container');

    if (players.length > 0) {
        for (let player of players) {
            handleMusicPlayerPopup(player);
        }
    }

    // ---------------- News / Events page

    /* Get all articles from the page and if found, pass each one
       to handler function */

    const articles = document.querySelectorAll('.news-item, .gig-listing');

    if (articles.length > 0) {
        for (let article of articles) {
            handleArticleDropdown(article);
        }
    }

    // ---------------------- Footer

    // Set current year in copyright statement if found

    const copYear = document.querySelector('#copyright-year');
    
    if (copYear) {
        copYear.innerHTML = new Date().getFullYear();
    }

});

// -------------------- Handler functions

// ------------------------ Main menu

/**
 * Get main menu button, items list and navigation links. Set their
 * initial aria and focus properties based on screen width (i.e. if
 * in dropdown menu mode).
 * 
 * Add event listener to set aria and focus properties of all
 * elements if screen is resized (e.g. mobile device flipped
 * between portrait & landscape mode).
 * 
 * @param {HTMLElement} menu - Main header navigation menu nav element.
 */
function handleMainMenuAria (menu) {
    const button = menu.querySelector('#main-menu-btn')
    const dropdown = menu.querySelector('#main-menu-items');
    const menuOpenClass = 'main-menu-open';
    const links = dropdown.querySelectorAll('a');

    if (window.innerWidth <= 800) {
        handlePopupAria(button, menuOpenClass);
    }
       
    window.addEventListener('resize', () => {
        if (window.innerWidth > 800) {
            button.setAttribute('aria-expanded', false);
            dropdown.removeAttribute('aria-hidden');
            for (let link of links) {
                link.removeAttribute('tabindex');
            }
        } else {
            handlePopupAria(button, menuOpenClass);
        }
    });
}

/**
 * Get main header navigation menu toggle button. Set names of
 * toggle button's 'active' class and dropdown menu's 'menu open'
 * class.
 * 
 * Pass toggle button and both class names to handlePopup function.
 * 
 * @param {HTMLElement} menu - Main header navigation menu nav element. 
 */
function handleMainMenuDropdown(menu) {
    const button = menu.querySelector('#main-menu-btn');
    const buttonActiveClass = 'menu-toggle-btn-active';
    const menuOpenClass = 'main-menu-open';

    handlePopup(button, buttonActiveClass, menuOpenClass);
}

// ------------------- Main menu functions end

// --------------------- Popups & dropdowns

// Aria properties

/**
 * Get passed-in toggle button's associated popup element. Get
 * popup's focusable child elements.
 * 
 * Check popup for passed-in class name to determine if visible.
 * 
 * If popup hidden, set toggle button's aria-expanded attribute to
 * false, set popup's aria-hidden attribute to true and set each
 * focusable element's tabindex attribute to -1, thereby rendering 
 * them non-focusable.
 * 
 * If popup visible, set toggle button's aria-expanded attribute to
 * true, set popup's aria-hidden attribute to false and remove each
 * focusable elements' tabindex attributes so that they become
 * focusable again. Add one-time, 'focusout' event listener to
 * toggle button to set focus to specified element in popup, if any.
 * 
 * @param {HTMLElement} toggleButton - Button controlling popup element to be handled.
 * @param {string} popupOpenClass - Class name denoting popup element visible.
 */
function handlePopupAria (toggleButton, popupOpenClass) {
    const popupId = toggleButton.getAttribute('aria-controls');
    const popup = document.querySelector(`#${popupId}`);
    const elements = popup.querySelectorAll('a, audio, button, iframe, input');
    const focusElement = popup.querySelector('.first-focus');
    
    if (!popup.classList.contains(popupOpenClass)) {
        toggleButton.setAttribute('aria-expanded', false);
        popup.setAttribute('aria-hidden', true);
        for (let el of elements) {
            el.setAttribute('tabindex', '-1');
        }
    } else {
        toggleButton.setAttribute('aria-expanded', true);
        popup.setAttribute('aria-hidden', false);
        for (let el of elements) {
            el.removeAttribute('tabindex');
        }

        toggleButton.addEventListener('focusout', () => {
            if (focusElement) {
                focusElement.focus();
            }
        }, {once: true});
    }
}

// Main functionality ('click' events)

/**
 * Get passed-in toggle button's associated popup element.
 * 
 * Add 'click' event listener to toggle button, passing event
 * handler function as callback to throttleEvent function with
 * 'interval' parameter of 300ms, thus limiting click events to
 * max 3 per second.
 * 
 * On click: toggle passed-in 'popup open' class on popup or, based
 * on popup type, add/remove appropriate class names and/or call
 * appropriate handler function(s); if appropriate, toggle
 * passed-in 'active' class on toggle button; pass toggle button
 * and 'popup open' class name to handlePopupAria function.
 * 
 * If appropriate, pass toggle button and both class names to
 * handlePopupExternalEvent function.
 * 
 * @param {HTMLElement} toggleButton - Button controlling popup element to be handled.
 * @param {string} togglerActiveClass - Class name denoting toggle button active (popup visible).
 * @param {string} popupOpenClass - Class name denoting popup element visible.
 */
function handlePopup(toggleButton, togglerActiveClass, popupOpenClass) {
    const popupId = toggleButton.getAttribute('aria-controls');
    const popup = document.querySelector(`#${popupId}`);

    toggleButton.addEventListener('click', throttleEvent(e => {
        // Only target entire button element
        let targetButton = e.target.closest('button');
        if (!targetButton) return;

        /* Specific handling of news & events page article
           dropdowns */
        if (popup.classList.contains('news-item-main') || popup.classList.contains('gig-listing-main')) {
            if (popup.classList.contains(popupOpenClass)) {
                handleCollapseArticle(toggleButton, togglerActiveClass, popupOpenClass);
            } else {
                popup.classList.add(popupOpenClass);
                toggleButton.classList.add(togglerActiveClass);
            }
        // Handling of generic popups
        } else {
            popup.classList.toggle(popupOpenClass);
            toggleButton.classList.toggle(togglerActiveClass);
        }
            
        handlePopupAria(toggleButton, popupOpenClass);

        /* Exempt news & events page article dropdowns and music
           page mini player popups from closing on outside events */
        if (!(toggleButton.classList.contains('article-toggle-btn') || toggleButton.classList.contains('mini-player-btn'))) {
            handlePopupExternalEvent(toggleButton, togglerActiveClass, popupOpenClass);
        }
    // Pass 300ms time interval to throttleEvent function
    }, 300));
}

// External events

/**
 * Get passed-in toggle button's associated popup element.
 * 
 * Check popup for passed-in class name to determine if visible.
 * 
 * If popup visible, add event listeners to window object for click,
 * touch and focus events outside popup and toggle button. If
 * detected: hide popup; pass toggle button and 'popup open' class
 * name to handlePopupAria function; remove 'active' class from
 * toggle button.
 * 
 * Remove event listeners from window. If appropriate, set focus to
 * toggle button.
 * 
 * @param {HTMLElement} toggleButton - Button controlling popup element to be handled.
 * @param {string} togglerActiveClass - Class name denoting toggle button active (popup visible).
 * @param {string} popupOpenClass - Class name denoting popup element visible.
 */
function handlePopupExternalEvent(toggleButton, togglerActiveClass, popupOpenClass) {
    const popupId = toggleButton.getAttribute('aria-controls');
    const popup = document.querySelector(`#${popupId}`);
    // Boolean variable to indicate keyboard tab key navigation
    let tabKeyNavigation = false;

    // Handler function for event listeners
    const close = e => {
        if (!popup.contains(e.target) && !toggleButton.contains(e.target)) {
            popup.classList.remove(popupOpenClass);
            handlePopupAria(toggleButton, popupOpenClass);
            toggleButton.classList.remove(togglerActiveClass);
        } else return;
        
        window.removeEventListener('click', close);
        window.removeEventListener('touchstart', close);
        window.removeEventListener('focusin', close);
        window.removeEventListener('keydown', detectTabbing);

        if (tabKeyNavigation) {
            toggleButton.focus();
        }
    }

    // Event listeners
    if (popup.classList.contains(popupOpenClass)) {
        window.addEventListener('click', close);
        /* Needed for iOS Safari as click events won't bubble up to
           window object */
        window.addEventListener('touchstart', close);
        // Needed for keyboard navigation (tabbing out of popup)
        window.addEventListener('focusin', close);
        /* Listener to detect tab key navigation & set value of
           boolean variable */
        window.addEventListener('keydown', detectTabbing = e => {
            if (e.key === 'Tab' || ((e.keyCode || e.which) === 9)) {
                let tab = true;

                if (tab || (e.shiftKey && tab)) {
                    tabKeyNavigation = true;
                }
            } else {
                tabKeyNavigation = false;
            }
        });
    }
}

// --------------- Popups & dropdowns functions end

// --------------------- Music page functions

/**
 * Get passed-in popup's toggle button and set it's 'active' class
 * name based on music player it pertains to.
 * 
 * Pass toggle button and class name(s) to handlePopup and
 * handlePopupAria functions.
 * 
 * @param {HTMLElement} player - Element containing or consisting of music player popup to be handled.
 */
function handleMusicPlayerPopup(player) {
    const playerToggleButton = player.querySelector('.menu-toggle-btn');
    const buttonActiveClass = 'menu-toggle-btn-active';
    let playerOpenClass;
    if (player.classList.contains('mini-player-container')) {
        playerOpenClass = 'mini-player-open';
    }
    if (player.id === 're-player') {
        playerOpenClass = 're-player-open';
    }

    handlePopupAria(playerToggleButton, playerOpenClass);
    handlePopup(playerToggleButton, buttonActiveClass, playerOpenClass);
}

// ------------------- Music page functions end

// ----------------- News / Events page functions

/**
 * Get article element's associated toggle button. Set names of
 * toggle button's 'active' class and its dropdown's 'article open'
 * class.
 * 
 * Pass toggle button and both class names to handlePopup function.
 * 
 * @param {HTMLElement} article - Individual news item or gig listng article element.
 */
function handleArticleDropdown(article) {
    const button = article.querySelector('.article-toggle-btn');
    const buttonActiveClass = 'article-toggle-btn-active';
    const articleOpenClass = 'article-open';

    if (button) {
        handlePopup(button, buttonActiveClass, articleOpenClass);
    }
}

/**
 * Get article content container element using toggle button's
 * 'aria-controls' attribute. Set toggle button to 'inactive' state.
 * 
 * Add 'closing' animation class name to content container and when
 * CSS animation completed: close content dropdown; pass toggle
 * button and 'article open' class name to handlePopupAria function;
 * remove 'closing' animation class name from content container;
 * ensure article heading remains within viewport after closing.
 * 
 * @param {HTMLElement} toggleButton - Button controlling article content to be handled.
 * @param {string} togglerActiveClass - Class name denoting toggle button active (article content visible).
 * @param {string} popupOpenClass - Class name denoting artice content visible. 
 */
function handleCollapseArticle(toggleButton, buttonActiveClass, articleOpenClass) {
    const bodyId = toggleButton.getAttribute('aria-controls');
    const body = document.querySelector(`#${bodyId}`);

    toggleButton.classList.remove(buttonActiveClass);
    body.classList.add('article-closing');

    body.addEventListener('animationend', () => {
        body.classList.remove(articleOpenClass);
        handlePopupAria (toggleButton, articleOpenClass)
        body.classList.remove('article-closing');

        /* To account for sticky header jumping up out of viewport
           when article closed, if it's scrolled past top of
           viewport, scroll it back down (combined with CSS
           scroll-margin-top on toggle button to set position
           just below main header) */
        if (toggleButton.getBoundingClientRect().top < 0) {
            window.location.href = `#${toggleButton.id}`;
        }       
    }, {once: true});
    
}

// --------------- News / Events page functions end

// ------------------- Miscellaneous functions

// Throttling

/**
 * When called on an event listener's handler function, returns a
 * new event listener after a passed-in time interval, thus
 * preventing further events from firing until interval has elapsed.
 * 
 * @param {function} handler - Event handler function to be throttled.
 * @param {number} interval - Time allowed in ms between events firing. 
 * @returns {function} throttledFunction - Handler function with throttling interval applied.
 */
 function throttleEvent(handler, interval) {
    /* Boolean to control when time interval has passed.
       Set to true so that handler can be called first time. */
    let enableEvent = true;

    /* Nested function to preserve throttleEvent function's 'this'
       (execution) context and apply it to passed-in handler
       (callback) function.
       Uses rest parameter syntax (...) to pack handler's arguments
       into an array which can be read by 'apply' method. */
    return function throttledFunction(...args) {
        /* If time interval not up, exit function without calling
           handler */
        if (!enableEvent) return;
        // Prevent handler being called until interval has passed
        enableEvent = false;
        /* Apply throttling to handler and return throttled version
           with any arguments */
        handler.apply(this, args);
        // Set control flag to true after passed-in interval
        setTimeout(() => enableEvent = true, interval);
    }
}

// ----------------- Miscellaneous functions end