import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, signInWithEmailAndPassword, signInWithGoogle } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, loading, error] = useAuthState(auth);

    const router = useRouter()

    useEffect(() => {
        if (loading) {
        return;
        }
        if (user) router.replace('/dashboard');
    }, [user, loading, router]);

    return (
        <div className='w-full flex flex-row max-sm:flex-column max-sm:flex-wrap justify-center h-25 
            align-middle mb-20 bg-yellow-50'>
        <div className='p-7'>
            <input
                type='text'
                className='p-3 text-xs border-gray-300 border-2 w-52 max-sm:w-36'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='E-mail address'
            />
            <input
                type='password'
                className='p-3 text-xs border-gray-300 border-2 ml-5 max-sm:mt-2 max-sm:ml-1 w-52 max-sm:w-36'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
            />
            <Link href="/">
            <button
                className='p-3 text-xs border-0 text-black rounded-full bg-gradient-to-r from-pink-100 via-violet-100
                to-pink-100 ml-5 mr-20 max-sm:mt-3 max-sm:ml-20 max-sm:mb-3'
                onClick={() => signInWithEmailAndPassword(auth, email, password)}
            >
            Login
            </button>
            </Link>
            <button className='rounded-full bg-gradient-to-r from-violet-100 via-blue-100 to-violet-100 p-3 mx-20
                text-xs md:mx-6 md:mt-5 max-sm:mx-2' onClick={signInWithGoogle}>
            Login with Google
            </button>
            <button className='p-3 text-xs border-0 text-black rounded-full bg-gradient-to-r from-blue-100 via-cyan-100
                to-blue-100 ml-10 md:mx-6 max-sm:mx-2'><Link href='/register'>Register</Link></button>
            <button className='p-3 text-xs border-0 text-black rounded-full bg-gradient-to-r from-cyan-100 via-teal-100
                to-cyan-100 ml-5 md:mx-6 max-sm:mx-2 max-sm:mt-3'><Link href='/reset'>Forgot Password?</Link></button>
        </div>
        </div>
    );
}
export default Login;
