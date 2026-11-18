import { Toast } from '@base-ui/react/toast';
import { Tooltip } from '@base-ui/react/tooltip';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui';
import { useInitialHashScroll } from './hooks';

export function App() {
  useInitialHashScroll();

  return (
    <Tooltip.Provider delay={250}>
      <Toast.Provider limit={1}>
        <a
          href="#main"
          className="fixed top-3 left-3 z-50 -translate-y-20 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <Footer />
        <Toaster />
      </Toast.Provider>
    </Tooltip.Provider>
  );
}
