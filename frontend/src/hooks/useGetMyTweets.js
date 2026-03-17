import axios from "axios";
import { POST_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import useTweetStore from '../store/useTweetStore';

const useGetMyTweets = () => {
    const refresh = useTweetStore((state) => state.refresh);
    const isActive = useTweetStore((state) => state.isActive);
    const setAllTweets = useTweetStore((state) => state.setAllTweets);

    const fetchFeed = async () => {
        try {
            const res = await axios.get(`${POST_API_END_POINT}/feed`, {
                withCredentials: true
            });
            setAllTweets(res.data.payload);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchAllPosts = async () => {
        try {
            const res = await axios.get(`${POST_API_END_POINT}/all`, {
                withCredentials: true
            });
            setAllTweets(res.data.payload);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (isActive) {
            fetchAllPosts(); // For you tab - all posts
        } else {
            fetchFeed(); // Following tab - feed from followed users
        }
        // eslint-disable-next-line
    }, [isActive, refresh]);
};

export default useGetMyTweets;