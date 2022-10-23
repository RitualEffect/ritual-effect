// Wait for the DOM to finish loading before running

document.addEventListener('DOMContentLoaded', function() {

    // Main menu

    // Get the main menu from the DOM

    const menu = document.querySelector('#main-menu');

    /* Get the main menu items list and set it's initial
       aria and focus properties based on the width of the
       screen (i.e. if it's in dropdown menu mode) */
    
    const menuItems = menu.querySelector('#main-menu-items');
    const links = menuItems.querySelectorAll('a');

    if (window.innerWidth <= 800) {
        handleDropdownMenuAria(menuItems, links, 'responsive-menu-open');
    }
    // console.log(menuItems);

    /* Add event listener to set aria and focus properties of main
       menu items if screen is resized (e.g. mobile device flipped
       between portrait & landscape mode) */
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 800) {
            menuItems.removeAttribute('aria-hidden');
            for (let link of links) {
                link.removeAttribute('tabindex');
            }
        } else {
            handleDropdownMenuAria(menuItems, links, 'responsive-menu-open');
        }
        // console.log(menuItems);
    })

});

// Handler functions

/**
 * Check passed-in container element for passed-in class name
 * indicating whether or not container is visible.
 * 
 * If class name not present, (container hidden), set container's
 * aria-hidden attribute to true and set each passed-in element's
 * tabindex attribute to -1, thereby rendering them non-focusable.
 * 
 * If class name present, (container visible), set container's
 * aria-hidden attribute to false and remove elements' tabindex
 * attributes so that elements become focusable.
 * 
 * @param {HTMLElement} menu - Container element of items to be operated on.
 * @param {HTMLCollection} elements - List of focusable elements whose focusable state is to be changed.
 * @param {string} menuOpenClass - Class name to be checked for on menu element.
 */
function handleDropdownMenuAria (menu, elements, menuOpenClass) {
    if (!menu.classList.contains(`${menuOpenClass}`)) {
        menu.setAttribute('aria-hidden', true);
        for (let el of elements) {
            el.setAttribute('tabindex', '-1');
        }
    } else {
        menu.setAttribute('aria-hidden', false);
        for (let el of elements) {
            el.removeAttribute('tabindex');
        }
    }
}