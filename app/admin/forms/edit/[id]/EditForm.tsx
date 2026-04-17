// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";

// import { useState, useEffect } from "react";
// import axios from "@/lib/axios";
// import { useRouter, useParams } from "next/navigation";
// import { toast } from "react-toastify";

// // Supported field types - matching backend schema
// type FieldType =
//   | "text"
//   | "textarea"
//   | "number"
//   | "radio"
//   | "select"
//   | "checkbox"
//   | "checkbox_grid"
//   | "multiple_choice_grid"
//   | "date"
//   | "time"
//   | "file_upload"
//   | "rating";

// interface FormField {
//   id: string;
//   label: string;
//   type: FieldType;
//   options?: string[];
//   rows?: string[];
//   columns?: string[];
//   required: boolean;
//   description?: string;
//   min?: number;
//   max?: number;
//   ratingMin?: number;
//   ratingMax?: number;
//   ratingLabels?: {
//     min?: string;
//     max?: string;
//     middle?: string;
//   };
//   ratingStyle?: "star" | "number" | "emoji";
// }

// export default function EditForm() {
//   const router = useRouter();
//   const { id } = useParams();
//   const [initialLoading, setInitialLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const [title, setTitle] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   const [className, setClassName] = useState<string>("");
//   const [subject, setSubject] = useState<string>("");
//   const [duration, setDuration] = useState<string>("60");
//   const [fields, setFields] = useState<FormField[]>([]);
//   const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
//   const [showFieldTypes, setShowFieldTypes] = useState<boolean>(false);
//   const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
//   const [isPublished, setIsPublished] = useState<boolean>(false);
//   const [saving, setSaving] = useState<boolean>(false);

//   // Generate a unique ID for new fields
//   const generateId = () =>
//     `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

//   // Transform backend field to frontend format
//   const transformBackendField = (backendField: any): FormField => {
//     const frontendField: FormField = {
//       id: backendField._id || generateId(),
//       label: backendField.label || "",
//       type: backendField.type || "text",
//       required: backendField.required || false,
//       description: backendField.description || "",
//     };

//     // Add type-specific properties
//     if (["radio", "select", "checkbox"].includes(backendField.type)) {
//       frontendField.options = backendField.options || ["Option 1", "Option 2"];
//     }

//     if (["checkbox_grid", "multiple_choice_grid"].includes(backendField.type)) {
//       frontendField.rows = backendField.rows || ["Row 1", "Row 2"];
//       frontendField.columns = backendField.columns || ["Column 1", "Column 2"];
//     }

//     if (backendField.type === "number") {
//       frontendField.min = backendField.min;
//       frontendField.max = backendField.max;
//     }

//     if (backendField.type === "rating") {
//       frontendField.ratingMin = backendField.ratingMin || 1;
//       frontendField.ratingMax = backendField.ratingMax || 5;
//       frontendField.ratingStyle = backendField.ratingStyle || "star";
//       frontendField.ratingLabels = backendField.ratingLabels || {
//         min: "Poor",
//         max: "Excellent",
//       };
//     }

//     return frontendField;
//   };

//   // Fetch form data on mount
//   useEffect(() => {
//     const fetchForm = async () => {
//       if (!id) return;

//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Please login to edit this form");
//           router.push("/login");
//           return;
//         }

//         const response = await axios.get(`/forms/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const formData = response.data;
//         setTitle(formData.title || "Untitled form");
//         setDescription(formData.description || "");
//         setClassName(formData.className || "");
//         setSubject(formData.subject || "");
//         setDuration(formData.duration?.toString() || "60");
//         setIsPublished(formData.isPublished || false);

//         // Transform backend fields to frontend format
//         if (formData.fields && Array.isArray(formData.fields)) {
//           const transformedFields = formData.fields.map(transformBackendField);
//           setFields(transformedFields);
//         }
//       } catch (err: any) {
//         console.error("Error fetching form:", err);
//         toast.error(err.response?.data?.error || "Failed to load form");
//         setError("Failed to load form");
//       } finally {
//         setInitialLoading(false);
//       }
//     };

//     fetchForm();
//   }, [id, router]);

//   // Add a new empty field
//   const addField = (type: FieldType = "text") => {
//     const newField: FormField = {
//       id: generateId(),
//       label: "",
//       type,
//       required: false,
//       description: "",
//     };

//     if (type === "radio" || type === "select" || type === "checkbox") {
//       newField.options = ["Option 1", "Option 2"];
//     } else if (type === "checkbox_grid" || type === "multiple_choice_grid") {
//       newField.rows = ["Row 1", "Row 2"];
//       newField.columns = ["Column 1", "Column 2"];
//     } else if (type === "rating") {
//       newField.ratingMin = 1;
//       newField.ratingMax = 5;
//       newField.ratingLabels = {
//         min: "Poor",
//         max: "Excellent",
//       };
//       newField.ratingStyle = "star";
//     }

//     setFields([...fields, newField]);
//     setSelectedFieldId(newField.id);
//     setShowFieldTypes(false);
//   };

//   // Delete a field
//   const deleteField = (id: string) => {
//     setFields(fields.filter((field) => field.id !== id));
//     if (selectedFieldId === id) {
//       setSelectedFieldId(null);
//     }
//   };

//   // Update field property
//   const updateField = <K extends keyof FormField>(
//     id: string,
//     key: K,
//     value: FormField[K],
//   ) => {
//     const updated = fields.map((field) => {
//       if (field.id === id) {
//         return { ...field, [key]: value };
//       }
//       return field;
//     });
//     setFields(updated);
//   };

//   // Add option to radio/select/checkbox
//   const addOption = (id: string) => {
//     const updated = fields.map((field) => {
//       if (field.id === id) {
//         const options = field.options || [];
//         return {
//           ...field,
//           options: [...options, `Option ${options.length + 1}`],
//         };
//       }
//       return field;
//     });
//     setFields(updated);
//   };

//   // Update option
//   const updateOption = (fieldId: string, optIndex: number, value: string) => {
//     const updated = fields.map((field) => {
//       if (field.id === fieldId && field.options) {
//         const newOptions = [...field.options];
//         newOptions[optIndex] = value;
//         return { ...field, options: newOptions };
//       }
//       return field;
//     });
//     setFields(updated);
//   };

//   // Delete option
//   const deleteOption = (fieldId: string, optIndex: number) => {
//     const updated = fields.map((field) => {
//       if (field.id === fieldId && field.options) {
//         return {
//           ...field,
//           options: field.options.filter((_, i) => i !== optIndex),
//         };
//       }
//       return field;
//     });
//     setFields(updated);
//   };

//   // Grid: add row
//   const addRow = (id: string) => {
//     const updated = fields.map((field) => {
//       if (field.id === id) {
//         const rows = field.rows || [];
//         return { ...field, rows: [...rows, `Row ${rows.length + 1}`] };
//       }
//       return field;
//     });
//     setFields(updated);
//   };

//   // Grid: update row
//   const updateRow = (fieldId: string, rowIndex: number, value: string) => {
//     const updated = fields.map((field) => {
//       if (field.id === fieldId && field.rows) {
//         const newRows = [...field.rows];
//         newRows[rowIndex] = value;
//         return { ...field, rows: newRows };
//       }
//       return field;
//     });
//     setFields(updated);
//   };

//   // Grid: delete row
//   const deleteRow = (fieldId: string, rowIndex: number) => {
//     const updated = fields.map((field) => {
//       if (field.id === fieldId && field.rows) {
//         return {
//           ...field,
//           rows: field.rows.filter((_, i) => i !== rowIndex),
//         };
//       }
//       return field;
//     });
//     setFields(updated);
//   };

//   // Grid: add column
//   const addColumn = (id: string) => {
//     const updated = fields.map((field) => {
//       if (field.id === id) {
//         const columns = field.columns || [];
//         return {
//           ...field,
//           columns: [...columns, `Column ${columns.length + 1}`],
//         };
//       }
//       return field;
//     });
//     setFields(updated);
//   };

//   // Grid: update column
//   const updateColumn = (fieldId: string, colIndex: number, value: string) => {
//     const updated = fields.map((field) => {
//       if (field.id === fieldId && field.columns) {
//         const newColumns = [...field.columns];
//         newColumns[colIndex] = value;
//         return { ...field, columns: newColumns };
//       }
//       return field;
//     });
//     setFields(updated);
//   };

//   // Grid: delete column
//   const deleteColumn = (fieldId: string, colIndex: number) => {
//     const updated = fields.map((field) => {
//       if (field.id === fieldId && field.columns) {
//         return {
//           ...field,
//           columns: field.columns.filter((_, i) => i !== colIndex),
//         };
//       }
//       return field;
//     });
//     setFields(updated);
//   };

//   // Transform frontend fields to backend format
//   const transformFieldsForBackend = () => {
//     return fields.map((field) => {
//       // Remove the temporary id field
//       const { id, ...backendField } = field;

//       if (field.type === "rating") {
//         return {
//           ...backendField,
//           ratingMin: field.ratingMin || 1,
//           ratingMax: field.ratingMax || 5,
//           ratingStyle: field.ratingStyle || "star",
//           ratingLabels: field.ratingLabels || { min: "", max: "" },
//         };
//       }

//       if (field.type === "number") {
//         return {
//           ...backendField,
//           min: field.min ? Number(field.min) : undefined,
//           max: field.max ? Number(field.max) : undefined,
//         };
//       }

//       return backendField;
//     });
//   };

//   // Handle form update
//   const handleUpdate = async (publishStatus?: boolean) => {
//     // Validate form
//     if (!title.trim()) {
//       setError("Form title is required");
//       toast.error("Form title is required");
//       return;
//     }

//     if (!className.trim()) {
//       setError("Class is required");
//       toast.error("Class is required");
//       return;
//     }

//     if (!subject.trim()) {
//       setError("Subject is required");
//       toast.error("Subject is required");
//       return;
//     }

//     if (!duration.trim() || parseInt(duration) <= 0) {
//       setError("Valid duration is required (minutes)");
//       toast.error("Valid duration is required (minutes)");
//       return;
//     }

//     const invalidFields = fields.filter((field) => !field.label.trim());
//     if (invalidFields.length > 0) {
//       setError("All questions must have a label");
//       toast.error("All questions must have a label");
//       return;
//     }

//     setSaving(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError("You must be logged in to update the form");
//         toast.error("You must be logged in to update the form");
//         setSaving(false);
//         return;
//       }

//       const formData = {
//         title: title.trim(),
//         description: description.trim(),
//         className: className.trim(),
//         subject: subject.trim(),
//         duration: parseInt(duration),
//         fields: transformFieldsForBackend(),
//         isPublished: publishStatus !== undefined ? publishStatus : isPublished,
//       };

//       await axios.put(`/forms/${id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (publishStatus !== undefined) {
//         setIsPublished(publishStatus);
//         toast.success(
//           publishStatus ? "Form published successfully!" : "Form unpublished",
//         );
//       } else {
//         toast.success("Form updated successfully!");
//       }

//       // Refresh form data
//       const response = await axios.get(`/forms/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setTitle(response.data.title);
//       setDescription(response.data.description);
//       setClassName(response.data.className);
//       setSubject(response.data.subject);
//       setDuration(response.data.duration?.toString() || "60");
//       setIsPublished(response.data.isPublished);
//     } catch (err: any) {
//       console.error("Error updating form:", err);
//       const errorMessage = err.response?.data?.message || err.message || "Failed to update form";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Handle delete form
//   const handleDelete = async () => {
//     if (
//       !confirm(
//         "Are you sure you want to delete this form? This action cannot be undone.",
//       )
//     ) {
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         toast.error("You must be logged in to delete the form");
//         return;
//       }

//       await axios.delete(`/forms/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success("Form deleted successfully!");
//       router.push("/admin/forms");
//     } catch (err: any) {
//       console.error("Error deleting form:", err);
//       toast.error(err.response?.data?.error || "Failed to delete form");
//     }
//   };

//   // Field type options
//   const fieldTypeOptions = [
//     { type: "text" as FieldType, label: "Short answer", icon: "T" },
//     { type: "textarea" as FieldType, label: "Paragraph", icon: "¶" },
//     { type: "number" as FieldType, label: "Number", icon: "#" },
//     { type: "radio" as FieldType, label: "Multiple choice", icon: "○" },
//     { type: "checkbox" as FieldType, label: "Checkboxes", icon: "☑" },
//     { type: "select" as FieldType, label: "Dropdown", icon: "▼" },
//     { type: "rating" as FieldType, label: "Rating", icon: "⭐" },
//     { type: "file_upload" as FieldType, label: "File upload", icon: "📎" },
//     { type: "date" as FieldType, label: "Date", icon: "📅" },
//     { type: "time" as FieldType, label: "Time", icon: "🕐" },
//     { type: "checkbox_grid" as FieldType, label: "Checkbox grid", icon: "⊞" },
//     {
//       type: "multiple_choice_grid" as FieldType,
//       label: "Multiple choice grid",
//       icon: "⊟",
//     },
//   ];

//   // Render field type menu
//   const renderFieldTypeMenu = () => (
//     <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 absolute bottom-full mb-2 left-0 z-10 w-72">
//       <div className="grid grid-cols-2 gap-1">
//         {fieldTypeOptions.map((option) => (
//           <button
//             key={option.type}
//             type="button"
//             onClick={() => addField(option.type)}
//             className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
//           >
//             <span className="text-xl w-6">{option.icon}</span>
//             <span className="text-sm text-gray-700">{option.label}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );

//   // Render rating stars preview
//   const renderStars = (
//     rating: number,
//     maxRating: number,
//     interactive: boolean = false,
//   ) => {
//     return (
//       <div className="flex gap-1">
//         {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
//           <button
//             key={star}
//             type="button"
//             className={`text-2xl transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-300"} ${interactive ? "hover:text-yellow-400 cursor-pointer" : "cursor-default"}`}
//             disabled={!interactive}
//           >
//             ★
//           </button>
//         ))}
//       </div>
//     );
//   };

//   // Render emoji ratings preview
//   const renderEmojis = (
//     rating: number,
//     maxRating: number,
//     interactive: boolean = false,
//   ) => {
//     const emojis = ["😞", "😐", "🙂", "😊", "😄"];
//     return (
//       <div className="flex gap-2">
//         {Array.from({ length: maxRating }, (_, i) => i).map((index) => (
//           <button
//             key={index}
//             type="button"
//             className={`text-3xl transition-all ${index === rating ? "scale-125" : "scale-100"} ${interactive ? "hover:scale-125 cursor-pointer" : "cursor-default"}`}
//             disabled={!interactive}
//           >
//             {emojis[index] || "😊"}
//           </button>
//         ))}
//       </div>
//     );
//   };

//   // Render field in edit mode
//   const renderField = (field: FormField) => {
//     const isSelected = selectedFieldId === field.id;

//     return (
//       <div
//         key={field.id}
//         className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
//           isSelected
//             ? "border-[#673AB7]"
//             : "border-gray-200 hover:border-gray-300"
//         }`}
//         onClick={() => setSelectedFieldId(field.id)}
//       >
//         {/* Field header */}
//         <div className="p-6">
//           <div className="flex items-start justify-between mb-4">
//             <div className="flex-1">
//               <input
//                 type="text"
//                 value={field.label}
//                 onChange={(e) => updateField(field.id, "label", e.target.value)}
//                 className="w-full text-lg font-medium border-0 focus:ring-0 p-0 outline-none placeholder:text-gray-400"
//                 placeholder="Question"
//                 onClick={(e) => e.stopPropagation()}
//               />
//               <input
//                 type="text"
//                 value={field.description || ""}
//                 onChange={(e) =>
//                   updateField(field.id, "description", e.target.value)
//                 }
//                 className="w-full text-sm text-gray-500 border-0 focus:ring-0 p-0 mt-1 outline-none placeholder:text-gray-300"
//                 placeholder="Description (optional)"
//                 onClick={(e) => e.stopPropagation()}
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   updateField(field.id, "required", !field.required);
//                 }}
//                 className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
//                   field.required
//                     ? "bg-red-50 text-red-600 hover:bg-red-100"
//                     : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                 }`}
//               >
//                 {field.required ? "Required" : "Optional"}
//               </button>
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   deleteField(field.id);
//                 }}
//                 className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100"
//               >
//                 <svg
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* Field type-specific content */}
//           <div className="mt-4">
//             {field.type === "text" && (
//               <input
//                 type="text"
//                 disabled
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
//                 placeholder="Short answer text"
//               />
//             )}

//             {field.type === "textarea" && (
//               <textarea
//                 disabled
//                 rows={3}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
//                 placeholder="Long answer text"
//               />
//             )}

//             {field.type === "number" && (
//               <div className="space-y-3">
//                 <input
//                   type="number"
//                   disabled
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
//                   placeholder="Number"
//                 />
//                 <div className="flex gap-4">
//                   <div className="flex-1">
//                     <label className="block text-xs text-gray-500 mb-1">
//                       Minimum
//                     </label>
//                     <input
//                       type="number"
//                       value={field.min || ""}
//                       onChange={(e) =>
//                         updateField(
//                           field.id,
//                           "min",
//                           e.target.value ? Number(e.target.value) : undefined,
//                         )
//                       }
//                       className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
//                       placeholder="No minimum"
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <label className="block text-xs text-gray-500 mb-1">
//                       Maximum
//                     </label>
//                     <input
//                       type="number"
//                       value={field.max || ""}
//                       onChange={(e) =>
//                         updateField(
//                           field.id,
//                           "max",
//                           e.target.value ? Number(e.target.value) : undefined,
//                         )
//                       }
//                       className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
//                       placeholder="No maximum"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {(field.type === "radio" ||
//               field.type === "select" ||
//               field.type === "checkbox") && (
//               <div className="space-y-2">
//                 {field.options?.map((option, index) => (
//                   <div key={index} className="flex items-center gap-3">
//                     {field.type === "radio" && (
//                       <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
//                     )}
//                     {field.type === "checkbox" && (
//                       <div className="w-4 h-4 rounded border-2 border-gray-300"></div>
//                     )}
//                     {field.type === "select" && (
//                       <span className="text-gray-400">•</span>
//                     )}
//                     <input
//                       type="text"
//                       value={option}
//                       onChange={(e) =>
//                         updateOption(field.id, index, e.target.value)
//                       }
//                       className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => deleteOption(field.id, index)}
//                       className="p-1 text-gray-400 hover:text-red-500 transition-colors"
//                     >
//                       <svg
//                         className="h-4 w-4"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M6 18L18 6M6 6l12 12"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={() => addOption(field.id)}
//                   className="text-sm text-[#673AB7] hover:text-[#5E35B1] font-medium mt-2"
//                 >
//                   + Add option
//                 </button>
//               </div>
//             )}

//             {field.type === "rating" && (
//               <div className="space-y-4">
//                 <div className="flex items-center gap-6">
//                   <select
//                     value={field.ratingStyle}
//                     onChange={(e) =>
//                       updateField(
//                         field.id,
//                         "ratingStyle",
//                         e.target.value as "star" | "number" | "emoji",
//                       )
//                     }
//                     className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
//                   >
//                     <option value="star">Stars</option>
//                     <option value="number">Numbers</option>
//                     <option value="emoji">Emojis</option>
//                   </select>

//                   <div className="flex items-center gap-2">
//                     <input
//                       type="number"
//                       value={field.ratingMin || 1}
//                       onChange={(e) =>
//                         updateField(
//                           field.id,
//                           "ratingMin",
//                           Number(e.target.value),
//                         )
//                       }
//                       className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center"
//                       min="1"
//                     />
//                     <span className="text-gray-400">to</span>
//                     <input
//                       type="number"
//                       value={field.ratingMax || 5}
//                       onChange={(e) =>
//                         updateField(
//                           field.id,
//                           "ratingMax",
//                           Number(e.target.value),
//                         )
//                       }
//                       className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center"
//                       min="1"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs text-gray-500 mb-1">
//                       Min label
//                     </label>
//                     <input
//                       type="text"
//                       value={field.ratingLabels?.min || ""}
//                       onChange={(e) =>
//                         updateField(field.id, "ratingLabels", {
//                           ...field.ratingLabels,
//                           min: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
//                       placeholder="e.g., Poor"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-gray-500 mb-1">
//                       Max label
//                     </label>
//                     <input
//                       type="text"
//                       value={field.ratingLabels?.max || ""}
//                       onChange={(e) =>
//                         updateField(field.id, "ratingLabels", {
//                           ...field.ratingLabels,
//                           max: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
//                       placeholder="e.g., Excellent"
//                     />
//                   </div>
//                 </div>

//                 {/* Preview */}
//                 <div className="pt-4 border-t border-gray-100">
//                   <p className="text-xs text-gray-400 mb-3">Preview:</p>
//                   {field.ratingStyle === "star" &&
//                     renderStars(3, field.ratingMax || 5)}
//                   {field.ratingStyle === "emoji" &&
//                     renderEmojis(2, field.ratingMax || 5)}
//                   {field.ratingStyle === "number" && (
//                     <div className="flex gap-2">
//                       {Array.from(
//                         {
//                           length:
//                             (field.ratingMax || 5) - (field.ratingMin || 1) + 1,
//                         },
//                         (_, i) => (field.ratingMin || 1) + i,
//                       ).map((num) => (
//                         <button
//                           key={num}
//                           type="button"
//                           className="w-10 h-10 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
//                           disabled
//                         >
//                           {num}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {field.type === "date" && (
//               <input
//                 type="date"
//                 disabled
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
//               />
//             )}

//             {field.type === "time" && (
//               <input
//                 type="time"
//                 disabled
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
//               />
//             )}

//             {field.type === "file_upload" && (
//               <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50">
//                 <svg
//                   className="mx-auto h-10 w-10 text-gray-300"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                   />
//                 </svg>
//                 <p className="mt-2 text-sm text-gray-500">
//                   Click to upload or drag and drop
//                 </p>
//               </div>
//             )}

//             {(field.type === "checkbox_grid" ||
//               field.type === "multiple_choice_grid") && (
//               <div className="space-y-6">
//                 {/* Rows */}
//                 <div>
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium text-gray-700">
//                       Rows
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => addRow(field.id)}
//                       className="text-sm text-[#673AB7] hover:text-[#5E35B1]"
//                     >
//                       + Add row
//                     </button>
//                   </div>
//                   <div className="space-y-2">
//                     {field.rows?.map((row, index) => (
//                       <div key={index} className="flex items-center gap-2">
//                         <input
//                           type="text"
//                           value={row}
//                           onChange={(e) =>
//                             updateRow(field.id, index, e.target.value)
//                           }
//                           className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => deleteRow(field.id, index)}
//                           className="p-1 text-gray-400 hover:text-red-500"
//                         >
//                           <svg
//                             className="h-4 w-4"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M6 18L18 6M6 6l12 12"
//                             />
//                           </svg>
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Columns */}
//                 <div>
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium text-gray-700">
//                       Columns
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => addColumn(field.id)}
//                       className="text-sm text-[#673AB7] hover:text-[#5E35B1]"
//                     >
//                       + Add column
//                     </button>
//                   </div>
//                   <div className="space-y-2">
//                     {field.columns?.map((column, index) => (
//                       <div key={index} className="flex items-center gap-2">
//                         <input
//                           type="text"
//                           value={column}
//                           onChange={(e) =>
//                             updateColumn(field.id, index, e.target.value)
//                           }
//                           className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => deleteColumn(field.id, index)}
//                           className="p-1 text-gray-400 hover:text-red-500"
//                         >
//                           <svg
//                             className="h-4 w-4"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M6 18L18 6M6 6l12 12"
//                             />
//                           </svg>
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Render field in preview mode
//   const renderPreviewField = (field: FormField, index: number) => {
//     return (
//       <div key={field.id} className="bg-white rounded-xl shadow-sm p-6">
//         <div className="flex items-start gap-3">
//           <span className="text-sm font-medium text-gray-400 min-w-6">
//             {index + 1}.
//           </span>
//           <div className="flex-1">
//             <div className="mb-3">
//               <span className="text-base font-medium text-gray-800">
//                 {field.label}
//               </span>
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//               {field.description && (
//                 <p className="text-sm text-gray-500 mt-1">
//                   {field.description}
//                 </p>
//               )}
//             </div>

//             <div>
//               {field.type === "text" && (
//                 <input
//                   type="text"
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
//                   placeholder="Your answer"
//                 />
//               )}

//               {field.type === "textarea" && (
//                 <textarea
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
//                   placeholder="Your answer"
//                 />
//               )}

//               {field.type === "number" && (
//                 <input
//                   type="number"
//                   min={field.min}
//                   max={field.max}
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
//                   placeholder="Your answer"
//                 />
//               )}

//               {field.type === "radio" && (
//                 <div className="space-y-2">
//                   {field.options?.map((option, idx) => (
//                     <label
//                       key={idx}
//                       className="flex items-center gap-3 cursor-pointer"
//                     >
//                       <input
//                         type="radio"
//                         name={`preview-${field.id}`}
//                         className="w-4 h-4 text-[#673AB7] border-gray-300 focus:ring-[#673AB7]"
//                       />
//                       <span className="text-sm text-gray-700">{option}</span>
//                     </label>
//                   ))}
//                 </div>
//               )}

//               {field.type === "checkbox" && (
//                 <div className="space-y-2">
//                   {field.options?.map((option, idx) => (
//                     <label
//                       key={idx}
//                       className="flex items-center gap-3 cursor-pointer"
//                     >
//                       <input
//                         type="checkbox"
//                         className="w-4 h-4 text-[#673AB7] border-gray-300 rounded focus:ring-[#673AB7]"
//                       />
//                       <span className="text-sm text-gray-700">{option}</span>
//                     </label>
//                   ))}
//                 </div>
//               )}

//               {field.type === "select" && (
//                 <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none">
//                   <option value="">Choose an option</option>
//                   {field.options?.map((option, idx) => (
//                     <option key={idx} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               )}

//               {field.type === "rating" && (
//                 <div>
//                   {field.ratingStyle === "star" &&
//                     renderStars(0, field.ratingMax || 5, true)}
//                   {field.ratingStyle === "emoji" &&
//                     renderEmojis(0, field.ratingMax || 5, true)}
//                   {field.ratingStyle === "number" && (
//                     <div className="flex gap-2">
//                       {Array.from(
//                         {
//                           length:
//                             (field.ratingMax || 5) - (field.ratingMin || 1) + 1,
//                         },
//                         (_, i) => (field.ratingMin || 1) + i,
//                       ).map((num) => (
//                         <button
//                           key={num}
//                           type="button"
//                           className="w-10 h-10 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
//                         >
//                           {num}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {field.type === "date" && (
//                 <input
//                   type="date"
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
//                 />
//               )}

//               {field.type === "time" && (
//                 <input
//                   type="time"
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
//                 />
//               )}

//               {field.type === "file_upload" && (
//                 <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-[#673AB7] transition-colors cursor-pointer">
//                   <svg
//                     className="mx-auto h-10 w-10 text-gray-300"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                     />
//                   </svg>
//                   <p className="mt-2 text-sm text-gray-500">
//                     Click to upload or drag and drop
//                   </p>
//                 </div>
//               )}

//               {(field.type === "checkbox_grid" ||
//                 field.type === "multiple_choice_grid") && (
//                 <div className="overflow-x-auto">
//                   <table className="w-full border border-gray-200 rounded-lg">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
//                         {field.columns?.map((col, idx) => (
//                           <th
//                             key={idx}
//                             className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                           >
//                             {col}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {field.rows?.map((row, rowIdx) => (
//                         <tr key={rowIdx}>
//                           <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
//                             {row}
//                            </td>
//                           {field.columns?.map((_, colIdx) => (
//                             <td key={colIdx} className="px-4 py-3 text-center">
//                               {field.type === "checkbox_grid" ? (
//                                 <input
//                                   type="checkbox"
//                                   className="w-4 h-4 text-[#673AB7] border-gray-300 rounded focus:ring-[#673AB7]"
//                                 />
//                               ) : (
//                                 <input
//                                   type="radio"
//                                   name={`preview-grid-${field.id}-${rowIdx}`}
//                                   className="w-4 h-4 text-[#673AB7] border-gray-300 focus:ring-[#673AB7]"
//                                 />
//                               )}
//                              </td>
//                           ))}
//                          </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (initialLoading) {
//     return (
//       <div className="min-h-screen bg-[#F0EBF8] flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#673AB7] mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading form...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F0EBF8] py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         {/* Header with navigation and actions */}
//         <div className="mb-4 flex items-center justify-between">
//           <button
//             onClick={() => router.back()}
//             className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
//           >
//             <svg
//               className="h-5 w-5 mr-1"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M10 19l-7-7m0 0l7-7m-7 7h18"
//               />
//             </svg>
//             Back
//           </button>
          
//           <button
//             onClick={handleDelete}
//             className="inline-flex items-center text-sm text-red-600 hover:text-red-700 transition-colors"
//           >
//             <svg
//               className="h-5 w-5 mr-1"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//               />
//             </svg>
//             Delete Form
//           </button>
//         </div>

//         {/* Mode toggle */}
//         <div className="flex justify-end mb-4">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 inline-flex">
//             <button
//               type="button"
//               onClick={() => setIsPreviewMode(false)}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                 !isPreviewMode
//                   ? "bg-[#673AB7] text-white"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               Edit
//             </button>
//             <button
//               type="button"
//               onClick={() => setIsPreviewMode(true)}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                 isPreviewMode
//                   ? "bg-[#673AB7] text-white"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               Preview
//             </button>
//           </div>
//         </div>

//         {/* Class, Subject, and Duration Card */}
//         <div className="bg-white rounded-xl shadow-sm border-t-8 border-[#673AB7] p-6 mb-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Class <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={className}
//                 onChange={(e) => setClassName(e.target.value)}
//                 placeholder="Enter class (e.g., 10, 12, A)"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#673AB7]"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Subject <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 placeholder="Enter subject (e.g., Math, English)"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#673AB7]"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Duration (minutes) <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 value={duration}
//                 onChange={(e) => setDuration(e.target.value)}
//                 placeholder="Enter duration in minutes"
//                 min="1"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#673AB7]"
//                 required
//               />
//               <p className="text-xs text-gray-500 mt-1">Time limit for completing the form</p>
//             </div>
//           </div>
//         </div>

//         {/* Form Header Card */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full text-3xl font-normal border-0 border-b-2 border-transparent focus:border-[#673AB7] focus:ring-0 outline-none px-0 py-1 mb-2"
//             placeholder="Form title"
//             required
//           />
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full text-base border-0 border-b-2 border-transparent focus:border-[#673AB7] focus:ring-0 outline-none px-0 py-1 resize-none"
//             placeholder="Form description"
//             rows={2}
//           />
//           <p className="mt-4 text-xs text-gray-400 flex items-center gap-1">
//             <span className="text-red-500">*</span> Indicates required question
//           </p>
//         </div>

//         {/* Error message */}
//         {error && (
//           <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
//             <p className="text-red-600 text-sm">{error}</p>
//           </div>
//         )}

//         {/* Form fields */}
//         <div className="space-y-3">
//           {isPreviewMode ? (
//             <>
//               {fields.length === 0 ? (
//                 <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
//                   <svg
//                     className="mx-auto h-12 w-12 text-gray-300 mb-4"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                     />
//                   </svg>
//                   <p>No questions added yet.</p>
//                 </div>
//               ) : (
//                 fields.map((field, index) => renderPreviewField(field, index))
//               )}
//             </>
//           ) : (
//             // Edit mode
//             <>
//               {fields.map((field) => renderField(field))}

//               {/* Add field button */}
//               <div className="relative flex justify-center py-4">
//                 {showFieldTypes && renderFieldTypeMenu()}
//                 <button
//                   type="button"
//                   onClick={() => setShowFieldTypes(!showFieldTypes)}
//                   className="bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm hover:shadow-md text-gray-700 font-medium flex items-center gap-2 transition-all hover:border-[#673AB7]"
//                 >
//                   <svg
//                     className="h-5 w-5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 4v16m8-8H4"
//                     />
//                   </svg>
//                   Add question
//                 </button>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Action buttons */}
//         <div className="mt-6 bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
//           <button
//             type="button"
//             onClick={() => handleUpdate(!isPublished)}
//             className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
//               isPublished
//                 ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
//                 : "bg-green-600 hover:bg-green-700 text-white"
//             }`}
//           >
//             {isPublished ? "Unpublish" : "Publish"}
//           </button>

//           <div className="flex gap-3">
//             <button
//               type="button"
//               onClick={() => handleUpdate()}
//               disabled={saving}
//               className={`px-8 py-2 bg-[#673AB7] hover:bg-[#5E35B1] text-white font-medium rounded-lg shadow-sm transition-colors ${
//                 saving ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               {saving ? "Saving..." : "Save Changes"}
//             </button>

//             <button
//               type="button"
//               onClick={() => router.push(`/forms/${id}`)}
//               className="px-6 py-2 border border-gray-200 hover:border-[#673AB7] text-gray-700 font-medium rounded-lg transition-colors"
//             >
//               View Live
//             </button>
//           </div>
//         </div>        
//       </div>
//     </div>
//   );
// }
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";

// Supported field types - matching backend schema
type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "radio"
  | "select"
  | "checkbox"
  | "checkbox_grid"
  | "multiple_choice_grid"
  | "date"
  | "time"
  | "file_upload"
  | "rating";

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  rows?: string[];
  columns?: string[];
  required: boolean;
  description?: string;
  min?: number;
  max?: number;
  ratingMin?: number;
  ratingMax?: number;
  ratingLabels?: {
    min?: string;
    max?: string;
    middle?: string;
  };
  ratingStyle?: "star" | "number" | "emoji";
  correctAnswer?: any;
  marks?: number;
}

export default function EditForm() {
  const router = useRouter();
  const { id } = useParams();
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [className, setClassName] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [duration, setDuration] = useState<string>("60");
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [showFieldTypes, setShowFieldTypes] = useState<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Generate a unique ID for new fields
  const generateId = () =>
    `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Transform backend field to frontend format
  const transformBackendField = (backendField: any): FormField => {
    const frontendField: FormField = {
      id: backendField._id || generateId(),
      label: backendField.label || "",
      type: backendField.type || "text",
      required: backendField.required || false,
      description: backendField.description || "",
      correctAnswer: backendField.correctAnswer || "",
      marks: backendField.marks || 1,
    };

    // Add type-specific properties
    if (["radio", "select", "checkbox"].includes(backendField.type)) {
      frontendField.options = backendField.options || ["Option 1", "Option 2"];
    }

    if (["checkbox_grid", "multiple_choice_grid"].includes(backendField.type)) {
      frontendField.rows = backendField.rows || ["Row 1", "Row 2"];
      frontendField.columns = backendField.columns || ["Column 1", "Column 2"];
    }

    if (backendField.type === "number") {
      frontendField.min = backendField.min;
      frontendField.max = backendField.max;
    }

    if (backendField.type === "rating") {
      frontendField.ratingMin = backendField.ratingMin || 1;
      frontendField.ratingMax = backendField.ratingMax || 5;
      frontendField.ratingStyle = backendField.ratingStyle || "star";
      frontendField.ratingLabels = backendField.ratingLabels || {
        min: "Poor",
        max: "Excellent",
      };
    }

    return frontendField;
  };

  // Fetch form data on mount
  useEffect(() => {
    const fetchForm = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to edit this form");
          router.push("/login");
          return;
        }

        const response = await axios.get(`/forms/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const formData = response.data;
        setTitle(formData.title || "Untitled form");
        setDescription(formData.description || "");
        setClassName(formData.className || "");
        setSubject(formData.subject || "");
        setDuration(formData.duration?.toString() || "60");
        setIsPublished(formData.isPublished || false);

        // Transform backend fields to frontend format
        if (formData.fields && Array.isArray(formData.fields)) {
          const transformedFields = formData.fields.map(transformBackendField);
          setFields(transformedFields);
        }
      } catch (err: any) {
        console.error("Error fetching form:", err);
        toast.error(err.response?.data?.error || "Failed to load form");
        setError("Failed to load form");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchForm();
  }, [id, router]);

  // Add a new empty field
  const addField = (type: FieldType = "text") => {
    const newField: FormField = {
      id: generateId(),
      label: "",
      type,
      required: false,
      description: "",
      correctAnswer: "",
      marks: 1,
    };

    if (type === "radio" || type === "select" || type === "checkbox") {
      newField.options = ["Option 1", "Option 2"];
      newField.correctAnswer = type === "checkbox" ? [] : "";
    } else if (type === "checkbox_grid" || type === "multiple_choice_grid") {
      newField.rows = ["Row 1", "Row 2"];
      newField.columns = ["Column 1", "Column 2"];
      newField.correctAnswer = {};
    } else if (type === "rating") {
      newField.ratingMin = 1;
      newField.ratingMax = 5;
      newField.ratingLabels = {
        min: "Poor",
        max: "Excellent",
      };
      newField.ratingStyle = "star";
      newField.correctAnswer = "";
    }

    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
    setShowFieldTypes(false);
  };

  // Delete a field
  const deleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  // Update field property
  const updateField = <K extends keyof FormField>(
    id: string,
    key: K,
    value: FormField[K],
  ) => {
    const updated = fields.map((field) => {
      if (field.id === id) {
        const updatedField = { ...field, [key]: value };
        
        // Reset correctAnswer when type changes
        if (key === "type") {
          if (value === "checkbox") {
            updatedField.correctAnswer = [];
          } else if (value === "checkbox_grid" || value === "multiple_choice_grid") {
            updatedField.correctAnswer = {};
          } else {
            updatedField.correctAnswer = "";
          }
        }
        
        return updatedField;
      }
      return field;
    });
    setFields(updated);
  };

  // Update correct answer
  const updateCorrectAnswer = (id: string, value: any) => {
    const updated = fields.map((field) => {
      if (field.id === id) {
        return { ...field, correctAnswer: value };
      }
      return field;
    });
    setFields(updated);
  };

  // Update marks
  const updateMarks = (id: string, marks: number) => {
    const updated = fields.map((field) => {
      if (field.id === id) {
        return { ...field, marks: Math.max(0, marks) };
      }
      return field;
    });
    setFields(updated);
  };

  // Update grid answer
  const updateGridAnswer = (fieldId: string, rowIndex: number, colIndex: number, value: string) => {
    const updated = fields.map((field) => {
      if (field.id === fieldId && field.correctAnswer && typeof field.correctAnswer === 'object') {
        const newAnswer = { ...field.correctAnswer };
        const key = `${rowIndex}_${colIndex}`;
        newAnswer[key] = value;
        return { ...field, correctAnswer: newAnswer };
      }
      return field;
    });
    setFields(updated);
  };

  // Add option to radio/select/checkbox
  const addOption = (id: string) => {
    const updated = fields.map((field) => {
      if (field.id === id) {
        const options = field.options || [];
        return {
          ...field,
          options: [...options, `Option ${options.length + 1}`],
        };
      }
      return field;
    });
    setFields(updated);
  };

  // Update option
  const updateOption = (fieldId: string, optIndex: number, value: string) => {
    const updated = fields.map((field) => {
      if (field.id === fieldId && field.options) {
        const newOptions = [...field.options];
        newOptions[optIndex] = value;
        return { ...field, options: newOptions };
      }
      return field;
    });
    setFields(updated);
  };

  // Delete option
  const deleteOption = (fieldId: string, optIndex: number) => {
    const updated = fields.map((field) => {
      if (field.id === fieldId && field.options) {
        return {
          ...field,
          options: field.options.filter((_, i) => i !== optIndex),
        };
      }
      return field;
    });
    setFields(updated);
  };

  // Grid: add row
  const addRow = (id: string) => {
    const updated = fields.map((field) => {
      if (field.id === id) {
        const rows = field.rows || [];
        return { ...field, rows: [...rows, `Row ${rows.length + 1}`] };
      }
      return field;
    });
    setFields(updated);
  };

  // Grid: update row
  const updateRow = (fieldId: string, rowIndex: number, value: string) => {
    const updated = fields.map((field) => {
      if (field.id === fieldId && field.rows) {
        const newRows = [...field.rows];
        newRows[rowIndex] = value;
        return { ...field, rows: newRows };
      }
      return field;
    });
    setFields(updated);
  };

  // Grid: delete row
  const deleteRow = (fieldId: string, rowIndex: number) => {
    const updated = fields.map((field) => {
      if (field.id === fieldId && field.rows) {
        return {
          ...field,
          rows: field.rows.filter((_, i) => i !== rowIndex),
        };
      }
      return field;
    });
    setFields(updated);
  };

  // Grid: add column
  const addColumn = (id: string) => {
    const updated = fields.map((field) => {
      if (field.id === id) {
        const columns = field.columns || [];
        return {
          ...field,
          columns: [...columns, `Column ${columns.length + 1}`],
        };
      }
      return field;
    });
    setFields(updated);
  };

  // Grid: update column
  const updateColumn = (fieldId: string, colIndex: number, value: string) => {
    const updated = fields.map((field) => {
      if (field.id === fieldId && field.columns) {
        const newColumns = [...field.columns];
        newColumns[colIndex] = value;
        return { ...field, columns: newColumns };
      }
      return field;
    });
    setFields(updated);
  };

  // Grid: delete column
  const deleteColumn = (fieldId: string, colIndex: number) => {
    const updated = fields.map((field) => {
      if (field.id === fieldId && field.columns) {
        return {
          ...field,
          columns: field.columns.filter((_, i) => i !== colIndex),
        };
      }
      return field;
    });
    setFields(updated);
  };

  // Calculate total marks
  const calculateTotalMarks = () => {
    return fields.reduce((total, field) => total + (field.marks || 0), 0);
  };

  // Transform frontend fields to backend format
  const transformFieldsForBackend = () => {
    return fields.map((field) => {
      // Remove the temporary id field
      const { id, ...backendField } = field;

      if (field.type === "rating") {
        return {
          ...backendField,
          ratingMin: field.ratingMin || 1,
          ratingMax: field.ratingMax || 5,
          ratingStyle: field.ratingStyle || "star",
          ratingLabels: field.ratingLabels || { min: "", max: "" },
          correctAnswer: field.correctAnswer,
          marks: field.marks || 1,
        };
      }

      if (field.type === "number") {
        return {
          ...backendField,
          min: field.min ? Number(field.min) : undefined,
          max: field.max ? Number(field.max) : undefined,
          correctAnswer: field.correctAnswer,
          marks: field.marks || 1,
        };
      }

      if (field.type === "checkbox") {
        return {
          ...backendField,
          correctAnswer: field.correctAnswer || [],
          marks: field.marks || 1,
        };
      }

      if (field.type === "checkbox_grid" || field.type === "multiple_choice_grid") {
        return {
          ...backendField,
          correctAnswer: field.correctAnswer || {},
          marks: field.marks || 1,
        };
      }

      return {
        ...backendField,
        correctAnswer: field.correctAnswer || "",
        marks: field.marks || 1,
      };
    });
  };

  // Handle form update
  const handleUpdate = async (publishStatus?: boolean) => {
    // Validate form
    if (!title.trim()) {
      setError("Form title is required");
      toast.error("Form title is required");
      return;
    }

    if (!className.trim()) {
      setError("Class is required");
      toast.error("Class is required");
      return;
    }

    if (!subject.trim()) {
      setError("Subject is required");
      toast.error("Subject is required");
      return;
    }

    if (!duration.trim() || parseInt(duration) <= 0) {
      setError("Valid duration is required (minutes)");
      toast.error("Valid duration is required (minutes)");
      return;
    }

    const invalidFields = fields.filter((field) => !field.label.trim());
    if (invalidFields.length > 0) {
      setError("All questions must have a label");
      toast.error("All questions must have a label");
      return;
    }

    const invalidMarks = fields.filter((field) => (field.marks || 0) <= 0);
    if (invalidMarks.length > 0) {
      setError("All questions must have positive marks");
      toast.error("All questions must have positive marks");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to update the form");
        toast.error("You must be logged in to update the form");
        setSaving(false);
        return;
      }

      const formData = {
        title: title.trim(),
        description: description.trim(),
        className: className.trim(),
        subject: subject.trim(),
        duration: parseInt(duration),
        totalMarks: calculateTotalMarks(),
        fields: transformFieldsForBackend(),
        isPublished: publishStatus !== undefined ? publishStatus : isPublished,
      };

      await axios.put(`/forms/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (publishStatus !== undefined) {
        setIsPublished(publishStatus);
        toast.success(
          publishStatus ? "Form published successfully!" : "Form unpublished",
        );
      } else {
        toast.success("Form updated successfully!");
      }

      // Refresh form data
      const response = await axios.get(`/forms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTitle(response.data.title);
      setDescription(response.data.description);
      setClassName(response.data.className);
      setSubject(response.data.subject);
      setDuration(response.data.duration?.toString() || "60");
      setIsPublished(response.data.isPublished);
      
      // Refresh fields
      if (response.data.fields && Array.isArray(response.data.fields)) {
        const transformedFields = response.data.fields.map(transformBackendField);
        setFields(transformedFields);
      }
    } catch (err: any) {
      console.error("Error updating form:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update form";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete form
  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this form? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You must be logged in to delete the form");
        return;
      }

      await axios.delete(`/forms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Form deleted successfully!");
      router.push("/admin/forms");
    } catch (err: any) {
      console.error("Error deleting form:", err);
      toast.error(err.response?.data?.error || "Failed to delete form");
    }
  };

  // Render answer and marks section
  const renderAnswerAndMarks = (field: FormField) => {
    return (
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Marks Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={field.marks || 1}
              onChange={(e) => updateMarks(field.id, parseInt(e.target.value) || 0)}
              min="1"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-purple-50"
            />
            <p className="text-xs text-gray-500 mt-1">Points for this question</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correct Answer <span className="text-red-500">*</span>
          </label>
          
          {field.type === "text" && (
            <input
              type="text"
              value={field.correctAnswer as string || ""}
              onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-green-50"
              placeholder="Enter the correct answer"
            />
          )}

          {field.type === "textarea" && (
            <textarea
              value={field.correctAnswer as string || ""}
              onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-green-50"
              placeholder="Enter the correct answer"
            />
          )}

          {field.type === "number" && (
            <input
              type="number"
              value={field.correctAnswer as string || ""}
              onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-green-50"
              placeholder="Enter the correct number"
            />
          )}

          {field.type === "radio" && (
            <div className="space-y-2 bg-green-50 p-4 rounded-lg">
              {field.options?.map((option, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`answer-${field.id}`}
                    value={option}
                    checked={field.correctAnswer === option}
                    onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
              <p className="text-xs text-gray-500 mt-2">Select the correct answer</p>
            </div>
          )}

          {field.type === "select" && (
            <select
              value={field.correctAnswer as string || ""}
              onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-green-50"
            >
              <option value="">Select the correct answer</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          {field.type === "checkbox" && (
            <div className="space-y-2 bg-green-50 p-4 rounded-lg">
              {field.options?.map((option, index) => {
                const answers = field.correctAnswer as string[] || [];
                return (
                  <label key={index} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      value={option}
                      checked={answers.includes(option)}
                      onChange={(e) => {
                        const currentAnswers = [...(field.correctAnswer as string[] || [])];
                        if (e.target.checked) {
                          updateCorrectAnswer(field.id, [...currentAnswers, option]);
                        } else {
                          updateCorrectAnswer(field.id, currentAnswers.filter(a => a !== option));
                        }
                      }}
                      className="text-green-600 focus:ring-green-500 rounded"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                );
              })}
              <p className="text-xs text-gray-500 mt-2">Select all correct answers</p>
            </div>
          )}

          {field.type === "rating" && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex gap-2 flex-wrap">
                {Array.from(
                  {
                    length: (field.ratingMax || 5) - (field.ratingMin || 1) + 1,
                  },
                  (_, i) => (field.ratingMin || 1) + i,
                ).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => updateCorrectAnswer(field.id, num)}
                    className={`w-10 h-10 rounded-lg border-2 transition ${
                      field.correctAnswer === num
                        ? 'bg-green-500 text-white border-green-600'
                        : 'border-gray-300 hover:border-green-400 text-gray-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Select the correct rating value</p>
            </div>
          )}

          {field.type === "date" && (
            <input
              type="date"
              value={field.correctAnswer as string || ""}
              onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-green-50"
            />
          )}

          {field.type === "time" && (
            <input
              type="time"
              value={field.correctAnswer as string || ""}
              onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-green-50"
            />
          )}

          {(field.type === "checkbox_grid" || field.type === "multiple_choice_grid") && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2"></th>
                      {field.columns?.map((column, colIndex) => (
                        <th key={colIndex} className="text-left p-2 font-medium text-sm">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {field.rows?.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="p-2 font-medium text-sm">{row}</td>
                        {field.columns?.map((_, colIndex) => {
                          const answers = field.correctAnswer as { [key: string]: string } || {};
                          const key = `${rowIndex}_${colIndex}`;
                          return (
                            <td key={colIndex} className="p-2">
                              {field.type === "checkbox_grid" ? (
                                <input
                                  type="checkbox"
                                  checked={answers[key] === "true"}
                                  onChange={(e) => {
                                    const newAnswers = { ...answers };
                                    newAnswers[key] = e.target.checked ? "true" : "false";
                                    updateCorrectAnswer(field.id, newAnswers);
                                  }}
                                  className="text-green-600 focus:ring-green-500 rounded"
                                />
                              ) : (
                                <select
                                  value={answers[key] || ""}
                                  onChange={(e) => {
                                    const newAnswers = { ...answers };
                                    newAnswers[key] = e.target.value;
                                    updateCorrectAnswer(field.id, newAnswers);
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-green-500"
                                >
                                  <option value="">Select...</option>
                                  {field.columns?.map((column, idx) => (
                                    <option key={idx} value={column}>
                                      {column}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2">Select the correct answers for each grid cell</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Field type options
  const fieldTypeOptions = [
    { type: "text" as FieldType, label: "Short answer", icon: "T" },
    { type: "textarea" as FieldType, label: "Paragraph", icon: "¶" },
    { type: "number" as FieldType, label: "Number", icon: "#" },
    { type: "radio" as FieldType, label: "Multiple choice", icon: "○" },
    { type: "checkbox" as FieldType, label: "Checkboxes", icon: "☑" },
    { type: "select" as FieldType, label: "Dropdown", icon: "▼" },
    { type: "rating" as FieldType, label: "Rating", icon: "⭐" },
    { type: "file_upload" as FieldType, label: "File upload", icon: "📎" },
    { type: "date" as FieldType, label: "Date", icon: "📅" },
    { type: "time" as FieldType, label: "Time", icon: "🕐" },
    { type: "checkbox_grid" as FieldType, label: "Checkbox grid", icon: "⊞" },
    {
      type: "multiple_choice_grid" as FieldType,
      label: "Multiple choice grid",
      icon: "⊟",
    },
  ];

  // Render field type menu
  const renderFieldTypeMenu = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 absolute bottom-full mb-2 left-0 z-10 w-72">
      <div className="grid grid-cols-2 gap-1">
        {fieldTypeOptions.map((option) => (
          <button
            key={option.type}
            type="button"
            onClick={() => addField(option.type)}
            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
          >
            <span className="text-xl w-6">{option.icon}</span>
            <span className="text-sm text-gray-700">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Render rating stars preview
  const renderStars = (
    rating: number,
    maxRating: number,
    interactive: boolean = false,
  ) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            className={`text-2xl transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-300"} ${interactive ? "hover:text-yellow-400 cursor-pointer" : "cursor-default"}`}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  // Render emoji ratings preview
  const renderEmojis = (
    rating: number,
    maxRating: number,
    interactive: boolean = false,
  ) => {
    const emojis = ["😞", "😐", "🙂", "😊", "😄"];
    return (
      <div className="flex gap-2">
        {Array.from({ length: maxRating }, (_, i) => i).map((index) => (
          <button
            key={index}
            type="button"
            className={`text-3xl transition-all ${index === rating ? "scale-125" : "scale-100"} ${interactive ? "hover:scale-125 cursor-pointer" : "cursor-default"}`}
            disabled={!interactive}
          >
            {emojis[index] || "😊"}
          </button>
        ))}
      </div>
    );
  };

  // Render field in edit mode
  const renderField = (field: FormField) => {
    const isSelected = selectedFieldId === field.id;

    return (
      <div
        key={field.id}
        className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
          isSelected
            ? "border-[#673AB7]"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => setSelectedFieldId(field.id)}
      >
        {/* Field header */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateField(field.id, "label", e.target.value)}
                className="w-full text-lg font-medium border-0 focus:ring-0 p-0 outline-none placeholder:text-gray-400"
                placeholder="Question"
                onClick={(e) => e.stopPropagation()}
              />
              <input
                type="text"
                value={field.description || ""}
                onChange={(e) =>
                  updateField(field.id, "description", e.target.value)
                }
                className="w-full text-sm text-gray-500 border-0 focus:ring-0 p-0 mt-1 outline-none placeholder:text-gray-300"
                placeholder="Description (optional)"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateField(field.id, "required", !field.required);
                }}
                className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                  field.required
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {field.required ? "Required" : "Optional"}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteField(field.id);
                }}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Field type-specific content */}
          <div className="mt-4">
            {field.type === "text" && (
              <input
                type="text"
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                placeholder="Short answer text"
              />
            )}

            {field.type === "textarea" && (
              <textarea
                disabled
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                placeholder="Long answer text"
              />
            )}

            {field.type === "number" && (
              <div className="space-y-3">
                <input
                  type="number"
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  placeholder="Number"
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">
                      Minimum
                    </label>
                    <input
                      type="number"
                      value={field.min || ""}
                      onChange={(e) =>
                        updateField(
                          field.id,
                          "min",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
                      placeholder="No minimum"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">
                      Maximum
                    </label>
                    <input
                      type="number"
                      value={field.max || ""}
                      onChange={(e) =>
                        updateField(
                          field.id,
                          "max",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
                      placeholder="No maximum"
                    />
                  </div>
                </div>
              </div>
            )}

            {(field.type === "radio" ||
              field.type === "select" ||
              field.type === "checkbox") && (
              <div className="space-y-2">
                {field.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {field.type === "radio" && (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                    )}
                    {field.type === "checkbox" && (
                      <div className="w-4 h-4 rounded border-2 border-gray-300"></div>
                    )}
                    {field.type === "select" && (
                      <span className="text-gray-400">•</span>
                    )}
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        updateOption(field.id, index, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => deleteOption(field.id, index)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg
                        className="h-4 w-4"
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
                ))}
                <button
                  type="button"
                  onClick={() => addOption(field.id)}
                  className="text-sm text-[#673AB7] hover:text-[#5E35B1] font-medium mt-2"
                >
                  + Add option
                </button>
              </div>
            )}

            {field.type === "rating" && (
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <select
                    value={field.ratingStyle}
                    onChange={(e) =>
                      updateField(
                        field.id,
                        "ratingStyle",
                        e.target.value as "star" | "number" | "emoji",
                      )
                    }
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
                  >
                    <option value="star">Stars</option>
                    <option value="number">Numbers</option>
                    <option value="emoji">Emojis</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={field.ratingMin || 1}
                      onChange={(e) =>
                        updateField(
                          field.id,
                          "ratingMin",
                          Number(e.target.value),
                        )
                      }
                      className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center"
                      min="1"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="number"
                      value={field.ratingMax || 5}
                      onChange={(e) =>
                        updateField(
                          field.id,
                          "ratingMax",
                          Number(e.target.value),
                        )
                      }
                      className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Min label
                    </label>
                    <input
                      type="text"
                      value={field.ratingLabels?.min || ""}
                      onChange={(e) =>
                        updateField(field.id, "ratingLabels", {
                          ...field.ratingLabels,
                          min: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
                      placeholder="e.g., Poor"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Max label
                    </label>
                    <input
                      type="text"
                      value={field.ratingLabels?.max || ""}
                      onChange={(e) =>
                        updateField(field.id, "ratingLabels", {
                          ...field.ratingLabels,
                          max: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
                      placeholder="e.g., Excellent"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-3">Preview:</p>
                  {field.ratingStyle === "star" &&
                    renderStars(3, field.ratingMax || 5)}
                  {field.ratingStyle === "emoji" &&
                    renderEmojis(2, field.ratingMax || 5)}
                  {field.ratingStyle === "number" && (
                    <div className="flex gap-2">
                      {Array.from(
                        {
                          length:
                            (field.ratingMax || 5) - (field.ratingMin || 1) + 1,
                        },
                        (_, i) => (field.ratingMin || 1) + i,
                      ).map((num) => (
                        <button
                          key={num}
                          type="button"
                          className="w-10 h-10 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                          disabled
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {field.type === "date" && (
              <input
                type="date"
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
            )}

            {field.type === "time" && (
              <input
                type="time"
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
            )}

            {field.type === "file_upload" && (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50">
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
                <p className="mt-2 text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
              </div>
            )}

            {(field.type === "checkbox_grid" ||
              field.type === "multiple_choice_grid") && (
              <div className="space-y-6">
                {/* Rows */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Rows
                    </span>
                    <button
                      type="button"
                      onClick={() => addRow(field.id)}
                      className="text-sm text-[#673AB7] hover:text-[#5E35B1]"
                    >
                      + Add row
                    </button>
                  </div>
                  <div className="space-y-2">
                    {field.rows?.map((row, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={row}
                          onChange={(e) =>
                            updateRow(field.id, index, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => deleteRow(field.id, index)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <svg
                            className="h-4 w-4"
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
                    ))}
                  </div>
                </div>

                {/* Columns */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Columns
                    </span>
                    <button
                      type="button"
                      onClick={() => addColumn(field.id)}
                      className="text-sm text-[#673AB7] hover:text-[#5E35B1]"
                    >
                      + Add column
                    </button>
                  </div>
                  <div className="space-y-2">
                    {field.columns?.map((column, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={column}
                          onChange={(e) =>
                            updateColumn(field.id, index, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => deleteColumn(field.id, index)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <svg
                            className="h-4 w-4"
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
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Answer and Marks Section */}
          {renderAnswerAndMarks(field)}
        </div>
      </div>
    );
  };

  // Render field in preview mode
  const renderPreviewField = (field: FormField, index: number) => {
    return (
      <div key={field.id} className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start gap-3">
          <span className="text-sm font-medium text-gray-400 min-w-6">
            {index + 1}.
          </span>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-3">
              <div>
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
              <div className="text-sm text-purple-600 font-medium">
                {field.marks} {field.marks === 1 ? 'mark' : 'marks'}
              </div>
            </div>

            <div>
              {field.type === "text" && (
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
                  placeholder="Your answer"
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
                  placeholder="Your answer"
                />
              )}

              {field.type === "number" && (
                <input
                  type="number"
                  min={field.min}
                  max={field.max}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
                  placeholder="Your answer"
                />
              )}

              {field.type === "radio" && (
                <div className="space-y-2">
                  {field.options?.map((option, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`preview-${field.id}`}
                        className="w-4 h-4 text-[#673AB7] border-gray-300 focus:ring-[#673AB7]"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.type === "checkbox" && (
                <div className="space-y-2">
                  {field.options?.map((option, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#673AB7] border-gray-300 rounded focus:ring-[#673AB7]"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.type === "select" && (
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none">
                  <option value="">Choose an option</option>
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "rating" && (
                <div>
                  {field.ratingStyle === "star" &&
                    renderStars(0, field.ratingMax || 5, true)}
                  {field.ratingStyle === "emoji" &&
                    renderEmojis(0, field.ratingMax || 5, true)}
                  {field.ratingStyle === "number" && (
                    <div className="flex gap-2">
                      {Array.from(
                        {
                          length:
                            (field.ratingMax || 5) - (field.ratingMin || 1) + 1,
                        },
                        (_, i) => (field.ratingMin || 1) + i,
                      ).map((num) => (
                        <button
                          key={num}
                          type="button"
                          className="w-10 h-10 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {field.type === "date" && (
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
                />
              )}

              {field.type === "time" && (
                <input
                  type="time"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#673AB7] focus:border-transparent outline-none"
                />
              )}

              {field.type === "file_upload" && (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-[#673AB7] transition-colors cursor-pointer">
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
                  <p className="mt-2 text-sm text-gray-500">
                    Click to upload or drag and drop
                  </p>
                </div>
              )}

              {(field.type === "checkbox_grid" ||
                field.type === "multiple_choice_grid") && (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        {field.columns?.map((col, idx) => (
                          <th
                            key={idx}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {field.rows?.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {row}
                           </td>
                          {field.columns?.map((_, colIdx) => (
                            <td key={colIdx} className="px-4 py-3 text-center">
                              {field.type === "checkbox_grid" ? (
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-[#673AB7] border-gray-300 rounded focus:ring-[#673AB7]"
                                />
                              ) : (
                                <input
                                  type="radio"
                                  name={`preview-grid-${field.id}-${rowIdx}`}
                                  className="w-4 h-4 text-[#673AB7] border-gray-300 focus:ring-[#673AB7]"
                                />
                              )}
                             </td>
                          ))}
                         </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#F0EBF8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#673AB7] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EBF8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with navigation and actions */}
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
            Back
          </button>
          
          <button
            onClick={handleDelete}
            className="inline-flex items-center text-sm text-red-600 hover:text-red-700 transition-colors"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Form
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex justify-end mb-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 inline-flex">
            <button
              type="button"
              onClick={() => setIsPreviewMode(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !isPreviewMode
                  ? "bg-[#673AB7] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setIsPreviewMode(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isPreviewMode
                  ? "bg-[#673AB7] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Class, Subject, and Duration Card */}
        <div className="bg-white rounded-xl shadow-sm border-t-8 border-[#673AB7] p-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Enter class (e.g., 10, 12, A)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#673AB7]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject (e.g., Math, English)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#673AB7]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration in minutes"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#673AB7]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Time limit for completing the form</p>
            </div>
          </div>
        </div>

        {/* Form Header Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-normal border-0 border-b-2 border-transparent focus:border-[#673AB7] focus:ring-0 outline-none px-0 py-1 mb-2"
            placeholder="Form title"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-base border-0 border-b-2 border-transparent focus:border-[#673AB7] focus:ring-0 outline-none px-0 py-1 resize-none"
            placeholder="Form description"
            rows={2}
          />
          
          {/* Total Marks Display */}
          {fields.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-right">
                <span className="text-sm font-medium text-gray-600">Total Marks: </span>
                <span className="text-lg font-bold text-purple-600">{calculateTotalMarks()}</span>
              </div>
            </div>
          )}
          
          <p className="mt-4 text-xs text-gray-400 flex items-center gap-1">
            <span className="text-red-500">*</span> Indicates required question
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Form fields */}
        <div className="space-y-3">
          {isPreviewMode ? (
            <>
              {fields.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-300 mb-4"
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
                  <p>No questions added yet.</p>
                </div>
              ) : (
                fields.map((field, index) => renderPreviewField(field, index))
              )}
            </>
          ) : (
            // Edit mode
            <>
              {fields.map((field) => renderField(field))}

              {/* Add field button */}
              <div className="relative flex justify-center py-4">
                {showFieldTypes && renderFieldTypeMenu()}
                <button
                  type="button"
                  onClick={() => setShowFieldTypes(!showFieldTypes)}
                  className="bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm hover:shadow-md text-gray-700 font-medium flex items-center gap-2 transition-all hover:border-[#673AB7]"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add question
                </button>
              </div>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleUpdate(!isPublished)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              isPublished
                ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isPublished ? "Unpublish" : "Publish"}
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleUpdate()}
              disabled={saving}
              className={`px-8 py-2 bg-[#673AB7] hover:bg-[#5E35B1] text-white font-medium rounded-lg shadow-sm transition-colors ${
                saving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => router.push(`/forms/${id}`)}
              className="px-6 py-2 border border-gray-200 hover:border-[#673AB7] text-gray-700 font-medium rounded-lg transition-colors"
            >
              View Live
            </button>
          </div>
        </div>        
      </div>
    </div>
  );
}
