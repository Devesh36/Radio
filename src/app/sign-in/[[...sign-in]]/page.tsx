import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center overflow-x-auto bg-[var(--background)] px-3 py-8">
      <div className="w-full max-w-[calc(100vw-1.5rem)] [&_.cl-rootBox]:mx-auto [&_.cl-rootBox]:w-full">
        <SignIn fallbackRedirectUrl="/my-rooms" signUpUrl="/sign-up" />
      </div>
    </div>
  );
}
