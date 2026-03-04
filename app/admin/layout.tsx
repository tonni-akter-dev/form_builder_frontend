import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex gap-4">
          <a href="/admin" className="font-bold">
            Dashboard
          </a>
          <a href="/admin/forms">Forms</a>
          <a href="/admin/upload">Upload Data</a>
          <a href="/admin">Visits</a>
        </div>
      </nav>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
