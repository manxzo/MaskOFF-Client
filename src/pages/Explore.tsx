import  { useEffect,useContext } from "react";
import DefaultLayout from "@/layouts/default";
import usePosts from "@/hooks/usePosts";
import useJobs from "@/hooks/useJobs";
import { Card, CardHeader, CardBody, Divider, Spinner } from "@heroui/react";
import { title, subtitle } from "@/components/primitives";
import { GlobalConfigContext } from "@/config/GlobalConfig";

const Explore = () => {
  const { posts, loading: postsLoading, error: postsError, fetchPosts } = usePosts();
  const { jobs, loading: jobsLoading, error: jobsError, fetchJobs } = useJobs();
  const {refresh} = useContext(GlobalConfigContext);
  useEffect(() => {
    fetchPosts();
    fetchJobs();
  }, [refresh, fetchPosts, fetchJobs]);


  return (
    <DefaultLayout>
      <div className="p-8">
        <h1 className={title({ size: "lg", color: "cyan", fullWidth: true })}>Explore</h1>
        <p className={subtitle({ fullWidth: true })}>
          Discover the latest posts and job opportunities from the community.
        </p>
        <Divider className="my-6" />

        <section>
          <h2 className={title({ size: "md", color: "violet", fullWidth: true })}>Recent Posts</h2>
          {postsLoading ? (
            <Spinner size="lg" />
          ) : postsError ? (
            <p className="text-red-500">{postsError}</p>
          ) : posts.length === 0 ? (
            <p>No posts available.</p>
          ) : (
            posts.map((post: any) => (
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
                      Tags: {post.tags.join(", ")}
                    </p>
                  )}
                </CardBody>
              </Card>
            ))
          )}
        </section>

        <Divider className="my-6" />

        <section>
          <h2 className={title({ size: "md", color: "violet", fullWidth: true })}>
            Latest Jobs
          </h2>
          {jobsLoading ? (
            <Spinner size="lg" />
          ) : jobsError ? (
            <p className="text-red-500">{jobsError}</p>
          ) : jobs.length === 0 ? (
            <p>No jobs available.</p>
          ) : (
            jobs.map((job: any) => (
              <Card key={job.jobID} className="mb-4">
                <CardHeader>
                  <h3 className={title({ size: "sm" })}>{job.title}</h3>
                  <p>Posted by: {job.user.username}</p>
                </CardHeader>
                <CardBody>
                  <p>{job.description}</p>
                  <p>
                    Price: ${job.price} | Contract: {job.contractPeriod} days
                  </p>
                </CardBody>
              </Card>
            ))
          )}
        </section>
      </div>
    </DefaultLayout>
  );
};

export default Explore;
