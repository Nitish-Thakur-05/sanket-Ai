import { useState } from "react";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/Firebase";
function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", form.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("User not found!");
        setLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0].data();

      // SHA-256 hash function (matches the hash in your Firestore)
      const hashPassword = async (password) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      };

      const enteredHashedPassword = await hashPassword(form.password);

      // Compare the entered (and hashed) password with the hash in Firestore
      if (userDoc.password_hash == enteredHashedPassword) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", form.email);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid password!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Sanket <span style={{ color: "#fe4a5a" }}>AI</span>
        </h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="admin@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
