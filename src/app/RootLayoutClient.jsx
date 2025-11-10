"use client";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";
import AdminSidebar from "./components/adminSidebar";

export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/adminDashboard");

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen shrink-0">
        {isAdminPage ? <AdminSidebar/> : <Sidebar />}
        <div className="grow">{children}</div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
