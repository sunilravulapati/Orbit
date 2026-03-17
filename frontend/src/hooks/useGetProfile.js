import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import useUserStore from '../store/useUserStore';

const useGetProfile = (id) => {
    const setProfile = useUserStore((state) => state.setProfile);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // fetch all users and find the one matching id
                const res = await axios.get(`${USER_API_END_POINT}/users`, {
                    withCredentials: true
                });
                const foundUser = res.data.payload?.find(u => u._id === id);
                if (foundUser) setProfile(foundUser);
            } catch (error) {
                console.log(error);
            }
        }
        if (id) fetchProfile();
        // eslint-disable-next-line
    }, [id]);
};

export default useGetProfile;