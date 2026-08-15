import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center overflow-x-auto bg-[var(--background)] px-3 py-8">
      <div className="w-full max-w-[calc(100vw-1.5rem)] [&_.cl-rootBox]:mx-auto [&_.cl-rootBox]:w-full">
        <SignUp fallbackRedirectUrl="/studio" signInUrl="/sign-in" />
      </div>
    </div>
  );
}
