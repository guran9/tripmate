import { useEffect, useState } from "react";
import Login from "./Login";

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

  const addTrip = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/trips",
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

  const deleteTrip = (id) => {
  const updatedTrips = trips.filter(
    (trip) => trip.id !== id
  );

  setTrips(updatedTrips);

  localStorage.setItem(
    "trips",
    JSON.stringify(updatedTrips)
  );
};

const updateTrip = () => {
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
      fetch("http://localhost:3000/api/trips")
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

          <button
            onClick={() =>
              setSelectedTrip(
                selectedTrip === trip.id
                  ? null
                  : trip.id
              )
            }
          >
            상세보기
          </button>

          {" "}


            {trip.author === currentUser && (
  <button
    onClick={() => {
      setEditingTrip(trip.id);

      setTitle(trip.title);
      setStartDate(trip.startDate);
      setEndDate(trip.endDate);
      setDescription(trip.description);
    }}
  >
    수정
  </button>
)}

          {trip.author === currentUser && (
  <button
    onClick={() =>
      deleteTrip(trip.id)
    }
  >
    삭제
  </button>
)}

          {selectedTrip === trip.id && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor:
                  "#f5f5f5",
                borderRadius: "5px",
                whiteSpace: "pre-line",
              }}
            >
              {trip.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;