import styled from "styled-components";
import UserInfo from "./UserInfo";
import ChatList from "./ChatList";
import { MyProvider, useMyContext } from "./Context";

const ListStyled = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const List = () => {
  return (
    <ListStyled className="list">
      <UserInfo />
      <ChatList />
    </ListStyled>
  );
};

export default List;
