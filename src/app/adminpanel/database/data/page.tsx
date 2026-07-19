import { prisma } from "@/lib/prisma";
import { Users, FolderGit2, Users2, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DatabaseOverviewPage() {
  const [users, projects, organizations] = await Promise.all([
    prisma.user.findMany({
      include: { profile: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.project.findMany({
      include: { organization: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.team.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.organization.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ]);

  const stats = [
    { name: "Total Users", value: await prisma.user.count(), icon: Users, color: "text-blue-500" },
    { name: "Total Projects", value: await prisma.project.count(), icon: FolderGit2, color: "text-orange-500" },
    { name: "Total Teams", value: await prisma.team.count(), icon: Users2, color: "text-emerald-500" },
    { name: "Total Orgs", value: await prisma.organization.count(), icon: Building2, color: "text-purple-500" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
          <DatabaseIcon className="w-8 h-8 text-indigo-500" />
          Database Overview
        </h1>
        <p className="text-white/60">
          Manage and monitor all datasets including users, authentication, projects, and organizations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
            <div className={`p-4 rounded-xl bg-white/5 border border-white/10 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/50 text-sm font-medium">{stat.name}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-white/50" /> Recent Users
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-white/50 border-b border-white/10">
                <tr>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3 text-white/80">{user.email}</td>
                    <td className="py-3 text-white/50 text-right">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-white/50" /> Recent Projects
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-white/50 border-b border-white/10">
                <tr>
                  <th className="pb-3 font-medium">Project Name</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="py-3 text-white/80 font-medium">{project.name}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-white/70">{project.status}</span>
                    </td>
                    <td className="py-3 text-white/50 text-right">{new Date(project.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function DatabaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
