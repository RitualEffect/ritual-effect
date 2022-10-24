// Wait for the DOM to finish loading before running

document.addEventListener('DOMContentLoaded', function() {

    // -------------------- Main menu

    // Get main menu from the DOM and pass to handler functions

    const menu = document.querySelector('#main-menu');

    // Set initial aria properties based on screen size

    handleMainMenuAria (menu);

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
    const menuItems = menu.querySelector('#main-menu-items');
    const links = menuItems.querySelectorAll('a');

    if (window.innerWidth <= 800) {
        handleDropdownMenuAria(button, menuItems, links, 'responsive-menu-open');
    }
    // console.log(menuItems);
       
    window.addEventListener('resize', () => {
        if (window.innerWidth > 800) {
            button.setAttribute('aria-expanded', false);
            menuItems.removeAttribute('aria-hidden');
            for (let link of links) {
                link.removeAttribute('tabindex');
            }
        } else {
            handleDropdownMenuAria(button, menuItems, links, 'responsive-menu-open');
        }
        // console.log(menuItems);
    });
}

// ----------------- General aria properties

// Dropdown menus

/**
 * Check passed-in container element for passed-in class name
 * indicating whether or not container is visible.
 * 
 * If class name not present, (container hidden), set passed-in
 * toggle button's aria-expanded attribute to false, set container's
 * aria-hidden attribute to true and set each passed-in element's
 * tabindex attribute to -1, thereby rendering them non-focusable.
 * 
 * If class name present, (container visible), set toggle button's
 * aria-expanded attribute to true, set container's aria-hidden
 * attribute to false and remove elements' tabindex attributes so
 * that elements become focusable.
 * 
 * @param {HTMLElement} toggler - Element controlling hidden/visible state of container element.
 * @param {HTMLElement} menu - Container element of items to be operated on.
 * @param {HTMLCollection} elements - List of focusable elements whose focusable state is to be changed.
 * @param {string} menuOpenClass - Class name to be checked for on menu element.
 */
function handleDropdownMenuAria (toggler, menu, elements, menuOpenClass) {
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