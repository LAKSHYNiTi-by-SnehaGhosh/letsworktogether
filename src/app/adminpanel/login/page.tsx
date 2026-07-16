"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { loginAdmin } from "./actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email.endsWith("@lakshyniti.com")) {
      setError("Unauthorized domain. Must be @lakshyniti.com");
      setLoading(false);
      return;
    }

    try {
      const res = await loginAdmin(email, password);
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/adminpanel");
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background blur-3xl" />

      <div className="w-full max-w-md p-8 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <Image src="/main_icon.png" alt="LWT Admin" width={60} height={60} className="mb-4" />
          <h1 className="text-2xl font-bold tracking-tight">Backend Portal</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Authorized LWT personnel only.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 flex flex-col">
            <label htmlFor="email" className="text-sm font-medium leading-none">Staff Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="you@lakshyniti.com" 
              required 
              autoComplete="email"
              className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <label htmlFor="password" className="text-sm font-medium leading-none">LWT_Admin_Passwd</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              autoComplete="current-password"
              className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <button 
            type="submit" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 mt-2" 
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Secure Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
