import { User } from '@prisma/client';
import React, { createContext, useContext, useState } from 'react';
import { Provider } from 'react-redux';

interface UserContextValue {
    user: User | null | undefined;
  }
  
const UserContext = createContext<User | null | undefined>(null);


export default UserContext;