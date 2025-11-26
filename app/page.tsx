'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function HomePage() {
  const [seriesId, setSeriesId] = useState("");
  const router = useRouter();


  const submit = () => {
    if (seriesId.trim()) router.push(`/chart?series=${seriesId}`);
  };


  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Enter a FRED Series ID</h1>
      <input
        className="border w-full p-2 rounded"
        placeholder="e.g. GDP, CPIAUCSL, DGS10"
        value={seriesId}
        onChange={(e) => setSeriesId(e.target.value)}
      />
      <button
        onClick={submit}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        View Chart
      </button>
    </div>
  );
}
