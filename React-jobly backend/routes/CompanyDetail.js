import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import request from '../api';

function CompanyDetail() {
  const { handle } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    async function fetchCompany() {
      let company = await request(`companies/${handle}`);
      setCompany(company);
    }
    fetchCompany();
  }, [handle]);

  if (!company) return <p>Loading...</p>;

  return (
    <div>
      <h2>{company.name}</h2>
      <p>{company.description}</p>
      <h3>Jobs</h3>
      {company.jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

export default CompanyDetail;
