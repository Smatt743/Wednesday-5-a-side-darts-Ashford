import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [divisions, setDivisions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setSession(session);
    setLoading(false);
  }

  async function signIn(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      checkSession();
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
  }

  useEffect(() => {
    if (session) loadData();
  }, [session]);

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
      .update({ [field]: parseInt(value || 0) })
      .eq("id", id);
    loadData();
  }

  async function markPlayed(id) {
    await supabase.from("fixtures").update({ played: true }).eq("id", id);
    loadData();
  }

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  // 🔒 NOT LOGGED IN → SHOW LOGIN
  if (!session) {
    return (
      <main style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center", fontFamily: "Arial" }}>
        <h1>Admin Login</h1>

        <form onSubmit={signIn}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Sign In
          </button>
        </form>
      </main>
    );
  }

  // ✅ LOGGED IN → SHOW ADMIN
  return (
    <main style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Admin Panel</h1>

      <button onClick={signOut} style={buttonStyle}>
        Sign Out
      </button>

      <h2 style={{ marginTop: "30px" }}>Fixtures</h2>

      {fixtures.map((f) => (
        <div key={f.id} style={{ marginBottom: "10px" }}>
          {f.date} — {getTeamName(f.home_team_id)} vs {getTeamName(f.away_team_id)}
          <br />

          <input
            type="number"
            value={f.home_score}
            onChange={(e) => updateScore(f.id, "home_score", e.target.value)}
            style={smallInput}
          />

          <input
            type="number"
            value={f.away_score}
            onChange={(e) => updateScore(f.id, "away_score", e.target.value)}
            style={smallInput}
          />

          <button onClick={() => markPlayed(f.id)}>
            Mark Played
          </button>
        </div>
      ))}
    </main>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: "10px",
  padding: "10px",
};

const buttonStyle = {
  padding: "10px 16px",
  marginTop: "10px",
  background: "#111827",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const smallInput = {
  width: "60px",
  marginRight: "5px",
};
