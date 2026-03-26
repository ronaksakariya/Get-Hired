import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/utils/supabase";
import useAuth from "@/context/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Building, MapPin, Briefcase, Calendar } from "lucide-react";
import { COMPANIES } from "@/data/const";

const companiesMap = new Map(COMPANIES.map((c) => [c.id, c]));

const MyApplications = () => {
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("applications")
          .select(`*, job:jobs(*)`)
          .eq("candidate_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setApplications(data || []);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load your applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center py-20 bg-[#000814] min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#000814] text-white pt-6 pb-20 min-h-[calc(100vh-80px)]">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
          My Applications
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl">
          Track the status of jobs you've applied for.
        </p>
      </div>

      {error ? (
        <div className="text-center py-20 bg-[#0d1117] rounded-3xl flex flex-col items-center justify-center">
          <p className="text-red-400 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="text-white border-white/20"
          >
            Try Again
          </Button>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 bg-[#0d1117] rounded-3xl flex flex-col items-center justify-center">
          <Briefcase className="h-12 w-12 text-zinc-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-white">
            No applications yet
          </h2>
          <p className="text-zinc-400 mb-6">You haven't applied to any jobs.</p>
          <Link to="/jobs">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Browse Jobs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => {
            const job = app.job;
            const companyData = companiesMap.get(job.company_id) || {};
            const appliedDate = new Date(app.created_at).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            );

            return (
              <Card
                key={app.id}
                className="bg-[#0d1117] border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col rounded-2xl overflow-hidden shadow-lg"
              >
                <CardHeader className="pb-4 relative border-b border-white/5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-gray-900 p-2.5 rounded-xl h-14 w-14 flex items-center justify-center shadow-sm">
                      <img
                        src={companyData.logo || "/companies/amazon.svg"}
                        alt={companyData.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <Badge
                      className={`capitalize font-semibold px-3 py-1.5 text-sm rounded-lg border-none tracking-wide ${
                        app.status === "rejected"
                          ? "bg-red-600/20 text-red-500"
                          : app.status === "hired"
                            ? "bg-emerald-600/20 text-emerald-500"
                            : app.status === "interviewing"
                              ? "bg-amber-600/20 text-amber-500"
                              : "bg-blue-600/20 text-blue-400"
                      }`}
                    >
                      {app.status === "applied" ? "Pending" : app.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-white mb-2 leading-tight tracking-tight">
                    {job.title}
                  </CardTitle>
                  <p className="text-zinc-400 font-medium text-sm flex items-center gap-1.5">
                    <Building className="w-4 h-4" />{" "}
                    {companyData.name || job.company_id}
                  </p>
                </CardHeader>
                <CardContent className="py-6 grow flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2.5">
                    <span className="flex items-center text-sm font-medium text-zinc-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      <MapPin className="w-4 h-4 mr-1.5 opacity-70" />{" "}
                      {job.location}
                    </span>
                    <span className="flex items-center text-sm font-medium text-zinc-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      <Briefcase className="w-4 h-4 mr-1.5 opacity-70" />{" "}
                      {job.type}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-zinc-500 mt-2 font-medium">
                    <Calendar className="w-4 h-4 mr-2 opacity-70" /> Applied on{" "}
                    {appliedDate}
                  </div>
                </CardContent>
                <CardFooter className="pb-6 px-6 bg-transparent border-t-0 mt-auto pt-2">
                  <Link to={`/job/${job.id}`} className="w-full">
                    <Button
                      variant="secondary"
                      className="w-full bg-white/5 hover:bg-white/10 text-white rounded-xl h-12 font-semibold tracking-wide border border-transparent hover:border-white/10 transition-colors"
                    >
                      View Job Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default MyApplications;
