import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import md5 from 'js-md5';
import {
    doc,
    setDoc,
    collection,
    query,
    where,
    getDocs
} from "firebase/firestore";

// Ensure your firebase.js export is correct
import { db } from '../firebase';


const MyAccount = () => {
    const navigate = useNavigate();

    // --- UI States ---
    const [rotation, setRotation] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoginView, setIsLoginView] = useState(true);

    // --- Login States ---
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // --- Sign Up States ---
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const [signupUsername, setSignupUsername] = useState('');
    const [signupError, setSignupError] = useState('');


    // Effect for spinning donut on scroll (UI animation)
    useEffect(() => {
        const handleScroll = () => {
            setRotation(window.scrollY / 5);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // ===================================
    // === CUSTOM/FIRESTORE-ONLY LOGIC ===
    // ===================================

    const handleSignUp = async (e) => {
        e.preventDefault();
        setSignupError('');

        if (signupPassword !== signupConfirmPassword) {
            setSignupError("Passwords do not match.");
            return;
        }

        // ⭐ BEST PRACTICE: Normalize email for case-insensitivity and trimming
        const normalizedEmail = signupEmail.toLowerCase().trim();

        try {
            // Check if email already exists
            const usersRef = collection(db, "users");
            // Query using normalized email
            const emailQuery = query(usersRef, where("email", "==", normalizedEmail));
            const existingUsersSnapshot = await getDocs(emailQuery);

            if (!existingUsersSnapshot.empty) {
                setSignupError("This email address is already registered. Please log in or use a different email.");
                return; // Stop execution if email is found
            }

            // 1. Hash the password using MD5 
            const hashedPassword = md5(signupPassword);

            // 2. Generate a unique ID 
            const mockUid = crypto.randomUUID();

            // 3. Save new user data to Firestore
            await setDoc(doc(db, 'users', mockUid), {
                uid: mockUid,
                username: signupUsername,
                email: normalizedEmail, // Save the normalized email
                passwordHash: hashedPassword,
                createdAt: new Date().toISOString(),
            });

            alert(`Registration successful! You can now log in.`);
            // Reset signup form and switch to login view
            setSignupEmail('');
            setSignupPassword('');
            setSignupConfirmPassword('');
            setSignupUsername('');
            setIsLoginView(true);

        } catch (error) {
            console.error('Sign Up Error:', error.message);
            setSignupError(`Database error: ${error.message}.`);
        }
    };


    // const handleLogin = async (e) => {
    //     e.preventDefault();
    //     setLoginError('');

    //     // ⭐ BEST PRACTICE: Normalize email for case-insensitivity and trimming
    //     const normalizedLoginEmail = loginEmail.toLowerCase().trim();

    //     try {
    //         // 1. Hash the entered password for comparison
    //         const enteredPasswordHash = md5(loginPassword); 

    //         // 2. Query Firestore for a user with the matching email and hashed password
    //         const usersRef = collection(db, "users");
    //         const q = query(
    //             usersRef, 
    //             where("email", "==", normalizedLoginEmail), // Query using normalized email
    //             where("passwordHash", "==", enteredPasswordHash) 
    //         );

    //         // 🚨 IMPORTANT DEBUG STEP: Check your console to verify the query values.
    //         console.log("Login attempt:", { email: normalizedLoginEmail, passwordHash: enteredPasswordHash });

    //         const querySnapshot = await getDocs(q);

    //         if (querySnapshot.empty) {
    //             setLoginError("Invalid email or password.");
    //             return;
    //         }

    //         // 3. Success
    //         const userData = querySnapshot.docs[0].data();

    //         // 🌟 Save user data to local storage after successful login
    //         localStorage.setItem('user', JSON.stringify({
    //             uid: userData.uid,
    //             username: userData.username,
    //             email: userData.email,
    //         }));

    //         alert(`Login successful! Welcome back, ${userData.username}.`);
    //         navigate('/dashboard'); 

    //     } catch (error) {
    //         console.error('Login Error:', error.message);
    //         setLoginError(`An error occurred during login: ${error.message}`);
    //     }
    // };


    // ===================================
    // === RENDER FUNCTIONS (No change) ===
    // ===================================


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');

        // ⭐ BEST PRACTICE: Normalize email for case-insensitivity and trimming
        const normalizedLoginEmail = loginEmail.toLowerCase().trim();

        try {
            // 1. Hash the entered password for comparison
            const enteredPasswordHash = md5(loginPassword);

            // 2. Query Firestore for a user with the matching email and hashed password
            const usersRef = collection(db, "users");
            const q = query(
                usersRef,
                where("email", "==", normalizedLoginEmail), // Query using normalized email
                where("passwordHash", "==", enteredPasswordHash)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setLoginError("Invalid email or password.");
                return;
            }

            // 3. Success
            const userData = querySnapshot.docs[0].data();

            // 👇 MODIFICATION STARTS HERE 👇

            // 🌟 Save ALL user data to local storage using the key 'user'
            // This stores the full user data object: { uid, username, email, passwordHash, createdAt }
            localStorage.setItem('user', JSON.stringify(userData));

            // 👆 MODIFICATION ENDS HERE 👆

            alert(`Login successful! Welcome back, ${userData.username}.`);
            navigate('/dashboard');

        } catch (error) {
            console.error('Login Error:', error.message);
            setLoginError(`An error occurred during login: ${error.message}`);
        }
    };

    const renderLoginForm = () => (
        <div className="bg-[#fbeee2] p-6 sm:p-10 rounded-lg shadow-lg">
            <form className="space-y-6" onSubmit={handleLogin}>
                {loginError && <p className="text-red-500 font-medium pb-2 text-sm">{loginError}</p>}
                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="login-email">
                        Email address <span className="text-orange-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="login-email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#d9822b] transition"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="login-password">
                        Password <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="login-password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#d9822b] transition"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-600 hover:text-gray-900"
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                <div className="pt-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <button
                            type="submit"
                            className="bg-[#d9822b] hover:bg-[#c37124] text-white font-bold py-3 px-8 rounded-md transition"
                        >
                            Log in
                        </button>
                        <div className="flex items-center">
                            <input type="checkbox" id="remember-me" className="h-4 w-4 text-[#d9822b] focus:ring-[#c37124] border-gray-400 rounded" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                                Remember me
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                    <Link to="/forgot-password" className="text-sm font-medium text-gray-600 hover:text-black">
                        Lost your password?
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsLoginView(false)}
                        className="text-sm font-medium text-gray-600 hover:text-black "
                    >
                        Don't have an account? Sign Up
                    </button>
                </div>
            </form>
        </div>
    );

    const renderSignUpForm = () => (
        <div className="bg-[#fbeee2] p-6 sm:p-10 rounded-lg shadow-lg">
            <form className="space-y-6" onSubmit={handleSignUp}>
                {signupError && <p className="text-red-500 font-medium pb-2 text-sm">{signupError}</p>}
                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="signup-username">
                        Username <span className="text-orange-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="signup-username"
                        value={signupUsername}
                        onChange={(e) => setSignupUsername(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#d9822b] transition"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="signup-email">
                        Email address <span className="text-orange-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="signup-email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#d9822b] transition"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="signup-password">
                        Password <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="signup-password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#d9822b] transition"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-600 hover:text-gray-900"
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="confirm-password">
                        Confirm Password <span className="text-orange-500">*</span>
                    </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="confirm-password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#d9822b] transition"
                        required
                    />
                </div>
                <div className="pt-2">
                    <button
                        type="submit"
                        className="bg-[#d9822b] hover:bg-[#c37124] text-white font-bold py-3 px-8 rounded-md transition"
                    >
                        Register
                    </button>
                </div>
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={() => setIsLoginView(true)}
                        className="text-sm font-medium text-gray-600 hover:text-black"
                    >
                        Already have an account? Log In
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="bg-white">
            <div className="py-10 px-4">
                {/* The banner*/}
                <div className="bg-[#5b392a] max-w-6xl mx-auto rounded-3xl overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center sm:justify-between text-center sm:text-left p-8 md:p-10 min-h-[260px]">
                        {/* Text container */}
                        <div className="mb-6 sm:mb-0">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white font-bold">
                                My Account
                            </h1>
                        </div>

                        {/* Image container */}
                        <div>
                            <img
                                src="/banner2.png"
                                alt="Spinning Donut"
                                className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 object-contain"
                                style={{ transform: `rotate(${rotation}deg)` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="bg-cover bg-center pt-10 pb-12 sm:pb-24 px-4"
                style={{ backgroundImage: "url('https://kits.astylers.com/donatsu/wp-content/uploads/2023/07/bg-my-account.jpg')" }}
            >
                <div className="container mx-auto">
                    <div className="max-w-6xl mx-auto">
                        {/* Conditional Heading */}
                        <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-8">
                            {isLoginView ? 'Login' : 'Sign Up'}
                        </h2>

                        {/* Conditional Form Rendering */}
                        {isLoginView ? renderLoginForm() : renderSignUpForm()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;