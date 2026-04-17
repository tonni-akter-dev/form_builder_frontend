/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast } from "react-toastify";

interface FormField {
  _id: string;
  label: string;
  description?: string;
  type: string;
  options?: string[];
  rows?: string[];
  columns?: string[];
  required: boolean;
  ratingStyle?: "star" | "number" | "emoji";
  ratingMin?: number;
  ratingMax?: number;
  ratingLabels?: {
    min?: string;
    max?: string;
    middle?: string;
  };
  min?: number;
  max?: number;
}

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

        if (err.response) {
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
          toast.error("Network error. Please check your connection.");
          setError("Network error. Please check your connection.");
        } else {
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
              className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400"
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

  const renderField = (field: FormField, index: number) => {
    const baseClassName =
      "w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-600 cursor-not-allowed";

    return (
      <div key={field._id} className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-start gap-3">
          <span className="text-sm font-medium text-gray-400 min-w-6">
            {index + 1}.
          </span>
          <div className="flex-1">
            <div className="mb-3">
              <span className="text-base font-medium text-gray-800">
                {field.label}
              </span>
              {field.required && <span className="text-red-500 ml-1">*</span>}
              {field.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {field.description}
                </p>
              )}
            </div>

            {/* Handle different field types */}
            {field.type === "text" && (
              <input
                type="text"
                disabled
                className={baseClassName}
                placeholder="Text input preview"
              />
            )}

            {field.type === "textarea" && (
              <textarea
                disabled
                rows={4}
                className={baseClassName}
                placeholder="Paragraph text preview"
              />
            )}

            {field.type === "number" && (
              <div>
                <input
                  type="number"
                  disabled
                  min={field.min}
                  max={field.max}
                  className={baseClassName}
                  placeholder="Number input"
                />
                {(field.min !== undefined || field.max !== undefined) && (
                  <p className="mt-2 text-xs text-gray-400">
                    {field.min !== undefined && `Minimum: ${field.min}`}
                    {field.min !== undefined &&
                      field.max !== undefined &&
                      " • "}
                    {field.max !== undefined && `Maximum: ${field.max}`}
                  </p>
                )}
              </div>
            )}

            {field.type === "date" && (
              <input type="date" disabled className={baseClassName} />
            )}

            {field.type === "time" && (
              <input type="time" disabled className={baseClassName} />
            )}

            {field.type === "file_upload" && (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50/50">
                <svg
                  className="mx-auto h-10 w-10 text-gray-300"
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
                <p className="mt-2 text-sm text-gray-400">
                  File upload preview
                </p>
              </div>
            )}

            {field.type === "select" && (
              <select disabled className={baseClassName}>
                <option value="">Choose an option</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {field.type === "radio" && (
              <div className="space-y-3">
                {field.options?.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      id={`${field._id}-${option}`}
                      name={field._id}
                      type="radio"
                      disabled
                      className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label
                      htmlFor={`${field._id}-${option}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {field.type === "checkbox" && (
              <div className="space-y-3">
                {field.options?.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      id={`${field._id}-${option}`}
                      type="checkbox"
                      disabled
                      className="h-4 w-4 rounded text-blue-600 border-gray-300"
                    />
                    <label
                      htmlFor={`${field._id}-${option}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {field.type === "rating" && (
              <div className="p-4 bg-gray-50/50 rounded-lg">
                {renderRatingStars(
                  field.ratingMax || 5,
                  field.ratingStyle || "star",
                )}
                {(field.ratingLabels?.min || field.ratingLabels?.max) && (
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>{field.ratingLabels?.min || ""}</span>
                    {field.ratingLabels?.middle && (
                      <span>{field.ratingLabels.middle}</span>
                    )}
                    <span>{field.ratingLabels?.max || ""}</span>
                  </div>
                )}
              </div>
            )}

            {field.type === "checkbox_grid" && (
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        {field.columns?.map((col) => (
                          <th
                            key={col}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {field.rows?.map((row) => (
                        <tr key={row}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {row}
                          </td>
                          {field.columns?.map((col) => (
                            <td key={col} className="px-4 py-3">
                              <input
                                type="checkbox"
                                disabled
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {field.type === "multiple_choice_grid" && (
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        {field.columns?.map((col) => (
                          <th
                            key={col}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {field.rows?.map((row) => (
                        <tr key={row}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {row}
                          </td>
                          {field.columns?.map((col) => (
                            <td key={col} className="px-4 py-3">
                              <input
                                type="radio"
                                name={`${field._id}_${row}`}
                                disabled
                                className="h-4 w-4 text-blue-600 border-gray-300"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0EBF8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#673AB7] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-[#F0EBF8] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-4">
            <svg
              className="h-8 w-8 text-red-400"
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
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Form
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            {error || "Form not found."}
          </p>
          <button
            onClick={() => router.push("/admin/forms")}
            className="px-6 py-2 bg-[#673AB7] hover:bg-[#5E35B1] text-white font-medium rounded-lg transition-colors"
          >
            Go to Forms List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with back button and status */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Editor
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Preview Mode</span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                form.isPublished
                  ? "bg-green-50 text-green-700"
                  : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {form.isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </div>

        {/* Form Header */}
        <div className="bg-white rounded-t-lg shadow-sm border-t-8 border-[#673AB7] p-8 mb-3">
          <h1 className="text-3xl font-normal text-gray-800">{form.title}</h1>
          {form.description && (
            <p className="mt-4 text-sm text-gray-600">{form.description}</p>
          )}
          {form.createdBy && (
            <p className="mt-4 text-xs text-gray-400">
              Created by: {form.createdBy.username || form.createdBy.email}
            </p>
          )}
          <p className="mt-6 text-xs text-gray-400 flex items-center gap-1">
            <span className="text-red-500">*</span> Indicates required question
          </p>
        </div>

        {/* Preview Mode Indicator */}
        <div className="mb-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-blue-700">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>
              This is a preview of how your form will look to respondents. All
              fields are disabled.
            </span>
          </div>
        </div>

        {/* Form Fields */}
        {form.fields && form.fields.length > 0 ? (
          <div className="space-y-3">
            {form.fields.map((field, index) => renderField(field, index))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
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
            <p className="mt-4 text-gray-500 text-sm">
              This form has no fields yet. Add fields in the editor to see them
              here.
            </p>
          </div>
        )}

        {/* Disabled Submit Button */}
        <div className="mt-3 bg-white rounded-lg shadow-sm p-8">
          <button
            type="button"
            disabled
            className="px-6 py-2 bg-gray-200 text-gray-500 font-medium rounded-lg cursor-not-allowed"
          >
            Submit (Preview Mode)
          </button>
          <p className="mt-4 text-xs text-gray-400">
            This is just a preview. The actual form would be interactive when
            published.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormPreviewPage;
