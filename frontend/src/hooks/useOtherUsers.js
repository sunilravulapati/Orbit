import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import useUserStore from '../store/useUserStore';

const useOtherUsers = () => {
    const user = useUserStore((state) => state.user);
    const setOtherUsers = useUserStore((state) => state.setOtherUsers);

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/users`, {
                    withCredentials: true
                });
                // filter out current logged in user
                const others = res.data.payload?.filter(u => u._id !== user?.userId);
                setOtherUsers(others);
            } catch (error) {
                console.log(error);
            }
        }
        fetchOtherUsers();
        // eslint-disable-next-line
    }, [user?.userId]);
};

export default useOtherUsers;