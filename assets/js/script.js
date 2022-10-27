// Wait for the DOM to finish loading before running

document.addEventListener('DOMContentLoaded', function() {

    // -------------------- Main menu

    // Get main menu from the DOM and pass to handler functions

    const menu = document.querySelector('#main-menu');

    // Set initial aria properties based on screen size

    handleMainMenuAria (menu);

    // Add click event listeners

    handleMainMenuClicks(menu);

    // ---------------------- Footer

    // Set current year in copyright statement

    document.querySelector('#copyright-year').innerHTML = new Date().getFullYear();

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
    const menuOpenClass = 'responsive-menu-open';
    const links = dropdown.querySelectorAll('a');

    if (window.innerWidth <= 800) {
        handlePopupAria(button, dropdown, menuOpenClass);
    }
       
    window.addEventListener('resize', () => {
        if (window.innerWidth > 800) {
            button.setAttribute('aria-expanded', false);
            dropdown.removeAttribute('aria-hidden');
            for (let link of links) {
                link.removeAttribute('tabindex');
            }
        } else {
            handlePopupAria(button, dropdown, menuOpenClass);
        }
    });
}

/**
 * Get main header navigation menu toggle button and dropdown menu.
 * 
 * Add 'click' event listener to toggle button, limiting click
 * events to max 3 per second.
 * 
 * On click, toggle responsive-menu-open class on dropdown menu,
 * pass toggle button, dropdown menu and class name to
 * handlePopupAria function and toggle menu-toggle-btn-active class
 * on toggle button.
 * 
 * Pass dropdown menu and responsive-menu-open &
 * menu-toggle-btn-active class names to handlePopupExternalEvent
 * function.
 * 
 * @param {HTMLElement} menu - Main header navigation menu nav element. 
 */
function handleMainMenuClicks(menu) {
    const button = menu.querySelector('#main-menu-btn');
    const dropdown = menu.querySelector('#main-menu-items');
    const menuOpenClass = 'responsive-menu-open';
    const buttonActiveClass = 'menu-toggle-btn-active';
    // Throttling variable to limit click events
    let enableClick = true;

    button.addEventListener('click', e => {
        // Only run if throttling allows
        if (!enableClick) return;
        enableClick = false;

        // Only target entire button element
        let targetButton = e.target.closest('button');
        if (targetButton) {
            dropdown.classList.toggle(menuOpenClass);
            handlePopupAria(button, dropdown, menuOpenClass);
            button.classList.toggle(buttonActiveClass);
        } else return;

        /* Only register click events every 300ms
           (i.e. limit user to max 3 clicks/second) */
        setTimeout(function() {
            enableClick = true;
        }, 300);

        handlePopupExternalEvent(dropdown, menuOpenClass, buttonActiveClass);
    });
}

// ------------------- Main menu functions end

// -------------------- Popup/dropdown menus

// Aria properties

/**
 * Get passed-in container element's focusable child elements.
 * 
 * Check container element for passed-in class name indicating
 * whether or not container is visible.
 * 
 * If class name not present, (container hidden), set passed-in
 * toggle button's aria-expanded attribute to false, set container's
 * aria-hidden attribute to true and set each focusable element's
 * tabindex attribute to -1, thereby rendering them non-focusable.
 * 
 * If class name present, (container visible), set toggle button's
 * aria-expanded attribute to true, set container's aria-hidden
 * attribute to false and remove each focusable elements' tabindex
 * attributes so that they become focusable again.
 * 
 * @param {HTMLElement} toggleButton - Element toggling hidden/visible state of container element.
 * @param {HTMLElement} popup - Container element of items to be operated on.
 * @param {string} popupOpenClass - Class name to be checked for on container element.
 */
function handlePopupAria (toggleButton, popup, popupOpenClass) {
    const elements = popup.querySelectorAll('a', 'audio', 'iframe');
    
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
    }
}

// External events

/**
 * Get element containing both popup element and toggle button.
 * 
 * Get toggle button from container.
 * 
 * If popup visible, add event listeners to window object for click,
 * touch and focus events outside popup/button container. If 
 * detected: hide popup; pass toggle button, popup and 'popup open'
 * class name to handlePopupAria function; remove 'active' class
 * from toggle button.
 * 
 * Remove event listeners from window. If appropriate, set focus to
 * toggle button.
 * 
 * @param {HTMLElement} popup - Popup element to be handled.
 * @param {string} popupOpenClass - Class name denoting popup element visible.
 * @param {string} togglerActiveClass - Class name denoting toggle button active (popup visible). 
 */
function handlePopupExternalEvent(popup, popupOpenClass, togglerActiveClass) {
    const container = popup.closest('.popup-container');
    const toggleButton = container.querySelector('.toggle-btn');
    // Handler function for event listeners
    const close = e => {
        if (!container.contains(e.target)) {
            popup.classList.remove(popupOpenClass);
            handlePopupAria(toggleButton, popup, popupOpenClass);
            toggleButton.classList.remove(togglerActiveClass);
        } else return;
        
        window.removeEventListener('click', close);
        window.removeEventListener('touchstart', close);
        window.removeEventListener('focusin', close);
        toggleButton.focus();
    }

    if (popup.classList.contains(popupOpenClass)) {
        window.addEventListener('click', close);
        /* Needed for iOS Safari as click events won't bubble up to
           window object */
        window.addEventListener('touchstart', close);
        // Needed for keyboard navigation (tabbing out)
        window.addEventListener('focusin', close);
    }
}

// ----------- Popup/dropdown menu functions end