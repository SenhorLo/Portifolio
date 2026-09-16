import { useState } from "react";
import { MotionConfig } from "motion/react";
import About from "./components/About";
import CommandPalette from "./components/CommandPalette";
import Contact from "./components/Contact";
import Cosmos from "./components/Cosmos";
import Cursor from "./components/Cursor";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Letterbox from "./components/Letterbox";
import Nav from "./components/Nav";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

export default function App() {
  const [palette, setPalette] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[70] -translate-y-20 rounded-full bg-ink px-4 py-2 text-sm text-void focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <Cosmos />
      <Nav onOpenPalette={() => setPalette(true)} />
      <Hero />
      <main id="conteudo">
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
      <CommandPalette open={palette} onOpenChange={setPalette} />
      <Cursor />
      <Letterbox />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </MotionConfig>
  );
}
