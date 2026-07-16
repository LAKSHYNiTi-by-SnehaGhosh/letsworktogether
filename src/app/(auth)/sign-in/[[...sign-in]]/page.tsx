import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="flex flex-col items-center gap-4">
        <SignIn />
        <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground font-medium text-center mt-2">
          <div>&copy; 2026 LAKSHYNiTi.</div>
          <div className="flex items-center gap-1.5">
            <img src="/brand-icon.png" alt="LWT Logo" className="w-4 h-4 rounded-sm object-contain" />
            <span>LAKSHYNiTi LWT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
