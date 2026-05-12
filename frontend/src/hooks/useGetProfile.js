import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import useUserStore from '../store/useUserStore';
import useTweetStore from '../store/useTweetStore';

const useGetProfile = (id) => {
    const setProfile = useUserStore((state) => state.setProfile);
    // Re-fetch profile whenever follow/unfollow toggleRefresh fires
    // so follower/following counts update immediately
    const refresh = useTweetStore((state) => state.refresh);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/user/${id}`, {
                    withCredentials: true
                });
                const user = res.data?.payload;
                if (user) {
                    setProfile(user);
                } else {
                    console.warn(`useGetProfile: no user found with id ${id}`);
                }
            } catch (error) {
                console.error("useGetProfile error:", error);
            }
        };
        if (id) fetchProfile();
        // eslint-disable-next-line
    }, [id, refresh]); // ← refresh dependency so Follow updates the profile counts
};

export default useGetProfile;