const BROWSER = typeof browser === "undefined" ? chrome : browser;
const POPUP_URL = "https://tasks.google.com/embed/?origin=https://calendar.google.com&fullWidth=1";
const DOMAIN = "https://tasks.google.com";
const POPUP_WIDTH = 380;

/**
 * Get the current popup window id matching the domain
 *
 * @param {string} domain The domain to match in the popup window url
 * @returns {Promise} A promise that resolves when the popup window id is found
 * @resolves {number|null} The popup window id or null if not found
 */
function getOpenWindowId(domain) {
    return new Promise(function (resolve) {
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
 * @rejects {Error} An error if the popup window fails to open or create
 */
function openOrCreatePopup(url, domain) {
    return new Promise(function (resolve, reject) {
        getOpenWindowId(domain).then((windowId) => {
            if (windowId === null) {
                openPopup(url)
                    .then((popupWindow) => resolve(popupWindow))
                    .catch((error) => reject(error));
                return;
            }
            BROWSER.windows.update(windowId, { focused: true }, function (popupWindow) {
                if (BROWSER.runtime.lastError) {
                    // popup window doesn't exist anymore, create a new one
                    openPopup(url)
                        .then((popupWindow) => resolve(popupWindow))
                        .catch((error) => reject(error));
                } else {
                    resolve(popupWindow);
                }
            });
        });
    });
}

document.addEventListener(
    "DOMContentLoaded",
    function () {
        openOrCreatePopup(POPUP_URL, DOMAIN).then(() => window.close());
    },
    false
);
