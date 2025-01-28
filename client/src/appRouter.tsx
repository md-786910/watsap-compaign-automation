import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./components/dashboard";
import { ReadSheet } from "./components/sheet/readSheet";
import { ReadTemplate } from "./components/template/readTemplate";
import AppLayout from "./components/AppLayout";

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
        element: <ReadTemplate />,
      },
      {
        path: "/sheet",
        element: <ReadSheet />,
      },
      // Add more routes here
    ],
  },
]);

// Export the router for use in your app
export default function AppRouter() {
  return <RouterProvider router={router} />;
}
