// app/admin/forms/[formId]/preview/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios"; // Your configured axios instance
import { toast } from "react-toastify";

// Define the structure for a form field based on your backend schema
interface FormField {
  _id: string; // Changed from 'id' to '_id' to match MongoDB
  label: string;
  description?: string;
  type: string; // Using string to match all possible types from your schema
  options?: string[];
  rows?: string[]; // For grid types
  columns?: string[]; // For grid types
  required: boolean;
  // Rating specific fields
  ratingStyle?: "star" | "number" | "emoji";
  ratingMin?: number;
  ratingMax?: number;
  ratingLabels?: {
    min?: string;
    max?: string;
    middle?: string;
  };
  // Number field constraints
  min?: number;
  max?: number;
}

// Define the structure for the full form
interface Form {
  _id: string;
  title: string;
  description: string;
  isPublished: boolean;
  fields: FormField[];
  createdBy?: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

const FormPreviewPage = () => {
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setError("No form ID provided");
      setLoading(false);
      return;
    }
    const fetchForm = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to view this form");
          router.push("/login");
          return;
        }
        const response = await axios.get(`/forms/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Form data received:", response.data);
        setForm(response.data);
      } catch (err: any) {
        console.error("Error fetching form for preview:", err);

        // Handle different error types
        if (err.response) {
          // Server responded with error
          const status = err.response.status;
          const message =
            err.response.data?.error ||
            err.response.data?.message ||
            "Failed to load form.";

          if (status === 401) {
            toast.error("Session expired. Please login again.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
          } else if (status === 403) {
            toast.error("You don't have permission to view this form.");
          } else if (status === 404) {
            toast.error("Form not found.");
          } else {
            toast.error(message);
          }
          setError(message);
        } else if (err.request) {
          // Request made but no response
          toast.error("Network error. Please check your connection.");
          setError("Network error. Please check your connection.");
        } else {
          // Something else happened
          toast.error("An unexpected error occurred.");
          setError(err.message || "An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id, router]);

  const renderRatingStars = (max: number = 5, style: string = "star") => {
    if (style === "star") {
      return (
        <div className="flex gap-1">
          {Array.from({ length: max }, (_, i) => (
            <span key={i} className="text-2xl text-gray-300">
              ★
            </span>
          ))}
        </div>
      );
    } else if (style === "number") {
      return (
        <div className="flex gap-2">
          {Array.from({ length: max }, (_, i) => (
            <span
              key={i}
              className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500"
            >
              {i + 1}
            </span>
          ))}
        </div>
      );
    } else if (style === "emoji") {
      const emojis = ["😞", "😐", "🙂", "😊", "😄"];
      return (
        <div className="flex gap-2">
          {Array.from({ length: max }, (_, i) => (
            <span key={i} className="text-3xl text-gray-400">
              {emojis[i] || "😊"}
            </span>
          ))}
        </div>
      );
    }
  };

  const renderField = (field: FormField) => {
    const baseClassName =
      "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700 cursor-not-allowed";
    const label = (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}{" "}
        {field.required && <span className="text-red-500">*</span>}
        {field.description && (
          <span className="ml-2 text-xs text-gray-500 font-normal">
            ({field.description})
          </span>
        )}
      </label>
    );

    // Handle different field types based on your backend schema
    switch (field.type) {
      case "text":
        return (
          <div key={field._id} className="mb-4">
            {label}
            <input
              type="text"
              disabled
              className={baseClassName}
              placeholder="Text input preview"
            />
          </div>
        );

      case "textarea":
        return (
          <div key={field._id} className="mb-4">
            {label}
            <textarea
              disabled
              rows={4}
              className={baseClassName}
              placeholder="Paragraph text preview"
            />
          </div>
        );

      case "number":
        return (
          <div key={field._id} className="mb-4">
            {label}
            <input
              type="number"
              disabled
              min={field.min}
              max={field.max}
              className={baseClassName}
              placeholder={`Number input ${field.min ? `(min: ${field.min})` : ""} ${field.max ? `(max: ${field.max})` : ""}`}
            />
          </div>
        );

      case "date":
        return (
          <div key={field._id} className="mb-4">
            {label}
            <input type="date" disabled className={baseClassName} />
          </div>
        );

      case "time":
        return (
          <div key={field._id} className="mb-4">
            {label}
            <input type="time" disabled className={baseClassName} />
          </div>
        );

      case "file_upload":
        return (
          <div key={field._id} className="mb-4">
            {label}
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mt-1 text-xs text-gray-500">File upload preview</p>
            </div>
          </div>
        );

      case "select":
        return (
          <div key={field._id} className="mb-4">
            {label}
            <select disabled className={baseClassName}>
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case "radio":
        return (
          <div key={field._id} className="mb-4">
            {label}
            <div className="mt-2 space-y-2">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    id={`${field._id}-${option}`}
                    name={field._id}
                    type="radio"
                    disabled
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`${field._id}-${option}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div key={field._id} className="mb-4">
            {label}
            <div className="mt-2 space-y-2">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    id={`${field._id}-${option}`}
                    type="checkbox"
                    disabled
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`${field._id}-${option}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case "rating":
        return (
          <div key={field._id} className="mb-4">
            {label}
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              {renderRatingStars(
                field.ratingMax || 5,
                field.ratingStyle || "star",
              )}
              {(field.ratingLabels?.min || field.ratingLabels?.max) && (
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>{field.ratingLabels?.min || ""}</span>
                  {field.ratingLabels?.middle && (
                    <span>{field.ratingLabels.middle}</span>
                  )}
                  <span>{field.ratingLabels?.max || ""}</span>
                </div>
              )}
            </div>
          </div>
        );

      case "checkbox_grid":
        return (
          <div key={field._id} className="mb-4 overflow-x-auto">
            {label}
            <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"></th>
                    {field.columns?.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {field.rows?.map((row) => (
                    <tr key={row}>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                        {row}
                      </td>
                      {field.columns?.map((col) => (
                        <td key={col} className="px-4 py-2">
                          <input
                            type="checkbox"
                            disabled
                            className="rounded border-gray-300"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "multiple_choice_grid":
        return (
          <div key={field._id} className="mb-4 overflow-x-auto">
            {label}
            <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"></th>
                    {field.columns?.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {field.rows?.map((row) => (
                    <tr key={row}>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                        {row}
                      </td>
                      {field.columns?.map((col, colIndex) => (
                        <td key={col} className="px-4 py-2">
                          <input
                            type="radio"
                            name={`${field._id}_${row}`}
                            disabled
                            className="border-gray-300 text-blue-600"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        console.warn(`Unhandled field type: ${field.type}`);
        return (
          <div
            key={field._id}
            className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md"
          >
            <p className="text-sm text-yellow-700">
              Unknown field type: {field.type} - {field.label}
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Preview...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md border border-red-200 max-w-md">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-red-800">
            Error Loading Form
          </h3>
          <p className="mt-2 text-red-600">{error || "Form not found."}</p>
          <button
            onClick={() => router.push("/admin/forms")}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Forms List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>

          {/* Status badge */}
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              form.isPublished
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {form.isPublished ? "Published" : "Draft"}
          </span>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* <div className="bg-linear-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">{form.title}</h1>
            {form.description && (
              <p className="mt-2 text-blue-100">{form.description}</p>
            )}
            {form.createdBy && (
              <p className="mt-3 text-xs text-blue-200">
                Created by: {form.createdBy.username || form.createdBy.email}
              </p>
            )}
          </div> */}

          {/* Form Fields */}
          <div className="p-8">
            {/* <div className="mb-4">
              <p className="text-sm text-gray-500 italic">
                This is a preview. Form fields are disabled.
              </p>
            </div> */}

            {form.fields && form.fields.length > 0 ? (
              <div className="space-y-6">
                {form.fields.map((field) => renderField(field))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-2 text-gray-500">
                  This form has no fields yet.
                </p>
              </div>
            )}

            {/* Disabled Submit Button */}
            <div className="mt-8">
              <button
                type="button"
                disabled
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
              >
                Submit (Preview Mode)
              </button>
              <p className="text-center text-xs text-gray-500 mt-2">
                This is just a preview. The actual form would be interactive
                when published.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreviewPage;
