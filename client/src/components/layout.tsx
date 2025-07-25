import { Route, Routes } from "react-router";
import { DashboardPage } from "../pages/dashboard";
import { BooksPage } from "../pages/books";
import { MembersPage } from "../pages/members";
import { BorrowingsPage } from "../pages/borrowings";
import { GenresPage } from "../pages/genres";
import { StaffPage } from "../pages/staff";
import { SettingsPage } from "../pages/settings";
import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "./site-header";

export function Layout() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AppSidebar />
      <div className="flex flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/books/*" element={<BooksPage />} />
            <Route path="/members/*" element={<MembersPage />} />
            <Route path="/borrowings/*" element={<BorrowingsPage />} />
            <Route path="/genres/*" element={<GenresPage />} />
            <Route path="/staff/*" element={<StaffPage />} />
            <Route path="/settings/*" element={<SettingsPage />} />
            <Route path="/" element={<DashboardPage />} />
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
