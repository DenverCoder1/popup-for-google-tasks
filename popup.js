/**
 * Set a cookie for the current popup window ID
 *
 * @param {string} url The url for setting the cookie
 * @param {number} windowId The id of the popup window
 * @returns {Promise} A promise that resolves when the cookie is set
 */
function setWindowIdCookie(url, windowId) {
    return new Promise(function (resolve, reject) {
        chrome.cookies.set(
            {
                url,
                name: "windowId",
                value: windowId.toString(),
            },
            function (cookie) {
                if (cookie) {
                    resolve(cookie);
                } else {
                    reject(new Error("Failed to set windowId cookie"));
                }
            }
        );
    });
}

/**
 * Get the current popup window id from the cookie
 *
 * @param {string} url The url for getting the cookie
 * @returns {Promise} A promise that resolves when the cookie is retrieved
 * @resolves {number|null} Window ID or null if not found
 */
function getWindowIdCookie(url) {
    return new Promise(function (resolve) {
        chrome.cookies.get(
            {
                url,
                name: "windowId",
            },
            function (cookie) {
                resolve(cookie ? parseInt(cookie.value) : null);
            }
        );
    });
}

/**
 * Open a new popup window
 *
 * @param {string} url The url for opening the popup window
 * @returns {Promise} A promise that resolves when the popup window is created
 * @resolves {object} The popup window object
 * @rejects {Error} An error if the popup window fails to open
 */
function openPopup(url) {
    return new Promise(function (resolve, reject) {
        const POPUP_WIDTH = 380;
        chrome.windows.create(
            {
                url,
                type: "popup",
                width: POPUP_WIDTH,
                height: screen.height,
                left: screen.width - POPUP_WIDTH,
                top: 0,
                focused: true,
            },
            function (popupWindow) {
                setWindowIdCookie(url, popupWindow.id)
                    .then(() => resolve(popupWindow))
                    .catch((error) => reject(error));
            }
        );
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
function openOrCreatePopup(url) {
    return new Promise(function (resolve, reject) {
        getWindowIdCookie(url).then((windowId) => {
            if (windowId === null) {
                openPopup(url)
                    .then((popupWindow) => resolve(popupWindow))
                    .catch((error) => reject(error));
                return;
            }
            chrome.windows.update(windowId, { focused: true }, function (popupWindow) {
                if (chrome.runtime.lastError) {
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
        const url = "https://tasks.google.com/embed/?origin=https://calendar.google.com&fullWidth=1";
        openOrCreatePopup(url).then(() => window.close());
    },
    false
);
