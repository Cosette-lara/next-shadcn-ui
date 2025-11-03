// src/app/dashboard/layout.tsx
"use client";

import React from "react";
import { DashboardProvider } from "@/components/DashboardContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardProvider>{children}</DashboardProvider>;
}
