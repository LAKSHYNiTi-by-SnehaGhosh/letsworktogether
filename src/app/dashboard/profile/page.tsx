"use client";

import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="p-8 max-w-6xl mx-auto min-h-full flex flex-col items-center">
      <div className="w-full mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>
      <div className="w-full flex justify-center">
        <UserProfile 
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full max-w-4xl shadow-md rounded-xl overflow-hidden border border-border",
              card: "w-full shadow-none",
            }
          }}
        />
      </div>
    </div>
  );
}
