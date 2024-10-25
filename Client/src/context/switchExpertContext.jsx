import { createContext, useContext, useState } from "react";
import React from 'react';

const switchcontext = createContext(null);

export const useSwitchExpertContext = () => {
  return useContext(switchcontext);
};

export default function SwitchExpertContext({ children }) {
  const [state, setState] = useState(false);

  return (
    <switchcontext.Provider value={{ state, setState }}>
      {children}
    </switchcontext.Provider>
  );
}
