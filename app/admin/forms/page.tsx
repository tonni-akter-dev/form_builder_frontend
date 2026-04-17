/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast } from "react-toastify";

import { RxLink2, RxEyeOpen, RxPencil1, RxTrash } from "react-icons/rx";
import { FaRegComments } from "react-icons/fa";

interface Form {
  _id: string;
  title: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  response_count?: number;
  className: string;
  subject: string;
  duration?: number;
}

const AllForms = () => {
  const router = useRouter();

  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Class State
  const [selectedClass, setSelectedClass] = useState<string>("All");

  // Extract unique classes from forms data
  const getUniqueClasses = () => {
    const classSet = new Set(forms.map(form => form.className).filter(Boolean));
    return Array.from(classSet).sort();
  };

  const uniqueClasses = getUniqueClasses();
  
  // Class tabs with "All" option
  const classTabs = ["All", ...uniqueClasses];

  // Fetch Forms
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

  // Filter Forms by Class
  const filteredForms =
    selectedClass === "All"
      ? forms
      : forms.filter((form) => form.className === selectedClass);

  // Get counts for each class
  const getClassCount = (className: string) => {
    if (className === "All") return forms.length;
    return forms.filter((form) => form.className === className).length;
  };

  // Copy link
  const copyFormLink = async (formId: string) => {
    const formUrl = `${window.location.origin}/forms/${formId}`;

    try {
      await navigator.clipboard.writeText(formUrl);
      setCopiedId(formId);
      toast.success("Link copied!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = formUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      setCopiedId(formId);
      toast.success("Link copied!");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const deleteForm = async (formId: string, title: string) => {
    if (window.confirm(`Delete "${title}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`/forms/${formId}`);
        setForms(forms.filter((f) => f._id !== formId));
        toast.success("Form deleted successfully");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete form");
      }
    }
  };

  // Format Date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const getStatusColor = (isPublished: boolean) => {
    return isPublished
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Forms</h1>
            <p className="text-gray-500 mt-1">Manage and organize your forms by class</p>
          </div>

          <button
            onClick={() => router.push("/admin/forms/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Form
          </button>
        </div>

        {/* Class Tabs */}
        {classTabs.length > 1 && (
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex flex-wrap gap-1 -mb-px">
                {classTabs.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-t-lg transition-all
                      ${selectedClass === cls
                        ? "bg-white text-blue-600 border border-b-0 border-gray-200"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    {cls}
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                      {getClassCount(cls)}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedClass === "All" ? "All Forms" : `${selectedClass} Forms`}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredForms.length} {filteredForms.length === 1 ? "form" : "forms"})
            </span>
          </h2>
          
          {selectedClass !== "All" && (
            <button
              onClick={() => setSelectedClass("All")}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View All Forms →
            </button>
          )}
        </div>

        {/* Forms List */}
        {filteredForms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
            <p className="text-gray-500 mb-4">
              {selectedClass === "All" 
                ? "You haven't created any forms yet." 
                : `No forms found for ${selectedClass}.`}
            </p>
            <button
              onClick={() => router.push("/admin/forms/new")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Create your first form
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredForms.map((form) => (
              <div
                key={form._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  {/* Left Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {form.title}
                      </h3>

                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          form.isPublished
                        )}`}
                      >
                        {form.isPublished ? "Published" : "Draft"}
                      </span>
                      
                      {form.duration && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          ⏱ {form.duration} min
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-2">
                      {form.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>Class: {form.className}</span>
                      </div>
                      
                      {form.subject && (
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span>Subject: {form.subject}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Created: {formatDate(form.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => copyFormLink(form._id)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
                      title="Copy link"
                    >
                      <RxLink2 className="h-5 w-5" />
                      {copiedId === form._id && (
                        <span className="absolute text-xs bg-gray-800 text-white px-1 rounded -mt-6 ml-2">
                          Copied!
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => router.push(`/admin/forms/${form._id}`)}
                      className="p-2 text-gray-500 hover:text-green-600 transition-colors rounded-full hover:bg-gray-100"
                      title="View form"
                    >
                      <RxEyeOpen className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => router.push(`/admin/forms/edit/${form._id}`)}
                      className="p-2 text-gray-500 hover:text-yellow-600 transition-colors rounded-full hover:bg-gray-100"
                      title="Edit form"
                    >
                      <RxPencil1 className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => router.push(`/admin/forms/responses/${form._id}`)}
                      className="p-2 text-gray-500 hover:text-purple-600 transition-colors rounded-full hover:bg-gray-100"
                      title="View responses"
                    >
                      <FaRegComments className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => deleteForm(form._id, form.title)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-full hover:bg-gray-100"
                      title="Delete form"
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