import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function PlayerStatsPage() {
  const [divisions, setDivisions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState([]);
  const [highCheckouts, setHighCheckouts] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");

  const [sortField, setSortField] = useState("winPercent");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: divisionData } = await supabase.from("divisions").select("*");
    const { data: teamData } = await supabase.from("teams").select("*");
    const { data: playerData } = await supabase.from("players").select("*");
    const { data: statData } = await supabase.from("player_stats").select("*");
    const { data: checkoutData } = await supabase.from("high_checkouts").select("*");
    const { data: fixtureData } = await supabase.from("fixtures").select("*");

    setDivisions(divisionData || []);
    setTeams(teamData || []);
    setPlayers(playerData || []);
    setStats(statData || []);
    setHighCheckouts(checkoutData || []);
    setFixtures(fixtureData || []);

    if (divisionData?.length) setSelectedDivision(divisionData[0].id);
  }

  function getTeam(teamId) {
    return teams.find((t) => t.id === teamId);
  }

  function getPlayer(playerId) {
    return players.find((p) => p.id === playerId);
  }

  function getFixture(fixtureId) {
    return fixtures.find((f) => f.id === fixtureId);
  }

  function getTeamName(teamId) {
    return teams.find((t) => t.id === teamId)?.name || "";
  }

  function handleSort(field) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  }

  function getArrow(field) {
    if (sortField !== field) return "";
    return sortDirection === "asc" ? " ↑" : " ↓";
  }

  const rows = players
    .filter((player) => getTeam(player.team_id)?.division_id === selectedDivision)
    .map((player) => {
      const playerRows = stats.filter((s) => s.player_id === player.id);
      const playerCheckouts = highCheckouts.filter((c) => c.player_id === player.id);

      const totals = playerRows.reduce(
        (acc, row) => {
          acc.legsPlayed += row.legs_played || 0;
          acc.legsWon += row.legs_won || 0;
          acc.oneEighties += row.one_eighties || 0;
          return acc;
        },
        { legsPlayed: 0, legsWon: 0, oneEighties: 0 }
      );

      const winPercent =
        totals.legsPlayed > 0
          ? Math.round((totals.legsWon / totals.legsPlayed) * 1000) / 10
          : 0;

      return {
        name: player.name,
        team: getTeam(player.team_id)?.name || "",
        ...totals,
        winPercent,
        tonPlusFinishes: playerCheckouts.length,
      };
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (a[sortField] < b[sortField]) return -1 * direction;
      if (a[sortField] > b[sortField]) return 1 * direction;
      return 0;
    });

  const divisionCheckouts = highCheckouts
    .filter((checkout) => {
      const player = getPlayer(checkout.player_id);
      if (!player) return false;
      const team = getTeam(player.team_id);
      return team?.division_id === selectedDivision;
    })
    .map((checkout) => {
      const player = getPlayer(checkout.player_id);
      const fixture = getFixture(checkout.fixture_id);

      return {
        id: checkout.id,
        playerName: player?.name || "",
        teamName: getTeam(player?.team_id)?.name || "",
        value: checkout.checkout_value,
        date: fixture?.date || "",
      };
    })
    .sort((a, b) => {
      if (b.value !== a.value) return b.value - a.value;
      return a.date.localeCompare(b.date);
    });

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={linkStyle}>← Back to Home</Link>
      </div>

      <h1>Player Stats</h1>

      <div style={{ margin: "20px 0" }}>
        <select
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
          style={inputStyle}
        >
          {divisions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Player Totals</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Player</th>
              <th style={thStyle}>Team</th>
              <th style={thStyle} onClick={() => handleSort("legsPlayed")}>
                Legs Played{getArrow("legsPlayed")}
              </th>
              <th style={thStyle} onClick={() => handleSort("legsWon")}>
                Legs Won{getArrow("legsWon")}
              </th>
              <th style={thStyle} onClick={() => handleSort("winPercent")}>
                Win %{getArrow("winPercent")}
              </th>
              <th style={thStyle} onClick={() => handleSort("oneEighties")}>
                180s{getArrow("oneEighties")}
              </th>
              <th style={thStyle} onClick={() => handleSort("tonPlusFinishes")}>
                100+ Finishes{getArrow("tonPlusFinishes")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.name}-${row.team}`}>
                <td style={tdStyle}>{row.name}</td>
                <td style={tdStyle}>{row.team}</td>
                <td style={tdStyle}>{row.legsPlayed}</td>
                <td style={tdStyle}>{row.legsWon}</td>
                <td style={tdStyle}>{row.winPercent}%</td>
                <td style={tdStyle}>{row.oneEighties}</td>
                <td style={tdStyle}>{row.tonPlusFinishes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ ...cardStyle, marginTop: "24px" }}>
        <h2 style={{ marginTop: 0 }}>100+ Checkout List</h2>
        {divisionCheckouts.length === 0 ? (
          <p style={{ color: "#64748b" }}>No 100+ checkouts recorded yet.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Player</th>
                <th style={thStyle}>Team</th>
                <th style={thStyle}>Checkout</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {divisionCheckouts.map((row) => (
                <tr key={row.id}>
                  <td style={tdStyle}>{row.playerName}</td>
                  <td style={tdStyle}>{row.teamName}</td>
                  <td style={{ ...tdStyle, fontWeight: "bold" }}>{row.value}</td>
                  <td style={tdStyle}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "1px solid #e2e8f0",
  background: "#f8fafc",
  cursor: "pointer",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #e2e8f0",
};

const inputStyle = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
};

const linkStyle = {
  textDecoration: "none",
  color: "#2563eb",
  fontWeight: "bold",
};
