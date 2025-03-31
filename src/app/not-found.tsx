import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1>
        <span className="text-4xl font-bold text-gray-800">404</span> - Page Not Found
      </h1>
      <Link href={'/'} className="mt-4 text-blue-500 hover:underline">
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Go to Home
        </button>
      </Link>
    </main>
  );
}
