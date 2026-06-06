import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/message")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>TripMate</h1>
      <p>여행 계획 공유 서비스</p>

      <hr />

      <h2>백엔드 응답</h2>
      <p>{message}</p>
    </div>
  );
}

export default App;