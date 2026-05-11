import axios from "axios";
import { POST_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import useTweetStore from '../store/useTweetStore';

const useGetMyTweets = () => {
    const refresh = useTweetStore((state) => state.refresh);
    const isActive = useTweetStore((state) => state.isActive);
    const setAllTweets = useTweetStore((state) => state.setAllTweets);
    const tab = useTweetStore((state) => state.activeTab);

    const fetchFeed = async () => {
        try {
            const res = await axios.get(
                `${POST_API_END_POINT}/feed?tab=${tab || 'foryou'}`,
                { withCredentials: true }
            );
            setAllTweets(res.data.payload);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAllPosts = async () => {
        try {
            const res = await axios.get(`${POST_API_END_POINT}/all`, {
                withCredentials: true
            });
            setAllTweets(res.data.payload);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (isActive) {
            fetchAllPosts();
        } else {
            fetchFeed();
        }
    }, [isActive, refresh, tab]);
};

export default useGetMyTweets;