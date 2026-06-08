const db = require("../db");
const express = require("express");

const router = express.Router();

const trips = [
  {
    id: 1,
    title: "제주도 2박 3일",
    author: "관리자",
    startDate: "2026-07-01",
    endDate: "2026-07-03",
    description:
      "DAY1\n성산일출봉\n협재해수욕장\n\nDAY2\n우도\n카페투어",
  },
  {
    id: 2,
    title: "부산 맛집 여행",
    author: "홍길동",
    startDate: "2026-08-10",
    endDate: "2026-08-12",
    description:
      "DAY1\n광안리\n\nDAY2\n해운대\n\nDAY3\n감천문화마을",
  },
];

router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM trips",
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json(err);
      }

      res.json(results);
    }
  );
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const trip = trips.find((t) => t.id === id);

  if (!trip) {
    return res.status(404).json({
      message: "trip not found",
    });
  }

  res.json(trip);
});

router.post("/", (req, res) => {
  const {
    title,
    author,
    startDate,
    endDate,
    description,
  } = req.body;

  const sql =
    "INSERT INTO trips (title, author, startDate, endDate, description) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [title, author, startDate, endDate, description],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "여행 등록 성공",
        trip: {
          id: result.insertId,
          title,
          author,
          startDate,
          endDate,
          description,
        },
      });
    }
  );
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM trips WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "여행 삭제 성공",
    });
  });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;

  const {
    title,
    startDate,
    endDate,
    description,
  } = req.body;

  const sql =
    "UPDATE trips SET title = ?, startDate = ?, endDate = ?, description = ? WHERE id = ?";

  db.query(
    sql,
    [title, startDate, endDate, description, id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "여행 수정 성공",
      });
    }
  );
});

module.exports = router;