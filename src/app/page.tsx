import { EchoScriptApp } from '@/components/echo-script-app';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-0 sm:p-4">
      {/* Smartphone Container Mockup - Adjusted for ~6.3" compact feel */}
      <div className="relative w-full h-screen sm:h-[780px] sm:w-[360px] sm:rounded-[2.5rem] sm:border-[8px] sm:border-slate-800 sm:shadow-2xl overflow-hidden bg-white flex flex-col">
        {/* Notch / Status Bar Area for visual realism */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-800 rounded-b-xl z-50"></div>
        
        <div className="flex-1 overflow-hidden">
          <EchoScriptApp />
        </div>

        {/* Home Indicator for visual realism */}
        <div className="hidden sm:block absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-200 rounded-full"></div>
      </div>
    </main>
  );
}
