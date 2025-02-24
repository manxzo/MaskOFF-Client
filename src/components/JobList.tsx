import { useState } from "react";
import { Button, Card, CardHeader, CardBody, CardFooter, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea, Spinner } from "@heroui/react";
import { getJobApplications, updateApplicationStatus, applyToJob } from "@/services/services";
import { addToast } from "@heroui/toast";
import useChats from "@/hooks/useChats";
// what a job looks like in our app
interface Job {
  jobID: string;
  title: string;
  description: string;
  price: number;
  contractPeriod: string;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    userID: string;
    username: string;
    publicInfo: {
      bio: string;
    };
  };
}

// props needed for job list
interface JobListProps {
  jobs: Job[];
  currentUserID: string;
  onEdit: (job: Job) => void;
  onDelete: (jobID: string) => void;
}

interface Application {
  applicationID: string;
  applicant: {
    userID: string;
    username: string;
    name: string;
  };
  status: "pending" | "accepted" | "rejected";
  message?: string;
  createdAt: string;
}

const JobList = ({ jobs, currentUserID, onEdit, onDelete }: Omit<JobListProps, 'onApply'>) => {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState("");
 const {sendChatMessage} = useChats();
  // check if current user created this job
  const isJobAuthor = (job: Job) => {
    // added null checks
    if (!job.user || !job.user.userID || !currentUserID) return false;
    return job.user.userID === currentUserID;
  };

  // make dates look nice and readable
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'Date not available';
    }
  };

  const handleViewApplications = async (jobID: string) => {
    try {
      setLoading(true);
      const res = await getJobApplications(jobID);
      setApplications(res.data.applications);
      setExpandedJob(expandedJob === jobID ? null : jobID);
    } catch (err) {
      addToast({
        title: "Error",
        description: "Failed to load applications",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (jobID: string, applicationID: string, status: 'accepted' | 'rejected') => {
    try {
      const res = await updateApplicationStatus(jobID, applicationID, status);
      setApplications(apps => 
        apps.map(app => 
          app.applicationID === applicationID 
            ? res.data.application 
            : app
        )
      );
      addToast({
        title: "Success",
        description: `Application ${status} successfully`,
        color: "success",
      });
    } catch (err) {
      addToast({
        title: "Error",
        description: "Failed to update application status",
        color: "danger",
      });
    }
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setApplyModalOpen(true);
  };

  const handleSubmitApplication = async () => {
    if (!selectedJob) return;
    
    try {
      await applyToJob(selectedJob.jobID, applicationMessage);
      await sendChatMessage({
        recipientID: selectedJob.user.userID,
        text: applicationMessage.trim(),
        chatType: "job",
        jobID:selectedJob.jobID
      });
      addToast({
        title: "Success",
        description: "Application submitted successfully",
        color: "success",
      });
      setApplyModalOpen(false);
      setApplicationMessage("");
      setSelectedJob(null);
    } catch (err) {
      // Error toast is handled by the interceptor
    }
  };

  return (
    <div>
      {/* loop through all jobs and show them as cards */}
      {jobs?.map((job) => (
        <Card key={job.jobID} className="mb-4">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">{job.title}</h3>
                <p className="text-sm text-gray-500">Posted {formatDate(job.createdAt)} by {job.user.username}</p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <p>{job.description}</p>
            <p className="text-md text-teal-500">Price: ${job.price} | <span>Contract Period: {job.contractPeriod} days</span></p>
          </CardBody>
          <CardFooter>
            {isJobAuthor(job) ? (
              <div className="flex flex-col w-full gap-2">
                <div className="flex gap-2">
                  <Button variant="flat" onPress={() => onEdit(job)}>
                    Edit
                  </Button>
                  <Button variant="ghost" onPress={() => onDelete(job.jobID)}>
                    Delete
                  </Button>
                  <Button 
                    variant="flat" 
                    onPress={() => handleViewApplications(job.jobID)}
                  >
                    {expandedJob === job.jobID ? 'Hide Applications' : 'View Applications'}
                  </Button>
                </div>
                
                {expandedJob === job.jobID && (
                  <div className="mt-4">
                    <h4>Applications</h4>
                    {loading ? (
                      <div className="flex justify-center p-4">
                        <Spinner size="sm" />
                      </div>
                    ) : applications.length === 0 ? (
                      <p>No applications yet</p>
                    ) : (
                      applications.map(app => (
                        <div key={app.applicationID} className="border p-4 rounded mb-2">
                          <p>From: {app.applicant.name} (@{app.applicant.username})</p>
                          {app.message && <p>Message: {app.message}</p>}
                          <p>Status: {app.status}</p>
                          {app.status === 'pending' && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                color="success"
                                onPress={() => handleUpdateStatus(job.jobID, app.applicationID, 'accepted')}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                onPress={() => handleUpdateStatus(job.jobID, app.applicationID, 'rejected')}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Button 
                variant="solid" 
                onPress={() => handleApplyClick(job)}
                disabled={job.isComplete}
              >
                {job.isComplete ? "Job Completed" : "Apply Now"}
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}

      <Modal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Apply for Job</ModalHeader>
          <ModalBody>
            <Textarea
              label="Application Message"
              placeholder="Why should we hire you?"
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={() => setApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSubmitApplication}>
              Submit Application
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default JobList; 