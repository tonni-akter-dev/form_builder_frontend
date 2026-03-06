"use client";

import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

export default function FormSuccessPage() {
  const router = useRouter();
  const { id } = useParams();
  // const [countdown, setCountdown] = useState(5);

  // useEffect(() => {
  //   // Countdown timer
  //   const timer = setInterval(() => {
  //     setCountdown((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(timer);
  //         router.push("/");
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, [router]);

  return (
    <div className="min-h-screen bg-[#F0EBF8] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header with success icon */}
          <div className="px-8 pt-8 pb-4 text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-4">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-normal text-gray-800">Thank You!</h1>
            <p className="mt-1 text-sm text-gray-500">
              Your response has been recorded
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100"></div>

          {/* Content */}
          <div className="px-8 py-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-6">
                Your submission has been successfully saved. The form owner will
                review your response.
              </p>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/forms/${id}`)}
                  className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-orange-400 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                    />
                  </svg>
                  Submit Another Response
                </button>

                {/* <button
                  onClick={() => router.push("/")}
                  className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go to Homepage
                </button> */}
              </div>

              {/* Countdown indicator */}
              {/* <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Redirecting to homepage in {countdown} seconds...</span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Footer with Google Forms branding */}
      </div>
    </div>
  );
}
