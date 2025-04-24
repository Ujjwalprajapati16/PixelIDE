"use client";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
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

      {/* text */}
      <div className="mx-auto text-2xl lg:text-5xl my-6 flex flex-col gap-3 lg:gap-5 font-bold text-center">
        <div className="text-primary drop-shadow-md">
          Build Space
        </div>
        <div className="w-fit mx-auto text-center">
          <TypeAnimation
            sequence={[
              "Your team",
              1000,
              "Your Ideas",
              1000,
              "One Editor",
              1000,
            ]}
            wrapper="span"
            speed={50}
            style={{ fontSize: "2em", display: "inline-block" }}
            repeat={Infinity}
          />
        </div>
      </div>

      {/* Dashboard landing image */}
      <div className="mx-auto w-fit shadow-lg">
          <Image 
            src={"/banner.png"}
            width={1000}
            height={400}
            alt="banner"
          /> 
      </div>

      <footer className="bg-black py-4 mt-6 text-neutral-200">
        <p className="text-base font-semibold w-fit px-4 mx-auto">Made By 
        <span className="text-primary"> Pikachu ❤️</span>
        </p>
      </footer>
    </div >
  );
}
