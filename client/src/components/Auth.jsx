import React, { useState } from 'react'
import axiosInstance from '../config/axios';
import showToast from '../helpers/Toast';
import { auth, googleProvider, signInWithPopup } from '../config/firebaseConfig';
import Loader from './Loader';
import useLocalStorage from '../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';

function Auth({ isRegistering, setIsRegistering, setShowModal }) {
    const navigate = useNavigate();
    const [googleLoading, setGoogleLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [_, setLocalUser] = useLocalStorage("user", null);
    const [_1, setTokenUser] = useLocalStorage("access_token", null);
    const [user, setUser] = useState({
        email: "",
        password: '',
        photoUrl: '',
        name: '',
    });

    const handelChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })
    }


    // Handle authnentication
    const authentication = async (type, authRoute, user) => {
        return await axiosInstance.post(`/auth/${authRoute}`, { ...user, authentication_type: type })

    }

    // @handle redirect to dashboard
    const handleRedirect = async (resp) => {
        if (resp?.status == 200) {
            const { data: { user, token } } = resp.data;
            setLocalUser(JSON.stringify(user));
            setTokenUser(JSON.stringify(token));
            setTimeout(() => {
                setShowModal(false);
            }, 300);
            // redirect to dashboard
            navigate("/dashboard", { replace: true });
        } else {
            showToast("something went wrong", "error");
        }
    }

    const handleSubmit = async (e, type) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { email, password } = user;
            if (!email || !password) {
                showToast("Please fill all the fields", "warning");
                return;
            }
            const resp = await authentication("email", type, type === 'login' ? { email, password, } : { ...user, role: "user" });
            const messageType = type == "login" ? "login" : "created";
            showToast(`user ${messageType} successfully`, "success");
            handleRedirect(resp);
            setIsRegistering(false)
        } catch (error) {
            showToast(error, "error");
        }
        finally {
            setIsLoading(false);
        }
    }



    // Google authentication
    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const resp = await authentication("google", "login", {
                email: user.email,
                name: user.displayName,
                role: "user"
            });
            await handleRedirect(resp);
        } catch (error) {
            showToast(error?.message, "error");
        } finally {
            setGoogleLoading(false);
        }
    };
    return (
        <form className="space-y-4" onSubmit={(e) => handleSubmit(e, isRegistering ? "register" : "login")}>
            {
                isRegistering && <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={(e) => handelChange(e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
            }
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={(e) => handelChange(e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={(e) => handelChange(e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                {isRegistering ? 'Create Account' : 'Sign In'} &nbsp;{isLoading && <Loader color="white" width="20" />}
            </button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
            </div>

            <button
                type="button"
                onClick={() => handleGoogleSignIn()}
                disabled={googleLoading}
                className="w-full py-2 px-4 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:cursor-not-allowed"
            >
                <div className="flex items-center justify-center" >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google &nbsp;{googleLoading && <Loader width={20} height={20} />}
                </div>
            </button>

            <div className="text-sm text-center">
                <span className="text-gray-600">
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                </span>
                <button
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="ml-1 text-blue-600 hover:text-blue-700"
                >
                    {true ? 'Sign in' : 'Create one'}
                </button>
            </div>
        </form>
    )
}

export default Auth
