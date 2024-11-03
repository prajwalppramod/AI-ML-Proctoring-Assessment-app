'use client';
import React, { useState, useEffect } from 'react';
import { MdAssignment } from 'react-icons/md';
import Login from './Login';
import FullscreenHandler from './FullScreenHandler';


const HomeScreen = ({ userEmail, UserID }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [startedCamera, setStartedCamera] = useState(false);
    const [userName, setUserName] = useState('');


    useEffect(() => {
        if (userEmail) {
            const name = userEmail.split('.')[0];
            if (name) {
                setUserName(name.charAt(0).toUpperCase() + name.slice(1)); // Capitalize the first letter
            }
        }
    }, [userEmail]);

    const handleLogout = async (e) => {
        e.preventDefault();
        setIsLoggedIn(false);
    };
    const handleTaketest = async (e) => {
        e.preventDefault();
        setStartedCamera(true);
        
    };

    if (!isLoggedIn) {
        return <Login />;
    }
    if (startedCamera) {
        return <FullscreenHandler userID={UserID}/>
    }

    return (
        <div>
            <section className="bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a className="flex items-center mb-6 text-2xl font-semibold text-white">
                        <MdAssignment className="w-8 h-8 mr-2" />
                        Hi {userName}, You have logged into Assessment Buddy
                    </a>
                    <div className='flex space-x-5'><form className="space-y-4 md:space-y-6" onSubmit={handleTaketest}>
                        <button
                            type="submit"
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Take Test
                        </button>
                    </form>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleLogout}>
                            <button
                                type="submit"
                                className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomeScreen;
