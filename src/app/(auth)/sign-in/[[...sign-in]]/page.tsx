import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="flex flex-col items-center gap-4">
        <SignIn />
        <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground/60 font-medium text-center mt-2">
          <div>&copy; 2026 LAKSHYNiTi.</div>
          <div className="flex items-center gap-1.5">
            <img src="/brand-icon.png" alt="LWT Logo" className="w-3.5 h-3.5 rounded-sm opacity-50 grayscale" />
            <span>&quot;Let&apos;s Work Together&quot; is a service provided by LAKSHYNiTi.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
