// Wait for the DOM to finish loading before running

document.addEventListener('DOMContentLoaded', function() {

    // -------------------- Main menu

    // Get main menu from the DOM and pass to handler functions

    const menu = document.querySelector('#main-menu');

    // Set initial aria properties based on screen size

    handleMainMenuAria (menu);

    // Add click event listeners

    handleMainMenuClicks(menu);

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
    const button = menu.querySelector('#main-menu-button')
    const dropdown = menu.querySelector('#main-menu-items');
    const links = dropdown.querySelectorAll('a');

    if (window.innerWidth <= 800) {
        handleDropdownMenuAria(button, dropdown, 'responsive-menu-open');
    }
       
    window.addEventListener('resize', () => {
        if (window.innerWidth > 800) {
            button.setAttribute('aria-expanded', false);
            dropdown.removeAttribute('aria-hidden');
            for (let link of links) {
                link.removeAttribute('tabindex');
            }
        } else {
            handleDropdownMenuAria(button, dropdown, 'responsive-menu-open');
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
 * handleDropdownMenuAria function and toggle
 * menu-toggle-button-open class on toggle button.
 * 
 * @param {HTMLElement} menu - Main header navigation menu nav element. 
 */
function handleMainMenuClicks(menu) {
    const button = menu.querySelector('#main-menu-button');
    const dropdown = menu.querySelector('#main-menu-items');
    // Throttling variable to limit click events
    let enableClick = true;

    button.addEventListener('click', e => {
        // Only run if throttling allows
        if (!enableClick) return;
        enableClick = false;

        // Only target entire button element
        let targetButton = e.target.closest('button');
        if (targetButton) {
            dropdown.classList.toggle('responsive-menu-open');
            handleDropdownMenuAria(button, dropdown, 'responsive-menu-open');
            button.classList.toggle('menu-toggle-button-open');
        } else return;

        /* Only register click events every 300ms
           (i.e. limit user to max 3 clicks/second) */
        setTimeout(function() {
            enableClick = true;
        }, 300);
    });
}

// ----------------- General aria properties

// Dropdown menus

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
 * @param {HTMLElement} toggler - Element controlling hidden/visible state of container element.
 * @param {HTMLElement} menu - Container element of items to be operated on.
 * @param {string} menuOpenClass - Class name to be checked for on menu element.
 */
function handleDropdownMenuAria (toggler, menu, menuOpenClass) {
    let elements = menu.querySelectorAll('a', 'audio', 'iframe');
    
    if (!menu.classList.contains(`${menuOpenClass}`)) {
        toggler.setAttribute('aria-expanded', false);
        menu.setAttribute('aria-hidden', true);
        for (let el of elements) {
            el.setAttribute('tabindex', '-1');
        }
    } else {
        toggler.setAttribute('aria-expanded', true);
        menu.setAttribute('aria-hidden', false);
        for (let el of elements) {
            el.removeAttribute('tabindex');
        }
    }
}