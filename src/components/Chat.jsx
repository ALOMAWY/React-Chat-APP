import styled from "styled-components";

import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../lib/userStore";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useChatStore } from "../lib/chatStore";
import { format } from "timeago.js";
import { upload } from "../lib/upload";
import { useMyContext } from "./Context";

const ChatStyled = styled.div`
  flex: 2;
  border-left: 1px solid rgb(89, 96, 144);
  border-right: 1px solid rgb(89, 96, 144);
  display: flex;
  flex-direction: column;
`;

const Top = styled.div`
  border-bottom: 1px solid rgb(89, 96, 144);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;

  .user {
    display: flex;
    align-items: center;
    gap: 1rem;
    .image {
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    .texts {
      span {
        font-size: 0.9rem;
        color: #ffffff95;
      }
    }
  }

  .icons {
    display: flex;
    align-items: center;
    gap: 20px;
    img {
      width: 20px;
    }
  }
`;

const Center = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: scroll;

  .seen-status {
    position: relative;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 20px;

    img {
      position: absolute;
      right: 0px;
      width: 20px;
      height: 20px;
    }
  }
`;

const Message = styled.div`
  display: flex;
  align-items: start;
  gap: 0.8rem;
  max-width: 60%;
  width: fit-content;
  padding-bottom: 1rem;

  .image {
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .texts {
    overflow: hidden;
    img {
      width: 100%;
      border-radius: 14px;
      object-fit: cover;
      object-fit: cover;
    }

    p {
      padding: 0.7rem;
      background: rgba(17, 25, 40, 0.5);
      border-radius: 10px;
      word-break: break-all;
    }

    span {
      font-size: 0.8rem;
    }
  }

  &.own {
    position: relative;
    transform: translateX(-100%);
    left: 100%;
    .texts {
      p {
        background: #5183fe;
      }
    }
  }
`;
const Bottom = styled.div`
  form {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1.2rem;
    padding: 15px;
    border-top: 1px solid rgb(89, 96, 144);

    .icons {
      display: flex;
      aling-items: center;
      gap: 15px;

      img {
        width: 24px;
        height: 24px;
      }
    }

    .message-box {
      flex: 1;

      input {
        width: 100%;
        background: rgba(17, 25, 40, 0.5);
        color: #fff;
        border-radius: 10px;
        height: 36px;
        padding: 10px;
        border: none;
        outline: none;
      }
    }

    .emoji {
      position: relative;
      img {
        width: 24px;
        height: 24px;
      }

      .picker {
        position: absolute;
        left: 0;
        bottom: 50px;
      }
    }
    .send-message {
      width: 80px;
      background: #5183fe;
      color: #fff;
      padding: 10px;
      outline: none;
      border: none;
      border-radius: 10px;
    }
  }
`;

const Chat = () => {
  const [img, setImg] = useState({ file: null, url: "" });

  const [open, setOpen] = useState(false);

  const [text, setText] = useState("");

  const [chat, setChat] = useState([]);

  const [isSeen, setIsSeen] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false);

  const {
    addMode,
    setAddMode,
    isInChat,
    setIsInChat,
    isInDetail,
    setIsInDetail,
  } = useMyContext();

  const { currentUser } = useUserStore();

  const { chatId, user, isReceiverBlocked, isCurrentUserBlocked } =
    useChatStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (text === "") return;

    let imgUrl = null;

    if (img.file) {
      imgUrl = await upload(img.file);
    }

    setIsDisabled(true);

    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIds = [currentUser.id, user.id];

      userIds.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);

        const userChatsSnapShot = await getDoc(userChatsRef);

        if (userChatsSnapShot.exists()) {
          const userChatsData = userChatsSnapShot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId == chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;

          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          updateDoc(userChatsRef, { chats: userChatsData.chats });

          if (id !== user.id) setIsSeen(userChatsData.chats[chatIndex].isSeen);
        }
      });

      setText("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsDisabled(false);

      setImg({ file: null, url: "" });
    }
  };

  return (
    <ChatStyled className="chat">
      <Top
        onClick={() => {
          setIsInDetail(true);
          setIsInChat(false);
        }}
      >
        <div className="user">
          <div className="image">
            <img
              src={
                user.blocked.includes(currentUser.id)
                  ? "./avatar.png"
                  : user.avatar || "./avatar.png"
              }
              alt=""
            />
          </div>
          <div className="texts">
            <h3 className="name">
              {user.blocked.includes(currentUser.id) ? "User" : user.username}
            </h3>
            <span className="status">
              {user.blocked.includes(currentUser.id)
                ? ""
                : user.status || "Good"}
            </span>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </Top>
      <Center>
        {chat?.messages?.map((message, index) => (
          <Message
            className={
              message.senderId == currentUser.id ? "message own" : "message"
            }
            key={index}
          >
            <div className="image">
              {index <= chat.messages.length - 2 &&
              chat?.messages[index + 1].senderId == message.senderId ? (
                ""
              ) : message.senderId !== currentUser.id ? (
                <img src={user.avatar || "./avatar.png"} alt="" />
              ) : (
                <img src={currentUser.avatar || "./avatar.png"} alt="" />
              )}
            </div>
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text}</p>
              <span>{format(message.createdAt.toDate())}</span>
            </div>
          </Message>
        ))}
        <div className="seen-status">
          {isSeen ? (
            <img src="./seen.png" alt="" />
          ) : (
            <img src="./notSeen.png" alt="" />
          )}
        </div>

        <div ref={endRef}></div>
      </Center>
      <Bottom>
        <form onSubmit={handleSend}>
          <div className="icons">
            <label htmlFor="img">
              <img className="clickable" src={img.url || "./img.png"} alt="" />
            </label>
            <input
              type="file"
              id="img"
              style={{ display: "none" }}
              onChange={handleImage}
            />
            <img className="clickable" src="./camera.png" alt="" />
            <img className="clickable" src="./mic.png" alt="" />
          </div>
          <div className="message-box">
            <input
              type="text"
              placeholder={
                isCurrentUserBlocked || isReceiverBlocked
                  ? "This Chat Blocked"
                  : "Type A Message"
              }
              value={text}
              disabled={isCurrentUserBlocked || isReceiverBlocked}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
          </div>
          <div className="emoji">
            <img
              src="./emoji.png"
              alt=""
              onClick={() => setOpen((prev) => !prev)}
            />

            <div className="picker">
              <EmojiPicker
                open={open}
                onEmojiClick={(e) => {
                  handleEmoji(e);
                }}
              />
            </div>
          </div>

          <button
            className="send-message"
            disabled={isDisabled || isCurrentUserBlocked || isReceiverBlocked}
          >
            {isDisabled ? "Sending..." : "Send"}
          </button>
        </form>
      </Bottom>
    </ChatStyled>
  );
};

export default Chat;
