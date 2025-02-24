import React, { useEffect, useContext, useState } from "react";
import DefaultLayout from "@/layouts/default";
import usePosts from "@/hooks/usePosts";
import useJobs from "@/hooks/useJobs";
import useChats from "@/hooks/useChats";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Spinner,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
} from "@heroui/react";
import { title, subtitle } from "@/components/primitives";
import { GlobalConfigContext } from "@/config/GlobalConfig";

// explore page with updated details for posts and jobs
const Explore = () => {
  const { posts, loading: postsLoading, error: postsError, fetchPosts } = usePosts();
  const { jobs, loading: jobsLoading, error: jobsError, fetchJobs } = useJobs();
  const { refresh } = useContext(GlobalConfigContext);
  const { sendChatMessage } = useChats();

  // state for job application modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");

  // fetch posts and jobs when refresh changes
  useEffect(() => {
    fetchPosts();
    fetchJobs();
  }, [refresh]);

  // format date and time
  const convertDate = (timestamp) => {
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleString("en-us", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // open apply modal for job
  const handleApply = (job) => {
    setSelectedJob(job);
    setApplyModalOpen(true);
  };

  // send application via chat message
  const handleSubmitApplication = async () => {
    if (!selectedJob) return;
    if (!applicationMessage.trim()) return;
    try {
      await sendChatMessage({
        recipientID: selectedJob.user.userID,
        text: applicationMessage.trim(),
        chatType: "job",
      });
      setApplyModalOpen(false);
      setApplicationMessage("");
      setSelectedJob(null);
    } catch (err) {
      // handle error
    }
  };

  return (
    <DefaultLayout>
      <div className="p-8">
        <h1 className={title({ size: "lg", color: "cyan", fullWidth: true })}>
          Explore
        </h1>
        <p className={subtitle({ fullWidth: true })}>
          discover the latest posts and job opportunities from the community.
        </p>
        <Divider className="my-6" />

        {/* posts section */}
        <section>
          <h2 className={title({ size: "md", color: "violet", fullWidth: true })}>
            Recent Posts
          </h2>
          {postsLoading ? (
            <Spinner size="lg" />
          ) : postsError ? (
            <p className="text-red-500">{postsError}</p>
          ) : posts.length === 0 ? (
            <p>No Posts Available.</p>
          ) : (
            posts.slice(0, 5).map((post: any) => (
              <Card key={post.postID || post._id} className="mb-4">
                <CardHeader>
                  <h3 className={title({ size: "sm" })}>
                    {post.isAnonymous ? post.user.anonymousIdentity : post.user.username}
                  </h3>
                </CardHeader>
                <CardBody>
                  <p>{post.content}</p>
                  {post.tags && post.tags.length > 0 && (
                    <p className="text-sm italic text-gray-500">
                      tags: {post.tags.join(", ")}
                    </p>
                  )}
                </CardBody>
                <CardFooter className="flex justify-between items-center text-sm">
                  <div className="flex space-x-4">
                    <span>👍 {post.upvotedBy?.length || 0}</span>
                    <span>👎 {post.downvotedBy?.length || 0}</span>
                    <span>💬 {post.comments?.length || 0} comments</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {convertDate(post.createdAt)}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </section>

        <Divider className="my-6" />

        {/* jobs section */}
        <section>
          <h2 className={title({ size: "md", color: "violet", fullWidth: true })}>
            Latest Jobs
          </h2>
          {jobsLoading ? (
            <Spinner size="lg" />
          ) : jobsError ? (
            <p className="text-red-500">{jobsError}</p>
          ) : jobs.length === 0 ? (
            <p>No Jobs Available.</p>
          ) : (
            jobs.slice(0, 5).map((job: any) => (
              <Card key={job.jobID} className="mb-4">
                <CardHeader className="flex flex-col">
                  <h3 className={title({ size: "sm" })}>{job.title}</h3>
                  <p className="text-sm text-gray-500">
                    Posted by: {job.user.username}
                  </p>
                </CardHeader>
                <CardBody>
                  <p>{job.description}</p>
                  <p className="text-md text-teal-500">
                    Price: ${job.price} | Contract: {job.contractPeriod} days
                  </p>
                </CardBody>
                <CardFooter className="flex justify-between items-center text-sm">
                  <span className="text-xs text-gray-500">
                    Posted: {convertDate(job.createdAt)}
                  </span>
                  <Button
                    variant="solid"
                    size="sm"
                    onPress={() => handleApply(job)}
                    disabled={job.isComplete}
                  >
                    {job.isComplete ? "Job Completed" : "Apply Now"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </section>
      </div>

      {/* modal for job application */}
      {applyModalOpen && (
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
      )}
    </DefaultLayout>
  );
};

export default Explore;