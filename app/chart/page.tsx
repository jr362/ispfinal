'use client';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";


interface DataPoint {
    date: string;
    value: number;
}


export default function ChartPage() {
    const params = useSearchParams();
    const series = params.get("series");
    const [data, setData] = useState<DataPoint[]>([]);


    useEffect(() => {
        if (!series) return;
        fetch(`/api/series/${series}`)
        .then(res => res.json())
        .then(setData)
        .catch(console.error);
    }, [series]);


    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold">Series: {series}</h1>


            {data.length > 0 ? (
                <LineChart width={900} height={400} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
