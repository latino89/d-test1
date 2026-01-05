
import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, MessageSquare, Map as MapIcon, User as UserIcon, 
  Plus, Star, Clock, CheckCircle, Camera, Play, Sparkles, 
  CreditCard, ChevronRight, History, Settings, LogOut, Bell
} from 'lucide-react';
import { User, Job, Offer, Message, Transaction } from './types';
import { generateFunFact } from './services/geminiService';
import Tetris from './components/Tetris';

// Mock Data
const MOCK_USER: User = {
  id: 'u1',
  name: 'Ola Nordmann',
  avatar: 'https://picsum.photos/seed/ola/200',
  rating: 4.8,
  reviewsCount: 24,
  isPremium: false,
  location: { lat: 59.9139, lng: 10.7522 }
};

const MOCK_JOBS: Job[] = [
  { id: 'j1', title: 'Male stue', description: 'Trenger hjelp til å male en 25kvm stue. Maling er kjøpt inn.', budget: 1500, category: 'Håndverk', status: 'active', customerId: 'u1', createdAt: new Date().toISOString() },
  { id: 'j2', title: 'Flyttevask', description: 'Utvask av 2-roms leilighet i Oslo sentrum.', budget: 2000, category: 'Renhold', status: 'active', customerId: 'u1', createdAt: new Date().toISOString() },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bids' | 'map' | 'chat' | 'profile' | 'create'>('bids');
  const [user, setUser] = useState<User>(MOCK_USER);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [funFact, setFunFact] = useState<string>('');
  const [isVippsLoading, setIsVippsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    generateFunFact().then(setFunFact);
  }, []);

  const handleVippsPayment = () => {
    setIsVippsLoading(true);
    setTimeout(() => {
      setUser(prev => ({ ...prev, isPremium: true }));
      setIsVippsLoading(false);
      alert("Betaling vellykket! Du er nå Premium-bruker 🚀");
    }, 2000);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Kunne ikke åpne kameraet.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-pink-500/20 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
            <Briefcase size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ServiceBid
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-pink-400 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
          </button>
          {user.isPremium && (
            <span className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Premium
            </span>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Intro Video Trigger */}
        <section className="bg-slate-900/50 rounded-2xl p-4 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-tight">Introduksjonsvideo</h2>
            <Play size={16} className="text-pink-500" />
          </div>
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden cursor-pointer group" onClick={() => setShowVideo(!showVideo)}>
            <img src="https://picsum.photos/seed/appvideo/600/337" alt="Video cover" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-600/40">
                <Play className="fill-white text-white ml-1" />
              </div>
            </div>
            {showVideo && (
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                 <p className="text-xs text-center px-4 italic text-slate-400">Her ville en ekte video blitt lastet inn... Se for deg episke scener av folk som fikser ting!</p>
              </div>
            )}
          </div>
        </section>

        {/* Fun Fact Section */}
        <section className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-pink-500/10 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2 text-pink-400">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Dagens Fun Fact</span>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">
            {funFact || "Laster inn AI-generert fakta..."}
          </p>
          <div className="absolute -bottom-4 -right-4 text-pink-500/5 rotate-12">
            <Sparkles size={80} />
          </div>
        </section>

        {/* Dynamic Views */}
        {activeTab === 'bids' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Aktive Anbud</h2>
              <button className="text-xs text-pink-400 font-medium">Se alle</button>
            </div>
            {jobs.map(job => (
              <div key={job.id} className="bg-slate-900 rounded-2xl p-5 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-100">{job.title}</h3>
                  <span className="text-pink-500 font-bold">kr {job.budget}</span>
                </div>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{job.description}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>Postet i dag</span>
                  </div>
                  <div className="bg-slate-800 px-3 py-1 rounded-full text-slate-300">
                    {job.category}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Tetris Break */}
            <div className="py-6">
              <Tetris />
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Tjenester Nær Deg</h2>
            <div className="w-full h-80 bg-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-700">
              <MapIcon size={48} className="text-slate-700 mb-2" />
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-pink-500/20">
                <p className="text-xs text-slate-300 mb-1">Posisjonsdeling aktiv</p>
                <p className="text-sm font-bold">3 leverandører i nærheten</p>
              </div>
              {/* Simulated Map Pins */}
              <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-pink-500 rounded-full border-2 border-white animate-pulse"></div>
              <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-purple-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl">
              <p className="text-sm italic text-slate-400">Tips: Premium-brukere vises øverst i kartet med en gyllen ramme.</p>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-2">
             <h2 className="text-lg font-bold mb-4">Meldinger</h2>
             <div className="space-y-2">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-pink-500/30 transition-all cursor-pointer">
                    <img src={`https://picsum.photos/seed/${i}/100`} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-sm">Service Pro {i}</h4>
                        <span className="text-[10px] text-slate-500">12:30</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">Hei! Jeg kan ta på meg oppdraget ditt...</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center py-6 bg-gradient-to-b from-purple-900/40 to-transparent rounded-3xl border border-purple-500/10">
              <div className="relative">
                <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-slate-950 shadow-xl" />
                {user.isPremium && (
                  <div className="absolute -bottom-1 -right-1 bg-yellow-500 p-1 rounded-full border-2 border-slate-950">
                    <Sparkles size={16} className="text-slate-950" />
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-xl font-bold">{user.name}</h3>
              <div className="flex items-center gap-1 mt-1 text-pink-400">
                <Star size={16} className="fill-current" />
                <span className="font-bold">{user.rating}</span>
                <span className="text-slate-500 text-sm ml-1">({user.reviewsCount} vurderinger)</span>
              </div>
              
              {!user.isPremium && (
                <button 
                  onClick={handleVippsPayment}
                  disabled={isVippsLoading}
                  className="mt-6 flex items-center gap-3 bg-[#ff5b24] hover:bg-[#e04a1b] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#ff5b24]/30 transition-all"
                >
                  <CreditCard size={20} />
                  {isVippsLoading ? 'Behandler...' : 'Bli Premium med Vipps'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col items-center">
                  <History size={24} className="text-purple-400 mb-2" />
                  <span className="text-xs text-slate-400">Historikk</span>
                  <span className="text-lg font-bold">12 Jobber</span>
               </div>
               <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col items-center">
                  <CheckCircle size={24} className="text-pink-400 mb-2" />
                  <span className="text-xs text-slate-400">Loggføring</span>
                  <span className="text-lg font-bold">98% Fullført</span>
               </div>
            </div>

            <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <Camera size={20} className="text-slate-400" />
                  <span className="text-sm font-medium">Bildebevis for levering</span>
                </div>
                <ChevronRight size={16} className="text-slate-600" />
              </button>
              <div className="p-4 border-t border-slate-800">
                {cameraStream ? (
                  <div className="relative">
                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl bg-black" />
                    <button onClick={stopCamera} className="absolute top-2 right-2 bg-red-600 p-2 rounded-full">
                      <LogOut size={16} />
                    </button>
                    <button className="mt-4 w-full bg-pink-600 py-3 rounded-xl font-bold">Ta Bilde</button>
                  </div>
                ) : (
                  <button onClick={startCamera} className="w-full py-8 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 hover:border-pink-500/50 transition-all">
                    <Camera size={32} />
                    <span className="text-sm">Åpne kamera for dokumentasjon</span>
                  </button>
                )}
              </div>
              <button className="w-full flex items-center justify-between p-4 border-t border-slate-800 hover:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <Settings size={20} className="text-slate-400" />
                  <span className="text-sm font-medium">Instillinger</span>
                </div>
                <ChevronRight size={16} className="text-slate-600" />
              </button>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
               <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Siste Kvitteringer</h4>
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>Maling av stue</span>
                    <span className="font-mono text-pink-400">1 500,-</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Premium Abonn.</span>
                    <span className="font-mono text-pink-400">99,-</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="space-y-4">
             <h2 className="text-lg font-bold">Legg ut nytt anbud</h2>
             <div className="bg-slate-900 p-6 rounded-2xl border border-pink-500/20 space-y-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Tittel</label>
                  <input type="text" placeholder="Hva trenger du hjelp med?" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-pink-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Budsjett (Valgfritt)</label>
                  <input type="number" placeholder="Anslått beløp" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-pink-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Beskrivelse</label>
                  <textarea rows={4} placeholder="Fortell om oppdraget..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-pink-500 outline-none" />
                </div>
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 py-4 rounded-xl font-bold shadow-lg shadow-pink-600/20 active:scale-95 transition-transform">
                  Publiser Anbud
                </button>
             </div>
          </div>
        )}

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 px-6 py-3 flex justify-between items-center max-w-md mx-auto rounded-t-3xl shadow-2xl">
        <NavButton active={activeTab === 'bids'} onClick={() => setActiveTab('bids')} icon={<Briefcase size={22} />} label="Anbud" />
        <NavButton active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={<MapIcon size={22} />} label="Kart" />
        <div className="relative -top-8">
           <button 
             onClick={() => setActiveTab('create')}
             className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-pink-600/30 active:scale-90 transition-all border-4 border-slate-950"
           >
             <Plus size={28} />
           </button>
        </div>
        <NavButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={22} />} label="Chat" />
        <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<UserIcon size={22} />} label="Profil" />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-pink-500' : 'text-slate-500'}`}>
    {icon}
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

export default App;
