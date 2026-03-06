"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { ToastContainer } from "react-toastify";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ToastContainer />
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg w-64 p-5 space-y-4 fixed md:static h-screen z-40 transform 
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform`}
      >
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-3 text-gray-700">
          <Link href="/admin" className="hover:bg-gray-100 p-2 rounded">
            Dashboard
          </Link>

          <Link href="/admin/forms" className="hover:bg-gray-100 p-2 rounded">
            Forms
          </Link>
          <Link
            href="/admin/forms/new"
            className="hover:bg-gray-100 p-2 rounded"
          >
            Add New Form
          </Link>
        </nav>
      </aside>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
          <button className="md:hidden text-xl" onClick={() => setOpen(!open)}>
            ☰
          </button>
          <h1 className="font-semibold text-lg">Admin Dashboard</h1>
        </header>
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
