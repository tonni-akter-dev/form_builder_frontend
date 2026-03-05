// // /* eslint-disable react-hooks/purity */
// // "use client";

// // import { useState } from "react";
// // import axios from "@/lib/axios";
// // import { useRouter } from "next/navigation";

// // // Supported field types
// // type FieldType =
// //   | "text"
// //   | "textarea"
// //   | "number"
// //   | "radio"
// //   | "select"
// //   | "checkbox"
// //   | "checkbox_grid"
// //   | "multiple_choice_grid"
// //   | "date"
// //   | "time"
// //   | "file_upload";

// // interface FormField {
// //   id: string;
// //   label: string;
// //   type: FieldType;
// //   options?: string[]; // for radio/select/checkbox
// //   rows?: string[]; // for grid types
// //   columns?: string[]; // for grid types
// //   required: boolean;
// //   description?: string; // field description
// //   min?: number; // for number fields
// //   max?: number; // for number fields
// // }

// // export default function NewForm() {
// //   const router = useRouter();

// //   const [title, setTitle] = useState<string>("Untitled form");
// //   const [description, setDescription] = useState<string>("Form description");
// //   const [fields, setFields] = useState<FormField[]>([]);
// //   const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
// //   const [showFieldTypes, setShowFieldTypes] = useState<boolean>(false);
// //   const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

// //   // Generate a unique ID for new fields
// //   const generateId = () =>
// //     `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// //   // Add a new empty field (default type = text)
// //   const addField = (type: FieldType = "text") => {
// //     const newField: FormField = {
// //       id: generateId(),
// //       label: "",
// //       type,
// //       required: false,
// //     };

// //     // Initialize field based on type
// //     if (type === "radio" || type === "select" || type === "checkbox") {
// //       newField.options = ["Option 1", "Option 2"];
// //     } else if (type === "checkbox_grid" || type === "multiple_choice_grid") {
// //       newField.rows = ["Row 1", "Row 2"];
// //       newField.columns = ["Column 1", "Column 2"];
// //     }
// //     // else if (type === 'linear_scale') {
// //     //   newField.scaleMin = 1;
// //     //   newField.scaleMax = 5;
// //     //   newField.scaleLabels = { min: '', max: '' };
// //     // }

// //     setFields([...fields, newField]);
// //     setSelectedFieldId(newField.id);
// //     setShowFieldTypes(false);
// //   };

// //   // Delete a field by ID
// //   const deleteField = (id: string) => {
// //     setFields(fields.filter((field) => field.id !== id));
// //     if (selectedFieldId === id) {
// //       setSelectedFieldId(null);
// //     }
// //   };

// //   // Update any property of a field
// //   const updateField = <K extends keyof FormField>(
// //     id: string,
// //     key: K,
// //     value: FormField[K],
// //   ) => {
// //     const updated = fields.map((field) => {
// //       if (field.id === id) {
// //         const updatedField = { ...field, [key]: value };

// //         // If type changes to a grid type, ensure rows/columns exist
// //         if (
// //           key === "type" &&
// //           (value === "checkbox_grid" || value === "multiple_choice_grid")
// //         ) {
// //           if (!updatedField.rows || updatedField.rows.length === 0) {
// //             updatedField.rows = ["Row 1"];
// //           }
// //           if (!updatedField.columns || updatedField.columns.length === 0) {
// //             updatedField.columns = ["Column 1"];
// //           }
// //         }

// //         // If type changes to a radio/select/checkbox, ensure options exist
// //         if (
// //           key === "type" &&
// //           (value === "radio" || value === "select" || value === "checkbox")
// //         ) {
// //           if (!updatedField.options || updatedField.options.length === 0) {
// //             updatedField.options = ["Option 1", "Option 2"];
// //           }
// //         }

// //         // If type changes to linear scale, set defaults
// //         // if (key === 'type' && value === 'linear_scale') {
// //         //   updatedField.scaleMin = 1;
// //         //   updatedField.scaleMax = 5;
// //         //   updatedField.scaleLabels = { min: '', max: '' };
// //         // }

// //         return updatedField;
// //       }
// //       return field;
// //     });

// //     setFields(updated);
// //   };

// //   // Add a new option to a non-grid field
// //   const addOption = (id: string) => {
// //     const updated = fields.map((field) => {
// //       if (field.id === id) {
// //         const options = field.options || [];
// //         return { ...field, options: [...options, ""] };
// //       }
// //       return field;
// //     });
// //     setFields(updated);
// //   };

// //   // Update a specific option
// //   const updateOption = (fieldId: string, optIndex: number, value: string) => {
// //     const updated = fields.map((field) => {
// //       if (field.id === fieldId && field.options) {
// //         const newOptions = [...field.options];
// //         newOptions[optIndex] = value;
// //         return { ...field, options: newOptions };
// //       }
// //       return field;
// //     });
// //     setFields(updated);
// //   };

// //   // Delete an option
// //   const deleteOption = (fieldId: string, optIndex: number) => {
// //     const updated = fields.map((field) => {
// //       if (field.id === fieldId && field.options) {
// //         return {
// //           ...field,
// //           options: field.options.filter((_, i) => i !== optIndex),
// //         };
// //       }
// //       return field;
// //     });
// //     setFields(updated);
// //   };

// //   // Grid: add a new row
// //   const addRow = (id: string) => {
// //     const updated = fields.map((field) => {
// //       if (field.id === id) {
// //         const rows = field.rows || [];
// //         return { ...field, rows: [...rows, `Row ${rows.length + 1}`] };
// //       }
// //       return field;
// //     });
// //     setFields(updated);
// //   };

// //   // Grid: update a row label
// //   const updateRow = (fieldId: string, rowIndex: number, value: string) => {
// //     const updated = fields.map((field) => {
// //       if (field.id === fieldId && field.rows) {
// //         const newRows = [...field.rows];
// //         newRows[rowIndex] = value;
// //         return { ...field, rows: newRows };
// //       }
// //       return field;
// //     });
// //     setFields(updated);
// //   };

// //   // Grid: delete a row
// //   const deleteRow = (fieldId: string, rowIndex: number) => {
// //     const updated = fields.map((field) => {
// //       if (field.id === fieldId && field.rows) {
// //         return {
// //           ...field,
// //           rows: field.rows.filter((_, i) => i !== rowIndex),
// //         };
// //       }
// //       return field;
// //     });
// //     setFields(updated);
// //   };

// //   // Grid: add a new column
// //   const addColumn = (id: string) => {
// //     const updated = fields.map((field) => {
// //       if (field.id === id) {
// //         const columns = field.columns || [];
// //         return {
// //           ...field,
// //           columns: [...columns, `Column ${columns.length + 1}`],
// //         };
// //       }
// //       return field;
// //     });
// //     setFields(updated);
// //   };

// //   // Grid: update a column label
// //   const updateColumn = (fieldId: string, colIndex: number, value: string) => {
// //     const updated = fields.map((field) => {
// //       if (field.id === fieldId && field.columns) {
// //         const newColumns = [...field.columns];
// //         newColumns[colIndex] = value;
// //         return { ...field, columns: newColumns };
// //       }
// //       return field;
// //     });
// //     setFields(updated);
// //   };

// //   // Grid: delete a column
// //   const deleteColumn = (fieldId: string, colIndex: number) => {
// //     const updated = fields.map((field) => {
// //       if (field.id === fieldId && field.columns) {
// //         return {
// //           ...field,
// //           columns: field.columns.filter((_, i) => i !== colIndex),
// //         };
// //       }
// //       return field;
// //     });
// //     setFields(updated);
// //   };

// //   // Submit the form
// //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
// //     try {
// //       await axios.post("/forms", { title, description, fields });
// //       router.push("/admin/forms");
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   // Field type options
// //   const fieldTypeOptions = [
// //     { type: "text" as FieldType, label: "Short answer", icon: "T" },
// //     { type: "textarea" as FieldType, label: "Paragraph", icon: "¶" },
// //     { type: "number" as FieldType, label: "Number", icon: "#" },
// //     { type: "radio" as FieldType, label: "Multiple choice", icon: "○" },
// //     { type: "checkbox" as FieldType, label: "Checkboxes", icon: "☑" },
// //     { type: "dropdown" as FieldType, label: "Dropdown", icon: "▼" },
// //     { type: "file_upload" as FieldType, label: "File upload", icon: "📎" },
// //     { type: "date" as FieldType, label: "Date", icon: "📅" },
// //     { type: "time" as FieldType, label: "Time", icon: "🕐" },
// //     { type: "checkbox_grid" as FieldType, label: "Checkbox grid", icon: "⊞" },
// //     {
// //       type: "multiple_choice_grid" as FieldType,
// //       label: "Multiple choice grid",
// //       icon: "⊟",
// //     },
// //   ];

// //   // Render field type selection menu
// //   const renderFieldTypeMenu = () => (
// //     <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 absolute bottom-full mb-2 left-0 z-10 w-64">
// //       <div className="grid grid-cols-2 gap-1">
// //         {fieldTypeOptions.map((option) => (
// //           <button
// //             key={option.type}
// //             type="button"
// //             onClick={() => addField(option.type)}
// //             className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left"
// //           >
// //             <span className="text-xl">{option.icon}</span>
// //             <span className="text-sm">{option.label}</span>
// //           </button>
// //         ))}
// //       </div>
// //     </div>
// //   );

// //   // Render a field in edit mode
// //   const renderField = (field: FormField) => (
// //     <div
// //       key={field.id}
// //       className={`bg-white rounded-lg shadow-sm border ${selectedFieldId === field.id ? "border-blue-500" : "border-gray-200"} p-6 relative hover:shadow-md transition-shadow`}
// //       onClick={() => setSelectedFieldId(field.id)}
// //     >
// //       {/* Field actions (top right) */}
// //       <div className="absolute top-4 right-4 flex gap-2">
// //         <button
// //           type="button"
// //           onClick={(e) => {
// //             e.stopPropagation();
// //             // Duplicate field functionality would go here
// //           }}
// //           className="text-gray-400 hover:text-gray-600"
// //           aria-label="Duplicate field"
// //         >
// //           <svg
// //             xmlns="http://www.w3.org/2000/svg"
// //             className="h-5 w-5"
// //             viewBox="0 0 20 20"
// //             fill="currentColor"
// //           >
// //             <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
// //           </svg>
// //         </button>
// //         <button
// //           type="button"
// //           onClick={(e) => {
// //             e.stopPropagation();
// //             deleteField(field.id);
// //           }}
// //           className="text-gray-400 hover:text-gray-600"
// //           aria-label="Delete field"
// //         >
// //           <svg
// //             xmlns="http://www.w3.org/2000/svg"
// //             className="h-5 w-5"
// //             viewBox="0 0 20 20"
// //             fill="currentColor"
// //           >
// //             <path
// //               fillRule="evenodd"
// //               d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
// //               clipRule="evenodd"
// //             />
// //           </svg>
// //         </button>
// //       </div>

// //       {/* Field label input */}
// //       <input
// //         type="text"
// //         placeholder="Question"
// //         value={field.label}
// //         onChange={(e) => updateField(field.id, "label", e.target.value)}
// //         className="w-full text-lg font-medium border-0 border-b-2 border-transparent focus:border-blue-500 focus:ring-0 outline-none px-0 py-1 pr-12"
// //         required
// //       />

// //       {/* Field description input */}
// //       <input
// //         type="text"
// //         placeholder="Description (optional)"
// //         value={field.description || ""}
// //         onChange={(e) => updateField(field.id, "description", e.target.value)}
// //         className="w-full text-sm text-gray-500 border-0 border-b-2 border-transparent focus:border-blue-500 focus:ring-0 outline-none px-0 py-1 mt-2"
// //       />

// //       {/* Field type selector */}
// //       <div className="mt-4">
// //         <select
// //           value={field.type}
// //           onChange={(e) =>
// //             updateField(field.id, "type", e.target.value as FieldType)
// //           }
// //           className="block w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// //         >
// //           {fieldTypeOptions.map((option) => (
// //             <option key={option.type} value={option.type}>
// //               {option.label}
// //             </option>
// //           ))}
// //         </select>
// //       </div>

// //       {/* Options for non-grid types */}
// //       {!["checkbox_grid", "multiple_choice_grid"].includes(field.type) &&
// //         (field.type === "radio" ||
// //           field.type === "select" ||
// //           field.type === "checkbox") && (
// //           <div className="mt-4 space-y-2">
// //             <label className="block text-sm font-medium text-gray-700">
// //               Options
// //             </label>
// //             {field.options?.map((opt, optIdx) => (
// //               <div key={optIdx} className="flex items-center gap-2">
// //                 {field.type === "radio" && (
// //                   <span className="text-gray-400">○</span>
// //                 )}
// //                 {field.type === "checkbox" && (
// //                   <span className="text-gray-400">☐</span>
// //                 )}
// //                 {field.type === "select" && (
// //                   <span className="text-gray-400">•</span>
// //                 )}
// //                 <input
// //                   type="text"
// //                   value={opt}
// //                   onChange={(e) =>
// //                     updateOption(field.id, optIdx, e.target.value)
// //                   }
// //                   className="flex-1 p-2 border border-gray-300 rounded-md"
// //                   placeholder={`Option ${optIdx + 1}`}
// //                 />
// //                 {field.options && field.options.length > 2 && (
// //                   <button
// //                     type="button"
// //                     onClick={() => deleteOption(field.id, optIdx)}
// //                     className="text-red-500 hover:text-red-700"
// //                   >
// //                     ✕
// //                   </button>
// //                 )}
// //               </div>
// //             ))}
// //             <button
// //               type="button"
// //               onClick={() => addOption(field.id)}
// //               className="text-blue-600 text-sm hover:underline mt-2"
// //             >
// //               + Add option
// //             </button>
// //           </div>
// //         )}

// //       {/* Number field options */}
// //       {field.type === "number" && (
// //         <div className="mt-4 grid grid-cols-2 gap-4">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               Min value
// //             </label>
// //             <input
// //               type="number"
// //               value={field.min || ""}
// //               onChange={(e) =>
// //                 updateField(
// //                   field.id,
// //                   "min",
// //                   e.target.value ? Number(e.target.value) : undefined,
// //                 )
// //               }
// //               className="w-full p-2 border border-gray-300 rounded-md"
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               Max value
// //             </label>
// //             <input
// //               type="number"
// //               value={field.max || ""}
// //               onChange={(e) =>
// //                 updateField(
// //                   field.id,
// //                   "max",
// //                   e.target.value ? Number(e.target.value) : undefined,
// //                 )
// //               }
// //               className="w-full p-2 border border-gray-300 rounded-md"
// //             />
// //           </div>
// //         </div>
// //       )}

// //       {/* Grid configuration for grid types */}
// //       {(field.type === "checkbox_grid" ||
// //         field.type === "multiple_choice_grid") && (
// //         <div className="mt-6 grid grid-cols-2 gap-6">
// //           {/* Rows */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Rows
// //             </label>
// //             <div className="space-y-2">
// //               {field.rows?.map((row, rowIdx) => (
// //                 <div key={rowIdx} className="flex items-center gap-2">
// //                   <span className="text-gray-500 text-sm">{rowIdx + 1}.</span>
// //                   <input
// //                     type="text"
// //                     value={row}
// //                     onChange={(e) =>
// //                       updateRow(field.id, rowIdx, e.target.value)
// //                     }
// //                     className="flex-1 p-2 border border-gray-300 rounded-md"
// //                   />
// //                   {field.rows && field.rows.length > 2 && (
// //                     <button
// //                       type="button"
// //                       onClick={() => deleteRow(field.id, rowIdx)}
// //                       className="text-red-500 hover:text-red-700"
// //                     >
// //                       ✕
// //                     </button>
// //                   )}
// //                 </div>
// //               ))}
// //               <button
// //                 type="button"
// //                 onClick={() => addRow(field.id)}
// //                 className="text-blue-600 text-sm hover:underline mt-2"
// //               >
// //                 + Add row
// //               </button>
// //             </div>
// //           </div>

// //           {/* Columns */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Columns
// //             </label>
// //             <div className="space-y-2">
// //               {field.columns?.map((col, colIdx) => (
// //                 <div key={colIdx} className="flex items-center gap-2">
// //                   <span className="text-gray-500 text-sm">{colIdx + 1}.</span>
// //                   <input
// //                     type="text"
// //                     value={col}
// //                     onChange={(e) =>
// //                       updateColumn(field.id, colIdx, e.target.value)
// //                     }
// //                     className="flex-1 p-2 border border-gray-300 rounded-md"
// //                   />
// //                   {field.columns && field.columns.length > 2 && (
// //                     <button
// //                       type="button"
// //                       onClick={() => deleteColumn(field.id, colIdx)}
// //                       className="text-red-500 hover:text-red-700"
// //                     >
// //                       ✕
// //                     </button>
// //                   )}
// //                 </div>
// //               ))}
// //               <button
// //                 type="button"
// //                 onClick={() => addColumn(field.id)}
// //                 className="text-blue-600 text-sm hover:underline mt-2"
// //               >
// //                 + Add column
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Required toggle */}
// //       <div className="mt-6 flex items-center">
// //         <label className="flex items-center gap-2 text-sm text-gray-700">
// //           <input
// //             type="checkbox"
// //             checked={field.required}
// //             onChange={(e) =>
// //               updateField(field.id, "required", e.target.checked)
// //             }
// //             className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
// //           />
// //           Required
// //         </label>
// //       </div>
// //     </div>
// //   );

// //   // Render a field in preview mode
// //   const renderPreviewField = (field: FormField) => (
// //     <div
// //       key={field.id}
// //       className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
// //     >
// //       <div className="flex items-start gap-2">
// //         {field.required && <span className="text-red-500">*</span>}
// //         <h3 className="text-base font-medium">{field.label}</h3>
// //       </div>
// //       {field.description && (
// //         <p className="text-sm text-gray-500 mt-1">{field.description}</p>
// //       )}

// //       {/* Render different field types in preview mode */}
// //       <div className="mt-3">
// //         {field.type === "text" && (
// //           <input
// //             type="text"
// //             className="w-full p-2 border border-gray-300 rounded-md"
// //             placeholder="Short answer"
// //           />
// //         )}

// //         {field.type === "textarea" && (
// //           <textarea
// //             className="w-full p-2 border border-gray-300 rounded-md resize-none"
// //             rows={4}
// //             placeholder="Long answer"
// //           />
// //         )}

// //         {field.type === "number" && (
// //           <input
// //             type="number"
// //             className="w-full p-2 border border-gray-300 rounded-md"
// //             placeholder="Number"
// //             min={field.min}
// //             max={field.max}
// //           />
// //         )}

// //         {field.type === "date" && (
// //           <input
// //             type="date"
// //             className="w-full p-2 border border-gray-300 rounded-md"
// //           />
// //         )}

// //         {field.type === "time" && (
// //           <input
// //             type="time"
// //             className="w-full p-2 border border-gray-300 rounded-md"
// //           />
// //         )}

// //         {field.type === "file_upload" && (
// //           <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
// //             <svg
// //               xmlns="http://www.w3.org/2000/svg"
// //               className="mx-auto h-12 w-12 text-gray-400"
// //               fill="none"
// //               viewBox="0 0 24 24"
// //               stroke="currentColor"
// //             >
// //               <path
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //                 strokeWidth={2}
// //                 d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
// //               />
// //             </svg>
// //             <p className="mt-2 text-sm text-gray-600">
// //               Click to upload or drag and drop
// //             </p>
// //           </div>
// //         )}

// //         {field.type === "radio" && (
// //           <div className="space-y-2">
// //             {field.options?.map((option, idx) => (
// //               <label key={idx} className="flex items-center gap-2">
// //                 <input type="radio" name={field.id} className="text-blue-600" />
// //                 <span>{option}</span>
// //               </label>
// //             ))}
// //           </div>
// //         )}

// //         {field.type === "checkbox" && (
// //           <div className="space-y-2">
// //             {field.options?.map((option, idx) => (
// //               <label key={idx} className="flex items-center gap-2">
// //                 <input type="checkbox" className="text-blue-600 rounded" />
// //                 <span>{option}</span>
// //               </label>
// //             ))}
// //           </div>
// //         )}

// //         {field.type === "select" && (
// //           <select className="w-full p-2 border border-gray-300 rounded-md">
// //             <option value="">Choose an option</option>
// //             {field.options?.map((option, idx) => (
// //               <option key={idx} value={option}>
// //                 {option}
// //               </option>
// //             ))}
// //           </select>
// //         )}

// //         {field.type === "checkbox_grid" && (
// //           <div className="overflow-x-auto">
// //             <table className="w-full">
// //               <thead>
// //                 <tr>
// //                   <th></th>
// //                   {field.columns?.map((col, idx) => (
// //                     <th key={idx} className="p-2 text-left text-sm font-medium">
// //                       {col}
// //                     </th>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {field.rows?.map((row, rowIdx) => (
// //                   <tr key={rowIdx}>
// //                     <td className="p-2 text-sm font-medium">{row}</td>
// //                     {field.columns?.map((_, colIdx) => (
// //                       <td key={colIdx} className="p-2 text-start">
// //                         <input
// //                           type="checkbox"
// //                           className="text-blue-600 rounded"
// //                         />
// //                       </td>
// //                     ))}
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}

// //         {field.type === "multiple_choice_grid" && (
// //           <div className="overflow-x-auto">
// //             <table className="w-full">
// //               <thead>
// //                 <tr>
// //                   <th></th>
// //                   {field.columns?.map((col, idx) => (
// //                     <th key={idx} className="p-2 text-left text-sm font-medium">
// //                       {col}
// //                     </th>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {field.rows?.map((row, rowIdx) => (
// //                   <tr key={rowIdx}>
// //                     <td className="p-2 text-sm font-medium">{row}</td>
// //                     {field.columns?.map((_, colIdx) => (
// //                       <td key={colIdx} className="p-2 text-start">
// //                         <input
// //                           type="radio"
// //                           name={`${field.id}_${rowIdx}`}
// //                           className="text-blue-600"
// //                         />
// //                       </td>
// //                     ))}
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-8">
// //       <div className="max-w-3xl mx-auto">
// //         {/* Header with title and description */}
// //         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
// //           <input
// //             type="text"
// //             value={title}
// //             onChange={(e) => setTitle(e.target.value)}
// //             className="w-full text-3xl font-normal border-0 border-b-2 border-transparent focus:border-blue-500 focus:ring-0 outline-none px-0 py-1 mb-2"
// //             placeholder="Form title"
// //             required
// //           />
// //           <textarea
// //             value={description}
// //             onChange={(e) => setDescription(e.target.value)}
// //             className="w-full text-base border-0 border-b-2 border-transparent focus:border-blue-500 focus:ring-0 outline-none px-0 py-1 resize-none"
// //             placeholder="Form description"
// //             rows={2}
// //           />
// //         </div>

// //         {/* Toggle between edit and preview mode */}
// //         <div className="flex justify-end mb-4">
// //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
// //             <button
// //               type="button"
// //               onClick={() => setIsPreviewMode(false)}
// //               className={`px-4 py-2 rounded-md text-sm font-medium ${!isPreviewMode ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
// //             >
// //               Edit
// //             </button>
// //             <button
// //               type="button"
// //               onClick={() => setIsPreviewMode(true)}
// //               className={`px-4 py-2 rounded-md text-sm font-medium ${isPreviewMode ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
// //             >
// //               Preview
// //             </button>
// //           </div>
// //         </div>

// //         {/* Form fields */}
// //         <form onSubmit={handleSubmit} className="space-y-6">
// //           {isPreviewMode ? (
// //             // Preview mode
// //             <>
// //               {fields.length === 0 ? (
// //                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
// //                   No questions added yet. Switch to edit mode to add questions.
// //                 </div>
// //               ) : (
// //                 fields.map(renderPreviewField)
// //               )}
// //             </>
// //           ) : (
// //             // Edit mode
// //             <>
// //               {fields.map(renderField)}

// //               {/* Add field button with menu */}
// //               <div className="flex justify-center relative">
// //                 {showFieldTypes && renderFieldTypeMenu()}
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowFieldTypes(!showFieldTypes)}
// //                   className="bg-white border border-gray-300 rounded-full px-6 py-3 shadow-sm hover:shadow-md text-gray-700 font-medium flex items-center gap-2 transition-shadow"
// //                 >
// //                   <svg
// //                     xmlns="http://www.w3.org/2000/svg"
// //                     className="h-5 w-5"
// //                     viewBox="0 0 20 20"
// //                     fill="currentColor"
// //                   >
// //                     <path
// //                       fillRule="evenodd"
// //                       d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
// //                       clipRule="evenodd"
// //                     />
// //                   </svg>
// //                   Add question
// //                 </button>
// //               </div>
// //             </>
// //           )}

// //           {/* Save button */}
// //           <div className="flex justify-end mt-6">
// //             <button
// //               type="submit"
// //               className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md shadow-sm font-medium transition-colors"
// //             >
// //               Save Form
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// /* eslint-disable react-hooks/purity */
// "use client";

// import { useState } from "react";
// import axios from "@/lib/axios";
// import { useRouter } from "next/navigation";

// // Supported field types
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
//   | "rating"; // Added rating type

// interface FormField {
//   id: string;
//   label: string;
//   type: FieldType;
//   options?: string[]; // for radio/select/checkbox
//   rows?: string[]; // for grid types
//   columns?: string[]; // for grid types
//   required: boolean;
//   description?: string; // field description
//   min?: number; // for number fields
//   max?: number; // for number fields
//   // Rating-specific properties
//   ratingMin?: number; // minimum rating value
//   ratingMax?: number; // maximum rating value
//   ratingLabels?: {
//     min?: string; // label for minimum value
//     max?: string; // label for maximum value
//     middle?: string; // label for middle value (optional)
//   };
//   ratingStyle?: "star" | "number" | "emoji"; // rating display style
// }

// export default function NewForm() {
//   const router = useRouter();

//   const [title, setTitle] = useState<string>("Untitled form");
//   const [description, setDescription] = useState<string>("Form description");
//   const [fields, setFields] = useState<FormField[]>([]);
//   const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
//   const [showFieldTypes, setShowFieldTypes] = useState<boolean>(false);
//   const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

//   // Generate a unique ID for new fields
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

//     // Initialize field based on type
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
//         return { ...field, options: [...options, ""] };
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

//   // Submit the form
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       await axios.post("/forms", { title, description, fields });
//       router.push("/admin/forms");
//     } catch (err) {
//       console.error(err);
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
//     { type: "rating" as FieldType, label: "Rating", icon: "⭐" }, // Added rating option
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
//   const renderStars = (rating: number, maxRating: number, interactive: boolean = false) => {
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
//   const renderEmojis = (rating: number, maxRating: number, interactive: boolean = false) => {
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
//   const renderField = (field: FormField) => (
//     <div
//       key={field.id}
//       className={`bg-white rounded-lg shadow-sm border ${selectedFieldId === field.id ? "border-blue-500" : "border-gray-200"} p-6 relative hover:shadow-md transition-shadow`}
//       onClick={() => setSelectedFieldId(field.id)}
//     >
//       {/* Field actions (top right) */}
//       <div className="absolute top-4 right-4 flex gap-2">
//         <button
//           type="button"
//           onClick={(e) => {
//             e.stopPropagation();
//             // Duplicate field functionality would go here
//           }}
//           className="text-gray-400 hover:text-gray-600"
//           aria-label="Duplicate field"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//           >
//             <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
//           </svg>
//         </button>
//         <button
//           type="button"
//           onClick={(e) => {
//             e.stopPropagation();
//             deleteField(field.id);
//           }}
//           className="text-gray-400 hover:text-gray-600"
//           aria-label="Delete field"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//           >
//             <path
//               fillRule="evenodd"
//               d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </button>
//       </div>

//       {/* Field label input */}
//       <input
//         type="text"
//         placeholder="Question"
//         value={field.label}
//         onChange={(e) => updateField(field.id, "label", e.target.value)}
//         className="w-full text-lg font-medium border-0 border-b-2 border-transparent focus:border-blue-500 focus:ring-0 outline-none px-0 py-1 pr-12"
//         required
//       />

//       {/* Field description input */}
//       <input
//         type="text"
//         placeholder="Description (optional)"
//         value={field.description || ""}
//         onChange={(e) => updateField(field.id, "description", e.target.value)}
//         className="w-full text-sm text-gray-500 border-0 border-b-2 border-transparent focus:border-blue-500 focus:ring-0 outline-none px-0 py-1 mt-2"
//       />

//       {/* Field type selector */}
//       <div className="mt-4">
//         <select
//           value={field.type}
//           onChange={(e) =>
//             updateField(field.id, "type", e.target.value as FieldType)
//           }
//           className="block w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//         >
//           {fieldTypeOptions.map((option) => (
//             <option key={option.type} value={option.type}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Rating field configuration */}
//       {field.type === "rating" && (
//         <div className="mt-6 space-y-4">
//           {/* Rating Style */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Rating Style
//             </label>
//             <div className="flex gap-2">
//               {[
//                 { value: "star", label: "Stars", icon: "⭐" },
//                 { value: "number", label: "Numbers", icon: "1-5" },
//                 { value: "emoji", label: "Emojis", icon: "😊" },
//               ].map((style) => (
//                 <button
//                   key={style.value}
//                   type="button"
//                   onClick={() => updateField(field.id, "ratingStyle", style.value as "star" | "number" | "emoji")}
//                   className={`px-3 py-2 rounded-md border ${field.ratingStyle === style.value ? "bg-blue-50 border-blue-500 text-blue-700" : "bg-white border-gray-300 text-gray-700"} hover:bg-gray-50`}
//                 >
//                   <span className="mr-1">{style.icon}</span>
//                   {style.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Rating Scale */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Minimum Value
//               </label>
//               <input
//                 type="number"
//                 min="1"
//                 max="10"
//                 value={field.ratingMin || 1}
//                 onChange={(e) => {
//                   const val = Number(e.target.value);
//                   const max = field.ratingMax || 5;
//                   if (val < max) {
//                     updateField(field.id, "ratingMin", val);
//                   }
//                 }}
//                 className="w-full p-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Maximum Value
//               </label>
//               <input
//                 type="number"
//                 min="2"
//                 max="10"
//                 value={field.ratingMax || 5}
//                 onChange={(e) => {
//                   const val = Number(e.target.value);
//                   const min = field.ratingMin || 1;
//                   if (val > min) {
//                     updateField(field.id, "ratingMax", val);
//                   }
//                 }}
//                 className="w-full p-2 border border-gray-300 rounded-md"
//               />
//             </div>
//           </div>

//           {/* Rating Labels */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Rating Labels
//             </label>
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-500 w-20">Min ({field.ratingMin || 1}):</span>
//                 <input
//                   type="text"
//                   value={field.ratingLabels?.min || ""}
//                   onChange={(e) =>
//                     updateField(field.id, "ratingLabels", {
//                       ...field.ratingLabels,
//                       min: e.target.value,
//                     })
//                   }
//                   className="flex-1 p-2 border border-gray-300 rounded-md"
//                   placeholder="e.g., Poor"
//                 />
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-500 w-20">Max ({field.ratingMax || 5}):</span>
//                 <input
//                   type="text"
//                   value={field.ratingLabels?.max || ""}
//                   onChange={(e) =>
//                     updateField(field.id, "ratingLabels", {
//                       ...field.ratingLabels,
//                       max: e.target.value,
//                     })
//                   }
//                   className="flex-1 p-2 border border-gray-300 rounded-md"
//                   placeholder="e.g., Excellent"
//                 />
//               </div>
//               {(field.ratingMax || 5) - (field.ratingMin || 1) >= 4 && (
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-500 w-20">Middle:</span>
//                   <input
//                     type="text"
//                     value={field.ratingLabels?.middle || ""}
//                     onChange={(e) =>
//                       updateField(field.id, "ratingLabels", {
//                         ...field.ratingLabels,
//                         middle: e.target.value,
//                       })
//                     }
//                     className="flex-1 p-2 border border-gray-300 rounded-md"
//                     placeholder="e.g., Average (optional)"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Preview of rating */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Preview
//             </label>
//             <div className="p-4 bg-gray-50 rounded-md">
//               {field.ratingStyle === "star" && renderStars(3, field.ratingMax || 5)}
//               {field.ratingStyle === "number" && (
//                 <div className="flex gap-2">
//                   {Array.from({ length: (field.ratingMax || 5) - (field.ratingMin || 1) + 1 }, (_, i) => (field.ratingMin || 1) + i).map((num) => (
//                     <button
//                       key={num}
//                       type="button"
//                       className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center font-medium"
//                     >
//                       {num}
//                     </button>
//                   ))}
//                 </div>
//               )}
//               {field.ratingStyle === "emoji" && renderEmojis(2, field.ratingMax || 5)}
              
//               {/* Show labels if they exist */}
//               <div className="flex justify-between mt-2 text-xs text-gray-500">
//                 <span>{field.ratingLabels?.min || ""}</span>
//                 {field.ratingLabels?.middle && <span>{field.ratingLabels.middle}</span>}
//                 <span>{field.ratingLabels?.max || ""}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Options for non-grid types */}
//       {!["checkbox_grid", "multiple_choice_grid", "rating"].includes(field.type) &&
//         (field.type === "radio" ||
//           field.type === "select" ||
//           field.type === "checkbox") && (
//           <div className="mt-4 space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Options
//             </label>
//             {field.options?.map((opt, optIdx) => (
//               <div key={optIdx} className="flex items-center gap-2">
//                 {field.type === "radio" && (
//                   <span className="text-gray-400">○</span>
//                 )}
//                 {field.type === "checkbox" && (
//                   <span className="text-gray-400">☐</span>
//                 )}
//                 {field.type === "select" && (
//                   <span className="text-gray-400">•</span>
//                 )}
//                 <input
//                   type="text"
//                   value={opt}
//                   onChange={(e) =>
//                     updateOption(field.id, optIdx, e.target.value)
//                   }
//                   className="flex-1 p-2 border border-gray-300 rounded-md"
//                   placeholder={`Option ${optIdx + 1}`}
//                 />
//                 {field.options && field.options.length > 2 && (
//                   <button
//                     type="button"
//                     onClick={() => deleteOption(field.id, optIdx)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => addOption(field.id)}
//               className="text-blue-600 text-sm hover:underline mt-2"
//             >
//               + Add option
//             </button>
//           </div>
//         )}

//       {/* Number field options */}
//       {field.type === "number" && (
//         <div className="mt-4 grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Min value
//             </label>
//             <input
//               type="number"
//               value={field.min || ""}
//               onChange={(e) =>
//                 updateField(
//                   field.id,
//                   "min",
//                   e.target.value ? Number(e.target.value) : undefined,
//                 )
//               }
//               className="w-full p-2 border border-gray-300 rounded-md"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Max value
//             </label>
//             <input
//               type="number"
//               value={field.max || ""}
//               onChange={(e) =>
//                 updateField(
//                   field.id,
//                   "max",
//                   e.target.value ? Number(e.target.value) : undefined,
//                 )
//               }
//               className="w-full p-2 border border-gray-300 rounded-md"
//             />
//           </div>
//         </div>
//       )}

//       {/* Grid configuration for grid types */}
//       {(field.type === "checkbox_grid" ||
//         field.type === "multiple_choice_grid") && (
//         <div className="mt-6 grid grid-cols-2 gap-6">
//           {/* Rows */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Rows
//             </label>
//             <div className="space-y-2">
//               {field.rows?.map((row, rowIdx) => (
//                 <div key={rowIdx} className="flex items-center gap-2">
//                   <span className="text-gray-500 text-sm">{rowIdx + 1}.</span>
//                   <input
//                     type="text"
//                     value={row}
//                     onChange={(e) =>
//                       updateRow(field.id, rowIdx, e.target.value)
//                     }
//                     className="flex-1 p-2 border border-gray-300 rounded-md"
//                   />
//                   {field.rows && field.rows.length > 2 && (
//                     <button
//                       type="button"
//                       onClick={() => deleteRow(field.id, rowIdx)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       ✕
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={() => addRow(field.id)}
//                 className="text-blue-600 text-sm hover:underline mt-2"
//               >
//                 + Add row
//               </button>
//             </div>
//           </div>

//           {/* Columns */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Columns
//             </label>
//             <div className="space-y-2">
//               {field.columns?.map((col, colIdx) => (
//                 <div key={colIdx} className="flex items-center gap-2">
//                   <span className="text-gray-500 text-sm">{colIdx + 1}.</span>
//                   <input
//                     type="text"
//                     value={col}
//                     onChange={(e) =>
//                       updateColumn(field.id, colIdx, e.target.value)
//                     }
//                     className="flex-1 p-2 border border-gray-300 rounded-md"
//                   />
//                   {field.columns && field.columns.length > 2 && (
//                     <button
//                       type="button"
//                       onClick={() => deleteColumn(field.id, colIdx)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       ✕
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={() => addColumn(field.id)}
//                 className="text-blue-600 text-sm hover:underline mt-2"
//               >
//                 + Add column
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Required toggle */}
//       <div className="mt-6 flex items-center">
//         <label className="flex items-center gap-2 text-sm text-gray-700">
//           <input
//             type="checkbox"
//             checked={field.required}
//             onChange={(e) =>
//               updateField(field.id, "required", e.target.checked)
//             }
//             className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//           />
//           Required
//         </label>
//       </div>
//     </div>
//   );

//   // Render a field in preview mode
//   const renderPreviewField = (field: FormField) => (
//     <div
//       key={field.id}
//       className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
//     >
//       <div className="flex items-start gap-2">
//         {field.required && <span className="text-red-500">*</span>}
//         <h3 className="text-base font-medium">{field.label}</h3>
//       </div>
//       {field.description && (
//         <p className="text-sm text-gray-500 mt-1">{field.description}</p>
//       )}

//       {/* Render different field types in preview mode */}
//       <div className="mt-3">
//         {field.type === "text" && (
//           <input
//             type="text"
//             className="w-full p-2 border border-gray-300 rounded-md"
//             placeholder="Short answer"
//           />
//         )}

//         {field.type === "textarea" && (
//           <textarea
//             className="w-full p-2 border border-gray-300 rounded-md resize-none"
//             rows={4}
//             placeholder="Long answer"
//           />
//         )}

//         {field.type === "number" && (
//           <input
//             type="number"
//             className="w-full p-2 border border-gray-300 rounded-md"
//             placeholder="Number"
//             min={field.min}
//             max={field.max}
//           />
//         )}

//         {field.type === "date" && (
//           <input
//             type="date"
//             className="w-full p-2 border border-gray-300 rounded-md"
//           />
//         )}

//         {field.type === "time" && (
//           <input
//             type="time"
//             className="w-full p-2 border border-gray-300 rounded-md"
//           />
//         )}

//         {field.type === "file_upload" && (
//           <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="mx-auto h-12 w-12 text-gray-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//               />
//             </svg>
//             <p className="mt-2 text-sm text-gray-600">
//               Click to upload or drag and drop
//             </p>
//           </div>
//         )}

//         {field.type === "rating" && (
//           <div>
//             {field.ratingStyle === "star" && (
//               <div className="space-y-2">
//                 {renderStars(0, field.ratingMax || 5, true)}
//                 <div className="flex justify-between text-xs text-gray-500">
//                   <span>{field.ratingLabels?.min || ""}</span>
//                   {field.ratingLabels?.middle && <span>{field.ratingLabels.middle}</span>}
//                   <span>{field.ratingLabels?.max || ""}</span>
//                 </div>
//               </div>
//             )}
            
//             {field.ratingStyle === "number" && (
//               <div className="space-y-2">
//                 <div className="flex gap-2">
//                   {Array.from({ length: (field.ratingMax || 5) - (field.ratingMin || 1) + 1 }, (_, i) => (field.ratingMin || 1) + i).map((num) => (
//                     <button
//                       key={num}
//                       type="button"
//                       className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center font-medium transition-colors"
//                     >
//                       {num}
//                     </button>
//                   ))}
//                 </div>
//                 <div className="flex justify-between text-xs text-gray-500">
//                   <span>{field.ratingLabels?.min || ""}</span>
//                   {field.ratingLabels?.middle && <span>{field.ratingLabels.middle}</span>}
//                   <span>{field.ratingLabels?.max || ""}</span>
//                 </div>
//               </div>
//             )}
            
//             {field.ratingStyle === "emoji" && (
//               <div className="space-y-2">
//                 {renderEmojis(-1, field.ratingMax || 5, true)}
//                 <div className="flex justify-between text-xs text-gray-500">
//                   <span>{field.ratingLabels?.min || ""}</span>
//                   {field.ratingLabels?.middle && <span>{field.ratingLabels.middle}</span>}
//                   <span>{field.ratingLabels?.max || ""}</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {field.type === "radio" && (
//           <div className="space-y-2">
//             {field.options?.map((option, idx) => (
//               <label key={idx} className="flex items-center gap-2">
//                 <input type="radio" name={field.id} className="text-blue-600" />
//                 <span>{option}</span>
//               </label>
//             ))}
//           </div>
//         )}

//         {field.type === "checkbox" && (
//           <div className="space-y-2">
//             {field.options?.map((option, idx) => (
//               <label key={idx} className="flex items-center gap-2">
//                 <input type="checkbox" className="text-blue-600 rounded" />
//                 <span>{option}</span>
//               </label>
//             ))}
//           </div>
//         )}

//         {field.type === "select" && (
//           <select className="w-full p-2 border border-gray-300 rounded-md">
//             <option value="">Choose an option</option>
//             {field.options?.map((option, idx) => (
//               <option key={idx} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         )}

//         {field.type === "checkbox_grid" && (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr>
//                   <th></th>
//                   {field.columns?.map((col, idx) => (
//                     <th key={idx} className="p-2 text-left text-sm font-medium">
//                       {col}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {field.rows?.map((row, rowIdx) => (
//                   <tr key={rowIdx}>
//                     <td className="p-2 text-sm font-medium">{row}</td>
//                     {field.columns?.map((_, colIdx) => (
//                       <td key={colIdx} className="p-2 text-start">
//                         <input
//                           type="checkbox"
//                           className="text-blue-600 rounded"
//                         />
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {field.type === "multiple_choice_grid" && (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr>
//                   <th></th>
//                   {field.columns?.map((col, idx) => (
//                     <th key={idx} className="p-2 text-left text-sm font-medium">
//                       {col}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {field.rows?.map((row, rowIdx) => (
//                   <tr key={rowIdx}>
//                     <td className="p-2 text-sm font-medium">{row}</td>
//                     {field.columns?.map((_, colIdx) => (
//                       <td key={colIdx} className="p-2 text-start">
//                         <input
//                           type="radio"
//                           name={`${field.id}_${rowIdx}`}
//                           className="text-blue-600"
//                         />
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-3xl mx-auto">
//         {/* Header with title and description */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full text-3xl font-normal border-0 border-b-2 border-transparent focus:border-blue-500 focus:ring-0 outline-none px-0 py-1 mb-2"
//             placeholder="Form title"
//             required
//           />
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full text-base border-0 border-b-2 border-transparent focus:border-blue-500 focus:ring-0 outline-none px-0 py-1 resize-none"
//             placeholder="Form description"
//             rows={2}
//           />
//         </div>

//         {/* Toggle between edit and preview mode */}
//         <div className="flex justify-end mb-4">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
//             <button
//               type="button"
//               onClick={() => setIsPreviewMode(false)}
//               className={`px-4 py-2 rounded-md text-sm font-medium ${!isPreviewMode ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
//             >
//               Edit
//             </button>
//             <button
//               type="button"
//               onClick={() => setIsPreviewMode(true)}
//               className={`px-4 py-2 rounded-md text-sm font-medium ${isPreviewMode ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
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
//                 fields.map(renderPreviewField)
//               )}
//             </>
//           ) : (
//             // Edit mode
//             <>
//               {fields.map(renderField)}

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
//               className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md shadow-sm font-medium transition-colors"
//             >
//               Save Form
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

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
  options?: string[]; // for radio/select/checkbox
  rows?: string[]; // for grid types
  columns?: string[]; // for grid types
  required: boolean;
  description?: string; // field description
  min?: number; // for number fields
  max?: number; // for number fields
  // Rating-specific properties
  ratingMin?: number; // minimum rating value
  ratingMax?: number; // maximum rating value
  ratingLabels?: {
    min?: string; // label for minimum value
    max?: string; // label for maximum value
    middle?: string; // label for middle value (optional)
  };
  ratingStyle?: "star" | "number" | "emoji"; // rating display style
}

export default function NewForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState<string>("Untitled form");
  const [description, setDescription] = useState<string>("Form description");
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [showFieldTypes, setShowFieldTypes] = useState<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Generate a unique ID for new fields
  const generateId = () =>
    `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Add a new empty field (default type = text)
  const addField = (type: FieldType = "text") => {
    const newField: FormField = {
      id: generateId(),
      label: "",
      type,
      required: false,
    };

    // Initialize field based on type
    if (type === "radio" || type === "select" || type === "checkbox") {
      newField.options = ["Option 1", "Option 2"];
    } else if (type === "checkbox_grid" || type === "multiple_choice_grid") {
      newField.rows = ["Row 1", "Row 2"];
      newField.columns = ["Column 1", "Column 2"];
    } else if (type === "rating") {
      // Initialize rating field with defaults
      newField.ratingMin = 1;
      newField.ratingMax = 5;
      newField.ratingLabels = {
        min: "Poor",
        max: "Excellent",
      };
      newField.ratingStyle = "star";
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
        }

        // If type changes to a radio/select/checkbox, ensure options exist
        if (
          key === "type" &&
          (value === "radio" || value === "select" || value === "checkbox")
        ) {
          if (!updatedField.options || updatedField.options.length === 0) {
            updatedField.options = ["Option 1", "Option 2"];
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
        }

        return updatedField;
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
        return { ...field, options: [...options, `Option ${options.length + 1}`] };
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

  // Transform frontend fields to backend format
  const transformFieldsForBackend = () => {
    return fields.map(field => {
      // Remove the temporary id field
      const { id, ...backendField } = field;
      
      // Ensure rating fields are properly formatted
      if (field.type === 'rating') {
        return {
          ...backendField,
          ratingMin: field.ratingMin || 1,
          ratingMax: field.ratingMax || 5,
          ratingStyle: field.ratingStyle || 'star',
          ratingLabels: field.ratingLabels || { min: '', max: '' }
        };
      }
      
      // Ensure number fields have min/max as numbers
      if (field.type === 'number') {
        return {
          ...backendField,
          min: field.min ? Number(field.min) : undefined,
          max: field.max ? Number(field.max) : undefined
        };
      }
      
      return backendField;
    });
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError('Form title is required');
      return;
    }

    // Validate fields
    const invalidFields = fields.filter(field => !field.label.trim());
    if (invalidFields.length > 0) {
      setError('All questions must have a label');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to create a form');
        setLoading(false);
        return;
      }

      const formData = {
        title,
        description,
        fields: transformFieldsForBackend(),
        isPublished: false // Default to unpublished, admin can publish later
      };

      console.log('Submitting form:', formData);

      const response = await axios.post("/forms", formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Form created successfully:', response.data);
      
      // Redirect to forms list or form detail page
      router.push("/admin/forms");
    } catch (err: any) {
      console.error("Error creating form:", err);
      setError(err.response?.data?.message || err.message || 'Failed to create form');
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
  const renderStars = (rating: number, maxRating: number, interactive: boolean = false) => {
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
  const renderEmojis = (rating: number, maxRating: number, interactive: boolean = false) => {
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
                    onChange={(e) => updateField(field.id, "min", Number(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="No minimum"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-600">Max value</label>
                  <input
                    type="number"
                    value={field.max || ""}
                    onChange={(e) => updateField(field.id, "max", Number(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="No maximum"
                  />
                </div>
              </div>
            </div>
          )}

          {(field.type === "radio" || field.type === "select" || field.type === "checkbox") && (
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
                    onChange={(e) => updateOption(field.id, index, e.target.value)}
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
                  onChange={(e) => updateField(field.id, "ratingStyle", e.target.value as "star" | "number" | "emoji")}
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
                  onChange={(e) => updateField(field.id, "ratingMin", Number(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="1"
                />
                <span>to</span>
                <input
                  type="number"
                  value={field.ratingMax || 5}
                  onChange={(e) => updateField(field.id, "ratingMax", Number(e.target.value))}
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
                    onChange={(e) => updateField(field.id, "ratingLabels", {
                      ...field.ratingLabels,
                      min: e.target.value
                    })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="e.g., Poor"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-16">Max label:</span>
                  <input
                    type="text"
                    value={field.ratingLabels?.max || ""}
                    onChange={(e) => updateField(field.id, "ratingLabels", {
                      ...field.ratingLabels,
                      max: e.target.value
                    })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="e.g., Excellent"
                  />
                </div>
              </div>

              {/* Preview of rating */}
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                {field.ratingStyle === "star" && renderStars(3, field.ratingMax || 5)}
                {field.ratingStyle === "emoji" && renderEmojis(2, field.ratingMax || 5)}
                {field.ratingStyle === "number" && (
                  <div className="flex gap-2">
                    {Array.from({ length: (field.ratingMax || 5) - (field.ratingMin || 1) + 1 }, (_, i) => (field.ratingMin || 1) + i).map((num) => (
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
              <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
            </div>
          )}

          {(field.type === "checkbox_grid" || field.type === "multiple_choice_grid") && (
            <div className="space-y-4">
              {/* Rows */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Rows</span>
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
                        onChange={(e) => updateRow(field.id, index, e.target.value)}
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
                  <span className="text-sm font-medium text-gray-700">Columns</span>
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
                        onChange={(e) => updateColumn(field.id, index, e.target.value)}
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
      </div>
    );
  };

  // Render a field in preview mode
  const renderPreviewField = (field: FormField) => {
    return (
      <div key={field.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <label className="text-lg font-medium text-gray-900">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.description && (
            <p className="text-sm text-gray-500 mt-1">{field.description}</p>
          )}
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
                <label key={index} className="flex items-center gap-2 cursor-pointer">
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
                <label key={index} className="flex items-center gap-2 cursor-pointer">
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
              {field.ratingStyle === "star" && renderStars(0, field.ratingMax || 5, true)}
              {field.ratingStyle === "emoji" && renderEmojis(0, field.ratingMax || 5, true)}
              {field.ratingStyle === "number" && (
                <div className="flex gap-2">
                  {Array.from({ length: (field.ratingMax || 5) - (field.ratingMin || 1) + 1 }, (_, i) => (field.ratingMin || 1) + i).map((num) => (
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
              <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}

          {(field.type === "checkbox_grid" || field.type === "multiple_choice_grid") && (
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
        {/* Header with title and description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-normal border-0 border-b-2 border-transparent focus:border-blue-500 focus:ring-0 outline-none px-0 py-1 mb-2"
            placeholder="Form title"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-base border-0 border-b-2 border-transparent focus:border-blue-500 focus:ring-0 outline-none px-0 py-1 resize-none"
            placeholder="Form description"
            rows={2}
          />
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
              className={`px-4 py-2 rounded-md text-sm font-medium ${!isPreviewMode ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setIsPreviewMode(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${isPreviewMode ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
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
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Saving...' : 'Save Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}