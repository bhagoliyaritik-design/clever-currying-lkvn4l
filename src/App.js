import React, { useEffect, useState } from "react";
import "./styles.css";

// Chart import
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Calendar import
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const STORAGE_KEY = "pro-streak-routine-tracker-data";

// --------- LOGIN STATE
const CORRECT_USER = "ritikcoderox";
const CORRECT_PASS = "68000";

function getDateKey(date = new Date()) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

function showDate(dateKey) {
  return new Date(dateKey + "T00:00:00").toLocaleDateString();
}

export default function App() {
  // -------- LOGIN STATES
  const [locked, setLocked] = useState(
    localStorage.getItem("myapp_login_ok") !== "YES"
  );
  const [uname, setUname] = useState("");
  const [upass, setUpass] = useState("");

  const [days, setDays] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [wakeUp, setWakeUp] = useState("");
  const [lectures, setLectures] = useState("");
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const todayKey = getDateKey(new Date());
  const todayDone = days.some((d) => d.dateKey === todayKey);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
  }, [days]);

  function markToday() {
    if (todayDone) return;
    const newEntry = {
      dateKey: todayKey,
      wakeUp,
      lectures,
      mood,
      note,
    };
    setDays([...days, newEntry]);

    setWakeUp("");
    setLectures("");
    setMood("");
    setNote("");
  }

  function isMarked(date) {
    const key = getDateKey(date);
    return days.some((d) => d.dateKey === key);
  }

  const selectedKey = getDateKey(selectedDate);
  const showDay = days.find((d) => d.dateKey === selectedKey);

  function resetAllData() {
    const confirmDelete = window.confirm(
      "Are you sure? Saara saved data delete ho jayega."
    );

    if (confirmDelete) {
      setDays([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // -------------- LOGIN FUNCTIONALITY:
  if (locked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(110deg,#2c5364, #43e97b)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <div
          style={{
            background: "#23243b",
            padding: "36px 18px 22px",
            borderRadius: 20,
            boxShadow: "0 0 24px #222a",
            minWidth: 270,
          }}
        >
          <h2 style={{ color: "#43e97b", marginBottom: 18, letterSpacing: 1 }}>
            🔒 App Login
          </h2>

          <input
            type="text"
            placeholder="Username"
            value={uname}
            autoFocus
            onChange={(e) => setUname(e.target.value)}
            style={{
              padding: "10px",
              fontSize: 16,
              border: "1px solid #43e97b",
              borderRadius: 8,
              width: "100%",
              marginBottom: 10,
              boxSizing: "border-box",
              background: "#141e30",
              color: "#fff",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={upass}
            onChange={(e) => setUpass(e.target.value)}
            style={{
              padding: "10px",
              fontSize: 16,
              border: "1px solid #43e97b",
              borderRadius: 8,
              width: "100%",
              marginBottom: 14,
              boxSizing: "border-box",
              background: "#141e30",
              color: "#fff",
            }}
          />

          <button
            onClick={() => {
              if (uname === CORRECT_USER && upass === CORRECT_PASS) {
                localStorage.setItem("myapp_login_ok", "YES");
                setLocked(false);
                setUname("");
                setUpass("");
              } else {
                alert("Galat Username/Password! Try again.");
                setUpass("");
              }
            }}
            style={{
              background: "#43e97b",
              color: "#23243b",
              padding: "10px 26px",
              borderRadius: 10,
              border: "none",
              fontWeight: 800,
              fontSize: 16,
              width: "100%",
              cursor: "pointer",
              boxShadow: "0 1px 8px #43e97b44",
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // --------------- LOGOUT BUTTON code

  return (
    <div
      className="App"
      style={{
        maxWidth: 420,
        margin: "22px auto",
        position: "relative",
      }}
    >
      {/* Logout button */}
      <button
        onClick={() => {
          localStorage.removeItem("myapp_login_ok");
          window.location.reload();
        }}
        style={{
          position: "absolute",
          top: 16,
          right: 18,
          background: "#ff4d6d",
          color: "#fff",
          border: "none",
          borderRadius: 9,
          padding: "7px 18px",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          zIndex: 99,
        }}
      >
        Logout
      </button>

      <h2
        style={{
          background: "linear-gradient(90deg,#00f2fe 40%,#4facfe 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        🏆 Pro Streak Routine Tracker 🍀
      </h2>

      <div className="inputs">
        <div>
          <label>Subah kitne baje uthe?</label>
          <input
            type="time"
            value={wakeUp}
            onChange={(e) => setWakeUp(e.target.value)}
          />
        </div>
        <div>
          <label>Lectures Kitne kiye?</label>
          <input
            type="number"
            min="0"
            max="10"
            value={lectures}
            onChange={(e) => setLectures(e.target.value)}
          />
        </div>
        <div>
          <label>Mood:</label>
          <select value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="">Select</option>
            <option value="😃">😃 Happy</option>
            <option value="🙂">🙂 Normal</option>
            <option value="😖">😖 Low</option>
          </select>
        </div>
        <div>
          <label>Notes:</label>
          <input
            type="text"
            maxLength={40}
            placeholder="Anything special today..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      <button onClick={markToday} disabled={todayDone} className="markbtn">
        {todayDone ? "✅ Done for Today!" : "🔥 Mark Today"}
      </button>

      <div className="section-box">
        <h3>🔥 Streak: {days.length} Days</h3>
        {days.length === 0 ? (
          <p>Abhi koi entry nahi hai.</p>
        ) : (
          <ul>
            {days
              .slice()
              .reverse()
              .map((d, i) => (
                <li key={i}>
                  <b>{showDate(d.dateKey)}</b> | Uthna: {d.wakeUp || "--"} |
                  Lectures: {d.lectures || "--"} | Mood: {d.mood || "--"}
                  {d.note && <> | Note: {d.note}</>}
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className="section-box">
        <h4>Last 7 Days Progress (Lectures)</h4>
        <Bar
          data={{
            labels: days.slice(-7).map((d) => showDate(d.dateKey)),
            datasets: [
              {
                label: "Lectures",
                backgroundColor: "#43e97b",
                data: days.slice(-7).map((d) => Number(d.lectures) || 0),
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
              },
            },
          }}
          width={320}
          height={140}
        />
      </div>

      <div className="section-box calendar-bg">
        <h4>My Progress Calendar</h4>

        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={({ date }) =>
            isMarked(date) ? "calendar-day-marked" : null
          }
        />

        {showDay && (
          <div className="calendar-popup">
            <span>
              <b>{showDate(showDay.dateKey)}</b>
            </span>
            <br />
            Uthna: <b>{showDay.wakeUp || "--"}</b>
            <br />
            Lectures: <b>{showDay.lectures || "--"}</b>
            <br />
            Mood: <b>{showDay.mood || "--"}</b>
            <br />
            {showDay.note && (
              <>
                Note: <b>{showDay.note}</b>
                <br />
              </>
            )}
          </div>
        )}
      </div>

      <button
        onClick={resetAllData}
        style={{
          background: "#ff4d6d",
          color: "white",
          border: "none",
          borderRadius: "10px",
          padding: "9px 18px",
          cursor: "pointer",
          marginTop: "8px",
        }}
      >
        🗑 Reset All Data
      </button>

      <div className="footnote">
        <b>Saved:</b> Data ab browser me save rahega ✅
      </div>
    </div>
  );
}
