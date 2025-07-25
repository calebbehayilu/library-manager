import {
  Home,
  Book,
  Users,
  Repeat,
  List,
  UserCog,
  Settings,
} from "lucide-react";
import { Link } from "react-router";

export function AppSidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <Book className="h-6 w-6" />
            <span className="">Library Manager</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/books"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Book className="h-4 w-4" />
              Books
            </Link>
            <Link
              to="/members"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Users className="h-4 w-4" />
              Members
            </Link>
            <Link
              to="/borrowings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Repeat className="h-4 w-4" />
              Borrowings
            </Link>
            <Link
              to="/genres"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <List className="h-4 w-4" />
              Genres
            </Link>
            <Link
              to="/staff"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <UserCog className="h-4 w-4" />
              Staff
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
