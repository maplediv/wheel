// Wait for the DOM content to be fully loaded before executing any JavaScript code
document.addEventListener("DOMContentLoaded", function() {
    // Select the login icon element by its ID
    var loginIcon = document.getElementById("loginIcon");
  
    // Check if the login icon element exists
    if (loginIcon) {
      // Attach the handleLoginIconClick function as an event listener for the "click" event
      loginIcon.addEventListener("click", handleLoginIconClick);
    }
  });
  
  // Event handler function for the login icon click event
  function handleLoginIconClick(event) {
    // Prevent the default action of the click event (e.g., following the href)
    event.preventDefault();
  
    // Add your event handling logic here
    console.log("Login icon clicked!");
    // For example, you can navigate to the login page
    window.location.href = "/login";
  }

  const handleLoginFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Add logic to handle login form submission
  };
  
  // Inside the conditional rendering block for the login form
  <form onSubmit={handleLoginFormSubmit}>
    {/* Input fields */}
    <button type="submit" className="btn btn-primary">Login</button>
  </form>
  