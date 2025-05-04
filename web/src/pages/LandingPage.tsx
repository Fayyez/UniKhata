import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface UserInfo {
    id: string;
    email: string;
    name: string;
    picture?: string;
}

const LandingPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (accessToken && refreshToken) {
            // Store tokens in localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // Set default authorization header
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            // Fetch user information
            const fetchUserInfo = async () => {
                try {
                    const response = await axios.get('http://localhost:4000/api/auth/user-info');
                    setUserInfo(response.data);
                } catch (err) {
                    setError('Failed to fetch user information');
                    console.error(err);
                }
            };

            fetchUserInfo();
        } else {
            setError('No tokens found in URL');
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-700">{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    if (!userInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Welcome, {userInfo.name}!</h2>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center space-x-4">
                            {userInfo.picture && (
                                <img
                                    src={userInfo.picture}
                                    alt="Profile"
                                    className="h-16 w-16 rounded-full"
                                />
                            )}
                            <div>
                                <p className="text-gray-600">Email: {userInfo.email}</p>
                                <p className="text-gray-600">User ID: {userInfo.id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900">Your Tokens</h3>
                        <div className="mt-4 space-y-2">
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm text-gray-600">Access Token:</p>
                                <p className="text-xs text-gray-500 break-all">
                                    {localStorage.getItem('accessToken')}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm text-gray-600">Refresh Token:</p>
                                <p className="text-xs text-gray-500 break-all">
                                    {localStorage.getItem('refreshToken')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;