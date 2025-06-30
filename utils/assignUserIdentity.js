const assignUserIdentity = (watchHistory, data = {}) => {
    if (watchHistory.user_id) {
        data.user_id = Number(watchHistory.user_id);
    } else if (watchHistory.guest_id) {
        data.guest_id = String(watchHistory.guest_id).trim();
    } else {
        throw new Error("user_id or guest_id must be provided.");
    }

    return data;
};

const getWatchHistorySelector = (watchHistory) => {
    if (watchHistory.user_id) {
        return {
            user_id_video_id: {
                user_id: Number(watchHistory.user_id),
                video_id: Number(watchHistory.video_id),
            },
        };
    } else if (watchHistory.guest_id) {
        return {
            guest_id_video_id: {
                guest_id: String(watchHistory.guest_id).trim(),
                video_id: Number(watchHistory.video_id),
            },
        };
    } else {
        throw new Error("user_id or guest_id must be provided.");
    }
};

module.exports = { assignUserIdentity, getWatchHistorySelector };


module.exports = assignUserIdentity;
