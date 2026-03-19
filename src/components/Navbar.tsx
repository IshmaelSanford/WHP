import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Minimalist Logo Mark */}
          <div className="w-8 h-8 rounded-full border border-zinc-950 flex items-center justify-center">
            <span className="font-outfit font-bold text-lg leading-none">W</span>
          </div>
          <span className="font-outfit font-semibold tracking-tight text-xl hidden sm:block">
            Wild Horse Prairie
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <Link href="#about" className="hover:text-zinc-950 transition-colors">Our Story</Link>
          <Link href="#services" className="hover:text-zinc-950 transition-colors">Conservation</Link>
          <Link href="#showcase" className="hover:text-zinc-950 transition-colors">Showcase</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors hidden sm:block"
          >
            Dashboard Preview
          </Link>
          <Link 
            href="#contact"
            className="px-5 py-2.5 bg-zinc-950 text-white text-sm font-medium rounded-full hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-950/20"
          >
            Get Involved
          </Link>
        </div>
      </div>
    </nav>
  );
}
