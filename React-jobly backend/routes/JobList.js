import { useState, useEffect } from 'react';
import request from '../api';

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      let jobs = await request("jobs");
      setJobs(jobs);
    }
    fetchJobs();
  }, []);

  return (
    <div>
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

function JobCard({ job }) {
  return (
    <div>
      <h5>{job.title}</h5>
      <p>Salary: {job.salary}</p>
    </div>
  );
}

export default JobList;
