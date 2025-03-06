'use client'

import React, { useState, useEffect } from 'react';

export default function Kd() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]:any = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('api/kd/'); // Replace with your API URL
        const jsonData = await res.json();
        setData(jsonData);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data to display.</p>;

  return (
    <div>
      <h1>Client-Side Data from API</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}