// src/components/JobDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getJobById } from '../api';

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await getJobById(id);
      setJob(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1>{job.title} - {job.company}</h1>
      <p>{job.description}</p>
      {/* ApplicationForm component can be added here */}
    </div>
  );
}

export default JobDetail;