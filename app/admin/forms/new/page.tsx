/* eslint-disable @next/next/no-img-element */

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
//   | "date"
//   | "time"
//   | "file_upload"
//   | "rating"
//   | "image_text";

// interface FormField {
//   id: string;
//   label: string;
//   type: FieldType;
//   options?: string[];
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
//   correctAnswer?: any;
//   marks?: number;
//   // For image_text type
//   imageUrl?: string;
//   imagePrompt?: string;
//   imagePreview?: string;
//   isUploading?: boolean;
// }

// export default function NewForm() {
//   const router = useRouter();
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [uploadingFieldId, setUploadingFieldId] = useState<string | null>(null);

//   const [title, setTitle] = useState<string>("Untitled form");
//   const [description, setDescription] = useState<string>("Form description");
//   const [className, setClassName] = useState<string>("");
//   const [subject, setSubject] = useState<string>("");
//   const [duration, setDuration] = useState<string>("60");
//   const [fields, setFields] = useState<FormField[]>([]);
//   const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
//   const [showFieldTypes, setShowFieldTypes] = useState<boolean>(false);
//   const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

//   // Your ImgBB API Key
//   const IMGBB_API_KEY = "4e40960ee867d0115a4c0049f45f4572";

//   const generateId = () =>
//     `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

//   const addField = (type: FieldType = "text") => {
//     const newField: FormField = {
//       id: generateId(),
//       label: "",
//       type,
//       required: false,
//       correctAnswer: "",
//       marks: 1,
//     };

//     if (type === "radio" || type === "select" || type === "checkbox") {
//       newField.options = ["Option 1", "Option 2"];
//       newField.correctAnswer = type === "checkbox" ? [] : "";
//     } else if (type === "rating") {
//       newField.ratingMin = 1;
//       newField.ratingMax = 5;
//       newField.ratingLabels = {
//         min: "Poor",
//         max: "Excellent",
//       };
//       newField.ratingStyle = "star";
//       newField.correctAnswer = "";
//     } else if (type === "image_text") {
//       newField.imageUrl = "";
//       newField.imagePrompt = "";
//       newField.imagePreview = "";
//       newField.correctAnswer = "";
//     } else if (type === "file_upload") {
//       newField.correctAnswer = "";
//     }

//     setFields([...fields, newField]);
//     setSelectedFieldId(newField.id);
//     setShowFieldTypes(false);
//   };

//   const deleteField = (id: string) => {
//     setFields(fields.filter((field) => field.id !== id));
//     if (selectedFieldId === id) {
//       setSelectedFieldId(null);
//     }
//   };

//   const updateField = <K extends keyof FormField>(
//     id: string,
//     key: K,
//     value: FormField[K],
//   ) => {
//     setFields((prev) =>
//       prev.map((field) =>
//         field.id === id ? { ...field, [key]: value } : field,
//       ),
//     );
//   };

//   // Fixed: Upload to ImgBB with API key
//   const uploadToImgBB = async (file: File): Promise<string> => {
//     const formData = new FormData();
//     formData.append("image", file);
//     formData.append("key", IMGBB_API_KEY); // IMPORTANT: Add API key to form data

//     try {
//       const response = await fetch("https://api.imgbb.com/1/upload", {
//         method: "POST",
//         body: formData, // Don't set Content-Type header, let browser set it with boundary
//       });

//       const result = await response.json();
//       console.log("ImgBB response:", result);

//       if (result.success) {
//         return result.data.url; // Returns the direct image URL
//       } else {
//         throw new Error(result.error?.message || "Upload failed");
//       }
//     } catch (error) {
//       console.error("ImgBB upload error:", error);
//       throw error;
//     }
//   };

//   // Image upload handler
//   const handleImageUpload = async (fieldId: string, file: File) => {
//     if (!file) return;

//     // Validate file type
//     const validTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/jpg",
//       "image/gif",
//       "image/webp",
//     ];
//     if (!validTypes.includes(file.type)) {
//       toast.error("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
//       return;
//     }

//     // Validate file size (max 2MB)
//     if (file.size > 2 * 1024 * 1024) {
//       toast.error("Image size should be less than 2MB");
//       return;
//     }

//     setUploadingFieldId(fieldId);

//     // Show local preview immediately
//     const previewUrl = URL.createObjectURL(file);
//     setFields((prev) =>
//       prev.map((field) =>
//         field.id === fieldId
//           ? { ...field, imagePreview: previewUrl, isUploading: true }
//           : field,
//       ),
//     );

//     try {
//       // Upload to ImgBB
//       const imgbbUrl = await uploadToImgBB(file);

//       console.log("Uploaded to ImgBB, URL:", imgbbUrl);

//       // Store the ImgBB URL in the field
//       setFields((prev) =>
//         prev.map((field) =>
//           field.id === fieldId
//             ? {
//                 ...field,
//                 imageUrl: imgbbUrl,
//                 imagePreview: previewUrl,
//                 isUploading: false,
//               }
//             : field,
//         ),
//       );

//       toast.success("Image uploaded to ImgBB successfully!");
//     } catch (err: any) {
//       console.error("Upload error:", err);
//       setFields((prev) =>
//         prev.map((field) =>
//           field.id === fieldId
//             ? { ...field, imagePreview: undefined, isUploading: false }
//             : field,
//         ),
//       );
//       toast.error(err.message || "Failed to upload image");
//     } finally {
//       setUploadingFieldId(null);
//     }
//   };

//   const removeImage = (fieldId: string) => {
//     setFields((prev) =>
//       prev.map((field) =>
//         field.id === fieldId
//           ? { ...field, imageUrl: "", imagePreview: "", isUploading: false }
//           : field,
//       ),
//     );
//     toast.info("Image removed");
//   };

//   const updateCorrectAnswer = (id: string, value: any) => {
//     setFields((prev) =>
//       prev.map((field) =>
//         field.id === id ? { ...field, correctAnswer: value } : field,
//       ),
//     );
//   };

//   const updateMarks = (id: string, marks: number) => {
//     setFields((prev) =>
//       prev.map((field) =>
//         field.id === id ? { ...field, marks: Math.max(0, marks) } : field,
//       ),
//     );
//   };

//   const addOption = (id: string) => {
//     setFields((prev) =>
//       prev.map((field) => {
//         if (field.id === id) {
//           const options = field.options || [];
//           return {
//             ...field,
//             options: [...options, `Option ${options.length + 1}`],
//           };
//         }
//         return field;
//       }),
//     );
//   };

//   const updateOption = (fieldId: string, optIndex: number, value: string) => {
//     setFields((prev) =>
//       prev.map((field) => {
//         if (field.id === fieldId && field.options) {
//           const newOptions = [...field.options];
//           newOptions[optIndex] = value;
//           return { ...field, options: newOptions };
//         }
//         return field;
//       }),
//     );
//   };

//   const deleteOption = (fieldId: string, optIndex: number) => {
//     setFields((prev) =>
//       prev.map((field) => {
//         if (field.id === fieldId && field.options) {
//           return {
//             ...field,
//             options: field.options.filter((_, i) => i !== optIndex),
//           };
//         }
//         return field;
//       }),
//     );
//   };

//   const calculateTotalMarks = () => {
//     return fields.reduce((total, field) => total + (field.marks || 0), 0);
//   };

//   const transformFieldsForBackend = () => {
//     return fields.map((field) => {
//       // Remove frontend-only properties
//       const { id, imagePreview, isUploading, ...backendField } = field;

//       const transformed: any = {
//         label: backendField.label,
//         type: backendField.type,
//         options: backendField.options || [],
//         required: backendField.required,
//         correctAnswer: backendField.correctAnswer,
//         marks: backendField.marks || 1,
//       };

//       if (field.type === "rating") {
//         transformed.ratingStyle = field.ratingStyle;
//         transformed.ratingMin = field.ratingMin;
//         transformed.ratingMax = field.ratingMax;
//         transformed.ratingLabels = field.ratingLabels;
//       }

//       if (field.type === "number") {
//         if (field.min !== undefined) transformed.min = field.min;
//         if (field.max !== undefined) transformed.max = field.max;
//       }

//       if (field.type === "image_text") {
//         // This will be the ImgBB URL
//         transformed.imageUrl = field.imageUrl || "";
//         transformed.imagePrompt = field.imagePrompt || "";
//       }

//       if (field.description) transformed.description = field.description;

//       return transformed;
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

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

//     const invalidFields = fields.filter((field) => !field.label.trim());
//     if (invalidFields.length > 0) {
//       setError("All questions must have a label");
//       toast.error("All questions must have a label");
//       return;
//     }

//     const invalidMarks = fields.filter((field) => (field.marks || 0) <= 0);
//     if (invalidMarks.length > 0) {
//       setError("All questions must have positive marks");
//       toast.error("All questions must have positive marks");
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
//         duration: parseInt(duration),
//         totalMarks: calculateTotalMarks(),
//         fields: transformFieldsForBackend(),
//         isPublished: true,
//       };

//       console.log(
//         "Submitting form with ImgBB URLs:",
//         JSON.stringify(formData, null, 2),
//       );

//       const response = await axios.post("/forms", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("Form created successfully! Images are hosted on ImgBB");
//       router.push("/admin/forms");
//     } catch (err: any) {
//       console.error("Submit error:", err);
//       const errorMessage =
//         err.response?.data?.message || err.message || "Failed to create form";
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fieldTypeOptions = [
//     { type: "text" as FieldType, label: "Short answer", icon: "T" },
//     { type: "textarea" as FieldType, label: "Paragraph", icon: "¶" },
//     { type: "number" as FieldType, label: "Number", icon: "#" },
//     { type: "radio" as FieldType, label: "Multiple choice", icon: "○" },
//     { type: "checkbox" as FieldType, label: "Checkboxes", icon: "☑" },
//     { type: "select" as FieldType, label: "Dropdown", icon: "▼" },
//     { type: "rating" as FieldType, label: "Rating", icon: "⭐" },
//     { type: "image_text" as FieldType, label: "Image + Text", icon: "🖼️" },
//     { type: "file_upload" as FieldType, label: "File upload", icon: "📎" },
//     { type: "date" as FieldType, label: "Date", icon: "📅" },
//     { type: "time" as FieldType, label: "Time", icon: "🕐" },
//   ];

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

//   const renderStars = (
//     rating: number,
//     maxRating: number,
//     interactive: boolean = false,
//   ) => (
//     <div className="flex gap-1">
//       {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
//         <button
//           key={star}
//           type="button"
//           className={`text-2xl transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-300"} ${interactive ? "hover:text-yellow-400 cursor-pointer" : "cursor-default"}`}
//           disabled={!interactive}
//         >
//           ★
//         </button>
//       ))}
//     </div>
//   );

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

//   const renderAnswerAndMarks = (field: FormField) => {
//     if (field.type === "file_upload" || field.type === "image_text") {
//       return (
//         <div className="mt-4 pt-4 border-t border-gray-200">
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Marks <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="number"
//               value={field.marks || 1}
//               onChange={(e) =>
//                 updateMarks(field.id, parseInt(e.target.value) || 0)
//               }
//               min="1"
//               step="1"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
//             />
//           </div>
//           <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
//             <p className="text-sm text-yellow-800">
//               ⚠️ This question requires manual grading by the teacher. Students
//               will submit their answers, and you will need to review and grade
//               them manually.
//             </p>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="mt-4 pt-4 border-t border-gray-200">
//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Marks <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="number"
//               value={field.marks || 1}
//               onChange={(e) =>
//                 updateMarks(field.id, parseInt(e.target.value) || 0)
//               }
//               min="1"
//               step="1"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Correct Answer <span className="text-red-500">*</span>
//           </label>

//           {field.type === "text" && (
//             <input
//               type="text"
//               value={(field.correctAnswer as string) || ""}
//               onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
//               placeholder="Enter the correct answer"
//             />
//           )}

//           {field.type === "textarea" && (
//             <textarea
//               value={(field.correctAnswer as string) || ""}
//               onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
//               placeholder="Enter the correct answer"
//             />
//           )}

//           {field.type === "number" && (
//             <input
//               type="number"
//               value={(field.correctAnswer as string) || ""}
//               onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
//               placeholder="Enter the correct number"
//             />
//           )}

//           {field.type === "radio" && (
//             <div className="space-y-2 bg-green-50 p-3 rounded-md">
//               {field.options?.map((option, index) => (
//                 <label
//                   key={index}
//                   className="flex items-center gap-2 cursor-pointer"
//                 >
//                   <input
//                     type="radio"
//                     name={`answer-${field.id}`}
//                     value={option}
//                     checked={field.correctAnswer === option}
//                     onChange={(e) =>
//                       updateCorrectAnswer(field.id, e.target.value)
//                     }
//                     className="text-green-600"
//                   />
//                   <span>{option}</span>
//                 </label>
//               ))}
//             </div>
//           )}

//           {field.type === "checkbox" && (
//             <div className="space-y-2 bg-green-50 p-3 rounded-md">
//               {field.options?.map((option, index) => {
//                 const answers = (field.correctAnswer as string[]) || [];
//                 return (
//                   <label
//                     key={index}
//                     className="flex items-center gap-2 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       value={option}
//                       checked={answers.includes(option)}
//                       onChange={(e) => {
//                         const currentAnswers = [
//                           ...((field.correctAnswer as string[]) || []),
//                         ];
//                         if (e.target.checked) {
//                           updateCorrectAnswer(field.id, [
//                             ...currentAnswers,
//                             option,
//                           ]);
//                         } else {
//                           updateCorrectAnswer(
//                             field.id,
//                             currentAnswers.filter((a) => a !== option),
//                           );
//                         }
//                       }}
//                       className="text-green-600"
//                     />
//                     <span>{option}</span>
//                   </label>
//                 );
//               })}
//             </div>
//           )}

//           {field.type === "select" && (
//             <select
//               value={(field.correctAnswer as string) || ""}
//               onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
//             >
//               <option value="">Select the correct answer</option>
//               {field.options?.map((option, index) => (
//                 <option key={index} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           )}

//           {field.type === "rating" && (
//             <div className="bg-green-50 p-3 rounded-md">
//               <div className="flex gap-2">
//                 {Array.from(
//                   {
//                     length: (field.ratingMax || 5) - (field.ratingMin || 1) + 1,
//                   },
//                   (_, i) => (field.ratingMin || 1) + i,
//                 ).map((num) => (
//                   <button
//                     key={num}
//                     type="button"
//                     onClick={() => updateCorrectAnswer(field.id, num)}
//                     className={`w-10 h-10 border rounded hover:bg-green-100 ${
//                       field.correctAnswer === num
//                         ? "bg-green-500 text-white border-green-600"
//                         : "border-gray-300"
//                     }`}
//                   >
//                     {num}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {field.type === "date" && (
//             <input
//               type="date"
//               value={(field.correctAnswer as string) || ""}
//               onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
//             />
//           )}

//           {field.type === "time" && (
//             <input
//               type="time"
//               value={(field.correctAnswer as string) || ""}
//               onChange={(e) => updateCorrectAnswer(field.id, e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
//             />
//           )}
//         </div>
//       </div>
//     );
//   };

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
//                     updateField(field.id, "ratingStyle", e.target.value as any)
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
//             </div>
//           )}

//           {field.type === "image_text" && (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Upload Image (ImgBB Hosting)
//                 </label>
//                 {!field.imagePreview ? (
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         const file = e.target.files?.[0];
//                         if (file) handleImageUpload(field.id, file);
//                       }}
//                       className="hidden"
//                       id={`image-upload-${field.id}`}
//                     />
//                     <label
//                       htmlFor={`image-upload-${field.id}`}
//                       className="cursor-pointer block"
//                     >
//                       <svg
//                         className="mx-auto h-12 w-12 text-gray-400"
//                         stroke="currentColor"
//                         fill="none"
//                         viewBox="0 0 48 48"
//                       >
//                         <path
//                           d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                           strokeWidth={2}
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                       </svg>
//                       <p className="mt-2 text-sm text-gray-600">
//                         Click to upload image to ImgBB
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         PNG, JPG, GIF up to 2MB (Free CDN hosting)
//                       </p>
//                     </label>
//                   </div>
//                 ) : (
//                   <div className="relative border rounded-lg p-2 bg-gray-50">
//                     <img
//                       src={field.imagePreview}
//                       alt="Uploaded"
//                       className="max-w-full h-auto rounded max-h-64 mx-auto"
//                     />
//                     {uploadingFieldId === field.id && (
//                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
//                         <div className="text-white">Uploading to ImgBB...</div>
//                       </div>
//                     )}
//                     {field.imageUrl && !uploadingFieldId && (
//                       <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
//                         Hosted on ImgBB ✓
//                       </div>
//                     )}
//                     <button
//                       type="button"
//                       onClick={() => removeImage(field.id)}
//                       className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Image Prompt / Instructions
//                 </label>
//                 <textarea
//                   value={field.imagePrompt || ""}
//                   onChange={(e) =>
//                     updateField(field.id, "imagePrompt", e.target.value)
//                   }
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Describe what students should look for in the image or what they need to answer..."
//                 />
//               </div>

//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-blue-50">
//                 <p className="text-sm font-medium text-gray-700 mb-2">
//                   Student Preview:
//                 </p>
//                 {field.imagePreview && (
//                   <img
//                     src={field.imagePreview}
//                     alt="Preview"
//                     className="max-w-full h-auto rounded mb-3 max-h-48 mx-auto"
//                   />
//                 )}
//                 {field.imagePrompt && (
//                   <p className="text-sm text-gray-600 mb-3">
//                     {field.imagePrompt}
//                   </p>
//                 )}
//                 {!field.imagePreview && !field.imagePrompt && (
//                   <p className="text-sm text-gray-400 italic">
//                     Upload an image and add instructions to see preview
//                   </p>
//                 )}
//                 <textarea
//                   disabled
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
//                   placeholder="Students will write their answer here..."
//                 />
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
//               <p className="text-xs text-gray-500">
//                 Students can upload files here
//               </p>
//             </div>
//           )}
//         </div>

//         {renderAnswerAndMarks(field)}
//       </div>
//     );
//   };

//   const renderPreviewField = (field: FormField) => (
//     <div
//       key={field.id}
//       className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
//     >
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <label className="text-lg font-medium text-gray-900">
//             {field.label}
//             {field.required && <span className="text-red-500 ml-1">*</span>}
//           </label>
//           {field.description && (
//             <p className="text-sm text-gray-500 mt-1">{field.description}</p>
//           )}
//         </div>
//         <div className="text-sm text-purple-600 font-medium">
//           {field.marks} {field.marks === 1 ? "mark" : "marks"}
//         </div>
//       </div>

//       <div>
//         {field.type === "text" && (
//           <input
//             type="text"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Your answer"
//           />
//         )}
//         {field.type === "textarea" && (
//           <textarea
//             rows={4}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Your answer"
//           />
//         )}
//         {field.type === "number" && (
//           <input
//             type="number"
//             min={field.min}
//             max={field.max}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Your answer"
//           />
//         )}

//         {field.type === "radio" && (
//           <div className="space-y-2">
//             {field.options?.map((option, index) => (
//               <label
//                 key={index}
//                 className="flex items-center gap-2 cursor-pointer"
//               >
//                 <input
//                   type="radio"
//                   name={`radio-${field.id}`}
//                   className="text-blue-600"
//                 />
//                 <span>{option}</span>
//               </label>
//             ))}
//           </div>
//         )}

//         {field.type === "checkbox" && (
//           <div className="space-y-2">
//             {field.options?.map((option, index) => (
//               <label
//                 key={index}
//                 className="flex items-center gap-2 cursor-pointer"
//               >
//                 <input type="checkbox" className="text-blue-600" />
//                 <span>{option}</span>
//               </label>
//             ))}
//           </div>
//         )}

//         {field.type === "select" && (
//           <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
//             <option value="">Choose an option</option>
//             {field.options?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         )}

//         {field.type === "rating" && (
//           <div>
//             {field.ratingStyle === "star" &&
//               renderStars(0, field.ratingMax || 5, true)}
//             {field.ratingStyle === "emoji" &&
//               renderEmojis(0, field.ratingMax || 5, true)}
//             {field.ratingStyle === "number" && (
//               <div className="flex gap-2">
//                 {Array.from(
//                   {
//                     length: (field.ratingMax || 5) - (field.ratingMin || 1) + 1,
//                   },
//                   (_, i) => (field.ratingMin || 1) + i,
//                 ).map((num) => (
//                   <button
//                     key={num}
//                     type="button"
//                     className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100"
//                   >
//                     {num}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {field.type === "image_text" && (
//           <div className="space-y-4">
//             {field.imagePreview && (
//               <div className="border rounded-lg p-2">
//                 <img
//                   src={field.imagePreview}
//                   alt="Question reference"
//                   className="max-w-full h-auto rounded"
//                 />
//               </div>
//             )}
//             {field.imagePrompt && (
//               <p className="text-sm text-gray-600">{field.imagePrompt}</p>
//             )}
//             <textarea
//               rows={4}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Your answer based on the image above..."
//             />
//           </div>
//         )}

//         {field.type === "date" && (
//           <input
//             type="date"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         )}
//         {field.type === "time" && (
//           <input
//             type="time"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         )}

//         {field.type === "file_upload" && (
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
//             <svg
//               className="mx-auto h-12 w-12 text-gray-400"
//               stroke="currentColor"
//               fill="none"
//               viewBox="0 0 48 48"
//             >
//               <path
//                 d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                 strokeWidth={2}
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//             <p className="mt-2 text-sm text-gray-600">
//               Click to upload or drag and drop
//             </p>
//             <p className="text-xs text-gray-500">
//               PNG, JPG, GIF, PDF up to 10MB
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-3xl mx-auto">
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
//                 placeholder="Enter class"
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
//                 placeholder="Enter subject"
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
//                 min="1"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           </div>
//         </div>

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
//             className="w-full text-base border-0 border-b-2 border-black focus:border-blue-500 focus:ring-0 outline-none px-0 py-1 resize-none"
//             placeholder="Form description"
//             rows={2}
//           />
//           {fields.length > 0 && (
//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <div className="text-right">
//                 <span className="text-sm font-medium text-gray-600">
//                   Total Marks:{" "}
//                 </span>
//                 <span className="text-lg font-bold text-purple-600">
//                   {calculateTotalMarks()}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         {error && (
//           <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-600 text-sm">{error}</p>
//           </div>
//         )}

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

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {isPreviewMode ? (
//             fields.length === 0 ? (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
//                 No questions added yet. Switch to edit mode to add questions.
//               </div>
//             ) : (
//               fields.map((field) => renderPreviewField(field))
//             )
//           ) : (
//             <>
//               {fields.map((field) => renderField(field))}
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
//           <div className="flex justify-end mt-6">
//             <button
//               type="submit"
//               disabled={loading}
//               className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md shadow-sm font-medium transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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

type FieldType = "text" | "radio" | "checkbox" | "image_text";

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  required: boolean;
  description?: string;
  correctAnswer?: any;
  marks?: number;
  // For image_text type
  imageUrl?: string;
  imagePrompt?: string;
  imagePreview?: string;
  isUploading?: boolean;
}

export default function NewForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingFieldId, setUploadingFieldId] = useState<string | null>(null);

  const [title, setTitle] = useState<string>("Untitled form");
  const [description, setDescription] = useState<string>("Form description");
  const [className, setClassName] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [duration, setDuration] = useState<string>("60");
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [showFieldTypes, setShowFieldTypes] = useState<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Your ImgBB API Key
  const IMGBB_API_KEY = "4e40960ee867d0115a4c0049f45f4572";

  const generateId = () =>
    `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: generateId(),
      label: "",
      type,
      required: false,
      correctAnswer: type === "checkbox" ? [] : "",
      marks: 1,
    };

    if (type === "radio" || type === "checkbox") {
      newField.options = ["Option 1", "Option 2"];
    } else if (type === "image_text") {
      newField.imageUrl = "";
      newField.imagePrompt = "";
      newField.imagePreview = "";
      newField.correctAnswer = ""; // No correct answer needed for manual grading
    }

    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
    setShowFieldTypes(false);
  };

  const deleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  const updateField = <K extends keyof FormField>(
    id: string,
    key: K,
    value: FormField[K],
  ) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, [key]: value } : field,
      ),
    );
  };

  // Check if field type requires manual grading (no correct answer needed)
  const requiresManualGrading = (type: FieldType): boolean => {
    return type === "image_text";
  };

  // Upload to ImgBB
  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("key", IMGBB_API_KEY);

    try {
      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("ImgBB response:", result);

      if (result.success) {
        return result.data.url;
      } else {
        throw new Error(result.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("ImgBB upload error:", error);
      throw error;
    }
  };

  // Image upload handler for image_text field
  const handleImageUpload = async (fieldId: string, file: File) => {
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setUploadingFieldId(fieldId);

    const previewUrl = URL.createObjectURL(file);
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId
          ? { ...field, imagePreview: previewUrl, isUploading: true }
          : field,
      ),
    );

    try {
      const imgbbUrl = await uploadToImgBB(file);
      console.log("Uploaded to ImgBB, URL:", imgbbUrl);

      setFields((prev) =>
        prev.map((field) =>
          field.id === fieldId
            ? {
                ...field,
                imageUrl: imgbbUrl,
                imagePreview: previewUrl,
                isUploading: false,
              }
            : field,
        ),
      );

      toast.success("Image uploaded to ImgBB successfully!");
    } catch (err: any) {
      console.error("Upload error:", err);
      setFields((prev) =>
        prev.map((field) =>
          field.id === fieldId
            ? { ...field, imagePreview: undefined, isUploading: false }
            : field,
        ),
      );
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploadingFieldId(null);
    }
  };

  const removeImage = (fieldId: string) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId
          ? { ...field, imageUrl: "", imagePreview: "", isUploading: false }
          : field,
      ),
    );
    toast.info("Image removed");
  };

  const updateCorrectAnswer = (id: string, value: any) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, correctAnswer: value } : field,
      ),
    );
  };

  const updateMarks = (id: string, marks: number) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, marks: Math.max(0, marks) } : field,
      ),
    );
  };

  const addOption = (id: string) => {
    setFields((prev) =>
      prev.map((field) => {
        if (field.id === id) {
          const options = field.options || [];
          return {
            ...field,
            options: [...options, `Option ${options.length + 1}`],
          };
        }
        return field;
      }),
    );
  };

  const updateOption = (fieldId: string, optIndex: number, value: string) => {
    setFields((prev) =>
      prev.map((field) => {
        if (field.id === fieldId && field.options) {
          const newOptions = [...field.options];
          newOptions[optIndex] = value;
          return { ...field, options: newOptions };
        }
        return field;
      }),
    );
  };

  const deleteOption = (fieldId: string, optIndex: number) => {
    setFields((prev) =>
      prev.map((field) => {
        if (field.id === fieldId && field.options) {
          return {
            ...field,
            options: field.options.filter((_, i) => i !== optIndex),
          };
        }
        return field;
      }),
    );
  };

  const calculateTotalMarks = () => {
    return fields.reduce((total, field) => total + (field.marks || 0), 0);
  };

  const transformFieldsForBackend = () => {
    return fields.map((field) => {
      const { id, imagePreview, isUploading, ...backendField } = field;

      const transformed: any = {
        label: backendField.label,
        type: backendField.type,
        options: backendField.options || [],
        required: backendField.required,
        marks: backendField.marks || 1,
      };

      // Only include correctAnswer for auto-gradable questions (radio, checkbox)
      if (!requiresManualGrading(field.type)) {
        transformed.correctAnswer = backendField.correctAnswer;
      }

      if (field.type === "image_text") {
        transformed.imageUrl = field.imageUrl || "";
        transformed.imagePrompt = field.imagePrompt || "";
      }

      if (field.description) transformed.description = field.description;

      return transformed;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    const invalidFields = fields.filter((field) => !field.label.trim());
    if (invalidFields.length > 0) {
      setError("All questions must have a label");
      toast.error("All questions must have a label");
      return;
    }

    // Validate that multiple choice and checkbox questions have correct answers
    const missingCorrectAnswers = fields.filter(
      (field) => (field.type === "radio" || field.type === "checkbox") && 
      (!field.correctAnswer || field.correctAnswer === "" || 
        (Array.isArray(field.correctAnswer) && field.correctAnswer.length === 0))
    );
    
    if (missingCorrectAnswers.length > 0) {
      setError("All multiple choice and checkbox questions must have a correct answer");
      toast.error("Please provide correct answers for all multiple choice and checkbox questions");
      return;
    }

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

      console.log("Submitting form:", JSON.stringify(formData, null, 2));

      const response = await axios.post("/forms", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Form created successfully!");
      router.push("/admin/forms");
    } catch (err: any) {
      console.error("Submit error:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create form";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fieldTypeOptions = [
    { type: "text" as FieldType, label: "Short Answer", icon: "T", description: "Students write text answer (Manual Grading)" },
    { type: "radio" as FieldType, label: "Multiple Choice", icon: "○", description: "Single correct answer (Auto-graded)" },
    { type: "checkbox" as FieldType, label: "Checkboxes", icon: "☑", description: "Multiple correct answers (Auto-graded)" },
    { type: "image_text" as FieldType, label: "Image + Text", icon: "🖼️", description: "Upload image + text answer (Manual Grading)" },
  ];

  const renderFieldTypeMenu = () => (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 absolute bottom-full mb-2 left-0 z-10 w-72">
      <div className="space-y-1">
        {fieldTypeOptions.map((option) => (
          <button
            key={option.type}
            type="button"
            onClick={() => addField(option.type)}
            className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded w-full text-left"
          >
            <span className="text-2xl">{option.icon}</span>
            <div className="flex-1">
              <div className="font-medium text-sm">{option.label}</div>
              <div className="text-xs text-gray-500">{option.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderAnswerAndMarks = (field: FormField) => {
    const isManualGrading = requiresManualGrading(field.type);

    if (isManualGrading) {
      return (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={field.marks || 1}
              onChange={(e) =>
                updateMarks(field.id, parseInt(e.target.value) || 0)
              }
              min="1"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
            />
          </div>
          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ This question requires manual grading by the teacher. No correct answer needed during creation.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={field.marks || 1}
              onChange={(e) =>
                updateMarks(field.id, parseInt(e.target.value) || 0)
              }
              min="1"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correct Answer <span className="text-red-500">*</span>
          </label>

          {field.type === "radio" && (
            <div className="space-y-2 bg-green-50 p-3 rounded-md">
              {field.options?.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`answer-${field.id}`}
                    value={option}
                    checked={field.correctAnswer === option}
                    onChange={(e) =>
                      updateCorrectAnswer(field.id, e.target.value)
                    }
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
                const answers = (field.correctAnswer as string[]) || [];
                return (
                  <label
                    key={index}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={option}
                      checked={answers.includes(option)}
                      onChange={(e) => {
                        const currentAnswers = [
                          ...((field.correctAnswer as string[]) || []),
                        ];
                        if (e.target.checked) {
                          updateCorrectAnswer(field.id, [
                            ...currentAnswers,
                            option,
                          ]);
                        } else {
                          updateCorrectAnswer(
                            field.id,
                            currentAnswers.filter((a) => a !== option),
                          );
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
        </div>
      </div>
    );
  };

  const renderField = (field: FormField) => {
    const isSelected = selectedFieldId === field.id;
    const isManualGrading = requiresManualGrading(field.type);

    return (
      <div
        key={field.id}
        className={`bg-white rounded-lg shadow-sm border-2 ${
          isSelected ? "border-blue-500" : "border-gray-200"
        } p-6 transition-all`}
        onClick={() => setSelectedFieldId(field.id)}
      >
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

        <div className="mt-4">
          {field.type === "text" && (
            <input
              type="text"
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              placeholder="Short answer text"
            />
          )}

          {(field.type === "radio" || field.type === "checkbox") && (
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  {field.type === "radio" && (
                    <input type="radio" disabled className="text-blue-600" />
                  )}
                  {field.type === "checkbox" && (
                    <input type="checkbox" disabled className="text-blue-600" />
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

          {field.type === "image_text" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Reference Image (Optional)
                </label>
                {!field.imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(field.id, file);
                      }}
                      className="hidden"
                      id={`image-upload-${field.id}`}
                    />
                    <label
                      htmlFor={`image-upload-${field.id}`}
                      className="cursor-pointer block"
                    >
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
                        Click to upload reference image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 2MB (Optional)
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="relative border rounded-lg p-2 bg-gray-50">
                    <img
                      src={field.imagePreview}
                      alt="Uploaded"
                      className="max-w-full h-auto rounded max-h-64 mx-auto"
                    />
                    {uploadingFieldId === field.id && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="text-white">Uploading to ImgBB...</div>
                      </div>
                    )}
                    {field.imageUrl && !uploadingFieldId && (
                      <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Uploaded ✓
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(field.id)}
                      className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions for Students
                </label>
                <textarea
                  value={field.imagePrompt || ""}
                  onChange={(e) =>
                    updateField(field.id, "imagePrompt", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe what students should look for in the image or what they need to answer..."
                />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-blue-50">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Student Preview:
                </p>
                {field.imagePreview && (
                  <img
                    src={field.imagePreview}
                    alt="Preview"
                    className="max-w-full h-auto rounded mb-3 max-h-48 mx-auto"
                  />
                )}
                {field.imagePrompt && (
                  <p className="text-sm text-gray-600 mb-3">
                    {field.imagePrompt}
                  </p>
                )}
                {!field.imagePreview && !field.imagePrompt && (
                  <p className="text-sm text-gray-400 italic">
                    Upload an image and add instructions to see preview
                  </p>
                )}
                <textarea
                  disabled
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  placeholder="Students will write their answer here..."
                />
              </div>
            </div>
          )}
        </div>

        {renderAnswerAndMarks(field)}
      </div>
    );
  };

  const renderPreviewField = (field: FormField) => (
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
          {field.marks} {field.marks === 1 ? "mark" : "marks"}
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

        {field.type === "image_text" && (
          <div className="space-y-4">
            {field.imagePreview && (
              <div className="border rounded-lg p-2">
                <img
                  src={field.imagePreview}
                  alt="Question reference"
                  className="max-w-full h-auto rounded"
                />
              </div>
            )}
            {field.imagePrompt && (
              <p className="text-sm text-gray-600">{field.imagePrompt}</p>
            )}
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your answer based on the image above..."
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto">
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
                placeholder="Enter class"
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
                placeholder="Enter subject"
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
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

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
            className="w-full text-base border-0 border-b-2 border-black focus:border-blue-500 focus:ring-0 outline-none px-0 py-1 resize-none"
            placeholder="Form description"
            rows={2}
          />
          {fields.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-right">
                <span className="text-sm font-medium text-gray-600">
                  Total Marks:{" "}
                </span>
                <span className="text-lg font-bold text-purple-600">
                  {calculateTotalMarks()}
                </span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {isPreviewMode ? (
            fields.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                No questions added yet. Switch to edit mode to add questions.
              </div>
            ) : (
              fields.map((field) => renderPreviewField(field))
            )
          ) : (
            <>
              {fields.map((field) => renderField(field))}
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
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md shadow-sm font-medium transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Saving..." : "Save Form"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}