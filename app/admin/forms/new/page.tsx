// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useState } from "react";
// import axios from "@/lib/axios";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";

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

// export default function NewForm() {
//   const router = useRouter();
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const [title, setTitle] = useState<string>("Untitled form");
//   const [description, setDescription] = useState<string>("Form description");
//   const [className, setClassName] = useState<string>("");
//   const [subject, setSubject] = useState<string>("");
//   const [duration, setDuration] = useState<string>("60");
//   const [fields, setFields] = useState<FormField[]>([]);
//   const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
//   const [showFieldTypes, setShowFieldTypes] = useState<boolean>(false);
//   const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

//   const generateId = () =>
//     `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

//   // Add a new empty field (default type = text)
//   const addField = (type: FieldType = "text") => {
//     const newField: FormField = {
//       id: generateId(),
//       label: "",
//       type,
//       required: false,
//     };

//     if (type === "radio" || type === "select" || type === "checkbox") {
//       newField.options = ["Option 1", "Option 2"];
//     } else if (type === "checkbox_grid" || type === "multiple_choice_grid") {
//       newField.rows = ["Row 1", "Row 2"];
//       newField.columns = ["Column 1", "Column 2"];
//     } else if (type === "rating") {
//       // Initialize rating field with defaults
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

//   // Delete a field by ID
//   const deleteField = (id: string) => {
//     setFields(fields.filter((field) => field.id !== id));
//     if (selectedFieldId === id) {
//       setSelectedFieldId(null);
//     }
//   };

//   // Update any property of a field
//   const updateField = <K extends keyof FormField>(
//     id: string,
//     key: K,
//     value: FormField[K],
//   ) => {
//     const updated = fields.map((field) => {
//       if (field.id === id) {
//         const updatedField = { ...field, [key]: value };

//         // If type changes to a grid type, ensure rows/columns exist
//         if (
//           key === "type" &&
//           (value === "checkbox_grid" || value === "multiple_choice_grid")
//         ) {
//           if (!updatedField.rows || updatedField.rows.length === 0) {
//             updatedField.rows = ["Row 1"];
//           }
//           if (!updatedField.columns || updatedField.columns.length === 0) {
//             updatedField.columns = ["Column 1"];
//           }
//         }

//         // If type changes to a radio/select/checkbox, ensure options exist
//         if (
//           key === "type" &&
//           (value === "radio" || value === "select" || value === "checkbox")
//         ) {
//           if (!updatedField.options || updatedField.options.length === 0) {
//             updatedField.options = ["Option 1", "Option 2"];
//           }
//         }

//         // If type changes to rating, set defaults
//         if (key === "type" && value === "rating") {
//           updatedField.ratingMin = 1;
//           updatedField.ratingMax = 5;
//           updatedField.ratingLabels = {
//             min: "Poor",
//             max: "Excellent",
//           };
//           updatedField.ratingStyle = "star";
//         }

//         return updatedField;
//       }
//       return field;
//     });

//     setFields(updated);
//   };

//   // Add a new option to a non-grid field
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

//   // Update a specific option
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

//   // Delete an option
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

//   // Grid: add a new row
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

//   // Grid: update a row label
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

//   // Grid: delete a row
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

//   // Grid: add a new column
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

//   // Grid: update a column label
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

//   // Grid: delete a column
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

//   // Submit the form
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     // Validate title, class, subject, and duration
//     if (!title.trim()) {
//       setError("Title is required");
//       toast.error("Title is required");
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

//     // Validate fields
//     const invalidFields = fields.filter((field) => !field.label.trim());
//     if (invalidFields.length > 0) {
//       setError("All questions must have a label");
//       toast.error("All questions must have a label");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("You must be logged in to create a form");
//         toast.error("You must be logged in to create a form");
//         setLoading(false);
//         return;
//       }

//       const formData = {
//         title: title.trim(),
//         description: description.trim(),
//         className: className.trim(),
//         subject: subject.trim(),
//         duration: parseInt(duration), // Send duration as number
//         fields: transformFieldsForBackend(),
//         isPublished: true,
//       };

//       const response = await axios.post("/forms", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
      
//       toast.success("Form created successfully");
//       router.push("/admin/forms");
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || err.message || "Failed to create form";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
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

//   // Render field type selection menu
//   const renderFieldTypeMenu = () => (
//     <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 absolute bottom-full mb-2 left-0 z-10 w-64">
//       <div className="grid grid-cols-2 gap-1">
//         {fieldTypeOptions.map((option) => (
//           <button
//             key={option.type}
//             type="button"
//             onClick={() => addField(option.type)}
//             className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left"
//           >
//             <span className="text-xl">{option.icon}</span>
//             <span className="text-sm">{option.label}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );

//   // Render rating stars
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

//   // Render emoji ratings
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

//   // Render a field in edit mode
//   const renderField = (field: FormField) => {
//     const isSelected = selectedFieldId === field.id;

//     return (
//       <div
//         key={field.id}
//         className={`bg-white rounded-lg shadow-sm border-2 ${
//           isSelected ? "border-blue-500" : "border-gray-200"
//         } p-6 transition-all`}
//         onClick={() => setSelectedFieldId(field.id)}
//       >
//         {/* Field header */}
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex-1">
//             <input
//               type="text"
//               value={field.label}
//               onChange={(e) => updateField(field.id, "label", e.target.value)}
//               className="w-full text-lg font-medium border-0 focus:ring-0 p-0 outline-none"
//               placeholder="Question title"
//               onClick={(e) => e.stopPropagation()}
//             />
//             {field.description && (
//               <p className="text-sm text-gray-500 mt-1">{field.description}</p>
//             )}
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 updateField(field.id, "required", !field.required);
//               }}
//               className={`text-sm px-3 py-1 rounded-full ${
//                 field.required
//                   ? "bg-red-100 text-red-700"
//                   : "bg-gray-100 text-gray-700"
//               }`}
//             >
//               {field.required ? "Required" : "Optional"}
//             </button>
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 deleteField(field.id);
//               }}
//               className="text-gray-400 hover:text-red-500 transition-colors"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Field type-specific content */}
//         <div className="mt-4">
//           {field.type === "text" && (
//             <input
//               type="text"
//               disabled
//               className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
//               placeholder="Short answer text"
//             />
//           )}

//           {field.type === "textarea" && (
//             <textarea
//               disabled
//               rows={4}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
//               placeholder="Long answer text"
//             />
//           )}

//           {field.type === "number" && (
//             <div className="space-y-2">
//               <input
//                 type="number"
//                 disabled
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
//                 placeholder="Number"
//               />
//               <div className="flex gap-4">
//                 <div className="flex-1">
//                   <label className="text-xs text-gray-600">Min value</label>
//                   <input
//                     type="number"
//                     value={field.min || ""}
//                     onChange={(e) =>
//                       updateField(field.id, "min", Number(e.target.value))
//                     }
//                     className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
//                     placeholder="No minimum"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <label className="text-xs text-gray-600">Max value</label>
//                   <input
//                     type="number"
//                     value={field.max || ""}
//                     onChange={(e) =>
//                       updateField(field.id, "max", Number(e.target.value))
//                     }
//                     className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
//                     placeholder="No maximum"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {(field.type === "radio" ||
//             field.type === "select" ||
//             field.type === "checkbox") && (
//             <div className="space-y-2">
//               {field.options?.map((option, index) => (
//                 <div key={index} className="flex items-center gap-2">
//                   {field.type === "radio" && (
//                     <input type="radio" disabled className="text-blue-600" />
//                   )}
//                   {field.type === "checkbox" && (
//                     <input type="checkbox" disabled className="text-blue-600" />
//                   )}
//                   {field.type === "select" && (
//                     <span className="text-gray-400">•</span>
//                   )}
//                   <input
//                     type="text"
//                     value={option}
//                     onChange={(e) =>
//                       updateOption(field.id, index, e.target.value)
//                     }
//                     className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => deleteOption(field.id, index)}
//                     className="text-gray-400 hover:text-red-500"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={() => addOption(field.id)}
//                 className="text-sm text-blue-600 hover:text-blue-700"
//               >
//                 + Add option
//               </button>
//             </div>
//           )}

//           {field.type === "rating" && (
//             <div className="space-y-4">
//               <div className="flex items-center gap-4">
//                 <span className="text-sm text-gray-600">Style:</span>
//                 <select
//                   value={field.ratingStyle}
//                   onChange={(e) =>
//                     updateField(
//                       field.id,
//                       "ratingStyle",
//                       e.target.value as "star" | "number" | "emoji",
//                     )
//                   }
//                   className="px-2 py-1 border border-gray-300 rounded text-sm"
//                 >
//                   <option value="star">Stars</option>
//                   <option value="number">Numbers</option>
//                   <option value="emoji">Emojis</option>
//                 </select>
//               </div>

//               <div className="flex items-center gap-4">
//                 <span className="text-sm text-gray-600">Range:</span>
//                 <input
//                   type="number"
//                   value={field.ratingMin || 1}
//                   onChange={(e) =>
//                     updateField(field.id, "ratingMin", Number(e.target.value))
//                   }
//                   className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
//                   min="1"
//                 />
//                 <span>to</span>
//                 <input
//                   type="number"
//                   value={field.ratingMax || 5}
//                   onChange={(e) =>
//                     updateField(field.id, "ratingMax", Number(e.target.value))
//                   }
//                   className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
//                   min="1"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-600 w-16">Min label:</span>
//                   <input
//                     type="text"
//                     value={field.ratingLabels?.min || ""}
//                     onChange={(e) =>
//                       updateField(field.id, "ratingLabels", {
//                         ...field.ratingLabels,
//                         min: e.target.value,
//                       })
//                     }
//                     className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
//                     placeholder="e.g., Poor"
//                   />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-600 w-16">Max label:</span>
//                   <input
//                     type="text"
//                     value={field.ratingLabels?.max || ""}
//                     onChange={(e) =>
//                       updateField(field.id, "ratingLabels", {
//                         ...field.ratingLabels,
//                         max: e.target.value,
//                       })
//                     }
//                     className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
//                     placeholder="e.g., Excellent"
//                   />
//                 </div>
//               </div>

//               {/* Preview of rating */}
//               <div className="pt-2 border-t">
//                 <p className="text-xs text-gray-500 mb-2">Preview:</p>
//                 {field.ratingStyle === "star" &&
//                   renderStars(3, field.ratingMax || 5)}
//                 {field.ratingStyle === "emoji" &&
//                   renderEmojis(2, field.ratingMax || 5)}
//                 {field.ratingStyle === "number" && (
//                   <div className="flex gap-2">
//                     {Array.from(
//                       {
//                         length:
//                           (field.ratingMax || 5) - (field.ratingMin || 1) + 1,
//                       },
//                       (_, i) => (field.ratingMin || 1) + i,
//                     ).map((num) => (
//                       <button
//                         key={num}
//                         type="button"
//                         className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100"
//                         disabled
//                       >
//                         {num}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {field.type === "date" && (
//             <input
//               type="date"
//               disabled
//               className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
//             />
//           )}

//           {field.type === "time" && (
//             <input
//               type="time"
//               disabled
//               className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
//             />
//           )}

//           {field.type === "file_upload" && (
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
//               <svg
//                 className="mx-auto h-12 w-12 text-gray-400"
//                 stroke="currentColor"
//                 fill="none"
//                 viewBox="0 0 48 48"
//               >
//                 <path
//                   d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//               <p className="mt-2 text-sm text-gray-600">
//                 Click to upload or drag and drop
//               </p>
//             </div>
//           )}

//           {(field.type === "checkbox_grid" ||
//             field.type === "multiple_choice_grid") && (
//             <div className="space-y-4">
//               {/* Rows */}
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm font-medium text-gray-700">
//                     Rows
//                   </span>
//                   <button
//                     type="button"
//                     onClick={() => addRow(field.id)}
//                     className="text-sm text-blue-600 hover:text-blue-700"
//                   >
//                     + Add row
//                   </button>
//                 </div>
//                 <div className="space-y-1">
//                   {field.rows?.map((row, index) => (
//                     <div key={index} className="flex items-center gap-2">
//                       <input
//                         type="text"
//                         value={row}
//                         onChange={(e) =>
//                           updateRow(field.id, index, e.target.value)
//                         }
//                         className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => deleteRow(field.id, index)}
//                         className="text-gray-400 hover:text-red-500"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-4 w-4"
//                           viewBox="0 0 20 20"
//                           fill="currentColor"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Columns */}
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm font-medium text-gray-700">
//                     Columns
//                   </span>
//                   <button
//                     type="button"
//                     onClick={() => addColumn(field.id)}
//                     className="text-sm text-blue-600 hover:text-blue-700"
//                   >
//                     + Add column
//                   </button>
//                 </div>
//                 <div className="space-y-1">
//                   {field.columns?.map((column, index) => (
//                     <div key={index} className="flex items-center gap-2">
//                       <input
//                         type="text"
//                         value={column}
//                         onChange={(e) =>
//                           updateColumn(field.id, index, e.target.value)
//                         }
//                         className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => deleteColumn(field.id, index)}
//                         className="text-gray-400 hover:text-red-500"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-4 w-4"
//                           viewBox="0 0 20 20"
//                           fill="currentColor"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Render a field in preview mode
//   const renderPreviewField = (field: FormField) => {
//     return (
//       <div
//         key={field.id}
//         className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
//       >
//         <div className="mb-4">
//           <label className="text-lg font-medium text-gray-900">
//             {field.label}
//             {field.required && <span className="text-red-500 ml-1">*</span>}
//           </label>
//           {field.description && (
//             <p className="text-sm text-gray-500 mt-1">{field.description}</p>
//           )}
//         </div>

//         <div>
//           {field.type === "text" && (
//             <input
//               type="text"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Your answer"
//             />
//           )}

//           {field.type === "textarea" && (
//             <textarea
//               rows={4}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Your answer"
//             />
//           )}

//           {field.type === "number" && (
//             <input
//               type="number"
//               min={field.min}
//               max={field.max}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Your answer"
//             />
//           )}

//           {field.type === "radio" && (
//             <div className="space-y-2">
//               {field.options?.map((option, index) => (
//                 <label
//                   key={index}
//                   className="flex items-center gap-2 cursor-pointer"
//                 >
//                   <input
//                     type="radio"
//                     name={`radio-${field.id}`}
//                     className="text-blue-600"
//                   />
//                   <span>{option}</span>
//                 </label>
//               ))}
//             </div>
//           )}

//           {field.type === "checkbox" && (
//             <div className="space-y-2">
//               {field.options?.map((option, index) => (
//                 <label
//                   key={index}
//                   className="flex items-center gap-2 cursor-pointer"
//                 >
//                   <input type="checkbox" className="text-blue-600" />
//                   <span>{option}</span>
//                 </label>
//               ))}
//             </div>
//           )}

//           {field.type === "select" && (
//             <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
//               <option value="">Choose an option</option>
//               {field.options?.map((option, index) => (
//                 <option key={index} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           )}

//           {field.type === "rating" && (
//             <div>
//               {field.ratingStyle === "star" &&
//                 renderStars(0, field.ratingMax || 5, true)}
//               {field.ratingStyle === "emoji" &&
//                 renderEmojis(0, field.ratingMax || 5, true)}
//               {field.ratingStyle === "number" && (
//                 <div className="flex gap-2">
//                   {Array.from(
//                     {
//                       length:
//                         (field.ratingMax || 5) - (field.ratingMin || 1) + 1,
//                     },
//                     (_, i) => (field.ratingMin || 1) + i,
//                   ).map((num) => (
//                     <button
//                       key={num}
//                       type="button"
//                       className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100"
//                     >
//                       {num}
//                     </button>
//                   ))}
//                 </div>
//               )}
//               {(field.ratingLabels?.min || field.ratingLabels?.max) && (
//                 <div className="flex justify-between mt-2 text-xs text-gray-500">
//                   <span>{field.ratingLabels?.min}</span>
//                   <span>{field.ratingLabels?.max}</span>
//                 </div>
//               )}
//             </div>
//           )}

//           {field.type === "date" && (
//             <input
//               type="date"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           )}

//           {field.type === "time" && (
//             <input
//               type="time"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           )}

//           {field.type === "file_upload" && (
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
//               <svg
//                 className="mx-auto h-12 w-12 text-gray-400"
//                 stroke="currentColor"
//                 fill="none"
//                 viewBox="0 0 48 48"
//               >
//                 <path
//                   d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//               <p className="mt-2 text-sm text-gray-600">
//                 Click to upload or drag and drop
//               </p>
//               <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//             </div>
//           )}

//           {(field.type === "checkbox_grid" ||
//             field.type === "multiple_choice_grid") && (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr>
//                     <th className="text-left p-2"></th>
//                     {field.columns?.map((column, index) => (
//                       <th key={index} className="text-left p-2 font-medium">
//                         {column}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {field.rows?.map((row, rowIndex) => (
//                     <tr key={rowIndex}>
//                       <td className="p-2 font-medium">{row}</td>
//                       {field.columns?.map((_, colIndex) => (
//                         <td key={colIndex} className="p-2 text-center">
//                           {field.type === "checkbox_grid" ? (
//                             <input type="checkbox" className="text-blue-600" />
//                           ) : (
//                             <input
//                               type="radio"
//                               name={`grid-${field.id}-${rowIndex}`}
//                               className="text-blue-600"
//                             />
//                           )}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-3xl mx-auto">
//         {/* Class, Subject, and Duration Fields */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
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
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//               <p className="text-xs text-gray-500 mt-1">Time limit for completing the form</p>
//             </div>
//           </div>
//         </div>

//         {/* Header with title and description */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Form Title <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full text-3xl font-normal border-0 border-b-2 border-transparent focus:border-blue-500 focus:ring-0 outline-none px-0 py-1 mb-2"
//             placeholder="Form title"
//             required
//           />
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Form Description
//           </label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full text-base border-0 border-b-2 border-transparent focus:border-blue-500 focus:ring-0 outline-none px-0 py-1 resize-none"
//             placeholder="Form description"
//             rows={2}
//           />
//         </div>

//         {/* Error message display */}
//         {error && (
//           <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-600 text-sm">{error}</p>
//           </div>
//         )}

//         {/* Toggle between edit and preview mode */}
//         <div className="flex justify-end mb-4">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
//             <button
//               type="button"
//               onClick={() => setIsPreviewMode(false)}
//               className={`px-4 py-2 rounded-md text-sm font-medium ${
//                 !isPreviewMode ? "bg-blue-100 text-blue-700" : "text-gray-700"
//               }`}
//             >
//               Edit
//             </button>
//             <button
//               type="button"
//               onClick={() => setIsPreviewMode(true)}
//               className={`px-4 py-2 rounded-md text-sm font-medium ${
//                 isPreviewMode ? "bg-blue-100 text-blue-700" : "text-gray-700"
//               }`}
//             >
//               Preview
//             </button>
//           </div>
//         </div>

//         {/* Form fields */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {isPreviewMode ? (
//             // Preview mode
//             <>
//               {fields.length === 0 ? (
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
//                   No questions added yet. Switch to edit mode to add questions.
//                 </div>
//               ) : (
//                 fields.map((field) => renderPreviewField(field))
//               )}
//             </>
//           ) : (
//             // Edit mode
//             <>
//               {fields.map((field) => renderField(field))}

//               {/* Add field button with menu */}
//               <div className="flex justify-center relative">
//                 {showFieldTypes && renderFieldTypeMenu()}
//                 <button
//                   type="button"
//                   onClick={() => setShowFieldTypes(!showFieldTypes)}
//                   className="bg-white border border-gray-300 rounded-full px-6 py-3 shadow-sm hover:shadow-md text-gray-700 font-medium flex items-center gap-2 transition-shadow"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   Add question
//                 </button>
//               </div>
//             </>
//           )}

//           {/* Save button */}
//           <div className="flex justify-end mt-6">
//             <button
//               type="submit"
//               disabled={loading}
//               className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md shadow-sm font-medium transition-colors ${
//                 loading ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               {loading ? "Saving..." : "Save Form"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
  correctAnswer?: any; // Store admin's correct answer
  marks?: number; // Marks for this question
}

export default function NewForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState<string>("Untitled form");
  const [description, setDescription] = useState<string>("Form description");
  const [className, setClassName] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [duration, setDuration] = useState<string>("60");
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [showFieldTypes, setShowFieldTypes] = useState<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  const generateId = () =>
    `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Add a new empty field (default type = text)
  const addField = (type: FieldType = "text") => {
    const newField: FormField = {
      id: generateId(),
      label: "",
      type,
      required: false,
      correctAnswer: "", // Initialize empty answer
      marks: 1, // Default marks = 1
    };

    if (type === "radio" || type === "select" || type === "checkbox") {
      newField.options = ["Option 1", "Option 2"];
      newField.correctAnswer = type === "checkbox" ? [] : ""; // Checkbox uses array for multiple answers
    } else if (type === "checkbox_grid" || type === "multiple_choice_grid") {
      newField.rows = ["Row 1", "Row 2"];
      newField.columns = ["Column 1", "Column 2"];
      newField.correctAnswer = {}; // Grid uses object for answers
    } else if (type === "rating") {
      // Initialize rating field with defaults
      newField.ratingMin = 1;
      newField.ratingMax = 5;
      newField.ratingLabels = {
        min: "Poor",
        max: "Excellent",
      };
      newField.ratingStyle = "star";
      newField.correctAnswer = ""; // Rating answer is a number
    }

    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
    setShowFieldTypes(false);
  };

  // Delete a field by ID
  const deleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  // Update any property of a field
  const updateField = <K extends keyof FormField>(
    id: string,
    key: K,
    value: FormField[K],
  ) => {
    const updated = fields.map((field) => {
      if (field.id === id) {
        const updatedField = { ...field, [key]: value };

        // If type changes to a grid type, ensure rows/columns exist
        if (
          key === "type" &&
          (value === "checkbox_grid" || value === "multiple_choice_grid")
        ) {
          if (!updatedField.rows || updatedField.rows.length === 0) {
            updatedField.rows = ["Row 1"];
          }
          if (!updatedField.columns || updatedField.columns.length === 0) {
            updatedField.columns = ["Column 1"];
          }
          if (!updatedField.correctAnswer) {
            updatedField.correctAnswer = {};
          }
        }

        // If type changes to a radio/select/checkbox, ensure options exist
        if (
          key === "type" &&
          (value === "radio" || value === "select" || value === "checkbox")
        ) {
          if (!updatedField.options || updatedField.options.length === 0) {
            updatedField.options = ["Option 1", "Option 2"];
          }
          if (!updatedField.correctAnswer) {
            updatedField.correctAnswer = value === "checkbox" ? [] : "";
          }
        }

        // If type changes to rating, set defaults
        if (key === "type" && value === "rating") {
          updatedField.ratingMin = 1;
          updatedField.ratingMax = 5;
          updatedField.ratingLabels = {
            min: "Poor",
            max: "Excellent",
          };
          updatedField.ratingStyle = "star";
          if (!updatedField.correctAnswer) {
            updatedField.correctAnswer = "";
          }
        }

        return updatedField;
      }
      return field;
    });

    setFields(updated);
  };

  // Update correct answer for a field
  const updateCorrectAnswer = (id: string, value: any) => {
    const updated = fields.map((field) => {
      if (field.id === id) {
        return { ...field, correctAnswer: value };
      }
      return field;
    });
    setFields(updated);
  };

  // Update marks for a field
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

  // Add a new option to a non-grid field
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

  // Update a specific option
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

  // Delete an option
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

  // Grid: add a new row
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

  // Grid: update a row label
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

  // Grid: delete a row
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

  // Grid: add a new column
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

  // Grid: update a column label
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

  // Grid: delete a column
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
      const { id, ...backendField } = field;
      
      // Remove frontend-only fields
      const transformed: any = {
        label: backendField.label,
        type: backendField.type,
        options: backendField.options,
        required: backendField.required,
        correctAnswer: backendField.correctAnswer,
        marks: backendField.marks || 1,
      };

      // Add type-specific fields
      if (field.type === "rating") {
        transformed.ratingStyle = field.ratingStyle;
        transformed.ratingMin = field.ratingMin;
        transformed.ratingMax = field.ratingMax;
        transformed.ratingLabels = field.ratingLabels;
      }

      if (field.type === "number") {
        if (field.min !== undefined) transformed.min = field.min;
        if (field.max !== undefined) transformed.max = field.max;
      }

      if (field.type === "checkbox_grid" || field.type === "multiple_choice_grid") {
        transformed.rows = field.rows;
        transformed.columns = field.columns;
      }

      if (field.description) transformed.description = field.description;

      return transformed;
    });
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate title, class, subject, and duration
    if (!title.trim()) {
      setError("Title is required");
      toast.error("Title is required");
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

    // Validate fields
    const invalidFields = fields.filter((field) => !field.label.trim());
    if (invalidFields.length > 0) {
      setError("All questions must have a label");
      toast.error("All questions must have a label");
      return;
    }

    // Validate marks
    const invalidMarks = fields.filter((field) => (field.marks || 0) <= 0);
    if (invalidMarks.length > 0) {
      setError("All questions must have positive marks");
      toast.error("All questions must have positive marks");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to create a form");
        toast.error("You must be logged in to create a form");
        setLoading(false);
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
        isPublished: true,
      };

      const response = await axios.post("/forms", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success("Form created successfully");
      router.push("/admin/forms");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create form";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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

  // Render field type selection menu
  const renderFieldTypeMenu = () => (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 absolute bottom-full mb-2 left-0 z-10 w-64">
      <div className="grid grid-cols-2 gap-1">
        {fieldTypeOptions.map((option) => (
          <button
            key={option.type}
            type="button"
            onClick={() => addField(option.type)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left"
          >
            <span className="text-xl">{option.icon}</span>
            <span className="text-sm">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Render rating stars
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

  // Render emoji ratings
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

  // Render answer input based on field type
  const renderAnswerAndMarks = (field: FormField) => {
    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 mb-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
              placeholder="Enter the correct answer"
            />
          )}

          {field.type === "textarea" && (
            <textarea
              value={field.correctAnswer as string || ""}
              onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
              placeholder="Enter the correct answer"
            />
          )}

          {field.type === "number" && (
            <input
              type="number"
              value={field.correctAnswer as string || ""}
              onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
              placeholder="Enter the correct number"
            />
          )}

          {field.type === "radio" && (
            <div className="space-y-2 bg-green-50 p-3 rounded-md">
              {field.options?.map((option, index) => (
                <label key={index} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`answer-${field.id}`}
                    value={option}
                    checked={field.correctAnswer === option}
                    onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
                    className="text-green-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
              <p className="text-xs text-gray-500 mt-1">Select the correct answer</p>
            </div>
          )}

          {field.type === "checkbox" && (
            <div className="space-y-2 bg-green-50 p-3 rounded-md">
              {field.options?.map((option, index) => {
                const answers = field.correctAnswer as string[] || [];
                return (
                  <label key={index} className="flex items-center gap-2 cursor-pointer">
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
                      className="text-green-600"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
              <p className="text-xs text-gray-500 mt-1">Select all correct answers</p>
            </div>
          )}

          {field.type === "select" && (
            <select
              value={field.correctAnswer as string || ""}
              onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
            >
              <option value="">Select the correct answer</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          {field.type === "rating" && (
            <div className="bg-green-50 p-3 rounded-md">
              <div className="flex gap-2">
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
                    className={`w-10 h-10 border rounded hover:bg-green-100 ${
                      field.correctAnswer === num ? 'bg-green-500 text-white border-green-600' : 'border-gray-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Select the correct rating value</p>
            </div>
          )}

          {field.type === "date" && (
            <input
              type="date"
              value={field.correctAnswer as string || ""}
              onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
            />
          )}

          {field.type === "time" && (
            <input
              type="time"
              value={field.correctAnswer as string || ""}
              onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
            />
          )}

          {(field.type === "checkbox_grid" || field.type === "multiple_choice_grid") && (
            <div className="space-y-4 bg-green-50 p-3 rounded-md">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2"></th>
                      {field.columns?.map((column, colIndex) => (
                        <th key={colIndex} className="text-left p-2 font-medium">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {field.rows?.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="p-2 font-medium">{row}</td>
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
                                  className="text-green-600"
                                />
                              ) : (
                                <select
                                  value={answers[key] || ""}
                                  onChange={(e) => {
                                    const newAnswers = { ...answers };
                                    newAnswers[key] = e.target.value;
                                    updateCorrectAnswer(field.id, newAnswers);
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white"
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
              <p className="text-xs text-gray-500">Select the correct answers for each grid cell</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render a field in edit mode
  const renderField = (field: FormField) => {
    const isSelected = selectedFieldId === field.id;

    return (
      <div
        key={field.id}
        className={`bg-white rounded-lg shadow-sm border-2 ${
          isSelected ? "border-blue-500" : "border-gray-200"
        } p-6 transition-all`}
        onClick={() => setSelectedFieldId(field.id)}
      >
        {/* Field header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={field.label}
              onChange={(e) => updateField(field.id, "label", e.target.value)}
              className="w-full text-lg font-medium border-0 focus:ring-0 p-0 outline-none"
              placeholder="Question title"
              onClick={(e) => e.stopPropagation()}
            />
            {field.description && (
              <p className="text-sm text-gray-500 mt-1">{field.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                updateField(field.id, "required", !field.required);
              }}
              className={`text-sm px-3 py-1 rounded-full ${
                field.required
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
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
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              placeholder="Short answer text"
            />
          )}

          {field.type === "textarea" && (
            <textarea
              disabled
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              placeholder="Long answer text"
            />
          )}

          {field.type === "number" && (
            <div className="space-y-2">
              <input
                type="number"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                placeholder="Number"
              />
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-600">Min value</label>
                  <input
                    type="number"
                    value={field.min || ""}
                    onChange={(e) =>
                      updateField(field.id, "min", Number(e.target.value))
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="No minimum"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-600">Max value</label>
                  <input
                    type="number"
                    value={field.max || ""}
                    onChange={(e) =>
                      updateField(field.id, "max", Number(e.target.value))
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
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
                <div key={index} className="flex items-center gap-2">
                  {field.type === "radio" && (
                    <input type="radio" disabled className="text-blue-600" />
                  )}
                  {field.type === "checkbox" && (
                    <input type="checkbox" disabled className="text-blue-600" />
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
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => deleteOption(field.id, index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(field.id)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add option
              </button>
            </div>
          )}

          {field.type === "rating" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Style:</span>
                <select
                  value={field.ratingStyle}
                  onChange={(e) =>
                    updateField(
                      field.id,
                      "ratingStyle",
                      e.target.value as "star" | "number" | "emoji",
                    )
                  }
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="star">Stars</option>
                  <option value="number">Numbers</option>
                  <option value="emoji">Emojis</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Range:</span>
                <input
                  type="number"
                  value={field.ratingMin || 1}
                  onChange={(e) =>
                    updateField(field.id, "ratingMin", Number(e.target.value))
                  }
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="1"
                />
                <span>to</span>
                <input
                  type="number"
                  value={field.ratingMax || 5}
                  onChange={(e) =>
                    updateField(field.id, "ratingMax", Number(e.target.value))
                  }
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-16">Min label:</span>
                  <input
                    type="text"
                    value={field.ratingLabels?.min || ""}
                    onChange={(e) =>
                      updateField(field.id, "ratingLabels", {
                        ...field.ratingLabels,
                        min: e.target.value,
                      })
                    }
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="e.g., Poor"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-16">Max label:</span>
                  <input
                    type="text"
                    value={field.ratingLabels?.max || ""}
                    onChange={(e) =>
                      updateField(field.id, "ratingLabels", {
                        ...field.ratingLabels,
                        max: e.target.value,
                      })
                    }
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="e.g., Excellent"
                  />
                </div>
              </div>

              {/* Preview of rating */}
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
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
                        className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          )}

          {field.type === "time" && (
            <input
              type="time"
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          )}

          {field.type === "file_upload" && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
            </div>
          )}

          {(field.type === "checkbox_grid" ||
            field.type === "multiple_choice_grid") && (
            <div className="space-y-4">
              {/* Rows */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Rows
                  </span>
                  <button
                    type="button"
                    onClick={() => addRow(field.id)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Add row
                  </button>
                </div>
                <div className="space-y-1">
                  {field.rows?.map((row, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={row}
                        onChange={(e) =>
                          updateRow(field.id, index, e.target.value)
                        }
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => deleteRow(field.id, index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
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
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Add column
                  </button>
                </div>
                <div className="space-y-1">
                  {field.columns?.map((column, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={column}
                        onChange={(e) =>
                          updateColumn(field.id, index, e.target.value)
                        }
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => deleteColumn(field.id, index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
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

        {/* Answer and Marks section */}
        {renderAnswerAndMarks(field)}
      </div>
    );
  };

  // Render a field in preview mode
  const renderPreviewField = (field: FormField) => {
    return (
      <div
        key={field.id}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <label className="text-lg font-medium text-gray-900">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.description && (
              <p className="text-sm text-gray-500 mt-1">{field.description}</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your answer"
            />
          )}

          {field.type === "textarea" && (
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your answer"
            />
          )}

          {field.type === "number" && (
            <input
              type="number"
              min={field.min}
              max={field.max}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your answer"
            />
          )}

          {field.type === "radio" && (
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`radio-${field.id}`}
                    className="text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {field.type === "checkbox" && (
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input type="checkbox" className="text-blue-600" />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {field.type === "select" && (
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Choose an option</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
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
                      className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
              {(field.ratingLabels?.min || field.ratingLabels?.max) && (
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>{field.ratingLabels?.min}</span>
                  <span>{field.ratingLabels?.max}</span>
                </div>
              )}
            </div>
          )}

          {field.type === "date" && (
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {field.type === "time" && (
            <input
              type="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {field.type === "file_upload" && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}

          {(field.type === "checkbox_grid" ||
            field.type === "multiple_choice_grid") && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2"></th>
                    {field.columns?.map((column, index) => (
                      <th key={index} className="text-left p-2 font-medium">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {field.rows?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="p-2 font-medium">{row}</td>
                      {field.columns?.map((_, colIndex) => (
                        <td key={colIndex} className="p-2 text-center">
                          {field.type === "checkbox_grid" ? (
                            <input type="checkbox" className="text-blue-600" />
                          ) : (
                            <input
                              type="radio"
                              name={`grid-${field.id}-${rowIndex}`}
                              className="text-blue-600"
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
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Class, Subject, and Duration Fields */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Time limit for completing the form</p>
            </div>
          </div>
        </div>

        {/* Header with title and description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-normal border-0 border-b-2 border-transparent focus:border-blue-500 focus:ring-0 outline-none px-0 py-1 mb-2"
            placeholder="Form title"
            required
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-base border-0 border-b-2 border-transparent focus:border-blue-500 focus:ring-0 outline-none px-0 py-1 resize-none"
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
        </div>

        {/* Error message display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Toggle between edit and preview mode */}
        <div className="flex justify-end mb-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
            <button
              type="button"
              onClick={() => setIsPreviewMode(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                !isPreviewMode ? "bg-blue-100 text-blue-700" : "text-gray-700"
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setIsPreviewMode(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isPreviewMode ? "bg-blue-100 text-blue-700" : "text-gray-700"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {isPreviewMode ? (
            // Preview mode
            <>
              {fields.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                  No questions added yet. Switch to edit mode to add questions.
                </div>
              ) : (
                fields.map((field) => renderPreviewField(field))
              )}
            </>
          ) : (
            // Edit mode
            <>
              {fields.map((field) => renderField(field))}

              {/* Add field button with menu */}
              <div className="flex justify-center relative">
                {showFieldTypes && renderFieldTypeMenu()}
                <button
                  type="button"
                  onClick={() => setShowFieldTypes(!showFieldTypes)}
                  className="bg-white border border-gray-300 rounded-full px-6 py-3 shadow-sm hover:shadow-md text-gray-700 font-medium flex items-center gap-2 transition-shadow"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add question
                </button>
              </div>
            </>
          )}

          {/* Save button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md shadow-sm font-medium transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save Form"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}