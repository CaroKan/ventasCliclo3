import { useUser } from 'context/userContext';
import React from 'react';

const PrivateComponent = ({ rolesList, children }) => {
  const { userData } = useUser();

  console.log('User data en el private component',userData);
  if (rolesList.includes(userData.rol)) {
    return children;
  }

  return <></>;
};

export default PrivateComponent;
