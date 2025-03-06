"use client";

import React, { useState, useEffect } from "react";
import { Select } from "@geist-ui/react";

export default function Kd() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]: any = useState(null);

  const [selectedData, setSelectedData] = useState<any>(null); // Data to be fetched on select change
  const [loadingSelected, setLoadingSelected] = useState(false); // Loading state for the second fetch
  const [errorSelected, setErrorSelected]: any = useState(null); // Error for the second fetch


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

   // Fetch the second data based on the selected option
   const fetchSelectedData = async (value: string) => {
    setLoadingSelected(true);
    setErrorSelected(null);
    try {
      const res = await fetch(`/api/kd/${value}`); // API URL for selected data
      const jsonData = await res.json();
      setSelectedData(jsonData);
    } catch (err: any) {
      setErrorSelected(err);
    } finally {
      setLoadingSelected(false);
    }
  };

  if (!data || data.length === 0) return <p>No data available.</p>;

  const handleSelectChange = (val: any) => {
    console.log("Selected:", val);
    fetchSelectedData(val); // Trigger the second fetch when selection changes
  };

  const emptyHandler = () => console.log("Empty handler");

  return (
    <div>
      <h1>Client-Side Data from API</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{JSON.stringify(selectedData, null, 2)}</pre>
      <Select placeholder="Choose one" onChange={handleSelectChange}>
        {data.map((item) => (
          <Select.Option key={item.kd_id} value={item.kd_id}>
            {item.name + " - " + item.crebo}
          </Select.Option>
        ))}
      </Select>
        {/* Display additional data based on the selected option */}
        {loadingSelected && <p>Loading selected data...</p>}
      {errorSelected && <p>Error fetching selected data: {errorSelected.message}</p>}
      {selectedData && (
        <div>
          <h3>Details for selected option:</h3>
          <pre>{JSON.stringify(selectedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
