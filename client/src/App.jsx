import React, { useState, useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Home } from "./components/Home";
import ProtectedRoute from "./components/protectedRoutes";
import { WhatsAppProvider } from "./context/WatsappContext";
import { SocketProvider } from "./context/SockerProvider";
import { Dashboard } from "./components/dashboard";
import { ReadSheet } from "./components/sheet/readSheet";
import { Settings } from "./components/settings/Setting";
import Schedular from "./components/schedular/Schedular";
import { ReadTemplate } from "./components/template/readTemplate";
import AppLayout from "./components/AppLayout";

function DashboardLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

const App = () => {
  const [token, setToken] = useState(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Define router with token
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <h1>Not found</h1>,
    },
    {
      path: "/dashboard",
      element: <ProtectedRoute />,
      errorElement: <h1>Child route not found</h1>,
      children: [
        {
          element: (
            <>
              <SocketProvider token={token}>
                <WhatsAppProvider>
                  <DashboardLayout />
                </WhatsAppProvider>
              </SocketProvider>
            </>
          ),
          children: [
            { index: true, element: <Dashboard /> },
            { path: "template", element: <ReadTemplate /> },
            { path: "sheet", element: <ReadSheet /> },
            { path: "settings", element: <Settings /> },
            { path: "schedular", element: <Schedular /> },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
