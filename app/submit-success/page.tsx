import Link from "next/link";

export default function SubmitSuccess() {
  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h1>
      <p>Your response has been recorded.</p>
      <Link href="/" className="mt-4 inline-block text-blue-600 underline">Go to home</Link>
    </div>
  );
}