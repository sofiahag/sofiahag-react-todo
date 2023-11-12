import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, registerWithEmailAndPassword, signInWithGoogle } from '../firebase';

function Register() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [user, loading, error] = useAuthState(auth);

    const register = () => {
        if (!name) alert('Please enter your name');
        registerWithEmailAndPassword(name, email, password);
    };

    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        if (user) {
            router.replace('/');
        }
    }, [user, loading, router]);
    

    return (
    <div className='w-full flex flex-row justify-center h-25 align-middle mb-20 bg-yellow-50'>
        <div className='p-7'>
            <input
                type='text'
                className='p-3 text-xs border-gray-300 border-2 w-52 mr-2'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Full name'
            />
            <input
                type='text'
                className='p-3 text-xs border-gray-300 border-2 w-52 mr-2'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='E-mail address'
            />
            <input
                type='password'
                className='p-3 text-xs border-gray-300 border-2 w-52'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
            />
            <Link href="/register">
            <button className='p-3 text-xs border-0 text-black rounded-full bg-gradient-to-r from-pink-100 via-violet-100 to-pink-100 ml-5 mr-20' onClick={register}>
                Register
            </button>
            </Link>
            <Link href="/register">
            <button
                className='rounded-full bg-gradient-to-r from-violet-100 via-blue-100 to-violet-100 p-3 ml-20 mr-20 text-xs'
                onClick={signInWithGoogle}
            >
            Register with Google
            </button>
            </Link>
            <button className='p-3 text-xs border-0 text-black rounded-full bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-100 ml-10'><Link href='/'>Log in</Link></button>
        </div>
    </div>
    );
}
export default Register;
