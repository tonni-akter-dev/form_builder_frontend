/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { toast } from 'react-toastify';

interface ImportResult {
  success: boolean;
  message: string;
  imported: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
    data: any;
  }>;
  fieldMapping: string[];
  totalRows: number;
}

export default function BulkImportPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params?.id as string;

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    setPreviewData([]);
    setResult(null);
  };

  const handlePreview = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/upload/preview', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setPreviewData(res.data.preview || []);
      toast.success(`File loaded: ${res.data.totalRows} rows found`);
    } catch (err: any) {
      console.error('Preview error:', err);
      toast.error(err.response?.data?.error || 'Failed to preview file');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    if (!confirm(`Are you sure you want to import this data as responses for this form?`)) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setImporting(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/bulk-import/${formId}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setResult(res.data);
      
      if (res.data.imported > 0) {
        toast.success(`Successfully imported ${res.data.imported} responses!`);
      }
      
      if (res.data.failed > 0) {
        toast.warning(`${res.data.failed} rows failed to import`);
      }
    } catch (err: any) {
      console.error('Import error:', err);
      toast.error(err.response?.data?.error || 'Failed to import data');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center space-x-4">
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
          <h1 className="text-2xl font-bold text-gray-900">
            Bulk Import Responses
          </h1>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-blue-700">
                <strong>CSV Format Instructions:</strong> Your CSV file should have column headers that match your form field labels. 
                Each row will be imported as a separate response.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">1. Select File</h2>
          
          <div className="space-y-4">
            <div>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-2 text-sm text-gray-500">
                Supported formats: CSV, Excel (.xlsx, .xls)
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handlePreview}
                disabled={loading || !file}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Loading...' : 'Preview File'}
              </button>

              {previewData.length > 0 && (
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {importing ? 'Importing...' : 'Import Data'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {previewData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">2. File Preview (First 5 Rows)</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(previewData[0]).map((key) => (
                      <th
                        key={key}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val: any, colIdx) => (
                        <td key={colIdx} className="px-4 py-2 text-sm text-gray-900 border">
                          {val !== null && val !== undefined
                            ? String(val).substring(0, 50) + (String(val).length > 50 ? '...' : '')
                            : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Total rows in file: {previewData.length === 5 ? 'More than 5' : previewData.length}
            </p>
          </div>
        )}

        {/* Import Results */}
        {result && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">3. Import Results</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{result.imported}</p>
                <p className="text-sm text-green-800">Successfully Imported</p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{result.failed}</p>
                <p className="text-sm text-yellow-800">Failed Rows</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{result.totalRows}</p>
                <p className="text-sm text-blue-800">Total Rows</p>
              </div>
            </div>

            {result.fieldMapping && result.fieldMapping.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Detected Columns:</strong>{' '}
                  {result.fieldMapping.join(', ')}
                </p>
              </div>
            )}

            {result.errors && result.errors.length > 0 && (
              <div>
                <h3 className="font-medium text-red-600 mb-2 flex items-center">
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Errors ({result.errors.length})
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-red-200">
                    <thead className="bg-red-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-red-800">Row</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-red-800">Error</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-red-800">Data Preview</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-red-200">
                      {result.errors.slice(0, 5).map((error, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm text-red-700">{error.row}</td>
                          <td className="px-4 py-2 text-sm text-red-700">{error.error}</td>
                          <td className="px-4 py-2 text-sm text-red-700">
                            {error.data ? JSON.stringify(error.data).substring(0, 30) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.errors.length > 5 && (
                    <p className="p-2 text-sm text-red-600 border-t border-red-200">
                      ... and {result.errors.length - 5} more errors
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => router.push(`/admin/forms/${formId}/responses`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View All Responses
              </button>
              <button
                onClick={() => {
                  setFile(null);
                  setPreviewData([]);
                  setResult(null);
                  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                  if (fileInput) fileInput.value = '';
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Import Another File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}