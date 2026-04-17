/* eslint-disable react-hooks/rules-of-hooks */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "@/lib/axios";
// import { toast } from "react-toastify";

// interface Answer {
//   fieldId: string;
//   value: any;
//   fieldLabel?: string;
//   isCorrect?: boolean;
//   marksAwarded?: number;
//   correctAnswer?: any;
// }

// interface Response {
//   _id: string;
//   formId: string;
//   answers: Answer[];
//   submittedAt: string;
//   submittedBy?: {
//     _id: string;
//     username: string;
//     email: string;
//     fullName?: string;
//     className?: string;
//     rollNumber?: string;
//     phoneNumber?: string;
//   };
//   totalMarks?: number;
//   obtainedMarks?: number;
//   percentage?: number;
//   resultStatus?: string;
//   timeSpent?: number;
//   ipAddress?: string;
//   userAgent?: string;
// }

// interface FormField {
//   _id: string;
//   label: string;
//   type: string;
//   marks?: number;
//   correctAnswer?: any;
//   description?: string;
//   options?: string[];
// }

// interface Form {
//   _id: string;
//   title: string;
//   description: string;
//   className: string;
//   subject: string;
//   duration: number;
//   totalMarks: number;
//   fields: FormField[];
// }

// const FormResponsesPage = () => {
//   const router = useRouter();
//   const params = useParams();
//   const formId = params?.id as string;

//   const [form, setForm] = useState<Form | null>(null);
//   const [responses, setResponses] = useState<Response[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [exportLoading, setExportLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);

//   useEffect(() => {
//     if (!formId) {
//       setError("No form ID provided");
//       setLoading(false);
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Please login to view responses");
//           router.push("/login");
//           return;
//         }

//         const headers = { Authorization: `Bearer ${token}` };
//         const [formRes, responsesRes] = await Promise.all([
//           axios.get(`/forms/${formId}`, { headers }),
//           axios.get(`/responses/${formId}`, { headers }),
//         ]);

//         console.log("Form data:", formRes.data);
//         console.log("Responses data:", responsesRes.data);

//         setForm(formRes.data);
//         setResponses(responsesRes.data.responses || []);
//       } catch (err: any) {
//         console.error("Error fetching responses:", err);

//         let errorMessage = "Failed to load responses";

//         if (err.response) {
//           if (err.response.status === 401) {
//             errorMessage = "Session expired. Please login again.";
//             localStorage.removeItem("token");
//             localStorage.removeItem("user");
//             router.push("/login");
//           } else if (err.response.status === 403) {
//             errorMessage = "You don't have permission to view these responses.";
//           } else if (err.response.status === 404) {
//             errorMessage = "Form not found.";
//           } else {
//             errorMessage = err.response.data?.error || err.response.data?.message || errorMessage;
//           }
//         } else if (err.request) {
//           errorMessage = "Network error. Please check your connection.";
//         }

//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [formId, router]);

//   const formatDate = (dateString: string) => {
//     try {
//       return new Date(dateString).toLocaleString();
//     } catch (err) {
//       return dateString;
//     }
//   };

//   const formatTime = (seconds?: number) => {
//     if (!seconds) return "-";
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     if (minutes > 0) {
//       return `${minutes} min ${secs} sec`;
//     }
//     return `${secs} sec`;
//   };

//   const getFieldValue = (answer: Answer | undefined, field: FormField) => {
//     if (!answer || answer.value === null || answer.value === undefined)
//       return "-";

//     const value = answer.value;

//     try {
//       if (field.type === "checkbox" && Array.isArray(value)) {
//         return value.join(", ") || "-";
//       }

//       if (
//         field.type === "checkbox_grid" &&
//         typeof value === "object" &&
//         value !== null
//       ) {
//         const selections: string[] = [];
//         Object.entries(value).forEach(([row, cols]) => {
//           if (Array.isArray(cols) && cols.length > 0) {
//             selections.push(`${row}: ${cols.join(", ")}`);
//           }
//         });
//         return selections.join("; ") || "-";
//       }

//       if (
//         field.type === "multiple_choice_grid" &&
//         typeof value === "object" &&
//         value !== null
//       ) {
//         const selections: string[] = [];
//         Object.entries(value).forEach(([row, col]) => {
//           if (col) {
//             selections.push(`${row}: ${col}`);
//           }
//         });
//         return selections.join("; ") || "-";
//       }

//       if (typeof value === "object") {
//         return JSON.stringify(value);
//       }

//       return String(value);
//     } catch (err) {
//       console.error("Error formatting field value:", err);
//       return "-";
//     }
//   };

//   const getScoreColor = (percentage?: number) => {
//     if (!percentage) return "text-gray-600";
//     if (percentage >= 70) return "text-green-600";
//     if (percentage >= 40) return "text-yellow-600";
//     return "text-red-600";
//   };

//   const getResultBadge = (status?: string) => {
//     if (status === "pass") {
//       return (
//         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//           <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//             <path
//               fillRule="evenodd"
//               d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//               clipRule="evenodd"
//             />
//           </svg>
//           Pass
//         </span>
//       );
//     } else if (status === "fail") {
//       return (
//         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//           <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//             <path
//               fillRule="evenodd"
//               d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//               clipRule="evenodd"
//             />
//           </svg>
//           Fail
//         </span>
//       );
//     }
//     return <span className="text-xs text-gray-500">Pending</span>;
//   };

//   const exportToCSV = () => {
//     if (!form || responses.length === 0) {
//       toast.info("No data to export");
//       return;
//     }

//     setExportLoading(true);

//     try {
//       const headers = [
//         "Submission ID",
//         "Student Name",
//         "Student Email",
//         "Roll Number",
//         "Class",
//         "Phone Number",
//         "Submitted At",
//         "Time Spent",
//         "Total Marks",
//         "Obtained Marks",
//         "Percentage",
//         "Result",
//         "IP Address",
//         ...form.fields.map((f) => f.label),
//       ];

//       const rows = responses.map((response) => {
//         const row = [
//           response._id,
//           response.submittedBy?.fullName || response.submittedBy?.username || "Anonymous",
//           response.submittedBy?.email || "-",
//           response.submittedBy?.rollNumber || "-",
//           response.submittedBy?.className || "-",
//           response.submittedBy?.phoneNumber || "-",
//           formatDate(response.submittedAt),
//           formatTime(response.timeSpent),
//           response.totalMarks || form.totalMarks || "-",
//           response.obtainedMarks || "-",
//           response.percentage ? `${response.percentage.toFixed(1)}%` : "-",
//           response.resultStatus || "-",
//           response.ipAddress || "-",
//           ...form.fields.map((field) => {
//             const answer = response.answers.find((a) => a.fieldId === field._id);
//             return getFieldValue(answer, field);
//           }),
//         ];
//         return row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",");
//       });

//       const csv = [headers.join(","), ...rows].join("\n");
//       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//       const link = document.createElement("a");
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", `${form.title.replace(/[^a-z0-9]/gi, "_")}_responses.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);

//       toast.success("Responses exported successfully!");
//     } catch (err) {
//       console.error("Error exporting CSV:", err);
//       toast.error("Failed to export responses");
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   // View Details Modal Component
//   const ViewDetailsModal = ({ response, onClose }: { response: Response; onClose: () => void }) => {
//     if (!form) return null;

//     return (
//       <div className="fixed inset-0 z-50 overflow-y-auto">
//         <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//           <div className="fixed inset-0 transition-opacity " onClick={onClose}></div>

//           <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
//             <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//               <div className="sm:flex sm:items-start">
//                 <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg leading-6 font-medium text-gray-900">
//                       Student Response Details
//                     </h3>
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
//                       <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </div>

//                   {/* Student Information */}
//                   <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
//                     <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
//                       <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                       Student Information
//                     </h4>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                       <div>
//                         <p className="text-xs text-gray-500">Full Name</p>
//                         <p className="text-sm font-medium text-gray-900">
//                           {response.submittedBy?.fullName || response.submittedBy?.username || "Anonymous"}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Email</p>
//                         <p className="text-sm font-medium text-gray-900">{response.submittedBy?.email || "-"}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Roll Number</p>
//                         <p className="text-sm font-medium text-gray-900">{response.submittedBy?.rollNumber || "-"}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Class</p>
//                         <p className="text-sm font-medium text-gray-900">{response.submittedBy?.className || form.className}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Submitted At</p>
//                         <p className="text-sm font-medium text-gray-900">{formatDate(response.submittedAt)}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Time Spent</p>
//                         <p className="text-sm font-medium text-gray-900">{formatTime(response.timeSpent)}</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Score Summary */}
//                   <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 mb-6">
//                     <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
//                       <svg className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                       </svg>
//                       Score Summary
//                     </h4>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       <div>
//                         <p className="text-xs text-gray-500">Total Marks</p>
//                         <p className="text-xl font-bold text-gray-900">{response.totalMarks || form.totalMarks}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Obtained Marks</p>
//                         <p className="text-xl font-bold text-blue-600">{response.obtainedMarks || 0}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Percentage</p>
//                         <p className={`text-xl font-bold ${getScoreColor(response.percentage)}`}>
//                           {response.percentage?.toFixed(1) || 0}%
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Result</p>
//                         <div className="mt-1">{getResultBadge(response.resultStatus)}</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Questions and Answers */}
//                   <div>
//                     <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
//                       <svg className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       {`{`Student's`} Answers`}
//                     </h4>
//                     <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
//                       {form.fields.map((field, index) => {
//                         const answer = response.answers.find((a) => a.fieldId === field._id);

//                         return (
//                           <div key={field._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                             {/* Question */}
//                             <div className="mb-3">
//                               <p className="text-sm font-semibold text-gray-900">
//                                 {index + 1}. {field.label}
//                               </p>
//                               {field.description && (
//                                 <p className="text-xs text-gray-500 mt-1">{field.description}</p>
//                               )}
//                             </div>

//                             {/* {`Student's`} Answer */}
//                             <div className="bg-gray-50 rounded-lg p-3">
//                               <p className="text-xs text-gray-500 mb-1">{`{`Student's`} Answer`}:</p>
//                               <div className="text-sm text-gray-800">
//                                 {getFieldValue(answer, field)}
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading responses...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
//           <svg
//             className="mx-auto h-12 w-12 text-red-400"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           <h3 className="mt-4 text-lg font-medium text-red-800">Error</h3>
//           <p className="mt-2 text-red-600">{error}</p>
//           <button
//             onClick={() => router.push("/admin/forms")}
//             className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//           >
//             Go to Forms List
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!form) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600">Form not found</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => router.back()}
//               className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
//             >
//               <svg
//                 className="h-5 w-5 mr-1"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M10 19l-7-7m0 0l7-7m-7 7h18"
//                 />
//               </svg>
//               Back
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
//               <p className="text-sm text-gray-500 mt-1">
//                 {form.subject} - {form.className}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center space-x-3">
//             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//               Total Responses: {responses.length}
//             </span>
//             <button
//               onClick={exportToCSV}
//               disabled={exportLoading || responses.length === 0}
//               className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <svg
//                 className="h-4 w-4 mr-2"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                 />
//               </svg>
//               {exportLoading ? "Exporting..." : "Export to CSV"}
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//             <p className="text-sm text-gray-500">Total Responses</p>
//             <p className="text-2xl font-bold text-gray-900">{responses.length}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//             <p className="text-sm text-gray-500">Average Score</p>
//             <p className="text-2xl font-bold text-blue-600">
//               {responses.length > 0
//                 ? (responses.reduce((acc, r) => acc + (r.percentage || 0), 0) / responses.length).toFixed(1)
//                 : 0}%
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//             <p className="text-sm text-gray-500">Passed</p>
//             <p className="text-2xl font-bold text-green-600">
//               {responses.filter((r) => r.resultStatus === "pass").length}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//             <p className="text-sm text-gray-500">Failed</p>
//             <p className="text-2xl font-bold text-red-600">
//               {responses.filter((r) => r.resultStatus === "fail").length}
//             </p>
//           </div>
//         </div>

//         {/* Responses Table */}
//         {responses.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
//             <svg
//               className="mx-auto h-12 w-12 text-gray-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//               />
//             </svg>
//             <h3 className="mt-4 text-lg font-medium text-gray-900">
//               No responses yet
//             </h3>
//             <p className="mt-2 text-gray-500">
//               Share your form with users to start collecting responses.
//             </p>
//           </div>
//         ) : (
//           <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       #
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Student
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Roll No
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Email
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Submitted At
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Score
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Result
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {responses.map((response, index) => (
//                     <tr key={response._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {index + 1}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {response.submittedBy?.fullName || response.submittedBy?.username || "Anonymous"}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {response.submittedBy?.className || form.className}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {response.submittedBy?.rollNumber || "-"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {response.submittedBy?.email || "-"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(response.submittedAt)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {response.obtainedMarks || 0} / {response.totalMarks || form.totalMarks}
//                         </div>
//                         <div className={`text-xs ${getScoreColor(response.percentage)}`}>
//                           {response.percentage?.toFixed(1) || 0}%
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {getResultBadge(response.resultStatus)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <button
//                           onClick={() => {
//                             console.log("Opening modal for response:", response);
//                             setSelectedResponse(response);
//                             setShowDetailsModal(true);
//                           }}
//                           className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                         >
//                           <svg
//                             className="h-4 w-4 mr-1"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                             />
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                             />
//                           </svg>
//                           View Details
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Evaluation Modal */}
//       {showDetailsModal && selectedResponse && (
//         <ViewDetailsModal
//           response={selectedResponse}
//           onClose={() => {
//             setShowDetailsModal(false);
//             setSelectedResponse(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default FormResponsesPage;
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
}

interface Response {
  _id: string;
  formId: string;
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
  ipAddress?: string;
  userAgent?: string;
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

const FormResponsesPage = () => {
  const router = useRouter();
  const params = useParams();
  const formId = params?.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(
    null,
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [localAnswers, setLocalAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    if (!formId) {
      setError("No form ID provided");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to view responses");
          router.push("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const [formRes, responsesRes] = await Promise.all([
          axios.get(`/forms/${formId}`, { headers }),
          axios.get(`/responses/${formId}`, { headers }),
        ]);

        setForm(formRes.data);
        setResponses(responsesRes.data.responses || []);
      } catch (err: any) {
        console.error("Error fetching responses:", err);

        let errorMessage = "Failed to load responses";

        if (err.response) {
          if (err.response.status === 401) {
            errorMessage = "Session expired. Please login again.";
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
          } else if (err.response.status === 403) {
            errorMessage = "You don't have permission to view these responses.";
          } else if (err.response.status === 404) {
            errorMessage = "Form not found.";
          } else {
            errorMessage =
              err.response.data?.error ||
              err.response.data?.message ||
              errorMessage;
          }
        } else if (err.request) {
          errorMessage = "Network error. Please check your connection.";
        }

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId, router]);

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

  const getFieldValue = (answer: Answer | undefined, field: FormField) => {
    if (!answer || answer.value === null || answer.value === undefined)
      return "-";

    const value = answer.value;

    try {
      if (field.type === "checkbox" && Array.isArray(value)) {
        return value.join(", ") || "-";
      }

      if (
        field.type === "checkbox_grid" &&
        typeof value === "object" &&
        value !== null
      ) {
        const selections: string[] = [];
        Object.entries(value).forEach(([row, cols]) => {
          if (Array.isArray(cols) && cols.length > 0) {
            selections.push(`${row}: ${cols.join(", ")}`);
          }
        });
        return selections.join("; ") || "-";
      }

      if (
        field.type === "multiple_choice_grid" &&
        typeof value === "object" &&
        value !== null
      ) {
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
    } catch (err) {
      console.error("Error formatting field value:", err);
      return "-";
    }
  };

  const getScoreColor = (percentage?: number) => {
    if (!percentage) return "text-gray-600";
    if (percentage >= 70) return "text-green-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getResultBadge = (status?: string) => {
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
          Pass
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
          Fail
        </span>
      );
    }
    return <span className="text-xs text-gray-500">Pending</span>;
  };

  const exportToCSV = () => {
    if (!form || responses.length === 0) {
      toast.info("No data to export");
      return;
    }

    setExportLoading(true);

    try {
      const headers = [
        "Submission ID",
        "Student Name",
        "Student Email",
        "Roll Number",
        "Class",
        "Phone Number",
        "Submitted At",
        "Time Spent",
        "Total Marks",
        "Obtained Marks",
        "Percentage",
        "Result",
        "IP Address",
        ...form.fields.map((f) => f.label),
      ];

      const rows = responses.map((response) => {
        const row = [
          response._id,
          response.submittedBy?.fullName ||
            response.submittedBy?.username ||
            "Anonymous",
          response.submittedBy?.email || "-",
          response.submittedBy?.rollNumber || "-",
          response.submittedBy?.className || "-",
          response.submittedBy?.phoneNumber || "-",
          formatDate(response.submittedAt),
          formatTime(response.timeSpent),
          response.totalMarks || form.totalMarks || "-",
          response.obtainedMarks || "-",
          response.percentage ? `${response.percentage.toFixed(1)}%` : "-",
          response.resultStatus || "-",
          response.ipAddress || "-",
          ...form.fields.map((field) => {
            const answer = response.answers.find(
              (a) => a.fieldId === field._id,
            );
            return getFieldValue(answer, field);
          }),
        ];
        return row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",");
      });

      const csv = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${form.title.replace(/[^a-z0-9]/gi, "_")}_responses.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Responses exported successfully!");
    } catch (err) {
      console.error("Error exporting CSV:", err);
      toast.error("Failed to export responses");
    } finally {
      setExportLoading(false);
    }
  };

  // Check if field needs manual evaluation
  const needsManualEvaluation = (fieldType: string) => {
    return fieldType === "text" || fieldType === "textarea";
  };

  // Save evaluation for a single field
  const saveEvaluation = async (
    responseId: string,
    fieldId: string,
    marksAwarded: number,
    isCorrect: boolean,
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login");
        return false;
      }

      const response = await axios.put(
        `/responses/${responseId}/evaluate`,
        {
          fieldId,
          marksAwarded,
          isCorrect,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return true;
    } catch (err: any) {
      console.error("Error saving evaluation:", err);
      toast.error(err.response?.data?.error || "Failed to save evaluation");
      return false;
    }
  };

  // Save all evaluations at once
  const saveAllEvaluations = async (responseId: string, answers: Answer[]) => {
    setEvaluating(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login");
        return false;
      }

      const updates = answers.map((answer) => ({
        fieldId: answer.fieldId,
        marksAwarded: answer.marksAwarded || 0,
        isCorrect: answer.isCorrect || false,
      }));

      const response = await axios.put(
        `/responses/${responseId}/batch-evaluate`,
        { updates },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Update local state
      setResponses((prevResponses) =>
        prevResponses.map((r) => {
          if (r._id === responseId) {
            return {
              ...r,
              answers: answers,
              obtainedMarks: response.data.obtainedMarks,
              percentage: response.data.percentage,
              resultStatus: response.data.resultStatus,
            };
          }
          return r;
        }),
      );

      toast.success("All evaluations saved successfully!");
      return true;
    } catch (err: any) {
      console.error("Error saving evaluations:", err);
      toast.error(err.response?.data?.error || "Failed to save evaluations");
      return false;
    } finally {
      setEvaluating(false);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
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
          <h3 className="mt-4 text-lg font-medium text-red-800">Error</h3>
          <p className="mt-2 text-red-600">{error}</p>
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

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Form not found</p>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {form.subject} - {form.className}
              </p>
            </div>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Total Responses</p>
            <p className="text-2xl font-bold text-gray-900">
              {responses.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Average Score</p>
            <p className="text-2xl font-bold text-blue-600">
              {responses.length > 0
                ? (
                    responses.reduce((acc, r) => acc + (r.percentage || 0), 0) /
                    responses.length
                  ).toFixed(1)
                : 0}
              %
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Passed</p>
            <p className="text-2xl font-bold text-green-600">
              {responses.filter((r) => r.resultStatus === "pass").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Failed</p>
            <p className="text-2xl font-bold text-red-600">
              {responses.filter((r) => r.resultStatus === "fail").length}
            </p>
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
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted At
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
                  {responses.map((response, index) => (
                    <tr key={response._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {response.submittedBy?.fullName ||
                            response.submittedBy?.username ||
                            "Anonymous"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {response.submittedBy?.className || form.className}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {response.submittedBy?.rollNumber || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {response.submittedBy?.email || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(response.submittedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {response.obtainedMarks || 0} /{" "}
                          {response.totalMarks || form.totalMarks}
                        </div>
                        <div
                          className={`text-xs ${getScoreColor(response.percentage)}`}
                        >
                          {response.percentage?.toFixed(1) || 0}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getResultBadge(response.resultStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => {
                            router.push(
                              `/admin/forms/responses/view-response/${response._id}`,
                            );
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <svg
                            className="h-4 w-4 mr-1"
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
                          Evaluate
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

      {/* Evaluation Modal */}
      {/* {showDetailsModal && selectedResponse && (
        <ViewDetailsModal
          response={selectedResponse}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedResponse(null);
          }}
        />
      )} */}
    </div>
  );
};

export default FormResponsesPage;
