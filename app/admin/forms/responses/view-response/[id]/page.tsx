/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast } from "react-toastify";

interface Answer {
  fieldId: string;
  value: any;
  fieldLabel?: string;
  isCorrect?: boolean;
  marksAwarded?: number;
  correctAnswer?: any;
  fileUrls?: string[];
  needsManualGrading?: boolean;
}

interface Response {
  _id: string;
  formId: string | { _id: string; title?: string };
  answers: Answer[];
  submittedAt: string;
  submittedBy?: {
    _id: string;
    username: string;
    email: string;
    fullName?: string;
    className?: string;
    rollNumber?: string;
    phoneNumber?: string;
  };
  totalMarks?: number;
  obtainedMarks?: number;
  percentage?: number;
  resultStatus?: string;
  timeSpent?: number;
  overallFeedback?: string;
}

interface FormField {
  _id: string;
  label: string;
  type: string;
  marks?: number;
  correctAnswer?: any;
  description?: string;
  options?: string[];
}

interface Form {
  _id: string;
  title: string;
  description: string;
  className: string;
  subject: string;
  duration: number;
  totalMarks: number;
  fields: FormField[];
}

const ViewResponsePage = () => {
  const router = useRouter();
  const params = useParams();
  const responseId = params?.id as string;

  const [response, setResponse] = useState<Response | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [teacherNotes, setTeacherNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!responseId) {
      toast.error("No response ID provided");
      router.push("/admin/forms");
      return;
    }

    const fetchResponseDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login");
          router.push("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const responseRes = await axios.get(
          `/responses/response/${responseId}`,
          { headers },
        );
        const responseData = responseRes.data.response;

        setResponse(responseData);
        setAnswers(responseData.answers || []);

        let formIdToFetch;
        if (typeof responseData.formId === "string") {
          formIdToFetch = responseData.formId;
        } else if (
          responseData.formId &&
          typeof responseData.formId === "object"
        ) {
          formIdToFetch = responseData.formId._id;
        }

        const formRes = await axios.get(`/forms/${formIdToFetch}`, { headers });
        setForm(formRes.data);
      } catch (err: any) {
        console.error("Error fetching response details:", err);
        toast.error(
          err.response?.data?.error || "Failed to load response details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResponseDetails();
  }, [responseId, router]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (err) {
      return dateString;
    }
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return "-";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes} min ${secs} sec` : `${secs} sec`;
  };

  const getFieldValue = (answer: Answer | undefined, field: FormField) => {
    if (!answer || answer.value === null || answer.value === undefined)
      return "-";
    const value = answer.value;
    if (field.type === "checkbox" && Array.isArray(value))
      return value.join(", ") || "-";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 70) return "text-green-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getResultBadge = (status?: string) => {
    if (status === "pass")
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Pass
        </span>
      );
    if (status === "fail")
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Fail
        </span>
      );
    return <span className="text-xs text-gray-500">Pending</span>;
  };

  const needsManualEvaluation = (fieldType: string) => {
    return (
      fieldType === "text" ||
      fieldType === "textarea" ||
      fieldType === "image_text" ||
      fieldType === "file_upload"
    );
  };

  const handleTeacherNotesChange = (fieldId: string, notes: string) => {
    setTeacherNotes((prev) => ({ ...prev, [fieldId]: notes }));
  };

  const handleMarksChange = (
    fieldId: string,
    marksAwarded: number,
    isCorrect: boolean,
  ) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.fieldId === fieldId ? { ...a, marksAwarded, isCorrect } : a,
      ),
    );
  };
  const [overallFeedback, setOverallFeedback] = useState(
    response?.overallFeedback || "",
  );

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login");
        return;
      }

      const updates = answers.map((answer) => ({
        fieldId: answer.fieldId,
        marksAwarded: answer.marksAwarded || 0,
        isCorrect: answer.isCorrect || false,
        teacherFeedback: teacherNotes[answer.fieldId] || "",
      }));

      await axios.put(
        `/responses/${responseId}/batch-evaluate`,
        {
          updates,
          overallFeedback,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("All evaluations saved successfully!");
      router.back();
    } catch (err: any) {
      console.error("Error saving evaluations:", err);
      toast.error(err.response?.data?.error || "Failed to save evaluations");
    } finally {
      setSaving(false);
    }
  };

  const renderFileAttachments = (answer: Answer | undefined) => {
    if (!answer?.fileUrls || answer.fileUrls.length === 0) return null;

    return (
      <div className="mt-2">
        <p className="text-xs text-gray-500 mb-1">
          Attached Files ({answer.fileUrls.length}):
        </p>
        <div className="flex flex-wrap gap-2">
          {answer.fileUrls.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(url)}
              className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
              {url.includes(".jpg") ||
              url.includes(".png") ||
              url.includes(".jpeg") ||
              url.includes(".gif")
                ? "View Image"
                : "View File"}{" "}
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading response details...</p>
        </div>
      </div>
    );
  }

  if (!response || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Response not found</p>
          <button
            onClick={() => router.push("/admin/forms")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Go to Forms
          </button>
        </div>
      </div>
    );
  }

  const totalMarks = response.totalMarks || form.totalMarks;
  const obtainedMarks = answers.reduce(
    (sum, a) => sum + (a.marksAwarded || 0),
    0,
  );
  const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full p-4">
              <img
                src={selectedImage}
                alt="Full size"
                className="max-w-full max-h-screen object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-opacity-75"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

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
              Back to Responses
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {form.subject} - {form.className}
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save All Evaluations"}
          </button>
        </div>

        {/* Student Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Student Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="text-sm font-medium">
                {response.submittedBy?.fullName ||
                  response.submittedBy?.username ||
                  "Anonymous"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium">
                {response.submittedBy?.email || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Roll Number</p>
              <p className="text-sm font-medium">
                {response.submittedBy?.rollNumber || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Class</p>
              <p className="text-sm font-medium">
                {response.submittedBy?.className || form.className}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Submitted At</p>
              <p className="text-sm font-medium">
                {formatDate(response.submittedAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Time Spent</p>
              <p className="text-sm font-medium">
                {formatTime(response.timeSpent)}
              </p>
            </div>
          </div>
        </div>

        {/* Score Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Score Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Total Marks</p>
              <p className="text-2xl font-bold">{totalMarks}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Obtained Marks</p>
              <p className="text-2xl font-bold text-blue-600">
                {obtainedMarks}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Percentage</p>
              <p className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                {percentage.toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Result</p>
              <div className="mt-2">
                {getResultBadge(response.resultStatus)}
              </div>
            </div>
          </div>
        </div>

        {/* Questions and Answers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Question-wise Evaluation
          </h2>
          <div className="space-y-4">
            {form.fields.map((field, index) => {
              const answer = answers.find((a) => a.fieldId === field._id);
              const isManualEvaluation = needsManualEvaluation(field.type);

              return (
                <div
                  key={field._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        {index + 1}. {field.label}
                      </p>
                      {field.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {field.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="text-right">
                        <label className="text-xs text-gray-500 block">
                          Marks
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={field.marks || 1}
                          value={answer?.marksAwarded || 0}
                          onChange={(e) => {
                            const newMarks = Math.min(
                              parseInt(e.target.value) || 0,
                              field.marks || 1,
                            );
                            const newIsCorrect = isManualEvaluation
                              ? newMarks === (field.marks || 1)
                              : answer?.isCorrect || false;
                            handleMarksChange(
                              field._id,
                              newMarks,
                              newIsCorrect,
                            );
                          }}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-400">
                          / {field.marks || 1}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Student's Answer */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-500 mb-1">
                      {`Student's`} Answer:
                    </p>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap">
                      {getFieldValue(answer, field)}
                    </div>
                    {renderFileAttachments(answer)}
                  </div>

                  {/* Reference Answer */}
                  {isManualEvaluation && field.correctAnswer && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <p className="text-xs text-blue-600 mb-1">
                        Reference Answer (for teacher):
                      </p>
                      <div className="text-sm text-blue-800">
                        {field.correctAnswer}
                      </div>
                    </div>
                  )}

                  {/* Auto-grade Status */}
                  {!isManualEvaluation && answer?.isCorrect !== undefined && (
                    <div
                      className={`mt-2 text-xs ${answer.isCorrect ? "text-green-600" : "text-red-600"}`}
                    >
                      {answer.isCorrect
                        ? "✓ Auto-graded as correct"
                        : "✗ Auto-graded as incorrect"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Feedback for Student
          </label>
          <textarea
            rows={3}
            value={overallFeedback}
            onChange={(e) => setOverallFeedback(e.target.value)}
            placeholder="Provide overall feedback, comments, or suggestions for improvement..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default ViewResponsePage;
