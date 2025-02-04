import React from "react";
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileText,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";


const SidebarLink = ({
  icon: Icon,
  text,
  link,
  showText,
}) => (
  <NavLink
    to={link}
    className={({ isActive }) =>
      `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
        ? "bg-blue-100 text-blue-600"
        : "text-gray-600 hover:bg-gray-100"
      }`
    }
  >
    <Icon className="w-5 h-5" />
    {showText && <span>{text}</span>}
  </NavLink>
);

export const Sidebar = ({ isSidebarOpen }) => {
  return (
    <aside
      className={`fixed top-16 left-0 bg-white h-[calc(100vh-4rem)] shadow-sm transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"
        }`}
    >
      <nav className="p-4 space-y-2">
        <SidebarLink
          icon={LayoutDashboard}
          text="Dashboard"
          showText={isSidebarOpen}
          link=""
        />
        <SidebarLink
          icon={FileSpreadsheet}
          text="Sheet"
          showText={isSidebarOpen}
          link="/sheet"
        />
        <SidebarLink
          icon={FileText}
          text="Template"
          showText={isSidebarOpen}
          link="/template"
        />
        <SidebarLink
          icon={Settings}
          text="Settings"
          showText={isSidebarOpen}
          link="/settings"
        />
      </nav>
    </aside>
  );
};
