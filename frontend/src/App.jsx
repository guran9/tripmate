import { useEffect, useState } from "react";
import Login from "./Login";
const API_URL = "https://tripmate-05xu.onrender.com";

function App() {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [editingTrip, setEditingTrip] = useState(null);

  const [selectedTrip, setSelectedTrip] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");

  const [likes, setLikes] = useState({});

  const addTrip = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/trips`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            author: currentUser,
            startDate,
            endDate,
            description,
          }),
        }
      );

      const result = await response.json();

      const updatedTrips = [...trips, result.trip];

      setTrips(updatedTrips);

      localStorage.setItem(
        "trips",
        JSON.stringify(updatedTrips)
      );

      setTitle("");
      setStartDate("");
      setEndDate("");
      setDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTrip = async (id) => {
  try {
    await fetch(`${API_URL}/api/trips/${id}`, {
      method: "DELETE",
    });

    const updatedTrips = trips.filter(
      (trip) => trip.id !== id
    );

    setTrips(updatedTrips);

    localStorage.setItem(
      "trips",
      JSON.stringify(updatedTrips)
    );
  } catch (error) {
    console.error(error);
  }
};

const updateTrip = async () => {
  try {
    await fetch(
      `${API_URL}/api/trips/${editingTrip}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          startDate,
          endDate,
          description,
        }),
      }
    );

    const updatedTrips = trips.map((trip) =>
      trip.id === editingTrip
        ? {
            ...trip,
            title,
            startDate,
            endDate,
            description,
          }
        : trip
    );

    setTrips(updatedTrips);

    localStorage.setItem(
      "trips",
      JSON.stringify(updatedTrips)
    );

    setEditingTrip(null);
    setTitle("");
    setStartDate("");
    setEndDate("");
    setDescription("");
  } catch (error) {
    console.error(error);
  }
};

  const register = () => {
    const users =
      JSON.parse(
        localStorage.getItem("users")
      ) || [];

    users.push({
      username,
      password,
    });

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    alert("회원가입 완료");
  };

  const addComment = (tripId) => {
    if (!commentText.trim()) return;

      const newComment = {
        author: currentUser,
        text: commentText,
      };

  const updatedComments = {
    ...comments,
    [tripId]: [
      ...(comments[tripId] || []),
      newComment,
    ],
  };

  setComments(updatedComments);

  localStorage.setItem(
    "comments",
    JSON.stringify(updatedComments)
  );

  setCommentText("");
};

const toggleLike = (tripId) => {
  const currentLikes = likes[tripId];

  const likedUsers = Array.isArray(currentLikes)
    ? currentLikes
    : [];

  const alreadyLiked = likedUsers.includes(currentUser);

  const updatedLikes = {
    ...likes,
    [tripId]: alreadyLiked
      ? likedUsers.filter((user) => user !== currentUser)
      : [...likedUsers, currentUser],
  };

  setLikes(updatedLikes);

  localStorage.setItem(
    "likes",
    JSON.stringify(updatedLikes)
  );
};

  const login = () => {
    const users =
      JSON.parse(
        localStorage.getItem("users")
      ) || [];

    const user = users.find(
      (u) =>
        u.username === username &&
        u.password === password
    );

    if (!user) {
      alert("로그인 실패");
      return;
    }

    localStorage.setItem(
      "currentUser",
      user.username
    );

    setCurrentUser(user.username);
  };

  useEffect(() => {
    const savedTrips =
      localStorage.getItem("trips");

    if (savedTrips) {
      setTrips(JSON.parse(savedTrips));
    } else {
      fetch(`${API_URL}/api/trips`)
        .then((response) =>
          response.json()
        )
        .then((data) => {
          setTrips(data);

          localStorage.setItem(
            "trips",
            JSON.stringify(data)
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    const user =
      localStorage.getItem("currentUser");

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
  const savedComments =
    localStorage.getItem("comments");

  if (savedComments) {
    setComments(
      JSON.parse(savedComments)
    );
  }
}, []);

  useEffect(() => {
  const savedLikes = localStorage.getItem("likes");

  if (savedLikes) {
    setLikes(JSON.parse(savedLikes));
  }
}, []);

  if (!currentUser) {
    return (
      <Login
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        login={login}
        register={register}
      />
    );
  }

  const filteredTrips = trips.filter((trip) =>
    trip.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>✈️ TripMate</h1>

      <p>
        현재 로그인 : {currentUser}
      </p>

      <button
        onClick={() => {
          localStorage.removeItem(
            "currentUser"
          );

          setCurrentUser(null);
        }}
      >
        로그아웃
      </button>

      <p>여행 계획 공유 서비스</p>

      <hr />

      <h2>여행 등록</h2>

      <input
        type="text"
        placeholder="여행 제목"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <input
        type="date"
        value={startDate}
        onChange={(e) =>
          setStartDate(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) =>
          setEndDate(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <textarea
        placeholder="상세 일정을 입력하세요"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
        rows="6"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      {editingTrip ? (
  <button onClick={updateTrip}>
    수정 저장
  </button>
) : (
  <button onClick={addTrip}>
    여행 등록
  </button>
)}

      <hr />

      <input
        type="text"
        placeholder="여행 검색"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      <h2>공유된 여행 계획</h2>

      {filteredTrips.map((trip) => (
        <div
          key={trip.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <h3>{trip.title}</h3>

          <p>작성자 : {trip.author}</p>

          <p>
            기간 : {trip.startDate} ~{" "}
            {trip.endDate}
          </p>

          <div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
  }}
>
  <button
    onClick={() =>
      setSelectedTrip(
        selectedTrip === trip.id ? null : trip.id
      )
    }
  >
    상세보기
  </button>

  <button onClick={() => toggleLike(trip.id)}>
    ❤️ {Array.isArray(likes[trip.id]) ? likes[trip.id].length : 0}
  </button>

  {trip.author === currentUser && (
    <button
      onClick={() => {
        setEditingTrip(trip.id);
        setTitle(trip.title);
        setStartDate(trip.startDate);
        setEndDate(trip.endDate);
        setDescription(trip.description);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      수정
    </button>
  )}

  {trip.author === currentUser && (
    <button onClick={() => deleteTrip(trip.id)}>
      삭제
    </button>
  )}
</div>

          {selectedTrip === trip.id && (
  <div
    style={{
      marginTop: "10px",
      padding: "10px",
      backgroundColor: "#f5f5f5",
      borderRadius: "5px",
      whiteSpace: "pre-line",
    }}
  >
    <h4>상세 일정</h4>

    <p>{trip.description}</p>

    <hr />

    <h4>댓글</h4>

    {(comments[trip.id] || []).map(
      (comment, index) => (
        <div key={index}>
          <strong>
            {comment.author}
          </strong>

          <p>{comment.text}</p>

          <hr />
        </div>
      )
    )}

    <input
      type="text"
      placeholder="댓글 입력"
      value={commentText}
      onChange={(e) =>
        setCommentText(e.target.value)
      }
      style={{
        width: "100%",
        padding: "8px",
      }}
    />

    <br />
    <br />

    <button
      onClick={() =>
        addComment(trip.id)
      }
    >
      댓글 등록
    </button>
  </div>
)}
        </div>
      ))}
    </div>
  );
}

export default App;