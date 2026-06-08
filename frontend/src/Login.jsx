function Login({
  username,
  setUsername,
  password,
  setPassword,
  login,
  register,
}) {
  return (
    <div>
      <h1>TripMate 로그인</h1>

      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={login}>
        로그인
      </button>

      {" "}

      <button onClick={register}>
        회원가입
      </button>
    </div>
  );
}

export default Login;