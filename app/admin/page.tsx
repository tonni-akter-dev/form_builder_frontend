'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

export default function VisitsPage() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    axios.get('/visits').then(res => setCount(res.data.count));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Site Visits</h1>
      {count !== null ? (
        <p className="text-xl">Total visits: <span className="font-bold">{count}</span></p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}