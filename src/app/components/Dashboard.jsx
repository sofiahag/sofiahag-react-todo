import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, logout } from '../firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { query, collection, getDocs, where } from 'firebase/firestore';

function Dashboard() {

    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState('');

    const router = useRouter();

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
                const doc = await getDocs(q);
                const data = doc.docs[0].data();
            setName(data.name);
            } catch (err) {
                console.error(err);
                alert('An error occurred while fetching user data');
            }
        };
        if (loading) return;
        if (!user) return router.replace('/');
        fetchUserName();
    }, [user, loading, router]);

    return (
        <div className='w-full flex flex-row justify-center items-center h-25 p-7 mb-20 bg-yellow-50'>
                Logged in as:
                <div className='text-gray-700 ml-2'>{name},</div>
                <div className='text-gray-500 ml-2'>{user?.email}</div>
                <Link href="/dashboard">
                <button className='p-3 text-xs border-0 text-black rounded-full bg-gradient-to-r from-pink-100 via-violet-100 to-pink-100 ml-10' onClick={logout}>
                    Logout
                </button>
            </Link>
        </div>
    );
}
export default Dashboard;
