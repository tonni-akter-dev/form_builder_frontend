/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'radio' | 'select' | 'checkbox' | 
        'checkbox_grid' | 'multiple_choice_grid' | 'rating' | 'date' | 'time' | 'file';
  required: boolean;
  options?: string[];
  rows?: string[];
  columns?: string[];
}

interface FormType {
  _id: string;
  title: string;
  description?: string;
  fields: FormField[];
  status: 'draft' | 'published' | 'closed';
}

type FormValues = {
  [key: string]: any;
};

// Mock form data for design showcase
const mockForm: FormType = {
  _id: '1',
  title: 'Customer Feedback Survey',
  description: 'We value your feedback! Please take a moment to share your thoughts about our service.',
  status: 'published',
  fields: [
    {
      id: '1',
      label: 'Full Name',
      type: 'text',
      required: true,
    },
    {
      id: '2',
      label: 'Email Address',
      type: 'text',
      required: true,
    },
    {
      id: '3',
      label: 'Age',
      type: 'number',
      required: false,
    },
    {
      id: '4',
      label: 'How satisfied are you with our service?',
      type: 'rating',
      required: true,
    },
    {
      id: '5',
      label: 'Which features do you use most?',
      type: 'checkbox',
      required: false,
      options: ['Dashboard', 'Analytics', 'Reports', 'Settings', 'API Access'],
    },
    {
      id: '6',
      label: 'How likely are you to recommend us?',
      type: 'radio',
      required: true,
      options: ['Very Likely', 'Likely', 'Neutral', 'Unlikely', 'Very Unlikely'],
    },
    {
      id: '7',
      label: 'Subscription Plan',
      type: 'select',
      required: true,
      options: ['Free', 'Basic', 'Pro', 'Enterprise'],
    },
    {
      id: '8',
      label: 'Additional Comments',
      type: 'textarea',
      required: false,
    },
    {
      id: '9',
      label: 'Preferred Contact Time',
      type: 'time',
      required: false,
    },
    {
      id: '10',
      label: 'Follow-up Date',
      type: 'date',
      required: false,
    },
    {
      id: '11',
      label: 'Upload Supporting Document',
      type: 'file',
      required: false,
    },
    {
      id: '12',
      label: 'Rate different aspects of our service',
      type: 'multiple_choice_grid',
      required: true,
      rows: ['Quality', 'Speed', 'Support', 'Price', 'Features'],
      columns: ['Excellent', 'Good', 'Average', 'Poor'],
    },
    {
      id: '13',
      label: 'Select all that apply',
      type: 'checkbox_grid',
      required: false,
      rows: ['Mobile App', 'Web Platform', 'Desktop App', 'API'],
      columns: ['Used Daily', 'Used Weekly', 'Used Monthly', 'Never Used'],
    },
  ],
};

export default function FormDesignShowcase() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useState<FormType>(mockForm);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    // Simulate submission
    console.log('Form data:', data);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Form submitted successfully! (This is a demo)');
    }, 2000);
  };

  // Render a single field
  const renderField = (field: FormField, idx: number) => {
    const fieldName = field.label;
    const hasError = errors[fieldName];

    return (
      <div key={field.id || idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-3">
          <label className="block text-base font-medium text-gray-900">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {/* TEXT INPUT */}
          {field.type === 'text' && (
            <input
              type="text"
              {...register(fieldName, {
                required: field.required ? 'This field is required' : false,
              })}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                hasError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your answer"
            />
          )}

          {/* NUMBER INPUT */}
          {field.type === 'number' && (
            <input
              type="number"
              {...register(fieldName, {
                required: field.required ? 'This field is required' : false,
                valueAsNumber: true,
              })}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                hasError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter a number"
            />
          )}

          {/* TEXTAREA */}
          {field.type === 'textarea' && (
            <textarea
              {...register(fieldName, {
                required: field.required ? 'This field is required' : false,
              })}
              rows={4}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                hasError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your answer"
            />
          )}

          {/* DATE INPUT */}
          {field.type === 'date' && (
            <input
              type="date"
              {...register(fieldName, {
                required: field.required ? 'This field is required' : false,
              })}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                hasError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          )}

          {/* TIME INPUT */}
          {field.type === 'time' && (
            <input
              type="time"
              {...register(fieldName, {
                required: field.required ? 'This field is required' : false,
              })}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                hasError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          )}

          {/* FILE INPUT */}
          {field.type === 'file' && (
            <input
              type="file"
              {...register(fieldName, {
                required: field.required ? 'This field is required' : false,
              })}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                hasError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          )}

          {/* SELECT/DROPDOWN */}
          {field.type === 'select' && field.options && (
            <select
              {...register(fieldName, {
                required: field.required ? 'Please select an option' : false,
              })}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                hasError ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Choose an option</option>
              {field.options.map((option, optIdx) => (
                <option key={optIdx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          {/* RADIO BUTTONS */}
          {field.type === 'radio' && field.options && (
            <div className="space-y-3">
              {field.options.map((option, optIdx) => (
                <label key={optIdx} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                  <input
                    type="radio"
                    value={option}
                    {...register(fieldName, {
                      required: field.required ? 'Please select an option' : false,
                    })}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* CHECKBOXES */}
          {field.type === 'checkbox' && field.options && (
            <div className="space-y-3">
              {field.options.map((option, optIdx) => (
                <label key={optIdx} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                  <input
                    type="checkbox"
                    value={option}
                    {...register(`${fieldName}.${optIdx}`)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* RATING */}
          {field.type === 'rating' && (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue(fieldName, star)}
                  className={`text-4xl transition-colors ${
                    watch(fieldName) >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                  } focus:outline-none`}
                >
                  ★
                </button>
              ))}
              <input
                type="hidden"
                {...register(fieldName, {
                  required: field.required ? 'Please provide a rating' : false,
                })}
              />
            </div>
          )}

          {/* CHECKBOX GRID */}
          {field.type === 'checkbox_grid' && field.rows && field.columns && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 bg-gray-50 text-left text-sm font-medium"></th>
                    {field.columns?.map((col, colIdx) => (
                      <th key={colIdx} className="border border-gray-300 p-2 bg-gray-50 text-left text-sm font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {field.rows?.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      <td className="border border-gray-300 p-2 font-medium text-sm bg-gray-50">{row}</td>
                      {field.columns?.map((_, colIdx) => (
                        <td key={colIdx} className="border border-gray-300 p-2 text-center">
                          <input
                            type="checkbox"
                            {...register(`${fieldName}_${rowIdx}_${colIdx}`)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MULTIPLE CHOICE GRID */}
          {field.type === 'multiple_choice_grid' && field.rows && field.columns && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 bg-gray-50 text-left text-sm font-medium"></th>
                    {field.columns?.map((col, colIdx) => (
                      <th key={colIdx} className="border border-gray-300 p-2 bg-gray-50 text-left text-sm font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {field.rows.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      <td className="border border-gray-300 p-2 font-medium text-sm bg-gray-50">{row}</td>
                      {field.columns?.map((col, colIdx) => (
                        <td key={colIdx} className="border border-gray-300 p-2 text-center">
                          <input
                            type="radio"
                            {...register(`${fieldName}_${rowIdx}`)}
                            value={col}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {hasError && (
            <p className="text-red-500 text-sm mt-1">
              {errors[fieldName]?.message as string}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-normal text-gray-900 mb-2">{form.title}</h1>
          {form.description && (
            <p className="text-base text-gray-600">{form.description}</p>
          )}
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {form.fields.map((field, idx) => renderField(field, idx))}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Form'
              )}
            </button>
          </div>
        </form>

        {/* Design Notes */}
    
      </div>
    </div>
  );
}