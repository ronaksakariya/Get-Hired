import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { COMPANIES } from "@/data/const";
import { supabase } from "@/utils/supabase";
import useAuth from "@/context/useAuth";
import JobCard from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";

// Create a map for O(1) lookups outside the component
const companiesMap = new Map(COMPANIES.map((c) => [c.id, c]));

const Jobs = () => {
  const { user, role, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all-locations");
  const [jobTypeFilter, setJobTypeFilter] = useState("all-types");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    // Use isMounted to prevent setting state on unmounted component
    let isMounted = true;

    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        let query = supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        if (role === "recruiter" && user) {
          query = query.eq("recruiter_id", user.id);
        }

        const { data, error: supabaseError } = await query;

        if (supabaseError) throw supabaseError;
        if (isMounted) setJobs(data || []);
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching jobs:", err);
          setError("Failed to load jobs. Please try again later.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, [user, role, authLoading]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setLocationFilter("all-locations");
    setJobTypeFilter("all-types");
  }, []);

  const filteredJobs = useMemo(() => {
    const lowerSearchQuery = searchQuery.toLowerCase();

    return jobs.filter((job) => {
      // Short-circuit evaluations:
      // Start with string matching which is fast and boolean comparisons
      const matchesLocation =
        locationFilter === "all-locations" || job.location === locationFilter;
      if (!matchesLocation) return false;

      const matchesType =
        jobTypeFilter === "all-types" || job.type === jobTypeFilter;
      if (!matchesType) return false;

      // Only perform string finding if the first two match, and if search query exists
      if (!lowerSearchQuery) return true;

      const companyData = companiesMap.get(job.company_id);
      const companyName = companyData ? companyData.name : job.company_id;

      return (
        job.title?.toLowerCase().includes(lowerSearchQuery) ||
        companyName?.toLowerCase().includes(lowerSearchQuery)
      );
    });
  }, [jobs, searchQuery, locationFilter, jobTypeFilter]);

  return (
    <div className="w-full bg-[#000814] text-white pt-6 pb-20">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
          Explore Jobs
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl">
          Find your next career opportunity from top companies. Search and
          filter to find the perfect match.
        </p>
      </div>

      {/* Filters Section */}
      {role !== "recruiter" && (
        <JobFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          jobTypeFilter={jobTypeFilter}
          setJobTypeFilter={setJobTypeFilter}
          clearFilters={clearFilters}
        />
      )}

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-[#0d1117] rounded-3xl flex flex-col items-center justify-center">
          <p className="text-red-400 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
          >
            Try Again
          </Button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-[#0d1117] rounded-3xl flex flex-col items-center justify-center">
          <Search className="h-12 w-12 text-zinc-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-white">
            No jobs found
          </h2>
          <p className="text-zinc-400">
            Try adjusting your search or clearing your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} user={user} role={role} onJobDeleted={(id) => setJobs(prev => prev.filter(j => j.id !== id))} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
