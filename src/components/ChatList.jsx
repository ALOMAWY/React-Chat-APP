import { useEffect, useState } from "react";
import styled from "styled-components";
import AddUser from "./AddUser";
import { useUserStore } from "../lib/userStore";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useChatStore } from "../lib/chatStore";
import { useMyContext } from "./Context";

const ChatListStyled = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
    border-bottom: 1px solid rgb(89, 96, 144);

  .search-bar {
    flex: 1;
    background: rgba(17, 25, 40, 0.5);
    display: flex;
    align-items: center;
    gap: 20px;
    border-radius: 18px;
    height: 36px;
    padding: 10px;

    img {
      width: 20px;
      height: 20px;
    }

    input {
      background: transparent;
      border: none;
      color: #fff;
      font-weight: normal;

      &:focus {
        border: none;
        outline: none;
      }
    }
  }

  .add {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(17, 25, 40, 0.5);
    cursor: pointer;
    padding: 10px;
    display:flex
    align-items: center;
    justify-content: center;
  }
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
`;
const Item = styled.div`
  width: 100%;
  padding: 0.7rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  border-bottom: 1px solid rgb(89, 96, 144);
  cursor: pointer;
  position: relative;

  .images {
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
  .texts {
    flex: 1;

    span {
      color: #ffffff80;
      word-break: break-all;
    }
  }

  .new {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #5183fe;
    position: absolute;
    top: calc(50%-5px);
    right: 20px;
  }
`;

const ChatList = () => {
  const { addMode, setAddMode, isInChat, setIsInChat } = useMyContext();

  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();

  const { changeChat } = useChatStore();

  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    changeChat(chat.chatId, chat.user);
    if (chat.chatId && chat.user) setIsInChat(true);
  };

  const handleFilter = (e) => {
    setInput(e.target.value.toLowerCase());
  };

  const filteredChats = chats.filter((chat) =>
    chat.user.username.toLowerCase().startsWith(input)
  );
  return (
    <ChatListStyled>
      <Search>
        <div className="search-bar">
          <img src="./search.png" alt="search" />
          <input type="text" placeholder="Search" onChange={handleFilter} />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt="search"
          className="add clickable"
          onClick={() => {
            setAddMode(!addMode);
          }}
        />
      </Search>
      <Items className="items">
        {chats &&
          filteredChats.map((chat, index) => {
            return (
              <Item
                key={index}
                className="clickable"
                onClick={() => {
                  handleSelect(chat);
                }}
              >
                <div className="images">
                  <img
                    src={
                      chat.user.blocked.includes(currentUser.id)
                        ? "./avatar.png"
                        : chat.user.avatar || "./avatar.png"
                    }
                    alt=""
                  />
                </div>
                <div className="texts">
                  <h3>
                    {chat.user.blocked.includes(currentUser.id)
                      ? "User"
                      : chat.user.username}
                  </h3>
                  <span>
                    {chat.user.blocked.includes(currentUser.id)
                      ? ""
                      : chat.lastMessage.length > 20
                      ? chat.lastMessage.substr(0, 15) + "  ...more"
                      : chat.lastMessage}
                  </span>
                </div>
                {chat.user.blocked.includes(currentUser.id)
                  ? null
                  : !chat.isSeen && <div className="new"></div>}
              </Item>
            );
          })}
      </Items>
      {addMode && <AddUser />}
    </ChatListStyled>
  );
};

export default ChatList;
