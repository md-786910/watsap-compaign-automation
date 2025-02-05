import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./components/dashboard";
import { ReadSheet } from "./components/sheet/readSheet";
import { ReadTemplate } from "./components/template/readTemplate";
import AppLayout from "./components/AppLayout";
import { Settings } from "./components/settings/Setting";
import { Template } from "./components/template/NewTemplate";

// Define your routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // Wrap all routes in a layout component
    errorElement: <h1>Not found</h1>, // Handle 404 errors
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/template",
        element: <Template />,
      },
      {
        path: "/sheet",
        element: <ReadSheet />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      // Add more routes here
    ],
  },
]);

// Export the router for use in your app
export default function AppRouter() {
  return <RouterProvider router={router} />;
}
