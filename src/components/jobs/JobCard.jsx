import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { MapPin, Briefcase, Trash2 } from "lucide-react";
import { COMPANIES } from "@/data/const";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/utils/supabase";

const companiesMap = new Map(COMPANIES.map((c) => [c.id, c]));

const JobCard = memo(({ job, user, role, onJobDeleted }) => {
  const companyData = companiesMap.get(job.company_id) || {};
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      const { error } = await supabase.from("jobs").delete().eq("id", job.id);
      if (error) throw error;
      setIsDeleteDialogOpen(false);
      if (onJobDeleted) onJobDeleted(job.id);
    } catch (err) {
      console.error("Failed to delete job:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card
        onClick={() => navigate(`/job/${job.id}`)}
        className="bg-[#0d1117] border-transparent hover:border-white/15 transition-all duration-300 group cursor-pointer flex flex-col rounded-2xl overflow-hidden hover:-translate-y-1"
      >
        <CardHeader className="pb-4 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-gray-900 p-2.5 rounded-xl h-14 w-14 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
              <img
                src={companyData.logo || "/companies/amazon.svg"}
                alt={`${companyData.name || job.company_id} logo`}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-white transition-colors tracking-tight leading-tight">
            {job.title}
          </CardTitle>
          <p className="text-zinc-400 font-medium mt-1.5 text-sm">
            {companyData.name || job.company_id}
          </p>
        </CardHeader>

        <CardContent className="pb-6 grow">
          <div className="flex flex-wrap gap-2.5 mb-5">
            <Badge
              variant="secondary"
              className="bg-[#161b22] text-blue-400 hover:bg-white/10 border-none font-medium px-2.5 py-1 rounded-lg"
            >
              <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-80" />
              {job.location}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-[#161b22] text-emerald-400 hover:bg-white/10 border-none font-medium px-2.5 py-1 rounded-lg"
            >
              <Briefcase className="w-3.5 h-3.5 mr-1.5 opacity-80" />
              {job.type}
            </Badge>
          </div>
          <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        </CardContent>

        <CardFooter className="pt-0 pb-6 px-6 bg-transparent border-t-0">
          {user ? (
            role === "recruiter" ? (
              user.id === job.recruiter_id ? (
                <div className="w-full flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/job/${job.id}`);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 border-none text-white rounded-xl font-semibold h-12 tracking-wide cursor-pointer"
                  >
                    Manage Applicants
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeleteDialogOpen(true);
                    }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  disabled
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-zinc-800 text-zinc-400 border-none rounded-xl font-semibold h-12 cursor-not-allowed tracking-wide"
                >
                  Recruiter View
                </Button>
              )
            ) : (
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl font-semibold transition-all h-12 cursor-pointer tracking-wide">
                Apply Now
              </Button>
            )
          ) : (
            <Button
              disabled
              className="w-full bg-zinc-800 text-zinc-400 border-none rounded-xl font-semibold transition-all h-12 cursor-not-allowed tracking-wide"
            >
              Login to Apply
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          className="sm:max-w-md bg-[#0d1117] border-white/10 text-white rounded-2xl"
        >
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete "{job.title}"? This action cannot
              be undone and all applications will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:justify-end mt-4 bg-transparent border-t-0">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(false);
              }}
              className="bg-transparent border-white/20 text-white hover:bg-white/10 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete Job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});
JobCard.displayName = "JobCard";

export default JobCard;
