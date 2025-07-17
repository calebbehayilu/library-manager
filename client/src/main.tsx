import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./pages/layout.tsx";
import DashboardPage from "./pages/dashboard/dashboard-page.tsx";
import BooksPage from "./pages/books/books-page.tsx";
import MembersPage from "./pages/members/members-page.tsx";
import BorrowingsPage from "./pages/borrowings/borrowings-page.tsx";
import GenresPage from "./pages/genres/genres-page.tsx";
import StaffPage from "./pages/staff/staff-page.tsx";
import SettingsPage from "./pages/settings/settings-page.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/books", element: <BooksPage /> },
      { path: "/members", element: <MembersPage /> },
      { path: "/borrowings", element: <BorrowingsPage /> },
      { path: "/genres", element: <GenresPage /> },
      { path: "/staff", element: <StaffPage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
