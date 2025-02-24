import { useState } from "react";
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
} from "@/services/services";

// what a job looks like in our system
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

// data needed to create or edit a job
interface JobFormData {
  title: string;
  description: string;
  price: number;
  contractPeriod: string;
}

const useJobs = () => {
  // keep track of our jobs, loading state, and any errors
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // get all jobs from the server
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getJobs();
      // show newest jobs first
      const sortedJobs = res.data.jobs.sort((a: Job, b: Job) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setJobs(sortedJobs);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Error fetching jobs");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // create new job
  const createNewJob = async (data: JobFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createJob(data);
      const newJob = res.data.job;
      // put the new job at the top of the list
      setJobs(prev => [newJob, ...prev]);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Error creating job");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // update existing job
  const updateExistingJob = async (jobID: string, data: Partial<JobFormData>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateJob(jobID, data);
      const updatedJob = res.data.job || res.data;
      // replace old job with the updated one
      setJobs(prev => prev.map(job => (job.jobID === jobID ? updatedJob : job)));
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Error updating job");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a job
  const deleteExistingJob = async (jobID: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteJob(jobID);
      // Remove the deleted job from our list
      setJobs(prev => prev.filter(job => job.jobID !== jobID));
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Error deleting job");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Everything the rest of the app needs to work with jobs
  return {
    jobs,
    loading,
    error,
    fetchJobs,
    createNewJob,
    updateExistingJob,
    deleteExistingJob,
    setJobs,
    setError,
    setLoading,
  };
};

export default useJobs; 