import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminPage() {
  const [divisions, setDivisions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [table, setTable] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: divisionData } = await supabase.from("divisions").select("*");
    const { data: teamData } = await supabase.from("teams").select("*");
    const { data: fixtureData } = await supabase
      .from("fixtures")
      .select("*")
      .order("date", { ascending: true });

    setDivisions(divisionData || []);
    setTeams(teamData || []);
    setFixtures(fixtureData || []);
  }

  function getTeamName(id) {
    return teams.find((t) => t.id === id)?.name || "";
  }

  async function updateScore(id, field, value) {
    await supabase
      .from("fixtures")
      .update({ [field]: parseInt(value) })
      .eq("id", id);

    loadData();
  }

  async function markPlayed(id) {
    await supabase
      .from("fixtures")
      .update({ played: true })
      .eq("id", id);

    loadData();
  }

  function calculateTable() {
    const filtered = fixtures.filter(
      (f) => f.division_id === selectedDivision && f.played
    );

    let standings = {};

    filtered.forEach((f) => {
      if (!standings[f.home_team_id]) {
        standings[f.home_team_id] = { played: 0, won: 0, lost: 0, points: 0 };
      }
      if (!standings[f.away_team_id]) {
        standings[f.away_team_id] = { played: 0, won: 0, lost: 0, points: 0 };
      }

      standings[f.home_team_id].played++;
      standings[f.away_team_id].played++;

      if (f.home_score > f.away_score) {
        standings[f.home_team_id].won++;
        standings[f.home_team_id].points += 1;
        standings[f.away_team_id].lost++;
      } else if (f.away_score > f.home_score) {
        standings[f.away_team_id].won++;
        standings[f.away_team_id].points += 1;
        standings[f.home_team_id].lost++;
      }
    });

    const tableArray = Object.entries(standings).map(([team_id, stats]) => ({
      team: getTeamName(team_id),
      ...stats,
    }));

    tableArray.sort((a, b) => b.points - a.points);

    setTable(tableArray);
  }

  return (
    <main style={{ padding: "32px", fontFamily: "Arial" }}>
      <h1>Admin</h1>

      <select onChange={(e) => setSelectedDivision(e.target.value)}>
        <option value="">Select Division</option>
        {divisions.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <button onClick={calculateTable} style={{ marginLeft: "10px" }}>
        Generate Table
      </button>

      <h2 style={{ marginTop: "30px" }}>Fixtures</h2>

      {fixtures
        .filter((f) => f.division_id === selectedDivision)
        .map((f) => (
          <div key={f.id} style={{ marginBottom: "10px" }}>
            {f.date} — {getTeamName(f.home_team_id)} vs {getTeamName(f.away_team_id)}

            <br />

            <input
              type="number"
              placeholder="Home"
              value={f.home_score}
              onChange={(e) =>
                updateScore(f.id, "home_score", e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Away"
              value={f.away_score}
              onChange={(e) =>
                updateScore(f.id, "away_score", e.target.value)
              }
            />

            <button onClick={() => markPlayed(f.id)}>
              Mark Played
            </button>
          </div>
        ))}

      <h2 style={{ marginTop: "40px" }}>League Table</h2>

      {table.map((t, i) => (
        <div key={i}>
          {i + 1}. {t.team} — P: {t.played} W: {t.won} L: {t.lost} Pts: {t.points}
        </div>
      ))}
    </main>
  );
}
