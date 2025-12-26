import { createContext, useState, type ReactNode } from "react";

export type IsInfoContextType = {
  isInfo: boolean;
  setIsInfo: (newIsInfo: boolean) => void;
};

const IsInfoContext = createContext<IsInfoContextType>({
  isInfo: false,
  setIsInfo: () => {},
});

type IsInfoProviderProps = {
  children: ReactNode;
};

function IsInfoProvider({ children }: IsInfoProviderProps) {
  const [isInfo, setIsInfo] = useState(false);

  const value = {
    isInfo,
    setIsInfo,
  };

  return (
    <IsInfoContext.Provider value={value}>{children}</IsInfoContext.Provider>
  );
}

export { IsInfoContext, IsInfoProvider };
