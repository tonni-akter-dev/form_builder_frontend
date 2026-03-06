// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "@/lib/axios";
// import { toast } from "react-toastify";

// interface FormField {
//   _id: string;
//   label: string;
//   description?: string;
//   type: string;
//   options?: string[];
//   rows?: string[];
//   columns?: string[];
//   required: boolean;
//   ratingStyle?: "star" | "number" | "emoji";
//   ratingMin?: number;
//   ratingMax?: number;
//   ratingLabels?: {
//     min?: string;
//     max?: string;
//     middle?: string;
//   };
//   min?: number;
//   max?: number;
// }

// interface Form {
//   _id: string;
//   title: string;
//   description: string;
//   isPublished: boolean;
//   fields: FormField[];
// }

// interface FormData {
//   [key: string]:
//     | string
//     | number
//     | boolean
//     | string[]
//     | { [key: string]: string | string[] }
//     | File
//     | null;
// }

// const PublicFormPage = () => {
//   const router = useRouter();
//   const { id } = useParams();
//   const [form, setForm] = useState<Form | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [formData, setFormData] = useState<FormData>({});
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [files, setFiles] = useState<{ [key: string]: File | null }>({});

//   useEffect(() => {
//     if (!id) return;

//     const fetchForm = async () => {
//       try {
//         const response = await axios.get(`/forms/${id}`);
//         console.log("Form data:", response.data);
//         setForm(response.data);

//         // Initialize form data
//         const initialData: FormData = {};
//         response.data.fields.forEach((field: FormField) => {
//           if (field.type === "checkbox") {
//             initialData[field._id] = [];
//           } else if (field.type === "checkbox_grid") {
//             initialData[field._id] = {};
//           } else if (field.type === "multiple_choice_grid") {
//             initialData[field._id] = {};
//           } else {
//             initialData[field._id] = "";
//           }
//         });
//         setFormData(initialData);
//       } catch (err: any) {
//         console.error("Error fetching form:", err);
//         toast.error(err.response?.data?.error || "Failed to load form");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchForm();
//   }, [id]);

//   const validateField = (field: FormField, value: any): string => {
//     if (field.required) {
//       if (value === undefined || value === null || value === "") {
//         return "This field is required";
//       }
//       if (Array.isArray(value) && value.length === 0) {
//         return "This field is required";
//       }
//       if (typeof value === "object" && Object.keys(value).length === 0) {
//         return "This field is required";
//       }
//     }

//     if (field.type === "number" && value) {
//       const num = Number(value);
//       if (field.min !== undefined && num < field.min) {
//         return `Value must be at least ${field.min}`;
//       }
//       if (field.max !== undefined && num > field.max) {
//         return `Value must be at most ${field.max}`;
//       }
//     }

//     if (field.type === "file_upload" && field.required && !files[field._id]) {
//       return "Please upload a file";
//     }

//     return "";
//   };

//   const validateForm = (): boolean => {
//     if (!form) return false;

//     const newErrors: { [key: string]: string } = {};
//     form.fields.forEach((field) => {
//       const value = formData[field._id];
//       const error = validateField(field, value);
//       if (error) {
//         newErrors[field._id] = error;
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (fieldId: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [fieldId]: value }));
//     // Clear error for this field
//     if (errors[fieldId]) {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[fieldId];
//         return newErrors;
//       });
//     }
//   };

//   const handleFileChange = (fieldId: string, file: File | null) => {
//     setFiles((prev) => ({ ...prev, [fieldId]: file }));
//     if (file) {
//       setFormData((prev) => ({ ...prev, [fieldId]: file.name }));
//     }
//     // Clear error for this field
//     if (errors[fieldId]) {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[fieldId];
//         return newErrors;
//       });
//     }
//   };

//   const handleCheckboxChange = (
//     fieldId: string,
//     option: string,
//     checked: boolean,
//   ) => {
//     setFormData((prev) => {
//       const currentValues = (prev[fieldId] as string[]) || [];
//       let newValues;
//       if (checked) {
//         newValues = [...currentValues, option];
//       } else {
//         newValues = currentValues.filter((v) => v !== option);
//       }
//       return { ...prev, [fieldId]: newValues };
//     });
//   };

//   const handleGridCheckboxChange = (
//     fieldId: string,
//     row: string,
//     column: string,
//     checked: boolean,
//   ) => {
//     setFormData((prev) => {
//       const currentGrid = (prev[fieldId] as { [key: string]: string[] }) || {};
//       const rowSelections = currentGrid[row] || [];

//       let newRowSelections;
//       if (checked) {
//         newRowSelections = [...rowSelections, column];
//       } else {
//         newRowSelections = rowSelections.filter((c) => c !== column);
//       }

//       return {
//         ...prev,
//         [fieldId]: {
//           ...currentGrid,
//           [row]: newRowSelections,
//         },
//       };
//     });
//   };

//   const handleGridRadioChange = (
//     fieldId: string,
//     row: string,
//     column: string,
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [fieldId]: {
//         ...((prev[fieldId] as object) || {}),
//         [row]: column,
//       },
//     }));
//   };

//   const handleRatingChange = (fieldId: string, value: number) => {
//     setFormData((prev) => ({ ...prev, [fieldId]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!form || !validateForm()) {
//       toast.error("Please fill all required fields correctly");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       // Create a map of field IDs to labels for quick lookup
//       const fieldLabelMap: { [key: string]: string } = {};
//       form.fields.forEach((field) => {
//         fieldLabelMap[field._id] = field.label;
//       });

//       // Prepare answers with both fieldId and fieldLabel
//       const answers = Object.entries(formData).map(([fieldId, value]) => ({
//         fieldId,
//         fieldLabel: fieldLabelMap[fieldId] || fieldId, // Use label from map, fallback to ID
//         value: value || null,
//       }));

//       // Handle file uploads
//       const fileAnswers = Object.entries(files).map(([fieldId, file]) => ({
//         fieldId,
//         fieldLabel: fieldLabelMap[fieldId] || fieldId,
//         value: file ? file.name : null,
//       }));

//       const allAnswers = [...answers, ...fileAnswers];

//       console.log("Submitting answers:", allAnswers);

//       await axios.post("/responses", {
//         formId: id,
//         answers: allAnswers,
//       });

//       toast.success("Form submitted successfully!");
//       router.push(`/forms/success/${id}`);
//     } catch (err: any) {
//       console.error("Error submitting form:", err);
//       toast.error(err.response?.data?.error || "Failed to submit form");
//     } finally {
//       setSubmitting(false);
//     }
//   };
//   const renderField = (field: FormField) => {
//     const value = formData[field._id];
//     const error = errors[field._id];

//     const label = (
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {field.label}{" "}
//         {field.required && <span className="text-red-500">*</span>}
//         {field.description && (
//           <span className="ml-2 text-xs text-gray-500 font-normal">
//             ({field.description})
//           </span>
//         )}
//       </label>
//     );

//     const errorMessage = error && (
//       <p className="mt-1 text-sm text-red-600">{error}</p>
//     );

//     const baseInputClass = `w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//       error ? "border-red-300" : "border-gray-300"
//     }`;

//     switch (field.type) {
//       case "text":
//         return (
//           <div key={field._id} className="mb-6">
//             {label}
//             <input
//               type="text"
//               value={(value as string) || ""}
//               onChange={(e) => handleInputChange(field._id, e.target.value)}
//               className={baseInputClass}
//               placeholder="Enter your answer"
//             />
//             {errorMessage}
//           </div>
//         );

//       case "textarea":
//         return (
//           <div key={field._id} className="mb-6">
//             {label}
//             <textarea
//               value={(value as string) || ""}
//               onChange={(e) => handleInputChange(field._id, e.target.value)}
//               rows={4}
//               className={baseInputClass}
//               placeholder="Enter your answer"
//             />
//             {errorMessage}
//           </div>
//         );

//       case "number":
//         return (
//           <div key={field._id} className="mb-6">
//             {label}
//             <input
//               type="number"
//               value={(value as number) || ""}
//               onChange={(e) =>
//                 handleInputChange(field._id, e.target.valueAsNumber || "")
//               }
//               min={field.min}
//               max={field.max}
//               className={baseInputClass}
//               placeholder="Enter a number"
//             />
//             {(field.min !== undefined || field.max !== undefined) && (
//               <p className="mt-1 text-xs text-gray-500">
//                 {field.min !== undefined && `Min: ${field.min}`}
//                 {field.min !== undefined && field.max !== undefined && " • "}
//                 {field.max !== undefined && `Max: ${field.max}`}
//               </p>
//             )}
//             {errorMessage}
//           </div>
//         );

//       case "date":
//         return (
//           <div key={field._id} className="mb-6">
//             {label}
//             <input
//               type="date"
//               value={(value as string) || ""}
//               onChange={(e) => handleInputChange(field._id, e.target.value)}
//               className={baseInputClass}
//             />
//             {errorMessage}
//           </div>
//         );

//       case "time":
//         return (
//           <div key={field._id} className="mb-6">
//             {label}
//             <input
//               type="time"
//               value={(value as string) || ""}
//               onChange={(e) => handleInputChange(field._id, e.target.value)}
//               className={baseInputClass}
//             />
//             {errorMessage}
//           </div>
//         );

//       case "file_upload":
//         return (
//           <div key={field._id} className="mb-6">
//             {label}
//             <input
//               type="file"
//               onChange={(e) => {
//                 const file = e.target.files?.[0] || null;
//                 handleFileChange(field._id, file);
//               }}
//               className={`${baseInputClass} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
//             />
//             {files[field._id] && (
//               <p className="mt-1 text-sm text-gray-600">
//                 Selected: {files[field._id]?.name}
//               </p>
//             )}
//             {errorMessage}
//           </div>
//         );

//       case "select":
//         return (
//           <div key={field._id} className="mb-6">
//             {label}
//             <select
//               value={(value as string) || ""}
//               onChange={(e) => handleInputChange(field._id, e.target.value)}
//               className={baseInputClass}
//             >
//               <option value="">Select an option</option>
//               {field.options?.map((option) => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//             {errorMessage}
//           </div>
//         );

//       case "radio":
//         return (
//           <div key={field._id} className="mb-6">
//             {label}
//             <div className="mt-2 space-y-2">
//               {field.options?.map((option) => (
//                 <div key={option} className="flex items-center">
//                   <input
//                     id={`${field._id}-${option}`}
//                     name={field._id}
//                     type="radio"
//                     checked={value === option}
//                     onChange={() => handleInputChange(field._id, option)}
//                     className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   <label
//                     htmlFor={`${field._id}-${option}`}
//                     className="ml-2 block text-sm text-gray-700"
//                   >
//                     {option}
//                   </label>
//                 </div>
//               ))}
//             </div>
//             {errorMessage}
//           </div>
//         );

//       case "checkbox":
//         return (
//           <div key={field._id} className="mb-6">
//             {label}
//             <div className="mt-2 space-y-2">
//               {field.options?.map((option) => (
//                 <div key={option} className="flex items-center">
//                   <input
//                     id={`${field._id}-${option}`}
//                     type="checkbox"
//                     checked={((value as string[]) || []).includes(option)}
//                     onChange={(e) =>
//                       handleCheckboxChange(field._id, option, e.target.checked)
//                     }
//                     className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   <label
//                     htmlFor={`${field._id}-${option}`}
//                     className="ml-2 block text-sm text-gray-700"
//                   >
//                     {option}
//                   </label>
//                 </div>
//               ))}
//             </div>
//             {errorMessage}
//           </div>
//         );

//       case "rating":
//         return (
//           <div key={field._id} className="mb-6">
//             {label}
//             <div className="mt-2">
//               {field.ratingStyle === "star" && (
//                 <div className="flex gap-1">
//                   {Array.from({ length: field.ratingMax || 5 }, (_, i) => {
//                     const starValue = i + 1;
//                     return (
//                       <button
//                         key={starValue}
//                         type="button"
//                         onClick={() => handleRatingChange(field._id, starValue)}
//                         className={`text-3xl focus:outline-none transition-colors ${
//                           (value as number) >= starValue
//                             ? "text-yellow-400"
//                             : "text-gray-300 hover:text-yellow-200"
//                         }`}
//                       >
//                         ★
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}

//               {field.ratingStyle === "number" && (
//                 <div className="flex gap-2">
//                   {Array.from(
//                     {
//                       length:
//                         (field.ratingMax || 5) - (field.ratingMin || 1) + 1,
//                     },
//                     (_, i) => {
//                       const numValue = (field.ratingMin || 1) + i;
//                       return (
//                         <button
//                           key={numValue}
//                           type="button"
//                           onClick={() =>
//                             handleRatingChange(field._id, numValue)
//                           }
//                           className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-medium transition-colors ${
//                             value === numValue
//                               ? "border-blue-500 bg-blue-50 text-blue-700"
//                               : "border-gray-300 hover:border-blue-300 text-gray-700"
//                           }`}
//                         >
//                           {numValue}
//                         </button>
//                       );
//                     },
//                   )}
//                 </div>
//               )}

//               {field.ratingStyle === "emoji" && (
//                 <div className="flex gap-2">
//                   {Array.from({ length: field.ratingMax || 5 }, (_, i) => {
//                     const emojis = ["😞", "😐", "🙂", "😊", "😄"];
//                     const emojiValue = i;
//                     return (
//                       <button
//                         key={emojiValue}
//                         type="button"
//                         onClick={() =>
//                           handleRatingChange(field._id, emojiValue)
//                         }
//                         className={`text-3xl transition-all ${
//                           value === emojiValue
//                             ? "scale-125"
//                             : "scale-100 hover:scale-110"
//                         }`}
//                       >
//                         {emojis[i] || "😊"}
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}

//               {(field.ratingLabels?.min || field.ratingLabels?.max) && (
//                 <div className="flex justify-between mt-2 text-xs text-gray-500">
//                   <span>{field.ratingLabels?.min || ""}</span>
//                   {field.ratingLabels?.middle && (
//                     <span>{field.ratingLabels.middle}</span>
//                   )}
//                   <span>{field.ratingLabels?.max || ""}</span>
//                 </div>
//               )}
//             </div>
//             {errorMessage}
//           </div>
//         );

//       case "checkbox_grid":
//         return (
//           <div key={field._id} className="mb-6 overflow-x-auto">
//             {label}
//             <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"></th>
//                     {field.columns?.map((col) => (
//                       <th
//                         key={col}
//                         className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
//                       >
//                         {col}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {field.rows?.map((row) => {
//                     const rowSelections =
//                       (value as { [key: string]: string[] })?.[row] || [];
//                     return (
//                       <tr key={row}>
//                         <td className="px-4 py-2 text-sm font-medium text-gray-900">
//                           {row}
//                         </td>
//                         {field.columns?.map((col) => (
//                           <td key={col} className="px-4 py-2">
//                             <input
//                               type="checkbox"
//                               checked={rowSelections.includes(col)}
//                               onChange={(e) =>
//                                 handleGridCheckboxChange(
//                                   field._id,
//                                   row,
//                                   col,
//                                   e.target.checked,
//                                 )
//                               }
//                               className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                             />
//                           </td>
//                         ))}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//             {errorMessage}
//           </div>
//         );

//       case "multiple_choice_grid":
//         return (
//           <div key={field._id} className="mb-6 overflow-x-auto">
//             {label}
//             <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"></th>
//                     {field.columns?.map((col) => (
//                       <th
//                         key={col}
//                         className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
//                       >
//                         {col}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {field.rows?.map((row) => {
//                     const selectedCol = (value as { [key: string]: string })?.[
//                       row
//                     ];
//                     return (
//                       <tr key={row}>
//                         <td className="px-4 py-2 text-sm font-medium text-gray-900">
//                           {row}
//                         </td>
//                         {field.columns?.map((col) => (
//                           <td key={col} className="px-4 py-2">
//                             <input
//                               type="radio"
//                               name={`${field._id}_${row}`}
//                               checked={selectedCol === col}
//                               onChange={() =>
//                                 handleGridRadioChange(field._id, row, col)
//                               }
//                               className="border-gray-300 text-blue-600 focus:ring-blue-500"
//                             />
//                           </td>
//                         ))}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//             {errorMessage}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading form...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!form) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center p-8 bg-white rounded-lg shadow-md">
//           <h3 className="text-lg font-medium text-gray-900">Form not found</h3>
//           <p className="mt-2 text-gray-600">
//             {`The form you're looking for doesn't exist.`}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!form.isPublished) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
//           <svg
//             className="mx-auto h-12 w-12 text-yellow-400"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//             />
//           </svg>
//           <h3 className="mt-4 text-lg font-medium text-gray-900">
//             Form Not Published
//           </h3>
//           <p className="mt-2 text-gray-600">
//             This form is currently in draft mode and not available for
//             submissions.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//           <div className="bg-linear-to-r from-blue-600 to-purple-600 px-8 py-6">
//             <h1 className="text-2xl font-bold text-white">{form.title}</h1>
//             {form.description && (
//               <p className="mt-2 text-blue-100">{form.description}</p>
//             )}
//           </div>

//           <form onSubmit={handleSubmit} className="p-8">
//             <div className="space-y-6">
//               {form.fields?.map((field) => renderField(field))}
//             </div>

//             <div className="mt-8">
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 {submitting ? "Submitting..." : "Submit Form"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPage;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
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
}

interface FormData {
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | { [key: string]: string | string[] }
    | File
    | null;
}

const PublicFormPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});

  useEffect(() => {
    if (!id) return;

    const fetchForm = async () => {
      try {
        const response = await axios.get(`/forms/${id}`);
        console.log("Form data:", response.data);
        setForm(response.data);

        // Initialize form data
        const initialData: FormData = {};
        response.data.fields.forEach((field: FormField) => {
          if (field.type === "checkbox") {
            initialData[field._id] = [];
          } else if (field.type === "checkbox_grid") {
            initialData[field._id] = {};
          } else if (field.type === "multiple_choice_grid") {
            initialData[field._id] = {};
          } else {
            initialData[field._id] = "";
          }
        });
        setFormData(initialData);
      } catch (err: any) {
        console.error("Error fetching form:", err);
        toast.error(err.response?.data?.error || "Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  const validateField = (field: FormField, value: any): string => {
    if (field.required) {
      if (value === undefined || value === null || value === "") {
        return "This field is required";
      }
      if (Array.isArray(value) && value.length === 0) {
        return "This field is required";
      }
      if (typeof value === "object" && Object.keys(value).length === 0) {
        return "This field is required";
      }
    }

    if (field.type === "number" && value) {
      const num = Number(value);
      if (field.min !== undefined && num < field.min) {
        return `Value must be at least ${field.min}`;
      }
      if (field.max !== undefined && num > field.max) {
        return `Value must be at most ${field.max}`;
      }
    }

    if (field.type === "file_upload" && field.required && !files[field._id]) {
      return "Please upload a file";
    }

    return "";
  };

  const validateForm = (): boolean => {
    if (!form) return false;

    const newErrors: { [key: string]: string } = {};
    form.fields.forEach((field) => {
      const value = formData[field._id];
      const error = validateField(field, value);
      if (error) {
        newErrors[field._id] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleFileChange = (fieldId: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [fieldId]: file }));
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldId]: file.name }));
    }
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (
    fieldId: string,
    option: string,
    checked: boolean,
  ) => {
    setFormData((prev) => {
      const currentValues = (prev[fieldId] as string[]) || [];
      let newValues;
      if (checked) {
        newValues = [...currentValues, option];
      } else {
        newValues = currentValues.filter((v) => v !== option);
      }
      return { ...prev, [fieldId]: newValues };
    });
  };

  const handleGridCheckboxChange = (
    fieldId: string,
    row: string,
    column: string,
    checked: boolean,
  ) => {
    setFormData((prev) => {
      const currentGrid = (prev[fieldId] as { [key: string]: string[] }) || {};
      const rowSelections = currentGrid[row] || [];

      let newRowSelections;
      if (checked) {
        newRowSelections = [...rowSelections, column];
      } else {
        newRowSelections = rowSelections.filter((c) => c !== column);
      }

      return {
        ...prev,
        [fieldId]: {
          ...currentGrid,
          [row]: newRowSelections,
        },
      };
    });
  };

  const handleGridRadioChange = (
    fieldId: string,
    row: string,
    column: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: {
        ...((prev[fieldId] as object) || {}),
        [row]: column,
      },
    }));
  };

  const handleRatingChange = (fieldId: string, value: number) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form || !validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setSubmitting(true);

    try {
      // Create a map of field IDs to labels for quick lookup
      const fieldLabelMap: { [key: string]: string } = {};
      form.fields.forEach((field) => {
        fieldLabelMap[field._id] = field.label;
      });

      // Prepare answers with both fieldId and fieldLabel
      const answers = Object.entries(formData).map(([fieldId, value]) => ({
        fieldId,
        fieldLabel: fieldLabelMap[fieldId] || fieldId, // Use label from map, fallback to ID
        value: value || null,
      }));

      // Handle file uploads
      const fileAnswers = Object.entries(files).map(([fieldId, file]) => ({
        fieldId,
        fieldLabel: fieldLabelMap[fieldId] || fieldId,
        value: file ? file.name : null,
      }));

      const allAnswers = [...answers, ...fileAnswers];

      console.log("Submitting answers:", allAnswers);

      await axios.post("/responses", {
        formId: id,
        answers: allAnswers,
      });

      toast.success("Form submitted successfully!");
      router.push(`/forms/success/${id}`);
    } catch (err: any) {
      console.error("Error submitting form:", err);
      toast.error(err.response?.data?.error || "Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field._id];
    const error = errors[field._id];

    const label = (
      <div className="mb-2">
        <span className="text-base font-medium text-gray-900">
          {field.label}
        </span>
        {field.required && <span className="text-red-500 ml-1">*</span>}
        {field.description && (
          <p className="text-sm text-gray-500 mt-1">{field.description}</p>
        )}
      </div>
    );

    const errorMessage = error && (
      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        {error}
      </p>
    );

    const baseInputClass = `w-full px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
      error
        ? "border-red-300 bg-red-50"
        : "border-gray-300 hover:border-gray-400"
    }`;

    switch (field.type) {
      case "text":
        return (
          <div key={field._id} className="mb-6">
            {label}
            <input
              type="text"
              value={(value as string) || ""}
              onChange={(e) => handleInputChange(field._id, e.target.value)}
              className={baseInputClass}
              placeholder="Your answer"
            />
            {errorMessage}
          </div>
        );

      case "textarea":
        return (
          <div key={field._id} className="mb-6">
            {label}
            <textarea
              value={(value as string) || ""}
              onChange={(e) => handleInputChange(field._id, e.target.value)}
              rows={4}
              className={baseInputClass}
              placeholder="Your answer"
            />
            {errorMessage}
          </div>
        );

      case "number":
        return (
          <div key={field._id} className="mb-6">
            {label}
            <input
              type="number"
              value={(value as number) || ""}
              onChange={(e) =>
                handleInputChange(field._id, e.target.valueAsNumber || "")
              }
              min={field.min}
              max={field.max}
              className={baseInputClass}
              placeholder="Number"
            />
            {(field.min !== undefined || field.max !== undefined) && (
              <p className="mt-2 text-xs text-gray-500">
                {field.min !== undefined && `Minimum: ${field.min}`}
                {field.min !== undefined && field.max !== undefined && " • "}
                {field.max !== undefined && `Maximum: ${field.max}`}
              </p>
            )}
            {errorMessage}
          </div>
        );

      case "date":
        return (
          <div key={field._id} className="mb-6">
            {label}
            <input
              type="date"
              value={(value as string) || ""}
              onChange={(e) => handleInputChange(field._id, e.target.value)}
              className={baseInputClass}
            />
            {errorMessage}
          </div>
        );

      case "time":
        return (
          <div key={field._id} className="mb-6">
            {label}
            <input
              type="time"
              value={(value as string) || ""}
              onChange={(e) => handleInputChange(field._id, e.target.value)}
              className={baseInputClass}
            />
            {errorMessage}
          </div>
        );

      case "file_upload":
        return (
          <div key={field._id} className="mb-6">
            {label}
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8a4 4 0 01-4-4v-8m32 0l-6-6m-8 16l-8-8m8 8l-8-8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleFileChange(field._id, file);
                      }}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                {files[field._id] && (
                  <p className="text-sm text-gray-600">
                    Selected: {files[field._id]?.name}
                  </p>
                )}
              </div>
            </div>
            {errorMessage}
          </div>
        );

      case "select":
        return (
          <div key={field._id} className="mb-6">
            {label}
            <select
              value={(value as string) || ""}
              onChange={(e) => handleInputChange(field._id, e.target.value)}
              className={baseInputClass}
            >
              <option value="">Choose</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errorMessage}
          </div>
        );

      case "radio":
        return (
          <div key={field._id} className="mb-6">
            {label}
            <div className="mt-2 space-y-3">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    id={`${field._id}-${option}`}
                    name={field._id}
                    type="radio"
                    checked={value === option}
                    onChange={() => handleInputChange(field._id, option)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor={`${field._id}-${option}`}
                    className="ml-3 text-sm text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {errorMessage}
          </div>
        );

      case "checkbox":
        return (
          <div key={field._id} className="mb-6">
            {label}
            <div className="mt-2 space-y-3">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    id={`${field._id}-${option}`}
                    type="checkbox"
                    checked={((value as string[]) || []).includes(option)}
                    onChange={(e) =>
                      handleCheckboxChange(field._id, option, e.target.checked)
                    }
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor={`${field._id}-${option}`}
                    className="ml-3 text-sm text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {errorMessage}
          </div>
        );

      case "rating":
        return (
          <div key={field._id} className="mb-6">
            {label}
            <div className="mt-3">
              {field.ratingStyle === "star" && (
                <div className="flex gap-2">
                  {Array.from({ length: field.ratingMax || 5 }, (_, i) => {
                    const starValue = i + 1;
                    return (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => handleRatingChange(field._id, starValue)}
                        className={`text-3xl focus:outline-none transition ${
                          (value as number) >= starValue
                            ? "text-yellow-400"
                            : "text-gray-300 hover:text-yellow-200"
                        }`}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>
              )}

              {field.ratingStyle === "number" && (
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    {
                      length:
                        (field.ratingMax || 5) - (field.ratingMin || 1) + 1,
                    },
                    (_, i) => {
                      const numValue = (field.ratingMin || 1) + i;
                      return (
                        <button
                          key={numValue}
                          type="button"
                          onClick={() =>
                            handleRatingChange(field._id, numValue)
                          }
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition ${
                            value === numValue
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 hover:border-blue-300 text-gray-700"
                          }`}
                        >
                          {numValue}
                        </button>
                      );
                    },
                  )}
                </div>
              )}

              {field.ratingStyle === "emoji" && (
                <div className="flex gap-3">
                  {Array.from({ length: field.ratingMax || 5 }, (_, i) => {
                    const emojis = ["😞", "😐", "🙂", "😊", "😄"];
                    const emojiValue = i;
                    return (
                      <button
                        key={emojiValue}
                        type="button"
                        onClick={() =>
                          handleRatingChange(field._id, emojiValue)
                        }
                        className={`text-3xl transition ${
                          value === emojiValue
                            ? "scale-125"
                            : "scale-100 hover:scale-110"
                        }`}
                      >
                        {emojis[i] || "😊"}
                      </button>
                    );
                  })}
                </div>
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
            {errorMessage}
          </div>
        );

      case "checkbox_grid":
        return (
          <div key={field._id} className="mb-6">
            {label}
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
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
                  {field.rows?.map((row) => {
                    const rowSelections =
                      (value as { [key: string]: string[] })?.[row] || [];
                    return (
                      <tr key={row}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {row}
                        </td>
                        {field.columns?.map((col) => (
                          <td key={col} className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={rowSelections.includes(col)}
                              onChange={(e) =>
                                handleGridCheckboxChange(
                                  field._id,
                                  row,
                                  col,
                                  e.target.checked,
                                )
                              }
                              className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {errorMessage}
          </div>
        );

      case "multiple_choice_grid":
        return (
          <div key={field._id} className="mb-6">
            {label}
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
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
                  {field.rows?.map((row) => {
                    const selectedCol = (value as { [key: string]: string })?.[
                      row
                    ];
                    return (
                      <tr key={row}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {row}
                        </td>
                        {field.columns?.map((col) => (
                          <td key={col} className="px-4 py-3">
                            <input
                              type="radio"
                              name={`${field._id}_${row}`}
                              checked={selectedCol === col}
                              onChange={() =>
                                handleGridRadioChange(field._id, row, col)
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {errorMessage}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0EBF8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#673AB7] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-[#F0EBF8] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Form not found
          </h3>
          <p className="mt-2 text-gray-600">
            {`The form you're looking for doesn't exist or has been removed.`}
          </p>
        </div>
      </div>
    );
  }

  if (!form.isPublished) {
    return (
      <div className="min-h-screen bg-[#F0EBF8] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md">
          <svg
            className="mx-auto h-12 w-12 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Form Not Published
          </h3>
          <p className="mt-2 text-gray-600">
            This form is currently in draft mode and not available for
            submissions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EBF8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Form Header */}
        <div className="bg-white rounded-t-lg shadow-sm border-t-8 border-orange-500 p-8">
          <h1 className="text-3xl font-normal text-gray-800">{form.title}</h1>
          {form.description && (
            <p className="mt-4 text-sm text-gray-600">{form.description}</p>
          )}
          <p className="mt-6 text-sm text-red-500 flex items-center gap-1">
            <span className="text-lg">*</span> Indicates required question
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          <div className="mt-3 space-y-3">
            {form.fields?.map((field, index) => (
              <div
                key={field._id}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex items-start gap-2">
                  <p className="text-lg font-bold text-black ">
                    {index + 1}.
                  </p>
                  <div className="flex-1">{renderField(field)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 mt-5 bg-orange-500 text-white font-medium rounded-md shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicFormPage;
