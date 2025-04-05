import List from "./components/List";
import Chat from "./components/Chat";
import Detail from "./components/Detail";
import Login from "./components/Login";
import Notification from "./components/Notification";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import styled from "styled-components";
import { useChatStore } from "./lib/chatStore";
import EmptyErea from "./components/EmptyArea";
import { useMyContext } from "./components/Context";

const Container = styled.main`
  width: 90vw;
  height: 90vh;
  background-color: rgba(17, 25, 40, 0.75);
  backdrop-filter: blur(19px) saturate(180%);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.125);
  display: flex;
`;

const Loading = styled.div`
  padding: 50px;
  background: rgba(17, 25, 40, 0.9);
  font-size: 1.5rem;
  border-radius: 10px;
`;

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  const { isMobile, setIsMobile, isInChat, isInDetail, setIsInDetail } =
    useMyContext();

  const [Holder, setHolder] = useState(() => Login);

  const { chatId } = useChatStore();
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);

      return () => {
        unSub();
      };
    });
  }, [fetchUserInfo]);

  useEffect(() => {
    if (currentUser) {
      if (!isInChat && !isInDetail) {
        setHolder(() => List);
      } else if (isInChat) {
        setHolder(() => Chat);
      } else if (isInDetail) {
        setHolder(() => Detail);
      }
    }

  }, [currentUser, isInChat, isInDetail]);

  if (isLoading) return <Loading>Loading...</Loading>;

  return (
    <Container
      style={{
        width: isMobile ? "100vw" : "90vw",
        borderRadius: isMobile ? "0px" : "10px",
        marginTop: isMobile ? "15vw" : "",
      }}
    >
      {isMobile ? (
        <Holder />
      ) : currentUser ? (
        <>
          <List />
          {chatId ? (
            <>
              <Chat />
              <Detail />
            </>
          ) : (
            <EmptyErea></EmptyErea>
          )}
        </>
      ) : (
        <Login></Login>
      )}

      <Notification />
    </Container>
  );
};

export default App;
//
//  {
//    currentUser ? (
//      <>
//        {isMobile ? (
//          <Holder></Holder>
//        ) : (
//          <>
//            <List />
//            {chatId ? (
//              <>
//                <Chat />
//                <Detail />
//              </>
//            ) : (
//              <EmptyErea></EmptyErea>
//            )}
//          </>
//        )}
//      </>
//    ) : (
//      <Login />
//    );
//  }

//
