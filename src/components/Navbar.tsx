import { Heart } from 'lucide-react';
const Navbar = () => {
  return <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Pink logo pill with subtle pink pulse 3D shadow */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg animate-pulse-pink">
              <Heart className="h-5 w-5 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-pink-700 drop-shadow-pink">
                Hello Miss Purity ✨
              </h1>
              <p className="text-sm text-rose-400">This website was specially made for you Mummy m 💕</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-pink-700">Purity's Business</p>
            <p className="text-xs text-pink-400">Accounting & Inventory</p>
          </div>
        </div>
      </div>
      <style>
        {`
          .animate-pulse-pink {
            animation: pulsePink 2s cubic-bezier(0.4,0,0.6,1) infinite;
          }
          @keyframes pulsePink {
            0%, 100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.5); }
            50% { box-shadow: 0 0 24px 6px rgba(244, 114, 182, 0.37); }
          }
          .drop-shadow-pink {
            filter: drop-shadow(0 2px 5px rgba(236,72,153,0.12));
          }
        `}
      </style>
    </nav>;
};
export default Navbar;