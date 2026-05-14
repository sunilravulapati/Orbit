export const BASE_URL = import.meta.env.VITE_API_URL || "https://orbit-zaak.onrender.com";

export const USER_API_END_POINT = `${BASE_URL}/user-api`;
export const COMMON_API_END_POINT = `${BASE_URL}/common-api`;
export const POST_API_END_POINT = `${BASE_URL}/post-api`;
export const ADMIN_API_END_POINT = `${BASE_URL}/admin-api`;

export const timeSince = (timestamp) => {
    let time = Date.parse(timestamp);
    let now = Date.now();
    let secondsPast = (now - time) / 1000;
    let suffix = 'ago';

    let intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (let i in intervals) {
        let interval = intervals[i];
        if (secondsPast >= interval) {
            let count = Math.floor(secondsPast / interval);
            return `${count} ${i}${count > 1 ? 's' : ''} ${suffix}`;
        }
    }
};