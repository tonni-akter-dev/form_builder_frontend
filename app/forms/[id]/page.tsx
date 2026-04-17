// /* eslint-disable react-hooks/exhaustive-deps */

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
//   className: string;
//   subject: string;
//   duration: number;
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

//   // Exam state
//   const [examStarted, setExamStarted] = useState(false);
//   const [timeRemaining, setTimeRemaining] = useState<number>(0);
//   const [startTime, setStartTime] = useState<Date | null>(null);
//   const [examSubmitted, setExamSubmitted] = useState(false);
//   const [showStartScreen, setShowStartScreen] = useState(true);

//   // Check if user has already submitted
//   useEffect(() => {
//     const checkExistingSubmission = async () => {
//       if (!id) return;
      
//       try {
//         // Check localStorage for existing submission
//         const submittedKey = `submitted_${id}`;
//         const hasSubmitted = localStorage.getItem(submittedKey);
        
//         if (hasSubmitted === "true") {
//           setExamSubmitted(true);
//           setShowStartScreen(false);
//           toast.info("You have already submitted this exam");
//         }
//       } catch (error) {
//         console.error("Error checking submission:", error);
//       }
//     };
    
//     checkExistingSubmission();
//   }, [id]);

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

//   // Timer effect
//   useEffect(() => {
//     let interval: NodeJS.Timeout;
    
//     if (examStarted && timeRemaining > 0 && !examSubmitted) {
//       interval = setInterval(() => {
//         setTimeRemaining((prev) => {
//           if (prev <= 1) {
//             // Time's up - auto submit
//             clearInterval(interval);
//             toast.warning("Time's up! Submitting your exam...");
//             handleAutoSubmit();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
    
//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [examStarted, timeRemaining, examSubmitted]);

//   const handleAutoSubmit = async () => {
//     if (examSubmitted) return;
//     await handleSubmit(new Event("submit") as any, true);
//   };

//   const startExam = () => {
//     if (!form) return;
    
//     // Check if already submitted
//     const submittedKey = `submitted_${id}`;
//     const hasSubmitted = localStorage.getItem(submittedKey);
    
//     if (hasSubmitted === "true") {
//       toast.error("You have already submitted this exam");
//       setExamSubmitted(true);
//       return;
//     }
    
//     setExamStarted(true);
//     setShowStartScreen(false);
//     setStartTime(new Date());
//     setTimeRemaining(form.duration * 60); // Convert minutes to seconds
    
//     toast.success(`Exam started! You have ${form.duration} minutes to complete.`);
//   };

//   const formatTime = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
    
//     if (hours > 0) {
//       return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//     }
//     return `${minutes}:${secs.toString().padStart(2, "0")}`;
//   };

//   const getTimePercentage = () => {
//     if (!form) return 0;
//     const totalTime = form.duration * 60;
//     return (timeRemaining / totalTime) * 100;
//   };

//   const getTimeColor = () => {
//     if (timeRemaining <= 60) return "text-red-600";
//     if (timeRemaining <= 300) return "text-orange-600";
//     return "text-green-600";
//   };

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

//   const handleSubmit = async (e: React.FormEvent, isAutoSubmit = false) => {
//     e.preventDefault();

//     if (!form || examSubmitted) return;

//     if (!isAutoSubmit && !validateForm()) {
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
//         fieldLabel: fieldLabelMap[fieldId] || fieldId,
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
//         timeSpent: form.duration * 60 - timeRemaining,
//         completedAt: new Date().toISOString(),
//       });

//       // Store submission in localStorage to prevent re-submission
//       const submittedKey = `submitted_${id}`;
//       localStorage.setItem(submittedKey, "true");
      
//       setExamSubmitted(true);
//       toast.success(isAutoSubmit ? "Time's up! Form submitted automatically!" : "Form submitted successfully!");
//       // router.push(`/forms/success/${id}`);
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
//       <div className="mb-2">
//         <span className="text-base font-medium text-gray-900">
//           {field.label}
//         </span>
//         {field.required && <span className="text-red-500 ml-1">*</span>}
//         {field.description && (
//           <p className="text-sm text-gray-500 mt-1">{field.description}</p>
//         )}
//       </div>
//     );

//     const errorMessage = error && (
//       <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//           <path
//             fillRule="evenodd"
//             d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//             clipRule="evenodd"
//           />
//         </svg>
//         {error}
//       </p>
//     );

//     const baseInputClass = `w-full px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
//       error
//         ? "border-red-300 bg-red-50"
//         : "border-gray-300 hover:border-gray-400"
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
//               placeholder="Your answer"
//               disabled={examSubmitted}
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
//               placeholder="Your answer"
//               disabled={examSubmitted}
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
//               placeholder="Number"
//               disabled={examSubmitted}
//             />
//             {(field.min !== undefined || field.max !== undefined) && (
//               <p className="mt-2 text-xs text-gray-500">
//                 {field.min !== undefined && `Minimum: ${field.min}`}
//                 {field.min !== undefined && field.max !== undefined && " • "}
//                 {field.max !== undefined && `Maximum: ${field.max}`}
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
//               disabled={examSubmitted}
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
//               disabled={examSubmitted}
//             />
//             {errorMessage}
//           </div>
//         );

//       case "file_upload":
//         return (
//           <div key={field._id} className="mb-6">
//             {label}
//             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition">
//               <div className="space-y-1 text-center">
//                 <svg
//                   className="mx-auto h-12 w-12 text-gray-400"
//                   stroke="currentColor"
//                   fill="none"
//                   viewBox="0 0 48 48"
//                 >
//                   <path
//                     d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8a4 4 0 01-4-4v-8m32 0l-6-6m-8 16l-8-8m8 8l-8-8"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//                 <div className="flex text-sm text-gray-600">
//                   <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
//                     <span>Upload a file</span>
//                     <input
//                       type="file"
//                       className="sr-only"
//                       onChange={(e) => {
//                         const file = e.target.files?.[0] || null;
//                         handleFileChange(field._id, file);
//                       }}
//                       disabled={examSubmitted}
//                     />
//                   </label>
//                   <p className="pl-1">or drag and drop</p>
//                 </div>
//                 {files[field._id] && (
//                   <p className="text-sm text-gray-600">
//                     Selected: {files[field._id]?.name}
//                   </p>
//                 )}
//               </div>
//             </div>
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
//               disabled={examSubmitted}
//             >
//               <option value="">Choose</option>
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
//             <div className="mt-2 space-y-3">
//               {field.options?.map((option) => (
//                 <div key={option} className="flex items-center">
//                   <input
//                     id={`${field._id}-${option}`}
//                     name={field._id}
//                     type="radio"
//                     checked={value === option}
//                     onChange={() => handleInputChange(field._id, option)}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                     disabled={examSubmitted}
//                   />
//                   <label
//                     htmlFor={`${field._id}-${option}`}
//                     className="ml-3 text-sm text-gray-700"
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
//             <div className="mt-2 space-y-3">
//               {field.options?.map((option) => (
//                 <div key={option} className="flex items-center">
//                   <input
//                     id={`${field._id}-${option}`}
//                     type="checkbox"
//                     checked={((value as string[]) || []).includes(option)}
//                     onChange={(e) =>
//                       handleCheckboxChange(field._id, option, e.target.checked)
//                     }
//                     className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
//                     disabled={examSubmitted}
//                   />
//                   <label
//                     htmlFor={`${field._id}-${option}`}
//                     className="ml-3 text-sm text-gray-700"
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
//             <div className="mt-3">
//               {field.ratingStyle === "star" && (
//                 <div className="flex gap-2">
//                   {Array.from({ length: field.ratingMax || 5 }, (_, i) => {
//                     const starValue = i + 1;
//                     return (
//                       <button
//                         key={starValue}
//                         type="button"
//                         onClick={() => handleRatingChange(field._id, starValue)}
//                         className={`text-3xl focus:outline-none transition ${
//                           (value as number) >= starValue
//                             ? "text-yellow-400"
//                             : "text-gray-300 hover:text-yellow-200"
//                         }`}
//                         disabled={examSubmitted}
//                       >
//                         ★
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}

//               {field.ratingStyle === "number" && (
//                 <div className="flex flex-wrap gap-2">
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
//                           className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition ${
//                             value === numValue
//                               ? "border-blue-500 bg-blue-50 text-blue-700"
//                               : "border-gray-300 hover:border-blue-300 text-gray-700"
//                           }`}
//                           disabled={examSubmitted}
//                         >
//                           {numValue}
//                         </button>
//                       );
//                     },
//                   )}
//                 </div>
//               )}

//               {field.ratingStyle === "emoji" && (
//                 <div className="flex gap-3">
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
//                         className={`text-3xl transition ${
//                           value === emojiValue
//                             ? "scale-125"
//                             : "scale-100 hover:scale-110"
//                         }`}
//                         disabled={examSubmitted}
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
//           <div key={field._id} className="mb-6">
//             {label}
//             <div className="mt-3 overflow-x-auto">
//               <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
//                     {field.columns?.map((col) => (
//                       <th
//                         key={col}
//                         className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
//                         <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                           {row}
//                         </td>
//                         {field.columns?.map((col) => (
//                           <td key={col} className="px-4 py-3">
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
//                               className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
//                               disabled={examSubmitted}
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
//           <div key={field._id} className="mb-6">
//             {label}
//             <div className="mt-3 overflow-x-auto">
//               <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
//                     {field.columns?.map((col) => (
//                       <th
//                         key={col}
//                         className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
//                         <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                           {row}
//                         </td>
//                         {field.columns?.map((col) => (
//                           <td key={col} className="px-4 py-3">
//                             <input
//                               type="radio"
//                               name={`${field._id}_${row}`}
//                               checked={selectedCol === col}
//                               onChange={() =>
//                                 handleGridRadioChange(field._id, row, col)
//                               }
//                               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                               disabled={examSubmitted}
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
//       <div className="min-h-screen bg-[#F0EBF8] flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#673AB7] mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading exam...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!form) {
//     return (
//       <div className="min-h-screen bg-[#F0EBF8] flex items-center justify-center">
//         <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md">
//           <svg
//             className="mx-auto h-12 w-12 text-gray-400"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           <h3 className="mt-4 text-lg font-medium text-gray-900">
//             Exam not found
//           </h3>
//           <p className="mt-2 text-gray-600">
//           {`  The exam you're looking for doesn't exist or has been removed.`}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!form.isPublished) {
//     return (
//       <div className="min-h-screen bg-[#F0EBF8] flex items-center justify-center">
//         <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md">
//           <svg
//             className="mx-auto h-12 w-12 text-yellow-500"
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
//             Exam Not Published
//           </h3>
//           <p className="mt-2 text-gray-600">
//             This exam is currently in draft mode and not available.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (examSubmitted) {
//     return (
//       <div className="min-h-screen bg-[#F0EBF8] flex items-center justify-center">
//         <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md">
//           <svg
//             className="mx-auto h-12 w-12 text-green-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           <h3 className="mt-4 text-lg font-medium text-gray-900">
//             Exam Already Submitted
//           </h3>
//           <p className="mt-2 text-gray-600">
//             You have already submitted this exam. Multiple submissions are not allowed.
//           </p>
//           <button
//             onClick={() => router.push("/")}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Go to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Start Screen
//   if (showStartScreen) {
//     return (
//       <div className="min-h-screen bg-[#F0EBF8] flex items-center justify-center px-4">
//         <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm p-8">
//           <div className="text-center mb-6">
//             <svg
//               className="mx-auto h-16 w-16 text-orange-500"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//               />
//             </svg>
//             <h1 className="text-2xl font-bold text-gray-800 mt-4">{form.title}</h1>
//             <p className="text-gray-600 mt-2">{form.description}</p>
//           </div>

//           <div className="border-t border-b border-gray-200 py-4 my-4">
//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Subject:</span>
//                 <span className="font-medium text-gray-800">{form.subject}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Class:</span>
//                 <span className="font-medium text-gray-800">{form.className}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Duration:</span>
//                 <span className="font-medium text-orange-600">{form.duration} minutes</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Total Questions:</span>
//                 <span className="font-medium text-gray-800">{form.fields.length}</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
//             <h3 className="font-medium text-yellow-800 mb-2">Important Instructions:</h3>
//             <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
//               <li>Once started, the timer cannot be paused</li>
//               <li>The exam will auto-submit when time runs out</li>
//               <li>Each student can only submit once</li>
//               <li>Make sure you have a stable internet connection</li>
//               <li>Do not refresh the page during the exam</li>
//             </ul>
//           </div>

//           <button
//             onClick={startExam}
//             className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
//           >
//             Start Exam
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F0EBF8] py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         {/* Timer Header */}
//         <div className="sticky top-0 z-10 mb-4">
//           <div className="bg-white rounded-lg shadow-sm p-4">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-800">{form.title}</h2>
//                 <p className="text-sm text-gray-500">{form.subject} - {form.className}</p>
//               </div>
//               <div className="text-right">
//                 <div className={`text-3xl font-mono font-bold ${getTimeColor()}`}>
//                   {formatTime(timeRemaining)}
//                 </div>
//                 <div className="text-xs text-gray-500">Time Remaining</div>
//               </div>
//             </div>
//             <div className="mt-3">
//               <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//                 <div 
//                   className="h-full bg-orange-500 transition-all duration-1000"
//                   style={{ width: `${getTimePercentage()}%` }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Form Fields */}
//         <form onSubmit={handleSubmit}>
//           <div className="mt-3 space-y-3">
//             {form.fields?.map((field, index) => (
//               <div
//                 key={field._id}
//                 className="bg-white rounded-lg shadow-sm p-4"
//               >
//                 <div className="flex items-start gap-2">
//                   <p className="text-lg font-bold text-black">
//                     {index + 1}.
//                   </p>
//                   <div className="flex-1">{renderField(field)}</div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Submit Button */}
//           <div className="mt-6 flex justify-between items-center">
//             <button
//               type="button"
//               onClick={() => {
//                 if (confirm("Are you sure you want to submit? You cannot change your answers after submission.")) {
//                   handleSubmit(new Event("submit") as any);
//                 }
//               }}
//               disabled={submitting || examSubmitted}
//               className="px-6 py-2 bg-orange-500 text-white font-medium rounded-md shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600"
//             >
//               {submitting ? "Submitting..." : "Submit Exam"}
//             </button>
            
//             <p className="text-xs text-gray-500">
//               Make sure to submit before time runs out
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PublicFormPage;



/* eslint-disable react-hooks/exhaustive-deps */

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
  correctAnswer?: any;
  marks?: number;
}

interface Form {
  _id: string;
  title: string;
  description: string;
  isPublished: boolean;
  className: string;
  subject: string;
  duration: number;
  totalMarks: number;
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

interface AnswerResult {
  fieldId: string;
  fieldLabel: string;
  userAnswer: any;
  correctAnswer: any;
  isCorrect: boolean;
  marksAwarded: number;
  totalMarks: number;
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

  // Exam state
  const [examStarted, setExamStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  
  // Results state
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{
    totalScore: number;
    totalMarks: number;
    percentage: number;
    answers: AnswerResult[];
    passed: boolean;
  } | null>(null);

  // Check if user has already submitted
  useEffect(() => {
    const checkExistingSubmission = async () => {
      if (!id) return;
      
      try {
        // Check localStorage for existing submission
        const submittedKey = `submitted_${id}`;
        const hasSubmitted = localStorage.getItem(submittedKey);
        
        if (hasSubmitted === "true") {
          setExamSubmitted(true);
          setShowStartScreen(false);
          toast.info("You have already submitted this exam");
        }
      } catch (error) {
        console.error("Error checking submission:", error);
      }
    };
    
    checkExistingSubmission();
  }, [id]);

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

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (examStarted && timeRemaining > 0 && !examSubmitted && !showResults) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up - auto submit
            clearInterval(interval);
            toast.warning("Time's up! Submitting your exam...");
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [examStarted, timeRemaining, examSubmitted, showResults]);

  const handleAutoSubmit = async () => {
    if (examSubmitted || showResults) return;
    await handleSubmit(new Event("submit") as any, true);
  };

  // Function to check if an answer is correct
  const checkAnswer = (field: FormField, userAnswer: any): { isCorrect: boolean; marksAwarded: number } => {
    const correctAnswer = field.correctAnswer;
    const marks = field.marks || 1;

    if (!correctAnswer || correctAnswer === "") {
      // If no correct answer defined, award full marks
      return { isCorrect: true, marksAwarded: marks };
    }

    switch (field.type) {
      case "text":
      case "textarea":
      case "number":
      case "date":
      case "time":
        // Case-insensitive string comparison
        const userStr = String(userAnswer || "").trim().toLowerCase();
        const correctStr = String(correctAnswer).trim().toLowerCase();
        const isCorrect = userStr === correctStr;
        return { isCorrect, marksAwarded: isCorrect ? marks : 0 };

      case "radio":
      case "select":
        const isRadioCorrect = userAnswer === correctAnswer;
        return { isCorrect: isRadioCorrect, marksAwarded: isRadioCorrect ? marks : 0 };

      case "checkbox":
        if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
          // Sort both arrays and compare
          const userSorted = [...userAnswer].sort();
          const correctSorted = [...correctAnswer].sort();
          const isCheckboxCorrect = JSON.stringify(userSorted) === JSON.stringify(correctSorted);
          return { isCorrect: isCheckboxCorrect, marksAwarded: isCheckboxCorrect ? marks : 0 };
        }
        return { isCorrect: false, marksAwarded: 0 };

      case "rating":
        const isRatingCorrect = Number(userAnswer) === Number(correctAnswer);
        return { isCorrect: isRatingCorrect, marksAwarded: isRatingCorrect ? marks : 0 };

      case "checkbox_grid":
        if (userAnswer && correctAnswer) {
          let allCorrect = true;
          for (const row in correctAnswer) {
            const userRowAnswers = (userAnswer as any)[row] || [];
            const correctRowAnswers = (correctAnswer as any)[row] || [];
            
            if (JSON.stringify(userRowAnswers.sort()) !== JSON.stringify(correctRowAnswers.sort())) {
              allCorrect = false;
              break;
            }
          }
          return { isCorrect: allCorrect, marksAwarded: allCorrect ? marks : 0 };
        }
        return { isCorrect: false, marksAwarded: 0 };

      case "multiple_choice_grid":
        if (userAnswer && correctAnswer) {
          let allCorrect = true;
          for (const row in correctAnswer) {
            if (userAnswer[row] !== correctAnswer[row]) {
              allCorrect = false;
              break;
            }
          }
          return { isCorrect: allCorrect, marksAwarded: allCorrect ? marks : 0 };
        }
        return { isCorrect: false, marksAwarded: 0 };

      default:
        return { isCorrect: false, marksAwarded: 0 };
    }
  };

  const calculateResults = () => {
    if (!form) return null;

    let totalScore = 0;
    const answerResults: AnswerResult[] = [];

    form.fields.forEach((field) => {
      const userAnswer = formData[field._id];
      const { isCorrect, marksAwarded } = checkAnswer(field, userAnswer);
      
      totalScore += marksAwarded;

      answerResults.push({
        fieldId: field._id,
        fieldLabel: field.label,
        userAnswer: userAnswer,
        correctAnswer: field.correctAnswer,
        isCorrect: isCorrect,
        marksAwarded: marksAwarded,
        totalMarks: field.marks || 1,
      });
    });

    const totalMarks = form.totalMarks || form.fields.reduce((sum, f) => sum + (f.marks || 1), 0);
    const percentage = (totalScore / totalMarks) * 100;
    const passed = percentage >= 40; // 40% is passing mark

    return {
      totalScore,
      totalMarks,
      percentage,
      answers: answerResults,
      passed,
    };
  };

  const startExam = () => {
    if (!form) return;
    
    // Check if already submitted
    const submittedKey = `submitted_${id}`;
    const hasSubmitted = localStorage.getItem(submittedKey);
    
    if (hasSubmitted === "true") {
      toast.error("You have already submitted this exam");
      setExamSubmitted(true);
      return;
    }
    
    setExamStarted(true);
    setShowStartScreen(false);
    setStartTime(new Date());
    setTimeRemaining(form.duration * 60); // Convert minutes to seconds
    
    toast.success(`Exam started! You have ${form.duration} minutes to complete.`);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimePercentage = () => {
    if (!form) return 0;
    const totalTime = form.duration * 60;
    return (timeRemaining / totalTime) * 100;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 60) return "text-red-600";
    if (timeRemaining <= 300) return "text-orange-600";
    return "text-green-600";
  };

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

  const handleSubmit = async (e: React.FormEvent, isAutoSubmit = false) => {
    e.preventDefault();

    if (!form || examSubmitted || showResults) return;

    if (!isAutoSubmit && !validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setSubmitting(true);

    try {
      // Calculate results
      const resultsData = calculateResults();
      
      if (!resultsData) {
        throw new Error("Failed to calculate results");
      }

      // Format answers according to response schema
      const formattedAnswers = resultsData.answers.map((result) => ({
        fieldId: result.fieldId,
        fieldLabel: result.fieldLabel,
        value: result.userAnswer || null,
        isCorrect: result.isCorrect,
        correctAnswer: result.correctAnswer || null,
        marksAwarded: result.marksAwarded,
      }));

      // Get IP address and user agent (optional)
      const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';

      // Prepare submission data matching the response schema
      const submissionData = {
        formId: id,
        className: form.className,
        subject: form.subject,
        answers: formattedAnswers,
        submittedAt: new Date().toISOString(),
        totalMarks: resultsData.totalMarks,
        obtainedMarks: resultsData.totalScore,
        percentage: resultsData.percentage,
        resultStatus: resultsData.passed ? "pass" : "fail",
        userAgent: userAgent,
        // ipAddress will be added by the backend
      };

      console.log("Submitting data:", submissionData);

      // Submit to backend
      const response = await axios.post("/responses", submissionData);

      // Store submission in localStorage to prevent re-submission
      const submittedKey = `submitted_${id}`;
      localStorage.setItem(submittedKey, "true");
      
      // Set results and show results screen
      setResults(resultsData);
      setExamSubmitted(true);
      setShowResults(true);
      
      toast.success(isAutoSubmit ? "Time's up! Exam submitted automatically!" : "Exam submitted successfully!");
    } catch (err: any) {
      console.error("Error submitting form:", err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to submit form";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Render results screen
  const renderResults = () => {
    if (!results) return null;

    const getScoreColor = () => {
      if (results.percentage >= 70) return "text-green-600";
      if (results.percentage >= 40) return "text-yellow-600";
      return "text-red-600";
    };

    const getResultBadge = () => {
      if (results.passed) {
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            PASSED
          </div>
        );
      } else {
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            FAILED
          </div>
        );
      }
    };

    return (
      <div className="min-h-screen bg-[#F0EBF8] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Score Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Exam Results</h1>
              <p className="text-gray-600">{form?.title}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-4xl font-bold ${getScoreColor()}`}>
                  {results.percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Percentage</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-4xl font-bold text-blue-600">
                  {results.totalScore} / {results.totalMarks}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Score</div>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              {getResultBadge()}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Go to Home
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Print Results
              </button>
            </div>
          </div>

          {/* Detailed Answers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Detailed Answers</h2>
            <div className="space-y-4">
              {results.answers.map((answer, index) => (
                <div
                  key={answer.fieldId}
                  className={`border rounded-lg p-4 ${
                    answer.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {index + 1}. {answer.fieldLabel}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Marks: {answer.marksAwarded} / {answer.totalMarks}
                      </p>
                    </div>
                    <div className={`text-sm font-medium ${
                      answer.isCorrect ? "text-green-600" : "text-red-600"
                    }`}>
                      {answer.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Your Answer: </span>
                      <span className="text-gray-600">
                        {answer.userAnswer === null || answer.userAnswer === undefined || answer.userAnswer === ""
                          ? "(No answer)"
                          : Array.isArray(answer.userAnswer)
                          ? answer.userAnswer.join(", ")
                          : typeof answer.userAnswer === "object"
                          ? JSON.stringify(answer.userAnswer)
                          : answer.userAnswer}
                      </span>
                    </div>
                    {!answer.isCorrect && answer.correctAnswer && (
                      <div>
                        <span className="font-medium text-gray-700">Correct Answer: </span>
                        <span className="text-green-700">
                          {Array.isArray(answer.correctAnswer)
                            ? answer.correctAnswer.join(", ")
                            : typeof answer.correctAnswer === "object"
                            ? JSON.stringify(answer.correctAnswer)
                            : answer.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderField = (field: FormField) => {
    const value = formData[field._id];
    const error = errors[field._id];

    const label = (
      <div className="mb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <span className="text-base font-medium text-gray-900">
              {field.label}
            </span>
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </div>
          {field.marks && (
            <span className="text-sm text-purple-600 font-medium">
              {field.marks} {field.marks === 1 ? 'mark' : 'marks'}
            </span>
          )}
        </div>
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
              disabled={examSubmitted}
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
              disabled={examSubmitted}
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
              disabled={examSubmitted}
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
              disabled={examSubmitted}
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
              disabled={examSubmitted}
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
                      disabled={examSubmitted}
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
              disabled={examSubmitted}
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
                    disabled={examSubmitted}
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
                    disabled={examSubmitted}
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
                        disabled={examSubmitted}
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
                          disabled={examSubmitted}
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
                        disabled={examSubmitted}
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
                              disabled={examSubmitted}
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
                              disabled={examSubmitted}
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
          <p className="mt-4 text-gray-600">Loading exam...</p>
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
            Exam not found
          </h3>
          <p className="mt-2 text-gray-600">
           {` The exam you're looking for doesn't exist or has been removed.`}
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
            Exam Not Published
          </h3>
          <p className="mt-2 text-gray-600">
            This exam is currently in draft mode and not available.
          </p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return renderResults();
  }

  if (examSubmitted) {
    return (
      <div className="min-h-screen bg-[#F0EBF8] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm max-w-md">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Exam Already Submitted
          </h3>
          <p className="mt-2 text-gray-600">
            You have already submitted this exam. Multiple submissions are not allowed.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Start Screen
  if (showStartScreen) {
    return (
      <div className="min-h-screen bg-[#F0EBF8] flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-6">
            <svg
              className="mx-auto h-16 w-16 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800 mt-4">{form.title}</h1>
            <p className="text-gray-600 mt-2">{form.description}</p>
          </div>

          <div className="border-t border-b border-gray-200 py-4 my-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subject:</span>
                <span className="font-medium text-gray-800">{form.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Class:</span>
                <span className="font-medium text-gray-800">{form.className}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium text-orange-600">{form.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Questions:</span>
                <span className="font-medium text-gray-800">{form.fields.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Marks:</span>
                <span className="font-medium text-purple-600">{form.totalMarks || form.fields.reduce((sum, f) => sum + (f.marks || 1), 0)}</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-yellow-800 mb-2">Important Instructions:</h3>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>Once started, the timer cannot be paused</li>
              <li>The exam will auto-submit when time runs out</li>
              <li>Each student can only submit once</li>
              <li>Make sure you have a stable internet connection</li>
              <li>Do not refresh the page during the exam</li>
              <li>Results will be shown immediately after submission</li>
            </ul>
          </div>

          <button
            onClick={startExam}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EBF8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Timer Header */}
        <div className="sticky top-0 z-10 mb-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{form.title}</h2>
                <p className="text-sm text-gray-500">{form.subject} - {form.className}</p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-mono font-bold ${getTimeColor()}`}>
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-gray-500">Time Remaining</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-orange-500 transition-all duration-1000"
                  style={{ width: `${getTimePercentage()}%` }}
                />
              </div>
            </div>
          </div>
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
                  <p className="text-lg font-bold text-black">
                    {index + 1}.
                  </p>
                  <div className="flex-1">{renderField(field)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                if (confirm("Are you sure you want to submit? You cannot change your answers after submission.")) {
                  handleSubmit(new Event("submit") as any);
                }
              }}
              disabled={submitting || examSubmitted}
              className="px-6 py-2 bg-orange-500 text-white font-medium rounded-md shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600"
            >
              {submitting ? "Submitting..." : "Submit Exam"}
            </button>
            
            <p className="text-xs text-gray-500">
              Make sure to submit before time runs out
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublicFormPage;