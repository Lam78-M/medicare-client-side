"use client"
import AppointmentTable from '@/components/dashboard/AppointmentTable';
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
     <div className='bg-[#021A54] rounded-2xl '>
            <div className="space-y-1 py-8 px-7">
  <h1 className="text-2xl rounded-lg px-4 py-5 bg-white md:text-4xl font-extrabold text-gray-600 tracking-tight">
    Welcome back, <span className="text-[#FF85BB]">{user?.name || "User"}</span> 👋
    <br></br>
    <span className='text-lg text-gray-600 font-medium '>  Great to see you again! .</span>
  </h1>

  
  
</div>
     </div>
 <DoctorStats></DoctorStats>
 <AppointmentTable></AppointmentTable>
</div>
    );
};

export default PatientPage;