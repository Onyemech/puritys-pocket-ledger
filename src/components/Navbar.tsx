
import { Heart } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                Hello Miss Purity ✨
              </h1>
              <p className="text-sm text-gray-600">
                This website was specially designed by someone who Luvs you 💕
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">Purity's Business</p>
            <p className="text-xs text-gray-500">Accounting & Inventory</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
