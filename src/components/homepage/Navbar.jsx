import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import AuthDialog from "@/components/auth/AuthDialog";
import { supabase } from "@/utils/supabase";
import useAuth from "@/context/useAuth";

const Navbar = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <>
      <nav className="w-full px-6 sm:px-10 lg:px-16 py-4">
        <div className="mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1">
            <img
              src="/logo.png"
              alt="GetHired Logo"
              className="h-14 sm:h-16 lg:h-20 w-auto"
            />
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-xl font-medium hidden sm:block">
                👋 {displayName}
              </span>
              <Button
                variant="outline"
                size="lg"
                onClick={handleLogout}
                className="border-gray-500 bg-transparent text-white hover:bg-white/10 hover:text-white cursor-pointer px-6 py-6 text-lg sm:text-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setAuthOpen(true)}
              className="border-gray-500 bg-transparent text-white hover:bg-white/10 hover:text-white cursor-pointer px-6 py-6 text-lg sm:text-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300"
            >
              Login
            </Button>
          )}
        </div>
      </nav>

      <AuthDialog open={authOpen} setOpen={setAuthOpen} />
    </>
  );
};

export default Navbar;
