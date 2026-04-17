/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import Link from "next/link";

interface AttemptedExam {
  _id: string;
  formId: {
    _id: string;
    title: string;
    description: string;
    subject: string;
    className: string;
    duration: number;
    totalMarks: number;
  };
  answers: any[];
  submittedAt: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  resultStatus: "pass" | "fail" | "pending";
  timeSpent: number;
  feedback?: string;
  teacherNotes?: Array<{
    fieldId: string;
    fieldLabel: string;
    note: string;
  }>;
}

const StudentDashboard = () => {
  const router = useRouter();
  const [attempts, setAttempts] = useState<AttemptedExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<AttemptedExam | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to view your dashboard");
          router.push("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Get current user info
        const userRes = await axios.get("/auth/me", { headers });
        const userId = userRes.data.user._id;

        // Get user's responses
        const responsesRes = await axios.get(`/responses/user/${userId}`, {
          headers,
        });

        setAttempts(responsesRes.data.responses || []);
      } catch (err: any) {
        console.error("Error fetching attempts:", err);
        toast.error(
          err.response?.data?.error || "Failed to load your exam history",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [router]);

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
    if (minutes > 0) {
      return `${minutes} min ${secs} sec`;
    }
    return `${secs} sec`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 70) return "text-green-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getResultBadge = (status: string, percentage?: number) => {
    if (status === "pass") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Passed
        </span>
      );
    } else if (status === "fail") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        Pending Review
      </span>
    );
  };

  const viewFeedback = (exam: AttemptedExam) => {
    setSelectedExam(exam);
    setShowFeedbackModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your exam history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-2">
            View your exam history and results
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Total Exams Taken</p>
            <p className="text-2xl font-bold text-gray-900">
              {attempts.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Average Score</p>
            <p className="text-2xl font-bold text-blue-600">
              {attempts.length > 0
                ? (
                    attempts.reduce((acc, a) => acc + (a.percentage || 0), 0) /
                    attempts.length
                  ).toFixed(1)
                : 0}
              %
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Passed</p>
            <p className="text-2xl font-bold text-green-600">
              {attempts.filter((a) => a.resultStatus === "pass").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-600">
              {attempts.filter((a) => a.resultStatus === "pending").length}
            </p>
          </div>
        </div>

        {/* Exams Table */}
        {attempts.length === 0 ? (
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
              No exams attempted yet
            </h3>
            <p className="mt-2 text-gray-500">{`You haven't taken any exams. Visit the exams page to get started.`}</p>
            <button
              onClick={() => router.push("/exams")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Browse Exams
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Result
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attempts.map((attempt, index) => (
                    <tr key={attempt._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {attempt.formId?.title || "Unknown Exam"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {attempt.formId?.className || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {attempt.formId?.subject || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(attempt.submittedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {attempt.obtainedMarks || 0} /
                          {attempt.totalMarks || 0}
                        </div>
                        <div
                          className={`text-xs ${getScoreColor(attempt.percentage || 0)}`}
                        >
                          {attempt.percentage?.toFixed(1) || 0}%
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getResultBadge(
                          attempt.resultStatus,
                          attempt.percentage,
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => viewFeedback(attempt)}
                          className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                        >
                          View Details
                        </button>
                       
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedExam && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0  transition-opacity"
              onClick={() => setShowFeedbackModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Exam Details & Feedback
                      </h3>
                      <button
                        onClick={() => setShowFeedbackModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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

                    {/* Exam Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-gray-800">
                        {selectedExam.formId?.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedExam.formId?.subject} -{" "}
                        {selectedExam.formId?.className}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Submitted:</span>{" "}
                          {formatDate(selectedExam.submittedAt)}
                        </div>
                        <div>
                          <span className="text-gray-500">Time Spent:</span>{" "}
                          {formatTime(selectedExam.timeSpent)}
                        </div>
                      </div>
                    </div>

                    {/* Score Summary */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-gray-500">Total Marks</p>
                        <p className="text-xl font-bold text-gray-900">
                          {selectedExam.totalMarks || 0}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-500">Obtained Marks</p>
                        <p className="text-xl font-bold text-blue-600">
                          {selectedExam.obtainedMarks || 0}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-gray-500">Percentage</p>
                        <p
                          className={`text-xl font-bold ${getScoreColor(selectedExam.percentage || 0)}`}
                        >
                          {selectedExam.percentage?.toFixed(1) || 0}%
                        </p>
                      </div>
                    </div>

                    {/* Question-wise Results */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Question-wise Results
                      </h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {selectedExam.answers?.map((answer, idx) => (
                          <div
                            key={idx}
                            className={`border rounded-lg p-3 ${
                              answer.isCorrect
                                ? "border-green-200 bg-green-50"
                                : answer.needsManualGrading
                                  ? "border-yellow-200 bg-yellow-50"
                                  : "border-red-200 bg-red-50"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">
                                  Q{idx + 1}. {answer.fieldLabel}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  Marks: {answer.marksAwarded || 0} /{" "}
                                  {answer.totalMarks || 1}
                                </p>
                              </div>
                              <div
                                className={`text-xs font-medium ${
                                  answer.isCorrect
                                    ? "text-green-600"
                                    : answer.needsManualGrading
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                {answer.isCorrect
                                  ? "✓ Correct"
                                  : answer.needsManualGrading
                                    ? "⏳ Pending Review"
                                    : "✗ Incorrect"}
                              </div>
                            </div>

                            <div className="mt-2 text-sm">
                              <p>
                                <span className="text-gray-500">
                                  Your Answer:
                                </span>{" "}
                                {answer.value || "(No answer)"}
                              </p>
                              {!answer.isCorrect &&
                                answer.correctAnswer &&
                                !answer.needsManualGrading && (
                                  <p className="mt-1">
                                    <span className="text-gray-500">
                                      Correct Answer:
                                    </span>{" "}
                                    <span className="text-green-700">
                                      {answer.correctAnswer}
                                    </span>
                                  </p>
                                )}
                            </div>

                            {/* Teacher Feedback */}
                            {answer.teacherFeedback && (
                              <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                <p className="text-blue-600 font-medium">{`Teacher's Feedback:`}</p>
                                <p className="text-blue-800">
                                  {answer.teacherFeedback}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
