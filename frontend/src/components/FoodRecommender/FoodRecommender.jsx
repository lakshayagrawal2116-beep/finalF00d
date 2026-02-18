import React, { useContext, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./FoodRecommender.css";
import api from "../../api/axios";

const FoodRecommendation = ({ SetShowLogin }) => {
  const { url, token } = useContext(StoreContext);

  // 🔒 Not logged in → show locked UI
  if (!token) {
    return (
      <div className="food-rec-locked">
        <h2>🔒 Login Required</h2>
        <p>Please sign in to use AI food recommendations.</p>
        <button onClick={() => SetShowLogin(true)}>
          Sign In
        </button>
      </div>
    );
  }

  const [vegNon, setVegNon] = useState("veg");
  const [category, setCategory] = useState("smoothie");
  const [spicy, setSpicy] = useState("any");
  const [health, setHealth] = useState("any");

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const handleRecommend = async () => {
    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const res = await api.post(`/food/recommend`, {
        veg_non: vegNon,
        category,
        spicy,
        health,
        count: 5
      });

      if (res.data.success) {
        setRecommendations(res.data.recommendations);
      } else {
        setError(res.data.message || "No recommendations found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to get recommendations");
    }

    setLoading(false);
  };

  return (
    <div className="food-rec-container">
      <h2>🍽️ AI Food Recommendation</h2>

      {/* FILTERS */}
      <div className="food-rec-filters">
        <div>
          <label>Diet</label>
          <select value={vegNon} onChange={(e) => setVegNon(e.target.value)}>
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
          </select>
        </div>

        <div>
          <label >Category</label>
          <input style={{height:"2.1rem",marginTop:"6px"}} value={category} onChange={(e) => setCategory(e.target.value)}/>
            {/* <option value="biryani">Biryani</option>
            <option value="smoothie">Smoothie</option>
            <option value="snack">Snack</option>
            <option value="dessert">Dessert</option> */}
          
        </div>

        <div>
          <label>Spice Level</label>
          <select value={spicy} onChange={(e) => setSpicy(e.target.value)}>
            <option value="any">Any</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label>Health</label>
          <select value={health} onChange={(e) => setHealth(e.target.value)}>
            <option value="any">Any</option>
            <option value="light">Light</option>
            <option value="high-protein">High Protein</option>
          </select>
        </div>
      </div>

      <button
        className="food-rec-btn"
        onClick={handleRecommend}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Recommend Food"}
      </button>

      {/* ERROR */}
      {error && <p className="food-rec-error">{error}</p>}

      {/* RESULTS */}
      <div className="food-rec-results">
        {recommendations.map((item, idx) => (
          <div className="food-rec-card" key={idx}>
            <h3>{item.name}</h3>

            <div className="food-rec-badges">
              <span className="badge">{item.category}</span>
              <span className={`badge ${item.veg_non}`}>
                {item.veg_non}
              </span>
              <span className="badge spice">{item.spice_level}</span>
            </div>

            <p className="food-rec-reason">{item.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodRecommendation;
