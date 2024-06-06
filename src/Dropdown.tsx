import React, { useState } from 'react';

interface DropdownProps {
  title: string;
}

const Dropdown: React.FC<DropdownProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown">
      <button className="btn btn-secondary dropdown-toggle" type="button" onClick={toggleDropdown}>
        {title}
      </button>
      {isOpen && (
        <div className="dropdown-menu show">
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
