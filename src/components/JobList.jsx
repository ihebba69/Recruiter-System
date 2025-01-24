// src/components/JobList.js
import React, { useEffect, useState } from 'react';
import { getJobs } from '../api';

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await getJobs();
      setJobs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Available Jobs</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job._id}>
              <td>{job._id}</td>
              <td>{job.title}</td>
              <td>{job.company}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobList;