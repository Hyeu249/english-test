import React, { createContext, useContext, useState } from "react";

type ThemeContextType = {
  theme: ThemeMode;
  setTheme: React.Dispatch<React.SetStateAction<ThemeMode>>;

  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;

};

export type ThemeMode = "blue" | "yellow" | "red" | "green";
export type Mode = "light" | "dark";


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const RootProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setTheme] = useState<ThemeMode>("blue"); // giá trị mặc định
  const [mode, setMode] = useState<Mode>("light"); // giá trị mặc định


  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        mode,
        setMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useRootContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useRootContext must be used within RootProvider");
  }
  return context;
};
