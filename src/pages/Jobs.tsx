//@ts-nocheck
import React, { useEffect, useState, useContext } from "react";
import DefaultLayout from "@/layouts/default";
import useJobs from "@/hooks/useJobs";
import useChats from "@/hooks/useChats";
import JobInput from "@/components/JobInput";
import JobList from "@/components/JobList";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea, Button } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { GlobalConfigContext } from "@/config/GlobalConfig";
import JobModal from "@/components/JobModal";

interface Job {
  jobID: string;
  title: string;
  description: string;
  price: number;
  contractPeriod: number;
  isComplete: boolean;
  user: {
    userID: string;
    username: string;
    publicInfo: {
      bio: string;
    };
  };
}

interface JobFormData {
  title: string;
  description: string;
  price: number;
  contractPeriod: string;
}

const Jobs = () => {
  const { user } = useContext(GlobalConfigContext);
  const {
    jobs,
    loading: jobsLoading,
    error: jobsError,
    fetchJobs,
    createNewJob,
    updateExistingJob,
    deleteExistingJob,
  } = useJobs();
  const { sendChatMessage } = useChats();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [initialFormData, setInitialFormData] = useState<JobFormData | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (data: JobFormData) => {
    await createNewJob(data);
    await fetchJobs(); // Refresh the job list
  };

  const handleUpdateJob = async (data: JobFormData) => {
    if (!selectedJob) return;
    await updateExistingJob(selectedJob.jobID, data);
    setSelectedJob(null);
    await fetchJobs(); // Refresh the job list
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setApplyModalOpen(true);
  };

  const handleSubmitApplication = async () => {
    if (!selectedJob) return;
    if (!applicationMessage.trim()) {
      addToast({
        title: "Error",
        description: "Please enter your application message.",
        color: "danger",
        size: "lg",
      });
      return;
    }
    try {
      await sendChatMessage({
        recipientID: selectedJob.user.userID,
        text: applicationMessage.trim(),
        chatType: "job",
      });
      addToast({
        title: "Success",
        description: "Application submitted successfully",
        color: "success",
        size: "lg",
      });
      setApplyModalOpen(false);
      setApplicationMessage("");
      setSelectedJob(null);
    } catch (err: any) {
      addToast({
        title: "Error",
        description: err.message || "Failed to submit application",
        color: "danger",
        size: "lg",
      });
    }
  };

  if (jobsLoading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DefaultLayout>
    );
  }

  if (jobsError) {
    return (
      <DefaultLayout>
        <div>Error: {jobsError}</div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Jobs Board</h1>
          <Button 
            color="primary"
            onPress={() => setIsJobModalOpen(true)}
          >
            Create New Job
          </Button>
        </div>

        <JobList
          jobs={jobs || []}
          currentUserID={user?.userID || ""}
          onEdit={(job) => {
            setSelectedJob(job);
            setIsJobModalOpen(true);
            const formData = {
              title: job.title,
              description: job.description,
              price: Number(job.price),
              contractPeriod: Number(job.contractPeriod),
            };
            setInitialFormData(formData);
          }}
          onDelete={deleteExistingJob}
        />

        <JobModal
          isOpen={isJobModalOpen}
          onClose={() => {
            setIsJobModalOpen(false);
            setSelectedJob(null);
          }}
          onSubmit={selectedJob ? handleUpdateJob : handleCreateJob}
          initialData={selectedJob || undefined}
          mode={selectedJob ? "edit" : "create"}
        />
      </div>
    </DefaultLayout>
  );
};

export default Jobs;
