import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/utils/supabase";
import { Button } from "@/components/ui/button";
import { Briefcase, Search } from "lucide-react";

const roles = [
  {
    value: "candidate",
    title: "I'm a Candidate",
    description: "Browse and apply for jobs",
    icon: Search,
  },
  {
    value: "recruiter",
    title: "I'm a Recruiter",
    description: "Post jobs and hire talent",
    icon: Briefcase,
  },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkUserAndProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate("/");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role) {
        navigate(profile.role === "recruiter" ? "/post-job" : "/jobs");
        return;
      }

      setLoading(false);
    };

    checkUserAndProfile();
  }, [navigate]);

  const handleContinue = async () => {
    if (!selected) return;
    setSaving(true);
    setError("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;
    if (!user) {
      navigate("/");
      return;
    }

    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name || null,
      role: selected,
    });

    setSaving(false);

    if (upsertError) {
      setError("Failed to save your role. Please try again.");
      return;
    }

    navigate(selected === "recruiter" ? "/post-job" : "/jobs");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000814] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000814] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            What brings you to GetHired?
          </h1>
          <p className="mt-3 text-zinc-400 text-base">
            Choose your role to personalise your experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {roles.map(({ value, title, description, icon }) => {
            const RoleIcon = icon;
            const isSelected = selected === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setSelected(value)}
                className={`relative flex flex-col items-start gap-4 p-7 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/5"
                    : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/6"
                }`}
              >
                <div
                  className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? "border-blue-500 bg-blue-500"
                      : "border-white/20"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                <div
                  className={`p-3 rounded-xl transition-colors duration-200 ${
                    isSelected ? "bg-blue-500/15" : "bg-white/5"
                  }`}
                >
                  <RoleIcon
                    className={`w-6 h-6 transition-colors duration-200 ${
                      isSelected ? "text-blue-400" : "text-zinc-400"
                    }`}
                  />
                </div>

                <div>
                  <p
                    className={`text-lg font-semibold transition-colors duration-200 ${
                      isSelected ? "text-white" : "text-zinc-200"
                    }`}
                  >
                    {title}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">{description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {error && <p className="text-sm text-red-400 mb-4 text-center">{error}</p>}

        <Button
          onClick={handleContinue}
          disabled={!selected || saving}
          className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {saving ? "Saving…" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingPage;
