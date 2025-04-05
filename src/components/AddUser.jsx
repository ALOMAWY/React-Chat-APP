import { useEffect, useState } from "react";
import styled from "styled-components";
import { useUserStore } from "../lib/userStore";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useMyContext } from "./Context";

const AddUserStyled = styled.div`
  position: absolute;
  width: max-content;
  height: max-content;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: rgba(17, 25, 40, 0.7);
  padding: 30px;
  border-radius: 10px;
  z-index: 2;

  form {
    margin-bottom: 2rem;
    input {
      border: none;
      outline: none;
      padding: 1rem;
      border-radius: 10px;
      margin-right: 2rem;
    }
    button {
      padding: 1rem 1.5rem;
      background: #5183fe;
      color: #fff;
      border: none;
      outline: none;
      border-radius: 10px;
    }
  }
  .user {
    display: flex;
    align-itens: center;
    justify-content: space-between;

    .detail {
      display: flex;
      gap: 1rem;
      align-items: center;

      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    button {
      padding: 10px 15px;
      background: #5183fe;
      color: #fff;
      border: none;
      outline: none;
      border-radius: 10px;
    }
  }
`;

const AddUser = () => {
  const { addMode, setAddMode } = useMyContext();

  const [user, setUser] = useState(null);

  const { currentUser } = useUserStore();

  const [IsDisabled, setIsDisabled] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const quarySnapShot = await getDocs(q);

      if (!quarySnapShot.empty) {
        setUser(quarySnapShot.docs[0].data());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    const chatsRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");
    setIsDisabled(true);
    try {
      const newChatRef = doc(chatsRef);

      const chatId = newChatRef.id;

      const currentUserChatsSnap = await getDoc(
        doc(userChatsRef, currentUser.id)
      );

      if (currentUserChatsSnap.exists()) {
        const currentUserChats = currentUserChatsSnap.data().chats || [];

        const existingChats = currentUserChats.find(
          (chat) => chat.receiverId == user.id
        );

        if (existingChats) return;

        await setDoc(newChatRef, {
          createdAt: serverTimestamp(),
          messages: [],
        });

        await updateDoc(doc(userChatsRef, currentUser.id), {
          chats: arrayUnion({
            chatId,
            lastMessage: "",
            receiverId: user.id,
            updatedAt: Date.now(),
          }),
        });

        await updateDoc(doc(userChatsRef, user.id), {
          chats: arrayUnion({
            chatId,
            lastMessage: "",
            receiverId: currentUser.id,
            updatedAt: Date.now(),
          }),
        });
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsDisabled(false);
      setAddMode(false);
    }
  };

  return (
    <AddUserStyled className="add-user">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd} disabled={IsDisabled}>
            Add User
          </button>
        </div>
      )}
    </AddUserStyled>
  );
};

export default AddUser;
