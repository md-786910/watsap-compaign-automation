import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { useState } from "react";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // const renderContent = () => {
  //   switch (activeTab) {
  //     case "dashboard":
  //       return <Dashboard />;
  //     case "sheet":
  //       return (
  //         <div className="bg-white rounded-lg shadow-md p-6">
  //           <h2 className="text-2xl font-semibold mb-4">Sheet Management</h2>
  //           <p className="text-gray-600">
  //             Sheet management functionality coming soon...
  //           </p>
  //         </div>
  //       );
  //     case "template":
  //       return (
  //         <div className="bg-white rounded-lg shadow-md p-6">
  //           <h2 className="text-2xl font-semibold mb-4">Message Templates</h2>
  //           <p className="text-gray-600">
  //             Template management functionality coming soon...
  //           </p>
  //         </div>
  //       );
  //     default:
  //       return null;
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="pt-16 flex">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <main
          className={`flex-1 p-3 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-16"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
