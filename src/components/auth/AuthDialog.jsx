import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/utils/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const AuthDialog = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("signin");

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSignInError("");
    setSignInLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    });
    setSignInLoading(false);
    if (error) {
      setSignInError(error.message);
    } else {
      setOpen(false);
      navigate("/onboarding");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignUpError("");
    setSignUpLoading(true);
    const { error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
      options: { data: { full_name: signUpName } },
    });
    setSignUpLoading(false);
    if (error) setSignUpError(error.message);
    else setSignUpSuccess(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="p-0 border rounded-2xl sm:max-w-md"
        style={{
          background: "#0d1117",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-white leading-tight">
              Welcome back
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-400 mt-1">
              Sign in to your account or create a new one.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 pt-5">
          <div
            className="flex w-full p-1 rounded-xl mb-5"
            style={{ background: "#161b22" }}
          >
            <button
              type="button"
              onClick={() => setTab("signin")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors duration-150 cursor-pointer ${
                tab === "signin"
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab("signup")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors duration-150 cursor-pointer ${
                tab === "signup"
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {tab === "signin" && (
            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signin-email" className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                  Email
                </Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="h-11 rounded-xl text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:border-blue-500"
                  style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signin-password" className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                  Password
                </Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="h-11 rounded-xl text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:border-blue-500"
                  style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>

              {signInError && (
                <p className="text-sm text-red-400">{signInError}</p>
              )}

              <Button
                type="submit"
                disabled={signInLoading}
                className="w-full h-11 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-semibold cursor-pointer disabled:opacity-50 transition-colors duration-150"
              >
                {signInLoading ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          )}

          {tab === "signup" && (
            signUpSuccess ? (
              <div className="py-8 text-center flex flex-col items-center gap-3">
                <p className="text-white font-semibold text-lg">Check your email</p>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  We sent you a confirmation link. Click it to activate your account, then sign in.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="signup-name" className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                    Full Name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="h-11 rounded-xl text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:border-blue-500"
                    style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="signup-email" className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="h-11 rounded-xl text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:border-blue-500"
                    style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="signup-password" className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="h-11 rounded-xl text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:border-blue-500"
                    style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                </div>

                {signUpError && (
                  <p className="text-sm text-red-400">{signUpError}</p>
                )}

                <Button
                  type="submit"
                  disabled={signUpLoading}
                  className="w-full h-11 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-semibold cursor-pointer disabled:opacity-50 transition-colors duration-150"
                >
                  {signUpLoading ? "Creating account…" : "Create Account"}
                </Button>
              </form>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
