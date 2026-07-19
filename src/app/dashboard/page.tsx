import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActiveProjects } from "@/components/dashboard/active-projects";
import { TodaysTasks } from "@/components/dashboard/todays-tasks";
import { AiMentor } from "@/components/dashboard/ai-mentor";
import { TeamActivity } from "@/components/dashboard/team-activity";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { SkillProgress } from "@/components/dashboard/skill-progress";
import { WeeklyContribution } from "@/components/dashboard/weekly-contribution";
import { Briefcase, CheckCircle, Users, Activity } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) return null;
  const firstName = user.firstName || "Colleague";

  // Fetch real data from Prisma
  const userRecord = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      profile: true,
      projectMemberships: {
        include: {
          project: {
            include: {
              tasks: true,
              members: {
                include: { user: { include: { profile: true } } }
              }
            }
          }
        }
      },
      assignedTasks: {
        where: {
          status: { not: "DONE" }
        },
        orderBy: { dueDate: 'asc' },
        take: 5
      },
      activityLogs: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { user: { include: { profile: true } } }
      }
    }
  });

  if (!userRecord) {
    return (
      <div className="p-8 text-center">
        <h2>Your profile is not fully setup yet. Please complete onboarding.</h2>
      </div>
    );
  }

  // Format Projects
  const liveProjects = userRecord.projectMemberships.map(pm => {
    const p = pm.project;
    const totalTasks = p.tasks.length;
    const completedTasks = p.tasks.filter(t => t.status === "DONE").length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      id: p.id,
      name: p.name,
      type: "Project", // Type is missing in schema, using default
      progress,
      sprint: "Current Sprint",
      dueDate: p.endDate ? new Date(p.endDate).toLocaleDateString() : "TBD",
      members: p.members.map(m => m.user.profile?.avatarUrl || "/day_expectation.jpg")
    };
  });

  // Format Tasks
  const liveTasks = userRecord.assignedTasks.map(t => {
    let prio: "High" | "Medium" | "Low" = "Medium";
    if (t.priority === "HIGH" || t.priority === "URGENT") prio = "High";
    if (t.priority === "LOW") prio = "Low";
    
    return {
      id: t.id,
      title: t.title,
      priority: prio,
      completed: t.status === "DONE"
    };
  });

  // Format Activities
  const liveActivities = userRecord.activityLogs.map(a => ({
    id: a.id,
    userAvatar: a.user.profile?.avatarUrl || "/day_expectation.jpg",
    userName: a.user.profile?.firstName || "Someone",
    action: a.action,
    time: new Date(a.createdAt).toLocaleDateString()
  }));

  const activeProjectsCount = liveProjects.length;
  const tasksCompletedCount = await prisma.task.count({
    where: { assigneeId: user.id, status: "DONE" }
  });
  
  // Count unique team members across teams user is part of
  const teamMemberships = await prisma.teamMember.findMany({
    where: { userId: user.id },
    select: { teamId: true }
  });
  const teamIds = teamMemberships.map(tm => tm.teamId);
  const teamMembersCount = await prisma.teamMember.count({
    where: { teamId: { in: teamIds } }
  });

  const overallProgress = liveProjects.length > 0 
    ? Math.round(liveProjects.reduce((acc, p) => acc + p.progress, 0) / liveProjects.length)
    : 0;

  // Empty fallbacks for components without schema mappings
  const liveEvents: any[] = [];
  const liveSkills: any[] = [];
  const liveContributions = {
    commits: 0, commitsTrend: "0%",
    codeReviews: 0, codeReviewsTrend: "0%",
    tasksDone: tasksCompletedCount, tasksDoneTrend: "N/A",
    hoursSpent: 0, hoursSpentTrend: "0%"
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-2">
            Good morning, {firstName}! <span>👋</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Let&apos;s build something amazing today.</p>
        </div>
        <div className="hidden md:flex border-l-4 border-lwt-blue bg-lwt-blue/5 p-4 rounded-r-xl max-w-sm">
          <p className="text-sm font-medium text-foreground/80 leading-relaxed italic">
            &quot;The best way to predict the future is to create it together.&quot;
            <span className="block mt-2 text-lwt-blue not-italic">- LakshyaNiti VES</span>
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Projects" 
          value={activeProjectsCount.toString()} 
          trend="Current" 
          icon={<Briefcase className="h-6 w-6 text-blue-500" />} 
          iconBgClass="bg-blue-500/10"
        />
        <StatCard 
          title="Tasks Completed" 
          value={tasksCompletedCount.toString()} 
          trend="Total" 
          icon={<CheckCircle className="h-6 w-6 text-emerald-500" />} 
          iconBgClass="bg-emerald-500/10"
        />
        <StatCard 
          title="Team Members" 
          value={teamMembersCount.toString()} 
          trend="In your teams" 
          icon={<Users className="h-6 w-6 text-purple-500" />} 
          iconBgClass="bg-purple-500/10"
        />
        <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm flex flex-col justify-center">
          <span className="text-[13px] font-medium text-muted-foreground mb-2">Overall Progress</span>
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold">{overallProgress}%</span>
            <Activity className="text-indigo-500 h-6 w-6 mb-1" />
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Main Grid: Projects, Tasks, AI Mentor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 xl:col-span-5">
          <ActiveProjects projects={liveProjects} />
        </div>
        <div className="lg:col-span-4 xl:col-span-4">
          <TodaysTasks tasks={liveTasks} />
        </div>
        <div className="lg:col-span-3 xl:col-span-3">
          <AiMentor />
        </div>
      </div>

      {/* Activity, Charts, Events Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 xl:col-span-3">
          <TeamActivity activities={liveActivities} />
        </div>
        <div className="lg:col-span-5 xl:col-span-6">
          <ProgressChart />
        </div>
        <div className="lg:col-span-3 xl:col-span-3">
          <UpcomingEvents events={liveEvents} />
        </div>
      </div>

      {/* Skills & Contribution Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5">
          <SkillProgress skills={liveSkills} />
        </div>
        <div className="xl:col-span-7">
          <WeeklyContribution data={liveContributions} />
        </div>
      </div>

    </div>
  );
}
