import { createContext, useContext, useState } from "react";

const MyContext = createContext(undefined);

export const MyProvider = ({ children }) => {
  const [addMode, setAddMode] = useState("");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1120);

  const [isInChat, setIsInChat] = useState(false);
  const [isInDetail, setIsInDetail] = useState(false);

  console.log("Is Mobile :", isMobile);

  console.log("Is In Chat :", isInChat);

  console.log("Is In Detail :", isInDetail);

  const handleResize = (e) => {
    setIsMobile(window.innerWidth < 1120);
  };

  window.addEventListener("resize", handleResize);

  return (
    <MyContext.Provider
      value={{
        addMode,
        setAddMode,
        isMobile,
        setIsMobile,
        isInChat,
        setIsInChat,
        isInDetail,
        setIsInDetail,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);

  if (!context) throw new Error("useMyContext must be used within MyProvider");

  return context;
};
