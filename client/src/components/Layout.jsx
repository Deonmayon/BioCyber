import { NavLink, Outlet } from "react-router-dom";

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? "bg-blue-100 text-blue-700"
      : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
  }`;

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-blue-100 bg-white/90 backdrop-blur sticky top-0 z-10 shadow-sm shadow-blue-100/50">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <NavLink to="/" className="flex items-center gap-2 font-semibold text-blue-600">
            <img src="/shield.svg" alt="" className="h-7 w-7" />
            BioCyber
          </NavLink>
          <nav className="flex flex-wrap gap-1">
            <NavLink to="/" end className={navClass}>
              About
            </NavLink>
            <NavLink to="/certificates" className={navClass}>
              Certificates
            </NavLink>
            <NavLink to="/blog" className={navClass}>
              CTF Blog
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
}
