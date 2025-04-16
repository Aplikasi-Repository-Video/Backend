const assignUserIdentity = (watchHistory, data = {}) => {
    if (watchHistory.user_id) {
        data.user_id = +watchHistory.user_id;
    } else if (watchHistory.guest_id) {
        data.guest_id = watchHistory.guest_id;
    } else {
        throw new Error("user_id or guest_id must be provided.");
    }

    return data;
};

module.exports = assignUserIdentity;
