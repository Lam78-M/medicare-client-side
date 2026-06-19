"use client"
import DoctorStats from '@/components/dashboard/DoctorStats';
import { useSession } from '@/lib/auth-client';
import React from 'react';

const PatientPage = () => {
    const{data: session, isPending} = useSession()

    if(isPending){
        return <div>Loading...</div>
    }
    const user = session?.user
    return (

<div>
     <div className='bg-[#021A54] rounded-2xl max-w-7xl'>
            <div className="space-y-1 py-8 px-5 ">
  <h1 className="max-w-7xl text-2xl rounded-md px-2 py-5 bg-white md:text-4xl font-extrabold text-gray-600 tracking-tight">
    Welcome back, <span className="text-[#FF85BB]">{user?.name || "User"}</span> 👋
  </h1>

  <p className="max-w-7xl text-lg  rounded-md px-2 py-2 bg-white text-gray-600 font-medium mt-4 ">
    Great to see you again! .
  </p>
  
</div>
     </div>
 <DoctorStats></DoctorStats>
</div>
    );
};

export default PatientPage;