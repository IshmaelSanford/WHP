'use client';

import dynamic from 'next/dynamic';
import { Navbar } from '@/components/Navbar';
import { ArrowRight, Leaf, Shield, Globe, ChevronRight } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

// Dynamically import the 3D engine to prevent SSR issues with Canvas
const HorseEngine = dynamic(() => import('@/components/HorseEngine'), { 
  ssr: false,
  loading: () => <div className="w-full h-full animate-pulse bg-zinc-100 rounded-lg"></div>
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-zinc-200">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-20 bg-zinc-50">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-zinc-100 opacity-90" />
        
        {/* The 3D Particle Horse Engine is the background centerpiece */}
        <div className="absolute inset-0 z-10 opacity-90">
          <HorseEngine />
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pointer-events-none">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="max-w-2xl text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white/70 backdrop-blur-md mb-6 pointer-events-auto shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-zinc-600 uppercase">A New Era of Conservation</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-outfit font-medium tracking-tighter text-zinc-950 leading-[0.95] text-balance mb-6">
              Grace in <br/><span className="text-zinc-400">Motion.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-zinc-500 font-inter font-light max-w-lg mb-8 text-balance">
              Wild Horse Prairie redefines the intersection of luxury, nature, and modern conservation. Experience untamed beauty through a premium lens.
            </p>
            
            <div className="flex items-center gap-4 pointer-events-auto">
              <a href="#about" className="px-8 py-4 bg-zinc-950 text-white rounded-full font-medium hover:bg-zinc-800 transition-colors shadow-2xl flex items-center gap-2 group">
                Discover the Prairie
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-white" />
              </a>
            </div>
          </motion.div>
          
          <div className="hidden lg:block h-full w-full"></div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-50 text-zinc-950">
           <span className="text-xs font-medium tracking-widest uppercase text-zinc-950">Scroll</span>
           <div className="w-[1px] h-12 bg-zinc-400 origin-top animate-pulse" />
        </div>
      </section>

      {/* ABOUT / BRAND STORY */}
      <section id="about" className="py-32 px-6 bg-white shrink-0 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-5xl font-outfit font-medium text-zinc-950 mb-8"
          >
            Rewilding the Modern Spirit.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl font-light text-zinc-500 leading-relaxed text-balance"
          >
            Born from a desire to bridge high-end aesthetics with deep environmental stewardship. At Wild Horse Prairie, we believe that true luxury lies in undisturbed landscapes and the sheer elegance of nature moving free.
          </motion.p>
        </div>
      </section>

      {/* SERVICES / KEY BENEFITS */}
      <section id="services" className="py-32 px-6 bg-zinc-50 border-y border-zinc-100 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: 'Sustainable Stewardship', desc: 'Protecting habitats while cultivating premium experiences that leave zero footprint.' },
              { icon: Globe, title: 'Global Impact', desc: 'Scaling local conservation models to inspire international ecological preservation.' },
              { icon: Shield, title: 'Heritage Protection', desc: 'Safeguarding the legacy of wild herds through advanced monitoring and care.' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl transition-shadow duration-500 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-6 h-6 text-zinc-900" />
                </div>
                <h3 className="text-xl font-semibold font-outfit mb-3 text-zinc-900">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VISUAL SHOWCASE */}
      <section id="showcase" className="py-32 px-6 bg-white relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-5xl font-outfit font-medium text-zinc-950">A Glimpse of the Wild</h2>
            <button className="hidden sm:flex items-center gap-2 text-zinc-500 hover:text-zinc-950 transition-colors font-medium">
              View Gallery <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-[4/5] bg-zinc-100 rounded-3xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              {/* Fallback image if 3D isn't enough - styled minimalistically */}
              <div className="absolute inset-0 bg-zinc-200 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-10 left-10 z-20">
                <p className="text-white font-outfit text-2xl font-medium">The Dawn Run</p>
                <p className="text-white/70 font-light mt-1">Northern Plains</p>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="aspect-[16/9] bg-zinc-100 rounded-3xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-zinc-300 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute bottom-8 left-8 z-20">
                  <p className="text-white font-outfit text-xl font-medium">Sanctuary Views</p>
                </div>
              </div>
              <div className="flex-1 bg-zinc-950 rounded-3xl p-10 flex flex-col justify-between group overflow-hidden relative text-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-zinc-950 opacity-50" />
                <div className="relative z-10">
                  <Shield className="w-8 h-8 text-white/50 mb-6" />
                  <h3 className="text-3xl font-outfit font-medium mb-4">Invest in <br/>Preservation.</h3>
                  <p className="text-white/60 font-light mb-8 max-w-sm">
                    Join an exclusive collective of sponsors ensuring the freedom of the prairie.
                  </p>
                </div>
                <button className="relative z-10 w-fit shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                  <ArrowRight className="w-5 h-5 text-zinc-950 -rotate-45 group-hover:rotate-0 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-50 border-t border-zinc-200 py-16 px-6 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-950 flex items-center justify-center">
              <span className="font-outfit font-bold text-lg text-white leading-none">W</span>
            </div>
            <span className="font-outfit font-semibold text-xl">Wild Horse Prairie</span>
          </div>
          <p className="text-zinc-500 font-light text-sm">
            © {new Date().getFullYear()} Wild Horse Prairie. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-zinc-600">
            <a href="#" className="hover:text-zinc-950 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
