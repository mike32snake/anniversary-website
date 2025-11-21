import Hero from './components/Hero';
import Gallery from './components/Gallery';
import LoveLetter from './components/LoveLetter';
import Present from './components/Present';

function App() {
  return (
    <div className="min-h-screen bg-white selection:bg-love-red selection:text-white">
      <Hero />
      <LoveLetter />
      <Gallery />
      <Present />

      <footer className="py-8 text-center text-deep-maroon/60 text-sm">
        <p>Made with ❤️ for Meghan Maseda</p>
        <p>© 2025</p>
      </footer>
    </div>
  );
}

export default App;
