import { useState, useEffect } from 'react';
import request from '../api';

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchCompanies() {
      let companies = await request("companies", { search: searchTerm });
      setCompanies(companies);
    }
    fetchCompanies();
  }, [searchTerm]);

  function handleSearch(evt) {
    setSearchTerm(evt.target.value);
  }

  return (
    <div>
      <input type="text" placeholder="Search companies..." onChange={handleSearch} />
      {companies.map(company => (
        <CompanyCard key={company.handle} company={company} />
      ))}
    </div>
  );
}

export default CompanyList;
