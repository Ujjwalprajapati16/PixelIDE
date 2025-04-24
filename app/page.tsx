import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b via-white from-white to-primary overflow-hidden">
      <header className="h-20 flex items-center">
        <div className="container px-4 mx-auto flex items-center justify-between gap-4">
          <Logo />
          <nav>
            <Button>
              Login
            </Button>
          </nav>
        </div>
      </header>
    </div >
  );
}
