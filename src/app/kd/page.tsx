"use client";

import React, { useState, useEffect } from "react";
import { Select } from "@geist-ui/react";

export default function Kd() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]: any = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("api/kd/"); // Replace with your API URL
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

  if (!data || data.length === 0) return <p>No data available.</p>;
  const handler = (val: any) => console.log("Selected:", val);


  return (
    <div>
      <h1>Client-Side Data from API</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Select placeholder="Choose one" onChange={handler}>
        {data.map((item) => (
          <Select.Option key={item.kd_id} value={item.id}>
            {item.name + " - " + item.crebo}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
}
