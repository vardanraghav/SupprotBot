"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent p-4">
      <Card className="w-full max-w-2xl glassmorphism">
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>Welcome to the SupportBot Admin Dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is where admin-specific tools and analytics will be displayed.</p>
        </CardContent>
      </Card>
    </div>
  );
}
