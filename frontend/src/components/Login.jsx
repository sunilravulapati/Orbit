import React, { useState } from 'react';
import axios from "axios";
import { COMMON_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useUserStore from '../store/useUserStore';
import logo from '../assets/logodesign.png';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.setUser);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (isLogin) {
            try {
                const res = await axios.post(`${COMMON_API_END_POINT}/login`, { email, password }, {
                    headers: { 'Content-Type': "application/json" },
                    withCredentials: true
                });
                setUser(res?.data?.payload);
                if (res.data.message) {
                    navigate("/");
                    toast.success(res.data.message);
                }
            } catch (error) {
                toast.error(error?.response?.data?.error || "Something went wrong");
            }
        } else {
            try {
                const res = await axios.post(`${COMMON_API_END_POINT}/register`, {
                    firstName, username, email, password
                }, {
                    headers: { 'Content-Type': "application/json" },
                    withCredentials: true
                });
                if (res.data.message) {
                    setIsLogin(true);
                    toast.success(res.data.message);
                }
            } catch (error) {
                toast.error(error?.response?.data?.error || "Something went wrong");
            }
        }
    }

    const loginSignupHandler = () => setIsLogin(!isLogin);

    return (
        <div className='w-screen h-screen flex items-center justify-center bg-orbit-bg'>
            <div className='flex items-center justify-evenly w-[80%]'>
                <div className='flex flex-col items-center'>
                    <img width={"180px"} src={logo} alt="orbit-logo" />
                    <h2 className='text-orbit-teal font-semibold text-2xl mt-3'>Orbit</h2>
                </div>
                <div className='bg-orbit-card border border-orbit-border rounded-2xl p-8 w-96'>
                    <h1 className='font-bold text-2xl text-orbit-text mb-1'>
                        {isLogin ? "Welcome back" : "Join Orbit"}
                    </h1>
                    <p className='text-orbit-faint text-sm mb-6'>
                        {isLogin ? "Sign in to your account" : "Create your account"}
                    </p>
                    <form onSubmit={submitHandler} className='flex flex-col gap-3'>
                        {!isLogin && (
                            <>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder='First Name'
                                    className="bg-orbit-bg border border-orbit-border text-orbit-text placeholder-orbit-faint px-4 py-2.5 rounded-xl text-sm outline-none focus:border-orbit-teal transition-colors"
                                />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder='Username'
                                    className="bg-orbit-bg border border-orbit-border text-orbit-text placeholder-orbit-faint px-4 py-2.5 rounded-xl text-sm outline-none focus:border-orbit-teal transition-colors"
                                />
                            </>
                        )}
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email'
                            className="bg-orbit-bg border border-orbit-border text-orbit-text placeholder-orbit-faint px-4 py-2.5 rounded-xl text-sm outline-none focus:border-orbit-teal transition-colors"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                            className="bg-orbit-bg border border-orbit-border text-orbit-text placeholder-orbit-faint px-4 py-2.5 rounded-xl text-sm outline-none focus:border-orbit-teal transition-colors"
                        />
                        <button className='bg-orbit-teal-dark hover:bg-orbit-teal hover:text-orbit-bg text-white py-2.5 rounded-xl text-sm font-semibold transition-colors mt-2'>
                            {isLogin ? "Sign in" : "Create Account"}
                        </button>
                        <p className='text-orbit-faint text-sm text-center'>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <span onClick={loginSignupHandler} className='text-orbit-teal font-medium cursor-pointer ml-1'>
                                {isLogin ? "Sign up" : "Sign in"}
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;