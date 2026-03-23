import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/utils/supabase";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();
          
          setRole(profile?.role || null);
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  // Not authenticated? Redirect to home
  if (!session) {
    return <Navigate to="/" replace />;
  }

  // Authenticated but no role? Redirect to onboarding
  if (!role && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // Check specific route restrictions based on role
  if (role === "candidate" && location.pathname === "/post-job") {
    return <Navigate to="/jobs" replace />;
  }

  if (role === "recruiter" && location.pathname === "/jobs") {
    return <Navigate to="/post-job" replace />;
  }

  return children;
};

export default ProtectedRoute;
