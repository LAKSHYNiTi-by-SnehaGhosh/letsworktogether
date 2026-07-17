import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import Link from "next/link";
import { Database, Zap, LogOut, ArrowLeft } from "lucide-react";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key-please-change-in-production"
);

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("lwt_admin_token")?.value;

  if (!token) {
    redirect("/adminpanel/login");
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload || !payload.adminId) {
      redirect("/adminpanel/login");
    }
    return payload.adminId;
  } catch (error) {
    redirect("/adminpanel/login");
  }
}

export default async function AdminDatabaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0a0a0a] flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
              L
            </div>
            LWT Admin
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link
            href="/adminpanel/database/data"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Database className="w-4 h-4" />
            Database Overview
          </Link>
          <Link
            href="/adminpanel/database/api_limit"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Zap className="w-4 h-4" />
            AI Quotas & Limits
          </Link>
          <Link
            href="/adminpanel/database/marketplace"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Database className="w-4 h-4" />
            Marketplace Approvals
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-red-400 hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
