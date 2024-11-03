//app/components/Login.js
'use client';
import React, { useState } from 'react';
import { MdAssignment } from 'react-icons/md';
import HomeScreen from './HomeScreen'; // Import the HomeScreen component
import Admin from './Admin';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
    const [userID, setUserID] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (!validateEmail(newEmail)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        try {   
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                setIsLoggedIn(true); // Set login state to true
                setUserID(data.userID);
            } else {
                setLoginError(data.error || 'Login failed');
            }
        } catch (error) {
            setLoginError('An error occurred during login.');
        }
    };

    // If logged in, render the HomeScreen component
    if (isLoggedIn && email!='admin@gmail.com') {
        return <HomeScreen userEmail={email} UserID={userID} />;
    }
    if (isLoggedIn && email==='admin@gmail.com') {
        return <Admin />;
    }

    return (
        <div>
            <section className="bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-white">
                        <MdAssignment className="w-8 h-8 mr-2" />
                        Assessment Buddy
                    </a>
                    <div className="w-full bg-gray-800 rounded-lg shadow border-gray-700 md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                                Sign in
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className="bg-gray-700 border-gray-600 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400"
                                        placeholder="example@domain.com"
                                        required
                                    />
                                    {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••"
                                        className="bg-gray-700 border-gray-600 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400"
                                        required
                                    />
                                </div>
                                {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}
                                <button
                                    type="submit"
                                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Sign in
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;


// 'use client'
// import React, { useState } from 'react';
// import { MdAssignment } from 'react-icons/md';

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [emailError, setEmailError] = useState('');
//     const [loginError, setLoginError] = useState('');

//     const validateEmail = (email) => {
//         const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
//         return emailRegex.test(email);
//     };

//     const handleEmailChange = (e) => {
//         const newEmail = e.target.value;
//         setEmail(newEmail);
//         if (!validateEmail(newEmail)) {
//             setEmailError('Please enter a valid email address');
//         } else {
//             setEmailError(''); 
//         }
//     };

//     const handlePasswordChange = (e) => {
//         setPassword(e.target.value);
//     };


//     return (
//         <div>
//             <section className="bg-gray-900">
//                 <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
//                     <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-white">
//                         <MdAssignment className="w-8 h-8 mr-2" />
//                         Assessment Buddy
//                     </a>
//                     <div className="w-full bg-gray-800 rounded-lg shadow border-gray-700 md:mt-0 sm:max-w-md xl:p-0">
//                         <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//                             <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
//                                 Sign in
//                             </h1>
//                             <form className="space-y-4 md:space-y-6">
//                                 <div>
//                                     <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         id="email"
//                                         value={email}
//                                         onChange={handleEmailChange}
//                                         className="bg-gray-700 border-gray-600 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400"
//                                         placeholder="example@domain.com"
//                                         required
//                                     />
//                                     {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
//                                     <input
//                                         type="password"
//                                         name="password"
//                                         id="password"
//                                         value={password}
//                                         onChange={handlePasswordChange}
//                                         placeholder="••••••••"
//                                         className="bg-gray-700 border-gray-600 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400"
//                                         required
//                                     />
//                                 </div>
//                                 {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}
//                                 <button
//                                     type="submit"
//                                     className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
//                                 >
//                                     Sign in
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// };

// export default Login;

