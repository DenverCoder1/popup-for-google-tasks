const BROWSER = typeof browser === "undefined" ? chrome : browser;
const POPUP_URL = "https://tasks.google.com/embed/?origin=https://calendar.google.com&fullWidth=1";
const POPUP_WIDTH = 380;

/**
 * Get the current popup window id matching the domain
 *
 * @param {string} url The url with the domain to match in the popup window url
 * @returns {Promise} A promise that resolves when the popup window id is found
 * @resolves {number|null} The popup window id or null if not found
 */
function getOpenWindowId(url) {
    return new Promise(function (resolve) {
        const domain = new URL(url).hostname;
        BROWSER.windows.getAll({ populate: true, windowTypes: ["popup"] }).then((windows) => {
            let windowId = null;
            windows.forEach((window) => {
                window.tabs.forEach((tab) => {
                    if (tab.url.includes(domain) || tab.url.includes(encodeURIComponent(domain))) {
                        windowId = window.id;
                    }
                });
            });
            resolve(windowId);
        });
    });
}

/**
 * Open a new popup window
 *
 * @param {string} url The url for opening the popup window
 * @returns {Promise} A promise that resolves when the popup window is created
 * @resolves {object} The popup window object
 */
function openPopup(url) {
    return new Promise(function (resolve) {
        BROWSER.windows
            .create({
                url,
                type: "popup",
                width: POPUP_WIDTH,
                height: screen.height,
                left: screen.width - POPUP_WIDTH,
                top: 0,
            })
            .then((popupWindow) => resolve(popupWindow));
    });
}

/**
 * Open an existing popup window or create a new one if it doesn't exist
 *
 * @param {string} url The url for opening the popup window
 * @returns {Promise} A promise that resolves when the popup window is opened or created
 * @resolves {object} The popup window object
 */
function openOrCreatePopup(url) {
    return new Promise(function (resolve) {
        getOpenWindowId(url).then((windowId) => {
            if (windowId === null) {
                openPopup(url).then((popupWindow) => resolve(popupWindow));
                return;
            }
            BROWSER.windows.update(windowId, { focused: true }).then((popupWindow) => resolve(popupWindow));
        });
    });
}

document.addEventListener(
    "DOMContentLoaded",
    function () {
        openOrCreatePopup(POPUP_URL).then(() => window.close());
    },
    false
);
