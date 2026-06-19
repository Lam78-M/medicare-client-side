import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";



const DashboardLayout = ({children}) => {
    return (
  
            <div className=' flex gap-3 min-h-screen  lg:pl-20 pt-5 pb-5 '>
                <DashboardSidebar />
              <div className='flex-1'> {children} </div>
            </div>

    );
};

export default DashboardLayout;