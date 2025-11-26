import "./globals.css";
import { ReactNode } from "react";


export const metadata = {
title: "FRED Time Series Visualizer",
description: "Visualize economic time series from the FRED API",
};


export default function RootLayout({ children }: { children: ReactNode }) {
return (
<html lang="en">
<body className="min-h-screen bg-gray-50 text-gray-900">
<header className="p-4 bg-blue-600 text-white font-bold text-xl">
FRED Time Series Viewer
</header>
<main className="p-4">{children}</main>
</body>
</html>
);
}
