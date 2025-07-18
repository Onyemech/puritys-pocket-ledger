
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";

const AuthPage = () => {
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if user is authenticated
  useEffect(() => {
    console.log("AuthPage: Checking user state:", user);
    if (user) {
      console.log("AuthPage: User is authenticated, navigating to dashboard");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLogin) {
        console.log("AuthPage: Attempting sign-in with:", email);
        const { error } = await signIn(email, password);
        if (error) {
          console.log("AuthPage: Sign-in failed:", error.message);
          setError(error.message);
        } else {
          console.log("AuthPage: Sign-in successful");
          // Navigation will be handled by useEffect when user state updates
        }
      } else {
        console.log("AuthPage: Attempting sign-up with:", email, fullName);
        const { error } = await signUp(email, password, fullName);
        if (error) {
          console.log("AuthPage: Sign-up failed:", error.message);
          setError(error.message);
        } else {
          console.log("AuthPage: Sign-up successful");
          setSuccess("Account created successfully! You can now login.");
          setIsLogin(true);
          setEmail("");
          setPassword("");
          setFullName("");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-rose-200 relative transition-colors">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-3/4 h-1/3 rounded-full blur-3xl bg-rose-100/60 absolute -top-24 -left-20" />
        <div className="w-72 h-96 rounded-full blur-2xl bg-pink-400/40 absolute bottom-0 right-8" />
      </div>
      
      <Card className="z-10 shadow-2xl border-pink-200 bg-white/95 max-w-md w-full relative">
        <CardHeader>
          <div className="flex flex-col items-center mb-2">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg mb-3">
              <span className="text-white text-3xl font-bold">💖</span>
            </div>
            <CardTitle className="text-2xl font-extrabold text-pink-700 mb-2 drop-shadow-pink">
              Purity's Inventory
            </CardTitle>
            <span className="text-rose-400 font-medium text-sm mb-1">
              {isLogin ? "Welcome back! 💕" : "Join us today! 💕"}
            </span>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-pink-600">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Miss Purity"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-rose-50/70 focus:bg-white"
                  required
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email" className="text-pink-600">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="purity@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-rose-50/70 focus:bg-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-pink-600">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-rose-50/70 focus:bg-white"
                required
                minLength={6}
              />
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 p-2 rounded">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                <CheckCircle className="h-4 w-4" />
                {success}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 transition focus:ring-pink-400 font-semibold"
              disabled={loading}
            >
              {loading ? "Please wait…" : isLogin ? "Login" : "Create Account"}
            </Button>

            <div className="text-center mt-2">
              <button
                type="button"
                className="text-sm text-pink-600 hover:underline focus:outline-none"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setSuccess(null);
                }}
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Login"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <style>
        {`
          .drop-shadow-pink {
            filter: drop-shadow(0 2px 5px rgba(236,72,153,0.14));
          }
        `}
      </style>
    </div>
  );
};

export default AuthPage;
