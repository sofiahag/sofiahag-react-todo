import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { auth, sendPasswordResetEmail } from '../firebase';
function Reset() {
    const [email, setEmail] = useState('');
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (loading) return;
        if (user) navigate('/dashboard');
    }, [user, loading, navigate]);
    return (
        <div className='w-full flex flex-row justify-center h-25 align-middle mb-20 bg-yellow-50'>
            <div className='p-7'>
                <input
                    type='text'
                    className='p-3 text-xs border-gray-300 border-2 mr-5 w-52'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='E-mail address'
                />
                <button
                    className='p-3 text-xs border-0 text-black rounded-full bg-gradient-to-r from-pink-100 via-violet-100 to-pink-100 ml-5 mr-20'
                    onClick={() => sendPasswordResetEmail(auth, email)}
                >
                Send password reset email
                </button>
                <button className='p-3 text-xs border-0 text-black rounded-full bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-100 ml-10'><Link to='/register'>Register</Link></button>
            </div>
        </div>
    );
}
export default Reset;