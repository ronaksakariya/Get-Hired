import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/utils/supabase";
import useAuth from "@/context/useAuth";
import { COMPANIES } from "@/data/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, ChevronLeft, Building } from "lucide-react";
import ApplyJobDialog from "@/components/job-details/ApplyJobDialog";
import RecruiterApplicants from "@/components/job-details/RecruiterApplicants";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchJob = async () => {
      try {
        setLoading(true);
        const { data, error: supaError } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", id)
          .single();

        if (supaError) throw supaError;
        if (isMounted) setJob(data);

        if (user && data.recruiter_id !== user.id && isMounted) {
          const { data: appData } = await supabase
            .from("applications")
            .select("status")
            .eq("job_id", id)
            .eq("candidate_id", user.id)
            .maybeSingle();

          if (appData) {
            setApplicationStatus(appData.status);
          }
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Failed to load job details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchJob();
    return () => {
      isMounted = false;
    };
  }, [id, user]);



  if (loading || authLoading) {
    return (
      <div className="w-full min-h-screen bg-[#000814] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="w-full min-h-screen bg-[#000814] flex flex-col justify-center items-center text-white p-6">
        <p className="text-red-400 mb-6 text-xl">{error || "Job not found"}</p>
        <Button
          onClick={() => navigate("/jobs")}
          variant="outline"
          className="text-white border-white/20"
        >
          Back to Jobs
        </Button>
      </div>
    );
  }

  const companyData = COMPANIES.find((c) => c.id === job.company_id) || {};
  const isOwner = user && user.id === job.recruiter_id;

  return (
    <div className="w-full min-h-screen bg-[#000814] text-white pt-8 pb-20 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center text-zinc-400 hover:text-white transition-colors mb-6 text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Jobs
        </button>

        {/* Header Section */}
        <div className="bg-[#0d1117] rounded-3xl p-6 md:p-10 mb-8 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-600 to-indigo-600"></div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-4 md:gap-6">
              <div className="bg-gray-900 p-4 rounded-2xl h-20 w-20 shrink-0 flex items-center justify-center shadow-md">
                <img
                  src={companyData.logo || "/companies/amazon.svg"}
                  alt={companyData.name || job.company_id}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 leading-tight">
                  {job.title}
                </h1>
                <div className="flex items-center text-zinc-400 text-lg mb-4">
                  <Building className="w-5 h-5 mr-2 opacity-80" />
                  {companyData.name || job.company_id}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-[#161b22] text-blue-400 border-none font-medium px-3 py-1.5 rounded-lg text-sm"
                  >
                    <MapPin className="w-4 h-4 mr-1.5 opacity-80" />
                    {job.location}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-[#161b22] text-emerald-400 border-none font-medium px-3 py-1.5 rounded-lg text-sm"
                  >
                    <Briefcase className="w-4 h-4 mr-1.5 opacity-80" />
                    {job.type}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 md:pl-6 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 shrink-0">
              {user ? (
                isOwner ? (
                  <Button
                    onClick={() =>
                      document
                        .getElementById("applicants-section")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="w-full md:w-auto bg-zinc-800 hover:bg-zinc-700 border-none text-white rounded-xl font-semibold h-12 px-8"
                  >
                    View Applicants
                  </Button>
                ) : applicationStatus ? (
                  <Button
                    disabled
                    className={`w-full md:w-auto rounded-xl font-semibold h-12 px-8 cursor-default capitalize border ${
                      applicationStatus === "rejected"
                        ? "bg-red-600/20 text-red-400 border-red-500/30"
                        : applicationStatus === "hired"
                          ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/30"
                          : applicationStatus === "interviewing"
                            ? "bg-amber-600/20 text-amber-400 border-amber-500/30"
                            : "bg-blue-600/20 text-blue-400 border-blue-500/30"
                    }`}
                  >
                    {applicationStatus}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsApplyOpen(true)}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all h-12 px-8"
                  >
                    Apply Now
                  </Button>
                )
              ) : (
                <Button
                  disabled
                  className="w-full md:w-auto bg-zinc-800 text-zinc-500 border-none rounded-xl font-semibold h-12 px-8 cursor-not-allowed"
                >
                  Login to Apply
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-[#0d1117] rounded-3xl p-6 md:p-10 border border-white/5">
          <h2 className="text-2xl font-bold mb-6">About the Role</h2>
          <div className="prose prose-invert max-w-none text-zinc-300 whitespace-pre-wrap leading-relaxed">
            {job.description}
          </div>
        </div>
      </div>

      <ApplyJobDialog
        isOpen={isApplyOpen}
        onOpenChange={setIsApplyOpen}
        jobId={job.id}
        jobTitle={job.title}
        companyName={companyData.name || job.company_id}
        onApplied={() => setApplicationStatus("applied")}
      />

      {isOwner && <RecruiterApplicants jobId={job.id} />}
    </div>
  );
};

export default JobDetails;
