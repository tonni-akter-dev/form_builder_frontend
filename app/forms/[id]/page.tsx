/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
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
  required: boolean;
  correctAnswer?: any;
  marks?: number;
  imageUrl?: string;
  imagePrompt?: string;
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

interface FileAttachment {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
  uploadStatus?: "pending" | "uploading" | "success" | "error";
  uploadedUrl?: string;
}

interface FormData {
  [key: string]: any;
}

interface AnswerResult {
  fieldId: string;
  fieldLabel: string;
  userAnswer: any;
  correctAnswer: any;
  isCorrect: boolean;
  marksAwarded: number;
  totalMarks: number;
  needsManualGrading: boolean;
  fileUrls?: string[];
}

const IMGBB_API_KEY = "4e40960ee867d0115a4c0049f45f4572";

const PublicFormPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [files, setFiles] = useState<{ [key: string]: FileAttachment[] }>({});

  // Exam state
  const [examStarted, setExamStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
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
    pendingManualGrading: boolean;
  } | null>(null);

  // Check if user has already submitted
  useEffect(() => {
    const checkExistingSubmission = async () => {
      if (!id) return;

      try {
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

        const initialData: FormData = {};
        response.data.fields.forEach((field: FormField) => {
          if (field.type === "checkbox") {
            initialData[field._id] = [];
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

  const needsManualGrading = (fieldType: string): boolean => {
    // Short answer (text) and image_text require manual grading
    return fieldType === "text" || fieldType === "image_text";
  };

  const checkAnswer = (
    field: FormField,
    userAnswer: any,
  ): { isCorrect: boolean; marksAwarded: number } => {
    if (needsManualGrading(field.type)) {
      return { isCorrect: false, marksAwarded: 0 };
    }

    const correctAnswer = field.correctAnswer;
    const marks = field.marks || 1;

    if (!correctAnswer || correctAnswer === "") {
      return { isCorrect: true, marksAwarded: marks };
    }

    switch (field.type) {
      case "radio":
        const isRadioCorrect = userAnswer === correctAnswer;
        return {
          isCorrect: isRadioCorrect,
          marksAwarded: isRadioCorrect ? marks : 0,
        };

      case "checkbox":
        if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
          const userSorted = [...userAnswer].sort();
          const correctSorted = [...correctAnswer].sort();
          const isCheckboxCorrect =
            JSON.stringify(userSorted) === JSON.stringify(correctSorted);
          return {
            isCorrect: isCheckboxCorrect,
            marksAwarded: isCheckboxCorrect ? marks : 0,
          };
        }
        return { isCorrect: false, marksAwarded: 0 };

      default:
        return { isCorrect: false, marksAwarded: 0 };
    }
  };

  // Upload single file to ImgBB
  const uploadFileToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("key", IMGBB_API_KEY);

    try {
      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

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

  // Upload all files for a field
  const uploadFieldFiles = async (
    fieldId: string,
    attachments: FileAttachment[],
  ): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const attachment of attachments) {
      try {
        setFiles((prev) => ({
          ...prev,
          [fieldId]: prev[fieldId].map((f) =>
            f.id === attachment.id ? { ...f, uploadStatus: "uploading" } : f,
          ),
        }));

        const url = await uploadFileToImgBB(attachment.file);
        uploadedUrls.push(url);

        setFiles((prev) => ({
          ...prev,
          [fieldId]: prev[fieldId].map((f) =>
            f.id === attachment.id
              ? { ...f, uploadStatus: "success", uploadedUrl: url }
              : f,
          ),
        }));
      } catch (error) {
        console.error(`Failed to upload ${attachment.name}:`, error);
        setFiles((prev) => ({
          ...prev,
          [fieldId]: prev[fieldId].map((f) =>
            f.id === attachment.id ? { ...f, uploadStatus: "error" } : f,
          ),
        }));
        throw new Error(`Failed to upload ${attachment.name}`);
      }
    }

    return uploadedUrls;
  };

  const startExam = () => {
    if (!form) return;

    const submittedKey = `submitted_${id}`;
    const hasSubmitted = localStorage.getItem(submittedKey);

    if (hasSubmitted === "true") {
      toast.error("You have already submitted this exam");
      setExamSubmitted(true);
      return;
    }

    setExamStarted(true);
    setShowStartScreen(false);
    setTimeRemaining(form.duration * 60);

    toast.success(
      `Exam started! You have ${form.duration} minutes to complete.`,
    );
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

  const validateField = (
    field: FormField,
    value: any,
    attachments: FileAttachment[],
  ): string => {
    if (field.required) {
      if (field.type === "text" || field.type === "image_text") {
        if (attachments.length === 0 && (!value || value === "")) {
          return "Please provide an answer or upload a file";
        }
      } else {
        if (value === undefined || value === null || value === "") {
          return "This field is required";
        }
        if (Array.isArray(value) && value.length === 0) {
          return "This field is required";
        }
      }
    }
    return "";
  };

  const validateForm = (): boolean => {
    if (!form) return false;

    const newErrors: { [key: string]: string } = {};
    form.fields.forEach((field) => {
      const value = formData[field._id];
      const attachments = files[field._id] || [];
      const error = validateField(field, value, attachments);
      if (error) {
        newErrors[field._id] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      const newErrors = { ...errors };
      delete newErrors[fieldId];
      setErrors(newErrors);
    }
  };

  const handleFileUpload = (fieldId: string, filesList: FileList | null) => {
    if (!filesList) return;

    const newFiles: FileAttachment[] = [];
    const maxFiles = 10;

    for (let i = 0; i < Math.min(filesList.length, maxFiles); i++) {
      const file = filesList[i];
      const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      newFiles.push({
        id: fileId,
        file: file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadStatus: "pending",
      });
    }

    setFiles((prev) => ({
      ...prev,
      [fieldId]: [...(prev[fieldId] || []), ...newFiles],
    }));

    if (errors[fieldId]) {
      const newErrors = { ...errors };
      delete newErrors[fieldId];
      setErrors(newErrors);
    }

    toast.success(`${newFiles.length} file(s) added`);
  };

  const removeFile = (fieldId: string, fileId: string) => {
    setFiles((prev) => {
      const fieldFiles = prev[fieldId] || [];
      const fileToRemove = fieldFiles.find((f) => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return {
        ...prev,
        [fieldId]: fieldFiles.filter((f) => f.id !== fileId),
      };
    });
    toast.info("File removed");
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
      // Upload all files to ImgBB first
      const uploadedFileUrls: { [key: string]: string[] } = {};

      for (const [fieldId, attachments] of Object.entries(files)) {
        if (attachments && attachments.length > 0) {
          toast.info(`Uploading ${attachments.length} file(s)...`);
          const urls = await uploadFieldFiles(fieldId, attachments);
          uploadedFileUrls[fieldId] = urls;
        }
      }

      // Prepare answers for submission - include file URLs
      const formattedAnswers = form.fields.map((field) => {
        const userAnswer = formData[field._id] || "";
        const needsManualGradingFlag = needsManualGrading(field.type);
        const fileUrls = uploadedFileUrls[field._id] || [];

        return {
          fieldId: field._id,
          fieldLabel: field.label,
          value: userAnswer,
          needsManualGrading: needsManualGradingFlag,
          fileUrls: fileUrls,
        };
      });

      const token = localStorage.getItem("token");

      // Send as FormData to handle files
      const formDataToSend = new FormData();
      formDataToSend.append("formId", id as string);
      formDataToSend.append("answers", JSON.stringify(formattedAnswers));
      formDataToSend.append(
        "timeSpent",
        String(form.duration * 60 - timeRemaining),
      );

      // Append files
      Object.entries(files).forEach(([fieldId, fileList]) => {
        fileList.forEach((file, index) => {
          formDataToSend.append(`files_${fieldId}_${index}`, file.file);
        });
      });

      const response = await axios.post("/responses", formDataToSend, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "multipart/form-data",
        },
      });

      const submittedKey = `submitted_${id}`;
      localStorage.setItem(submittedKey, "true");

      // Get results from response or calculate
      const responseData = response.data;
      const hasManualGradingFlag =
        responseData.response?.hasManualGrading ||
        formattedAnswers.some((a) => a.needsManualGrading);

      // Calculate results for display
      let totalScore = 0;
      let totalMarks = 0;
      const answerResults: AnswerResult[] = [];

      form.fields.forEach((field) => {
        const userAnswer = formData[field._id] || "";
        const marks = field.marks || 1;
        totalMarks += marks;

        if (needsManualGrading(field.type)) {
          answerResults.push({
            fieldId: field._id,
            fieldLabel: field.label,
            userAnswer: userAnswer,
            correctAnswer: field.correctAnswer,
            isCorrect: false,
            marksAwarded: 0,
            totalMarks: marks,
            needsManualGrading: true,
            fileUrls: uploadedFileUrls[field._id] || [],
          });
        } else {
          const { isCorrect, marksAwarded } = checkAnswer(field, userAnswer);
          totalScore += marksAwarded;
          answerResults.push({
            fieldId: field._id,
            fieldLabel: field.label,
            userAnswer: userAnswer,
            correctAnswer: field.correctAnswer,
            isCorrect: isCorrect,
            marksAwarded: marksAwarded,
            totalMarks: marks,
            needsManualGrading: false,
          });
        }
      });

      const percentage = totalMarks > 0 ? (totalScore / totalMarks) * 100 : 0;

      setResults({
        totalScore,
        totalMarks,
        percentage,
        answers: answerResults,
        passed: percentage >= 40,
        pendingManualGrading: hasManualGradingFlag,
      });

      setExamSubmitted(true);
      setShowResults(true);

      const message = hasManualGradingFlag
        ? "Exam submitted! Your answers and files have been saved. Results will be available after teacher review."
        : isAutoSubmit
          ? "Time's up! Exam submitted automatically!"
          : "Exam submitted successfully!";

      toast.success(message);
    } catch (err: any) {
      console.error("Error submitting form:", err);
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to submit form";

      if (err.response?.status === 401) {
        toast.error("Please login to submit the exam");
        router.push("/login");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Render short answer field with file upload
  const renderShortAnswerField = (field: FormField) => {
    const value = (formData[field._id] as string) || "";
    const error = errors[field._id];
    const attachments = files[field._id] || [];

    return (
      <div className="mb-6">
        <div className="mb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <span className="text-base font-medium text-gray-900">
                {field.label}
              </span>
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            {field.marks && (
              <span className="text-sm text-orange-600 font-medium">
                {field.marks} {field.marks === 1 ? "mark" : "marks"} (Manual
                Grading)
              </span>
            )}
          </div>
          {field.description && (
            <p className="text-sm text-gray-500 mt-1">{field.description}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Answer
          </label>
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field._id, e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
              error && !attachments.length && !value
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Write your answer here..."
            disabled={examSubmitted}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Files (Optional - Images, Documents, etc.)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload files</span>
                  <input
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={(e) =>
                      handleFileUpload(field._id, e.target.files)
                    }
                    disabled={examSubmitted}
                    accept="image/*,application/pdf,.doc,.docx,.txt"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                Files will be uploaded to ImgBB cloud storage (max 10 files)
              </p>
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Uploaded Files ({attachments.length}):
              </p>
              <div className="grid grid-cols-2 gap-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="relative border rounded-lg p-2 bg-gray-50"
                  >
                    {attachment.type.startsWith("image/") ? (
                      <img
                        src={attachment.preview}
                        alt={attachment.name}
                        className="w-full h-24 object-cover rounded mb-1"
                      />
                    ) : (
                      <div className="w-full h-24 flex items-center justify-center bg-gray-200 rounded mb-1">
                        <svg
                          className="w-8 h-8 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                        </svg>
                      </div>
                    )}
                    <p className="text-xs text-gray-600 truncate">
                      {attachment.name}
                    </p>
                    {attachment.uploadStatus === "uploading" && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                        <div className="text-white text-xs">Uploading...</div>
                      </div>
                    )}
                    {attachment.uploadStatus === "success" && (
                      <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                        ✓
                      </div>
                    )}
                    {attachment.uploadStatus === "error" && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center rounded">
                        <div className="text-white text-xs">Failed</div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(field._id, attachment.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      disabled={
                        examSubmitted || attachment.uploadStatus === "uploading"
                      }
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
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
          )}
        </div>

        {error && !attachments.length && !value && (
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
        )}
      </div>
    );
  };

  // Render image_text field with multiple file upload support
  const renderImageTextField = (field: FormField) => {
    const value = (formData[field._id] as string) || "";
    const error = errors[field._id];
    const attachments = files[field._id] || [];

    return (
      <div className="mb-6">
        <div className="mb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <span className="text-base font-medium text-gray-900">
                {field.label}
              </span>
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            {field.marks && (
              <span className="text-sm text-orange-600 font-medium">
                {field.marks} {field.marks === 1 ? "mark" : "marks"} (Manual
                Grading)
              </span>
            )}
          </div>
          {field.description && (
            <p className="text-sm text-gray-500 mt-1">{field.description}</p>
          )}
        </div>

        {field.imageUrl && (
          <div className="mt-3 mb-4">
            <div className="border rounded-lg p-3 bg-gray-50">
              <p className="text-xs text-gray-500 mb-2">Reference Image:</p>
              <img
                src={field.imageUrl}
                alt={field.label}
                className="max-w-full h-auto rounded max-h-96 mx-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        )}

        {field.imagePrompt && (
          <div className="mt-3 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Instruction:</span>{" "}
              {field.imagePrompt}
            </p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Answer (Text)
          </label>
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field._id, e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
              error && !attachments.length && !value
                ? "border-red-300 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Write your answer here..."
            disabled={examSubmitted}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Files (Images will be uploaded to ImgBB)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload files</span>
                  <input
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={(e) =>
                      handleFileUpload(field._id, e.target.files)
                    }
                    disabled={examSubmitted}
                    accept="image/*,application/pdf,.doc,.docx,.txt"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                Files will be uploaded to ImgBB cloud storage
              </p>
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Uploaded Files ({attachments.length}):
              </p>
              <div className="grid grid-cols-2 gap-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="relative border rounded-lg p-2 bg-gray-50"
                  >
                    {attachment.type.startsWith("image/") ? (
                      <img
                        src={attachment.preview}
                        alt={attachment.name}
                        className="w-full h-24 object-cover rounded mb-1"
                      />
                    ) : (
                      <div className="w-full h-24 flex items-center justify-center bg-gray-200 rounded mb-1">
                        <svg
                          className="w-8 h-8 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                        </svg>
                      </div>
                    )}
                    <p className="text-xs text-gray-600 truncate">
                      {attachment.name}
                    </p>
                    {attachment.uploadStatus === "uploading" && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                        <div className="text-white text-xs">Uploading...</div>
                      </div>
                    )}
                    {attachment.uploadStatus === "success" && (
                      <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                        ✓
                      </div>
                    )}
                    {attachment.uploadStatus === "error" && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center rounded">
                        <div className="text-white text-xs">Failed</div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(field._id, attachment.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      disabled={
                        examSubmitted || attachment.uploadStatus === "uploading"
                      }
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
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
          )}
        </div>

        {error && !attachments.length && !value && (
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
        )}
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
            <span
              className={`text-sm font-medium ${needsManualGrading(field.type) ? "text-orange-600" : "text-purple-600"}`}
            >
              {field.marks} {field.marks === 1 ? "mark" : "marks"}
              {needsManualGrading(field.type) && " (Manual)"}
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

    if (field.type === "text") {
      return renderShortAnswerField(field);
    }

    if (field.type === "image_text") {
      return renderImageTextField(field);
    }

    switch (field.type) {
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
                    onChange={(e) => {
                      const currentValues = (value as string[]) || [];
                      if (e.target.checked) {
                        handleInputChange(field._id, [
                          ...currentValues,
                          option,
                        ]);
                      } else {
                        handleInputChange(
                          field._id,
                          currentValues.filter((v) => v !== option),
                        );
                      }
                    }}
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

      default:
        return null;
    }
  };

  // Render results screen
  // Render results screen
  const renderResults = () => {
    if (!results) return null;

    const getScoreColor = () => {
      if (results.pendingManualGrading) return "text-yellow-600";
      if (results.percentage >= 70) return "text-green-600";
      if (results.percentage >= 40) return "text-yellow-600";
      return "text-red-600";
    };

    const getScoreDisplay = () => {
      if (results.pendingManualGrading) {
        return "Pending Review";
      }
      return `${results.percentage.toFixed(1)}%`;
    };

    const getResultBadge = () => {
      if (results.pendingManualGrading) {
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            PENDING REVIEW
          </div>
        );
      }
      if (results.passed) {
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            PASSED
          </div>
        );
      }
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          FAILED
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-[#F0EBF8] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Exam Results
              </h1>
              <p className="text-gray-600">{form?.title}</p>
            </div>

            {results.pendingManualGrading && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-yellow-800">
                    Some questions require manual grading by the teacher. Your
                    final score will be updated once the teacher reviews your
                    submissions.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-4xl font-bold ${getScoreColor()}`}>
                  {getScoreDisplay()}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {results.pendingManualGrading
                    ? "Status"
                    : "Auto-Graded Score"}
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-4xl font-bold text-blue-600">
                  {results.totalScore} / {results.totalMarks}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {results.pendingManualGrading
                    ? "Current Marks (Partial)"
                    : "Auto-Graded Marks"}
                </div>
              </div>
            </div>

            <div className="flex justify-center mb-4">{getResultBadge()}</div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push("/user/dashboard")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Print Results
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Detailed Answers
            </h2>
            <div className="space-y-4">
              {results.answers.map((answer, index) => (
                <div
                  key={answer.fieldId}
                  className={`border rounded-lg p-4 ${
                    answer.needsManualGrading
                      ? "border-yellow-200 bg-yellow-50"
                      : answer.isCorrect
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
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
                    <div
                      className={`text-sm font-medium ${
                        answer.needsManualGrading
                          ? "text-yellow-600"
                          : answer.isCorrect
                            ? "text-green-600"
                            : "text-red-600"
                      }`}
                    >
                      {answer.needsManualGrading
                        ? "⏳ Pending Review"
                        : answer.isCorrect
                          ? "✓ Correct"
                          : "✗ Incorrect"}
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">
                        Your Answer:{" "}
                      </span>
                      <span className="text-gray-600">
                        {answer.userAnswer === null ||
                        answer.userAnswer === undefined ||
                        answer.userAnswer === ""
                          ? "(No answer provided)"
                          : answer.userAnswer}
                      </span>
                    </div>

                    {answer.fileUrls && answer.fileUrls.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">
                          Uploaded Files:{" "}
                        </span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {answer.fileUrls.map((url, idx) => (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              File {idx + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {!answer.isCorrect &&
                      answer.correctAnswer &&
                      !answer.needsManualGrading && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Correct Answer:{" "}
                          </span>
                          <span className="text-green-700">
                            {Array.isArray(answer.correctAnswer)
                              ? answer.correctAnswer.join(", ")
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
          <p className="mt-2 text-gray-600">{`The exam you're looking for doesn't exist or has been removed.`}</p>
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
            You have already submitted this exam. Multiple submissions are not
            allowed.
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
            <h1 className="text-2xl font-bold text-gray-800 mt-4">
              {form.title}
            </h1>
            <p className="text-gray-600 mt-2">{form.description}</p>
          </div>

          <div className="border-t border-b border-gray-200 py-4 my-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subject:</span>
                <span className="font-medium text-gray-800">
                  {form.subject}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Class:</span>
                <span className="font-medium text-gray-800">
                  {form.className}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium text-orange-600">
                  {form.duration} minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Questions:</span>
                <span className="font-medium text-gray-800">
                  {form.fields.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Marks:</span>
                <span className="font-medium text-purple-600">
                  {form.totalMarks ||
                    form.fields.reduce((sum, f) => sum + (f.marks || 1), 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-yellow-800 mb-2">
              Important Instructions:
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>Once started, the timer cannot be paused</li>
              <li>The exam will auto-submit when time runs out</li>
              <li>Each student can only submit once</li>
              <li>Make sure you have a stable internet connection</li>
              <li>Do not refresh the page during the exam</li>
              <li>
                For short answer and image-based questions, you can upload
                multiple files
              </li>
              <li>Files will be uploaded to ImgBB cloud storage</li>
              <li>Manual grading questions will be reviewed by the teacher</li>
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
        <div className="sticky top-0 z-10 mb-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {form.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {form.subject} - {form.className}
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`text-3xl font-mono font-bold ${getTimeColor()}`}
                >
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

        <form onSubmit={handleSubmit}>
          <div className="mt-3 space-y-3">
            {form.fields?.map((field, index) => (
              <div
                key={field._id}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex items-start gap-2">
                  <p className="text-lg font-bold text-black">{index + 1}.</p>
                  <div className="flex-1">{renderField(field)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to submit? You cannot change your answers after submission.",
                  )
                ) {
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
