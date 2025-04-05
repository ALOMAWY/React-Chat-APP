import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { upload } from "../lib/upload";
import { useMyContext } from "./Context";

const LoginStyled = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  width: 100%;

  section {
    width: 50%;

    h2 {
      text-align: center;

      margin: 3rem;
    }

    form {
      width: 60%;
      margin: auto;

      label {
        padding: 1rem;
        display: flex;
        align-items: center;
        border-radius: 10px;
        margin-bottom: 15px;

        img {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          margin-right: 1rem;
        }
      }

      input,
      button {
        width: 100%;
        margin-bottom: 1rem;
        padding: 1.2rem;
        color: #fff;
        border: none;
        outline: none;
        border-radius: 10px;

        &:focus {
          border: none;
          outline: none;
        }
      }
      input {
        background: rgba(17, 25, 40, 0.5);
      }

      button {
        background: #5183fe;
      }
    }
  }

  .seperator {
    width: 1px;
    height: 70%;
    background: #fff;
  }

  @media (max-width: 1120px) {
    flex-direction: column;

    section {
      width: 100%;

      h2 {
        margin: 1.4rem;
      }
    }
    form {
      width: 100%;
    }

    .seperator {
      width: 70%;
      height: 1px;
      background: #fff;
      position: relative;
      &::before {
        content: "SWAP";
        width: 70px;
        height: 70px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: #fff;
        color: #5183fe;
        text-align: center;
        line-height: 4.5;
        font-size: 1rem;
        font-weight: 900;
      }
    }
  }
`;

const Login = () => {
  const [avatar, setAvatar] = useState({ file: null, url: "" });

  const [loading, setLoading] = useState(false);

  const [isSwap, setIsSwap] = useState(true);

  const { isMobile, setIsMobile } = useMyContext();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.target);

    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // toast.success("Account Created ! You Can Login Now! ");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
      e.target.reset();
    }
  };

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgURL = await upload(avatar.file);
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgURL,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account Created ! You Can Login Now! ");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
      e.target.reset();
    }
  };

  const handleSwap = (e) => {
    setIsSwap(!isSwap);
  };
  return (
    <LoginStyled
      className="login"
      style={{
        flexDirection:
          isMobile && isSwap
            ? "column-reverse"
            : isMobile && !isSwap
            ? "column"
            : "row",
      }}
    >
      <section className="sign-in">
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input
            className="check"
            type="email"
            placeholder="Email"
            name="email"
            required
          />
          <input
            className="check"
            type="password"
            placeholder="Password"
            name="password"
            required
            minLength={6}
            maxLength={15}
          />
          <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
        </form>
      </section>
      <div className="seperator" onClick={handleSwap}></div>
      <section className="sign-up">
        <h2>Create An Account</h2>
        <form onSubmit={handleRegister}>
          <input
            className="check"
            type="file"
            id="file"
            style={{ display: "none" }}
            required
            onChange={handleAvatar}
          />
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload Image Here
          </label>
          <input
            className="check"
            type="text"
            placeholder="Username"
            name="username"
            required
            minLength={3}
            maxLength={11}
          />
          <input
            className="check"
            type="email"
            placeholder="Email"
            name="email"
            required
          />
          <input
            className="check"
            type="password"
            placeholder="Password"
            name="password"
            required
            minLength={6}
            maxLength={15}
          />
          <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
        </form>
      </section>
    </LoginStyled>
  );
};

export default Login;
