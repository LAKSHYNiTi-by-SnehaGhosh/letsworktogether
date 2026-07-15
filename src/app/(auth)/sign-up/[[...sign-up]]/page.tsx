import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="flex flex-col items-center gap-4">
        <SignUp />
        <div className="flex items-center gap-2 text-xs text-muted-foreground/60 font-medium">
          <img src="/brand-icon.png" alt="LWT Logo" className="w-4 h-4 rounded-sm opacity-50 grayscale" />
          <span>Let&apos;s Work Together</span>
          <span className="mx-1">•</span>
          <span>Development by LAKSHYNiTi</span>
        </div>
      </div>
    </div>
  );
}
