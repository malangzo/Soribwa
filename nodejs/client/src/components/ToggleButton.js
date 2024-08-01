import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ToggleContainer = styled.div`
  position: relative;
  margin: 10px;
  cursor: pointer;

  > .toggle-container {
    width: 50px;
    height: 24px;
    border-radius: 30px;
    background-color: rgb(233, 233, 234);
  }

  > .toggle--checked {
    background-color: rgb(0, 200, 102);
    transition: 0.5s;
  }

  > .toggle-circle {
    position: absolute;
    top: 1px;
    left: 1px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: rgb(255, 254, 255);
    transition: 0.5s;
  }

  > .toggle-circle.toggle--checked {
    left: 27px;
    transition: 0.5s;
  }
`;

const ToggleButton = () => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchPermission = async () => {
      const uuid = sessionStorage.getItem('uuid');
      if (!uuid) {
        console.error('UUID is not available in session storage');
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_FASTAPI}/getPermission`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuid }),
        });
        const data = await response.json();
        if (data.has_permission) {
          setIsChecked(true);
        }
      } catch (error) {
        console.error('Error fetching permission:', error);
      }
    };

    fetchPermission();
  }, []);

  const handleToggle = async () => {
    const newStatus = !isChecked ? "yes" : "no";
    setIsChecked(!isChecked);

    const uuid = sessionStorage.getItem('uuid');
    if (!uuid) {
      console.error('UUID is not available in session storage');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_FASTAPI}/updatePermission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid, permission: newStatus }),
      });
      const data = await response.json();
      if (data.status !== "success") {
        console.error('Error updating permission:', data);
      }
    } catch (error) {
      console.error('Error updating permission:', error);
    }
  };

  return (
    <ToggleContainer onClick={handleToggle}>
      <div className={`toggle-container ${isChecked ? 'toggle--checked' : ''}`}></div>
      <div className={`toggle-circle ${isChecked ? 'toggle--checked' : ''}`}></div>
    </ToggleContainer>
  );
};

export default ToggleButton;
