function JobCard({ job }) {
    async function applyToJob() {
      try {
        await request(`jobs/${job.id}/apply`, {}, 'post');
        alert("Applied!");
      } catch (err) {
        console.error(err);
      }
    }
  
    return (
      <div>
        <h5>{job.title}</h5>
        <button onClick={applyToJob}>Apply</button>
      </div>
    );
  }
  
  export default JobCard;
  