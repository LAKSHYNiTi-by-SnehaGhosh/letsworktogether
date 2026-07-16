import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <ClerkLoading>
        <div className="flex flex-col items-center justify-center w-full max-w-[400px] h-[550px] mx-auto">
          <div className="relative flex items-center justify-center w-20 h-20">
            <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-primary animate-spin" style={{ animationDuration: '1s' }} />
            <div className="absolute inset-2 rounded-full border-r-2 border-b-2 border-accent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            <img src="/brand-icon.png" alt="Loading" className="w-8 h-8 rounded-sm object-contain animate-pulse" />
          </div>
          <p className="mt-6 text-sm font-medium text-muted-foreground animate-pulse">
            Establishing secure connection...
          </p>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
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
      </ClerkLoaded>
    </div>
  );
}
