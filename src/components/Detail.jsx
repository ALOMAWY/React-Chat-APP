import styled from "styled-components";
import { auth, db } from "../lib/firebase";
import { useUserStore } from "../lib/userStore";
import { useChatStore } from "../lib/chatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useMyContext } from "./Context";

const DetailStyled = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  .user {
    flex: 1;
    width: 100%;
    text-align: center;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgb(89, 96, 144);

    & .mobile {
      position: absolute;
      width: 60px;
      height: 60px;
      padding: 0.5rem;
      border: 1px solid #fff;
      border-radius: 50%;
      margin-top: 0.5rem;
      margin-left: 0.5rem;

      & .back {
        content: "";
        position: absolute;
        left: -0.5rem;
        border: 20px solid transparent;
        border-right: 20px solid #fff;
      }
    }

    img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin: 1.3rem;
      object-fit: cover;
    }

    h2 {
      margin: 0 1rem 1rem;
    }

    p {
      font-size: 0.85rem;
      margin: 0 1rem;
    }
  }

  .info {
    overflow: auto;
    padding: 15px;
    .option {
      margin-bottom: 1.4rem;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;

        > img {
          width: 30px;
          height: 30px;
          background: rgba(17, 25, 40, 0.5);
          padding: 7px;
          border-radius: 50%;
        }
      }
      .photos {
        .photoItem {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 1rem 0;

          .images {
            display: flex;
            align-items: center;
            gap: 20px;

            img {
              width: 50px;
              height: 50px;
              border-radius: 10px;
            }
          }

          img.download {
            width: 30px;
            height: 30px;
            background: rgba(17, 25, 40, 0.5);
            padding: 7px;
            border-radius: 50%;
          }
        }
      }
    }
  }

  .block-user-btn,
  .logout-btn {
    flex: 1;
    padding: 15px;

    button {
      width: 100%;
      padding: 7px;
      color: #fff;
      font-size: 1.1rem;
      border-radius: 10px;

      &.block-user {
        background-color: rgba(230, 74, 105, 0.553);
        border: none;
        margin-botom: 2rem;
        margin-top: 1rem;
      }

      &.logout {
        margin-top: 1rem;
        background-color: #5183fe;
        border: none;
      }
    }
  }

  .block-user-btn {
    border-bottom: 1px solid rgb(89, 96, 144);
  }
`;

const Detail = () => {
  const {
    addMode,
    setAddMode,
    isInChat,
    setIsInChat,
    isMobile,
    isInDetail,
    setIsInDetail,
  } = useMyContext();

  const { currentUser } = useUserStore();

  const { chatId, user, changeBlock, isReceiverBlocked, isCurrentUserBlocked } =
    useChatStore();

  const handleBlock = async () => {
    if (!user) return;

    const usersDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(usersDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });

      changeBlock();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <DetailStyled className="detail">
      <div className="user">
        {isMobile && (
          <div
            className="mobile"
            onClick={() => {
              setIsInChat(false);
              setIsInDetail(false);
            }}
          >
            <div className="back"></div>
          </div>
        )}
        <img
          src={
            user.blocked.includes(currentUser.id)
              ? "./avatar.png"
              : user.avatar || "./avatar.png"
          }
          alt="avatar"
        />
        <h2>
          {user.blocked.includes(currentUser.id) ? "User" : user.username}
        </h2>
        <p>
          {user.blocked.includes(currentUser.id) ? "" : user.status || "Good"}
        </p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings </span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privecy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos </span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="images">
                <img
                  src="https://c4.wallpaperflare.com/wallpaper/367/252/59/5bd3350aedb54-wallpaper-preview.jpg"
                  alt=""
                />
                <span>photo_untitled_2025.png</span>
              </div>
              <img src="./download.png" alt="" className="download" />
            </div>
            <div className="photoItem">
              <div className="images">
                <img
                  src="https://c4.wallpaperflare.com/wallpaper/267/451/736/5bd32e1029d00-wallpaper-preview.jpg"
                  alt=""
                />
                <span>photo_untitled_2025.png</span>
              </div>
              <img src="./download.png" alt="" className="download" />
            </div>
            <div className="photoItem">
              <div className="images">
                <img
                  src="https://c4.wallpaperflare.com/wallpaper/666/665/244/the-magic-islands-of-lofoten-norway-europe-winter-morning-light-landscape-desktop-hd-wallpaper-for-pc-tablet-and-mobile-3840%C3%972160-wallpaper-preview.jpg"
                  alt=""
                />
                <span>photo_untitled_2025.png</span>
              </div>
              <img src="./download.png" alt="" className="download" />
            </div>
            <div className="photoItem">
              <div className="images">
                <img
                  src="https://c4.wallpaperflare.com/wallpaper/157/62/574/hummingbirds-and-pink-flowers-4k-ultra-hd-wallpaper-for-desktop-laptop-tablet-mobile-phones-and-tv-3840%D1%852400-wallpaper-preview.jpg"
                  alt=""
                />
                <span>photo_untitled_2025.png</span>
              </div>
              <img src="./download.png" alt="" className="download" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
      </div>
      <div className="block-user-btn">
        <button
          className="block-user"
          onClick={handleBlock}
          disabled={isCurrentUserBlocked}
        >
          {isCurrentUserBlocked
            ? "You Are Blocked !"
            : isReceiverBlocked
            ? "User Blocked"
            : "Block User"}
        </button>
      </div>

      <div className="logout-btn">
        <button
          className="logout"
          onClick={() => {
            auth.signOut();
          }}
        >
          Logout
        </button>
      </div>
    </DetailStyled>
  );
};

export default Detail;
