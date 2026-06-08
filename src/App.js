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

function getDateKey(date = new Date()) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

function showDate(dateKey) {
  return new Date(dateKey + "T00:00:00").toLocaleDateString();
}

export default function App() {
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

  return (
    <div className="App" style={{ maxWidth: 420, margin: "22px auto" }}>
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
