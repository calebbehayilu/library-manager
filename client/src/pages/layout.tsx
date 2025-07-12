import React from "react";
import { Outlet, Link } from "react-router";

const Layout: React.FC = () => {
  return (
    <div>
      <header>
        <nav className="flex justify-between items-center m-5">
          <h1 className="font-bold text-2xl">Library Manager Dashboard</h1>
          <ul className="flex space-x-4 font-semibold ">
            <li>
              <Link to="/">Dashboard Home</Link>
            </li>
            <li>
              <Link to="/books">Books</Link>
            </li>
            <li>
              <Link to="/members">Members</Link>
            </li>
            <li>
              <Link to="/loans">Loans</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
