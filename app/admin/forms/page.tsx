/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios"; // Make sure this points to your axios instance
import { toast } from "react-toastify";
// At the top of your AllForms.js file, add these imports:
import {
  RxLink2,
  RxEyeOpen,
  RxPencil1,
  RxTrash,
} from "react-icons/rx";
import { FaRegComments } from "react-icons/fa";

interface Form {
  _id: string; 
  title: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string; 
  response_count?: number;
}

const AllForms = () => {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchForms = async () => {
    try {
      const response = await axios.get("/forms");
      setForms(response.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast.error("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // Copy form link to clipboard
  const copyFormLink = async (formId: string) => {
    const formUrl = `${window.location.origin}/forms/${formId}`; // This assumes a public route exists

    try {
      await navigator.clipboard.writeText(formUrl);
      setCopiedId(formId);
      toast.success("Form link copied to clipboard!");

      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = formUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      setCopiedId(formId);
      toast.success("Form link copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Delete a form
  const deleteForm = async (formId: string, formTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${formTitle}"?`)) {
      try {
        // *** CHANGE 3: Corrected the API endpoint for deletion ***
        await axios.delete(`/forms/${formId}`);
        setForms(forms.filter((form) => form._id !== formId)); // Use _id for filtering
        toast.success("Form deleted successfully");
      } catch (error) {
        console.error("Error deleting form:", error);
        toast.error("Failed to delete form");
      }
    }
  };

  // Toggle form status
  const toggleFormStatus = async (formId: string, currentStatus: boolean) => {
    // *** CHANGE 4: The backend expects a boolean `isPublished`, not a string `status` ***
    const newStatus = !currentStatus;

    try {
      // *** CHANGE 5: The backend uses PUT to update the whole form, not PATCH ***
      await axios.put(`/api/forms/${formId}`, { isPublished: newStatus });
      setForms(
        forms.map(
          (form) =>
            form._id === formId ? { ...form, isPublished: newStatus } : form, // Use _id for mapping
        ),
      );
      toast.success(`Form ${newStatus ? "published" : "saved as draft"}`);
    } catch (error) {
      console.error("Error updating form status:", error);
      toast.error("Failed to update form status");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // *** CHANGE 6: Updated the status color function to use a boolean ***
  const getStatusColor = (isPublished: boolean) => {
    return isPublished
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Forms</h1>
              <p className="mt-2 text-gray-600">Manage and share your forms</p>
            </div>
            <button
              onClick={() => router.push("/admin/forms/new")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add New Form
            </button>
          </div>
        </div>

        {/* Forms Grid */}
        {forms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            {/* ... No forms UI ... */}
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No forms yet
            </h3>
            <p className="mt-2 text-gray-500">
              Get started by creating your first form.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/admin/forms/new")}
                className="..."
              >
                Create Form
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {forms.map((form) => (
              <div
                key={form._id} // *** CHANGE 7: Use _id as the key ***
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 truncate">
                        {form.title || "Untitled Form"}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          form.isPublished, // *** CHANGE 8: Use isPublished boolean ***
                        )}`}
                      >
                        {form.isPublished ? "Published" : "Draft"}{" "}
                        {/* *** CHANGE 9: Render text based on boolean *** */}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {form.description || "No description provided"}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Created: {formatDate(form.createdAt)}{" "}
                        {/* *** CHANGE 10: Use createdAt *** */}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Updated: {formatDate(form.updatedAt)}{" "}
                        {/* *** CHANGE 11: Use updatedAt *** */}
                      </div>
                      {form.response_count !== undefined && (
                        <div className="flex items-center gap-1">
                          {/* ... Response count SVG ... */}
                          {form.response_count}{" "}
                          {form.response_count === 1 ? "Response" : "Responses"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    {/* Copy Link Button */}
                    <button
                      onClick={() => copyFormLink(form._id)}
                      title="Copy form link"
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <RxLink2 className="h-5 w-5" />
                    </button>

                    {/* Preview Button */}
                    <button
                      onClick={() => router.push(`/admin/forms/${form._id}`)}
                      title="Preview form"
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    >
                      <RxEyeOpen className="h-5 w-5" />
                    </button>

                    {/* Edit Form Button */}
                    <button
                      onClick={() =>
                        router.push(`/admin/forms/edit/${form._id}`)
                      }
                      title="Edit form"
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    >
                      <RxPencil1 className="h-5 w-5" />
                    </button>

                    {/* Publish/Draft Toggle Button */}
                    {/* <button
    onClick={() => toggleFormStatus(form._id, form.isPublished)}
    title={form.isPublished ? "Save as draft" : "Publish form"}
    className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors"
  >
    {form.isPublished ? (
      <HiOutlineDocumentArrowDown className="h-5 w-5" title="Save as Draft" />
    ) : (
      <RxRocket className="h-5 w-5" title="Publish Form" />
    )}
  </button> */}

                    {/* View Responses Button */}
                    <button
                      onClick={() =>
                        router.push(`/admin/forms/responses/${form._id}`)
                      }
                      title="View responses"
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                    >
                      <FaRegComments className="h-5 w-5" />
                    </button>

                    {/* Delete Form Button */}
                    <button
                      onClick={() => deleteForm(form._id, form.title)}
                      title="Delete form"
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <RxTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllForms;
