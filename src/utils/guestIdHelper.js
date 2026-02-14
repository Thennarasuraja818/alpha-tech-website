/**
 * Utility to manage guest user IDs for unauthenticated shopping carts.
 */

const GUEST_ID_KEY = 'guestUserId';

/**
 * Returns the current guestId from localStorage or generates a new one.
 * @returns {string} The guest user ID.
 */
export const getOrGenerateGuestId = () => {
    let guestId = localStorage.getItem(GUEST_ID_KEY);

    if (!guestId) {
        // Generate a random unique ID: "guest_" + random alphanumeric + timestamp
        guestId = 'guest_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
        localStorage.setItem(GUEST_ID_KEY, guestId);
    }

    return guestId;
};

/**
 * Removes the guestId from localStorage.
 */
export const clearGuestId = () => {
    localStorage.removeItem(GUEST_ID_KEY);
};

/**
 * Checks if a guestId exists.
 * @returns {boolean}
 */
export const hasGuestId = () => {
    return !!localStorage.getItem(GUEST_ID_KEY);
};
