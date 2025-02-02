import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { useState } from "react";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);



  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="pt-16 flex">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <main
          className={`flex-1 p-3 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"
            }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
