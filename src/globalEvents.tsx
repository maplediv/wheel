// globalEvents.tsx

import React from 'react';

// Event handler function for the login icon click event
export const handleLoginIconClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
  // Prevent the default action of the click event (e.g., following the href)
  event.preventDefault();

  // Add your event handling logic here
  console.log("Login icon clicked!");
  // For example, you can navigate to the login page
  window.location.href = "/login";
};

// Event handler function for creating an account
export const handleCreateAccount = () => {
  // Add your logic for creating an account here
  console.log("Creating an account...");
};
