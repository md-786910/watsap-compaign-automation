import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Home } from "./components/Home";
import ProtectedRoute from "./components/protectedRoutes";
import { WhatsAppProvider } from "./context/WatsappContext";
import { SocketProvider } from "./context/SockerProvider";
import { Dashboard } from "./components/dashboard";
import { ReadSheet } from "./components/sheet/readSheet";
import { Settings } from "./components/settings/Setting";
import Schedular from "./components/schedular/Schedular";
import AppLayout from "./components/AppLayout";
import { Template } from "./components/template/NewTemplate";

function DashboardLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

const App = () => {
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
              <SocketProvider >
                <WhatsAppProvider>
                  <DashboardLayout />
                </WhatsAppProvider>
              </SocketProvider>
            </>
          ),
          children: [
            { index: true, element: <Dashboard /> },
            { path: "template", element: <Template /> },
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
