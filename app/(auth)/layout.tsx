import Logo from "@/components/Logo";
import { TextAnimationHeading } from "@/components/TextAnimationHeading";
import { Suspense } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid lg:grid-cols-2 min-h-screen h-full">
      {/* Left: Animation & Logo */}
      <div className="hidden lg:flex flex-col p-10 bg-primary/10">
        <div className="flex items-center mb-6">
          <Logo />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <TextAnimationHeading
            className="mx-0"
            classNameAnimationContainer="text-left lg:text-center"
          />
        </div>
      </div>

      {/* Right: Auth Content */}
      <Suspense fallback={<div>Loading...</div>}>
        <div className="h-full flex flex-col justify-center px-4 lg:p-6 overflow-auto">
          {children}
        </div>
      </Suspense>
    </div>
  );
}
