import styled from "styled-components";
import { useUserStore } from "../lib/userStore";

const UserInfoStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;

  .user {
    display: flex;
    align-items: center;
    gap: 15px;

    img {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .icons {
    display: flex;
    align-items: center;
    gap: 15px;

    img {
      width: 20px;
    }
  }
`;

const UserInfo = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  return (
    <UserInfoStyled className="user-info">
      <div className="user">
        <img src={currentUser.avatar || "./avatar.png"} />
        <h4>{currentUser.username}</h4>
      </div>
      <div className="icons">
        <img src="/more.png" />
        <img src="/video.png" />
        <img src="/edit.png" />
      </div>
    </UserInfoStyled>
  );
};

export default UserInfo;
