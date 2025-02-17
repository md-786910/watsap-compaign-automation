import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Dashboard } from "./components/dashboard";
import { ReadSheet } from "./components/sheet/readSheet";
import AppLayout from "./components/AppLayout";
import { Settings } from "./components/settings/Setting";
import { Template } from "./components/template/NewTemplate";
import { Home } from "./components/Home";
import Schedular from "./components/schedular/Schedular";
import ProtectedRoute from "./components/protectedRoutes";
import WatsappMain from "./components/WatsappMain";


function DashboardLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}



// Define your routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // Directly render Home at "/"
    errorElement: <h1>Not found</h1>,
  },
  {
    path: "/qr",
    element: <WatsappMain />, // Directly render Home at "/"
    errorElement: <h1>Not found</h1>,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />, // Protect the whole dashboard
    errorElement: <h1>Child route not found</h1>,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "template", element: <Template /> },
          { path: "sheet", element: <ReadSheet /> },
          { path: "settings", element: <Settings /> },
          { path: "schedular", element: <Schedular /> },
        ],
      },
    ]

  },
]);


// Export the router for use in your app
export default function AppRouter() {

  return <RouterProvider router={router} />;
}