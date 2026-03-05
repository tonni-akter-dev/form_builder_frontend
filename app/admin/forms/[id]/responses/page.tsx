/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast } from "react-toastify";

interface Response {
  _id: string;
  formId: string;
  answers: Array<{
    fieldId: string;
    value: any;
  }>;
  submittedAt: string;
}

interface FormField {
  _id: string;
  label: string;
  type: string;
}

interface Form {
  _id: string;
  title: string;
  fields: FormField[];
}

const FormResponsesPage = () => {
  const router = useRouter();
  const { formId } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (!formId) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch form details and responses
        const [formRes, responsesRes] = await Promise.all([
          axios.get(`/forms/${formId}`, { headers }),
          axios.get(`/responses/${formId}`, { headers }),
        ]);

        setForm(formRes.data);
        setResponses(responsesRes.data);
      } catch (err: any) {
        console.error("Error fetching responses:", err);
        toast.error(err.response?.data?.error || "Failed to load responses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getFieldValue = (answer: any, field: FormField) => {
    const value = answer?.value;
    
    if (value === null || value === undefined) return "-";
    
    if (field.type === "checkbox" && Array.isArray(value)) {
      return value.join(", ") || "-";
    }
    
    if (field.type === "checkbox_grid" && typeof value === "object") {
      const selections: string[] = [];
      Object.entries(value).forEach(([row, cols]) => {
        if (Array.isArray(cols) && cols.length > 0) {
          selections.push(`${row}: ${cols.join(", ")}`);
        }
      });
      return selections.join("; ") || "-";
    }
    
    if (field.type === "multiple_choice_grid" && typeof value === "object") {
      const selections: string[] = [];
      Object.entries(value).forEach(([row, col]) => {
        if (col) {
          selections.push(`${row}: ${col}`);
        }
      });
      return selections.join("; ") || "-";
    }
    
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    
    return String(value);
  };

  const exportToCSV = () => {
    if (!form || responses.length === 0) {
      toast.info("No data to export");
      return;
    }

    setExportLoading(true);

    try {
      // Prepare CSV headers
      const headers = [
        "Submission ID",
        "Submitted At",
        ...form.fields.map((f) => f.label),
      ];

      // Prepare CSV rows
      const rows = responses.map((response) => {
        const row = [
          response._id,
          formatDate(response.submittedAt),
          ...form.fields.map((field) => {
            const answer = response.answers.find((a) => a.fieldId === field._id);
            return getFieldValue(answer, field);
          }),
        ];
        return row.map(cell => `"${cell}"`).join(",");
      });

      // Combine headers and rows
      const csv = [headers.join(","), ...rows].join("\n");

      // Create download link
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${form.title}_responses.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Responses exported successfully!");
    } catch (err) {
      console.error("Error exporting CSV:", err);
      toast.error("Failed to export responses");
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
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
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {form?.title} - Responses
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Total Responses: {responses.length}
            </span>
            <button
              onClick={exportToCSV}
              disabled={exportLoading || responses.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {exportLoading ? "Exporting..." : "Export to CSV"}
            </button>
          </div>
        </div>

        {/* Responses Table */}
        {responses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
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
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No responses yet
            </h3>
            <p className="mt-2 text-gray-500">
              Share your form with users to start collecting responses.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted At
                    </th>
                    {form?.fields.map((field) => (
                      <th
                        key={field._id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {field.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {responses.map((response, index) => (
                    <tr key={response._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(response.submittedAt)}
                      </td>
                      {form?.fields.map((field) => {
                        const answer = response.answers.find(
                          (a) => a.fieldId === field._id
                        );
                        return (
                          <td
                            key={field._id}
                            className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate"
                            title={getFieldValue(answer, field)}
                          >
                            {getFieldValue(answer, field)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormResponsesPage;