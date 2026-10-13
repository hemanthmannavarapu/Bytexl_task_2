import { useState } from "react";
function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mark, setMark] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined
    ? import.meta.env.VITE_API_BASE_URL
    : (import.meta.env.DEV ? "http://localhost:5000" : "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!name.trim() || !age || !mark) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const student = {
        name: name.trim(),
        age: Number(age),
        mark: Number(mark)
      };

      const response = await fetch(`${API_BASE_URL}/students2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setName("");
      setAge("");
      setMark("");
    } catch (err) {
      setError(`Failed to submit: ${err.message}. (API URL: ${API_BASE_URL})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Student Application</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input type="text" value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label>Age: </label>
          <input type="number" value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label>Mark: </label>
          <input type="number" value={mark}
            onChange={(e) => setMark(e.target.value)}
          />
        </div>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {error && (
        <div style={{ color: "red", marginTop: "12px" }}>
          <p>{error}</p>
        </div>
      )}
      {result && (
        <div>
          <h2>Result</h2>
          <p>Name: {result.name}</p>
          <p>CGPA: {result.cgpa}</p>
        </div>
      )}
    </div>
  );
}
export default App;
