import { User } from '@prisma/client';
import React, { createContext, useContext, useState } from 'react';
import { Provider } from 'react-redux';

interface UserContextValue {
    user: User | null | undefined;
    setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
  }
  
const UserContext = createContext<UserContextValue>({
    user: null,
    setUser: () => {}
});


export default UserContext;