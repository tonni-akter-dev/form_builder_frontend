import Link from "next/link";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex gap-4">
          <Link href="/admin" className="font-bold">
            Dashboard
          </Link>
          <Link href="/admin/forms">Forms</Link>
          <Link href="/admin/upload">Upload Data</Link>
          <Link href="/admin">Visits</Link>
        </div>
      </nav>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
