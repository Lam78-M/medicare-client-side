import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f5f7ff] p-3 pb-5 pt-4 lg:p-5">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-start">
        <DashboardSidebar />
        <div className="w-full flex-1">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;