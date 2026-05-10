import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Certifications } from "@/components/Certifications";
import { Resume } from "@/components/Resume";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { BootSequence } from "@/components/BootSequence";

export function App() {
  const [booted, setBooted] = useState(false);
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <CustomCursor />
      {!booted && <BootSequence onDone={() => setBooted(true)} />}
      <NavBar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Resume />
        <Contact />
      </main>
      <Footer />
      <div className="pointer-events-none fixed bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background via-background/60 to-transparent" />
    </div>
  );
}

