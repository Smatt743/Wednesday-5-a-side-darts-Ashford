import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminPage() {
  const [divisions, setDivisions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    division_id: "",
    date: "",
    home_team_id: "",
    away_team_id: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: divisionData } = await supabase
      .from("divisions")
      .select("*");

    const { data: teamData } = await supabase
      .from("teams")
      .select("*");

    setDivisions(divisionData || []);
    setTeams(teamData || []);
  }

  async function addFixture(e) {
    e.preventDefault();

    if (
      !form.division_id ||
      !form.date ||
      !form.home_team_id ||
      !form.away_team_id
    ) {
      setMessage("Please complete all fields");
      return;
    }

    const { error } = await supabase.from("fixtures").insert([
      {
        division_id: form.division_id,
        date: form.date,
        home_team_id: form.home_team_id,
        away_team_id: form.away_team_id,
      },
    ]);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Fixture added ✅");
      setForm({
        division_id: "",
        date: "",
        home_team_id: "",
        away_team_id: "",
      });
    }
  }

  const filteredTeams = teams.filter(
    (t) => t.division_id === form.division_id
  );

  return (
    <main style={{ padding: "32px", fontFamily: "Arial" }}>
      <h1>Admin</h1>

      <form onSubmit={addFixture} style={{ marginTop: "20px" }}>
        <select
          value={form.division_id}
          onChange={(e) =>
            setForm({ ...form, division_id: e.target.value })
          }
        >
          <option value="">Select Division</option>
          {divisions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        <br /><br />

        <select
          value={form.home_team_id}
          onChange={(e) =>
            setForm({ ...form, home_team_id: e.target.value })
          }
        >
          <option value="">Home Team</option>
          {filteredTeams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <br /><br />

        <select
          value={form.away_team_id}
          onChange={(e) =>
            setForm({ ...form, away_team_id: e.target.value })
          }
        >
          <option value="">Away Team</option>
          {filteredTeams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <br /><br />

        <button type="submit">Add Fixture</button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}
