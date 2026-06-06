const express = require("express");
const router = express.Router();

// 임시 데이터 (DB 대신)
let trips = [
  {
    id: 1,
    title: "제주도 2박 3일",
    author: "관리자",
  },
  {
    id: 2,
    title: "부산 맛집 여행",
    author: "홍길동",
  },
];


// 🔹 전체 조회
router.get("/", (req, res) => {
  res.json(trips);
});


// 🔹 단일 조회
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const trip = trips.find((t) => t.id === id);

  if (!trip) {
    return res.status(404).json({ message: "trip not found" });
  }

  res.json(trip);
});


// 🔹 여행 추가 (Create)
router.post("/", (req, res) => {
  const { title, author } = req.body;

  // 간단한 id 생성
  const newTrip = {
    id: trips.length > 0 ? trips[trips.length - 1].id + 1 : 1,
    title,
    author,
  };

  trips.push(newTrip);

  res.status(201).json({
    message: "trip added",
    data: newTrip,
  });
});


// 🔹 수정 (Update)
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const trip = trips.find((t) => t.id === id);

  if (!trip) {
    return res.status(404).json({ message: "trip not found" });
  }

  const { title, author } = req.body;

  if (title) trip.title = title;
  if (author) trip.author = author;

  res.json({
    message: "trip updated",
    data: trip,
  });
});


// 🔹 삭제 (Delete)
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = trips.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "trip not found" });
  }

  const deleted = trips.splice(index, 1);

  res.json({
    message: "trip deleted",
    data: deleted[0],
  });
});

module.exports = router;