"use client";

import { useUser } from "@clerk/nextjs";
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

// Mock Data for the UI based on mockup
const mockProjects = [
  {
    id: "1",
    name: "LakshyaNiti VES Platform",
    type: "Web App",
    progress: 72,
    sprint: "Sprint 3",
    dueDate: "5 days",
    members: ["/day_expectation.jpg", "/day_expectation.jpg", "/day_expectation.jpg", "/day_expectation.jpg", "/day_expectation.jpg", "/day_expectation.jpg"]
  },
  {
    id: "2",
    name: "Food Delivery App",
    type: "Mobile App",
    progress: 45,
    sprint: "Sprint 2",
    dueDate: "10 days",
    members: ["/day_expectation.jpg", "/day_expectation.jpg", "/day_expectation.jpg", "/day_expectation.jpg", "/day_expectation.jpg"]
  },
  {
    id: "3",
    name: "AI Study Buddy",
    type: "AI/ML",
    progress: 30,
    sprint: "Sprint 1",
    dueDate: "15 days",
    members: ["/day_expectation.jpg", "/day_expectation.jpg", "/day_expectation.jpg", "/day_expectation.jpg"]
  }
];

const mockTasks = [
  { id: "1", title: "Design Authentication Flow", priority: "High" as const, completed: true },
  { id: "2", title: "Implement Login API", priority: "High" as const, completed: false },
  { id: "3", title: "Code Review - User Module", priority: "Medium" as const, completed: false },
  { id: "4", title: "Update Project Documentation", priority: "Medium" as const, completed: false },
  { id: "5", title: "Team Standup Meeting", priority: "Low" as const, completed: false },
];

const mockActivities = [
  { id: "1", userAvatar: "/day_expectation.jpg", userName: "Sneha", action: "pushed 4 commits", time: "2h ago" },
  { id: "2", userAvatar: "/day_expectation.jpg", userName: "Rahul", action: "completed Task #21", time: "4h ago" },
  { id: "3", userAvatar: "/day_expectation.jpg", userName: "Amit", action: "reviewed PR #45", time: "6h ago" },
  { id: "4", userAvatar: "/day_expectation.jpg", userName: "You", action: "updated documentation", time: "8h ago" },
];

const mockEvents = [
  { id: "1", day: "10", month: "Jun", title: "Team Standup", time: "10:00 AM - 10:30 AM" },
  { id: "2", day: "10", month: "Jun", title: "Sprint Review", time: "03:00 PM - 04:00 PM" },
  { id: "3", day: "11", month: "Jun", title: "Client Meeting", time: "11:00 AM - 12:00 PM" },
];

const mockSkills = [
  { name: "React", progress: 80 },
  { name: "Node.js", progress: 75 },
  { name: "SQL", progress: 70 },
  { name: "AWS", progress: 60 },
  { name: "Docker", progress: 50 },
];

const mockContributions = {
  commits: 18, commitsTrend: "+8%",
  codeReviews: 7, codeReviewsTrend: "+12%",
  tasksDone: 12, tasksDoneTrend: "+20%",
  hoursSpent: 24, hoursSpentTrend: "+15%"
};

export default function DashboardPage() {
  const { user } = useUser();
  const firstName = user?.firstName || "Ishani";

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
          value="5" 
          trend="+1 this week" 
          icon={<Briefcase className="h-6 w-6 text-blue-500" />} 
          iconBgClass="bg-blue-500/10"
        />
        <StatCard 
          title="Tasks Completed" 
          value="28" 
          trend="+15% this week" 
          icon={<CheckCircle className="h-6 w-6 text-emerald-500" />} 
          iconBgClass="bg-emerald-500/10"
        />
        <StatCard 
          title="Team Members" 
          value="8" 
          trend="+2 this week" 
          icon={<Users className="h-6 w-6 text-purple-500" />} 
          iconBgClass="bg-purple-500/10"
        />
        <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm flex flex-col justify-center">
          <span className="text-[13px] font-medium text-muted-foreground mb-2">Overall Progress</span>
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold">72%</span>
            <Activity className="text-indigo-500 h-6 w-6 mb-1" />
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: "72%" }} />
          </div>
        </div>
      </div>

      {/* Main Grid: Projects, Tasks, AI Mentor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 xl:col-span-5">
          <ActiveProjects projects={mockProjects} />
        </div>
        <div className="lg:col-span-4 xl:col-span-4">
          <TodaysTasks tasks={mockTasks} />
        </div>
        <div className="lg:col-span-3 xl:col-span-3">
          <AiMentor />
        </div>
      </div>

      {/* Activity, Charts, Events Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 xl:col-span-3">
          <TeamActivity activities={mockActivities} />
        </div>
        <div className="lg:col-span-5 xl:col-span-6">
          <ProgressChart />
        </div>
        <div className="lg:col-span-3 xl:col-span-3">
          <UpcomingEvents events={mockEvents} />
        </div>
      </div>

      {/* Skills & Contribution Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5">
          <SkillProgress skills={mockSkills} />
        </div>
        <div className="xl:col-span-7">
          <WeeklyContribution data={mockContributions} />
        </div>
      </div>

    </div>
  );
}
