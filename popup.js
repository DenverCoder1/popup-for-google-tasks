/**
 * set a cookie for the current popup window id
 *
 * @param {string} url
 * @param {number} windowId
 * @returns {Promise}
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
 * get the current popup window id from the cookie
 *
 * @param {string} url
 * @returns {Promise}
 * @resolves {number|null} windowId or null if not found
 */
function getWindowIdCookie(url) {
    return new Promise(function (resolve, reject) {
        chrome.cookies.get(
            {
                url,
                name: "windowId",
            },
            function (cookie) {
                if (cookie) {
                    resolve(parseInt(cookie.value));
                } else {
                    resolve(null);
                }
            }
        );
    });
}

/**
 * open a new popup window with Google Tasks
 */
function openPopup(url) {
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
            setWindowIdCookie(url, popupWindow.id).then(() => {
                // close the toolbar popup
                window.close();
            });
        }
    );
}

/**
 * open an existing popup window with Google Tasks
 * or create a new one if it doesn't exist
 */
function openOrCreatePopup(url) {
    getWindowIdCookie(url).then((windowId) => {
        if (windowId === null) {
            openPopup();
            return;
        }
        chrome.windows.update(windowId, { focused: true }, function (popupWindow) {
            if (chrome.runtime.lastError) {
                openPopup(url);
            } else {
                // close the toolbar popup
                window.close();
            }
        });
    });
}

document.addEventListener(
    "DOMContentLoaded",
    function () {
        const url = "https://tasks.google.com/embed/?origin=https://calendar.google.com&fullWidth=1";
        openOrCreatePopup(url);
    },
    false
);
