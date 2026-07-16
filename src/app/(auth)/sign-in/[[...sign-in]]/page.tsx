import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="relative custom-auth-card w-fit mx-auto flex flex-col items-center">
        <SignIn />
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1 text-[11px] text-muted-foreground font-medium text-center z-50 pointer-events-none">
          <div>&copy; 2026 LAKSHYNiTi.</div>
          <div className="flex items-center gap-1.5">
            <img src="/brand-icon.png" alt="LWT Logo" className="w-3.5 h-3.5 rounded-sm object-contain" />
            <span>LAKSHYNiTi LWT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
