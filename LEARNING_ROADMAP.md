# FPL AI Assistant: Learning & implementation Roadmap

This document addresses the key questions regarding the development of a placement-level Machine Learning project in football analytics.

## 1. Feasibility of Concepts
**Can all these ML concepts realistically fit into one project?**
Yes, but they should be layered. A "Fantasy Assistant" is naturally a multi-model system:
- **Regression** for point prediction.
- **Classification** for injury/bench risk.
- **Clustering** for similarity.
- **Recommendation** for the final user output.
In a professional setting, this is called an "Ensemble Architecture".

## 2. Best Models for FPL
- **Tabular Data (Points/Stats):** XGBoost, LightGBM, or CatBoost. They handle categorical data (Team, Position) and non-linear relationships much better than Linear Regression.
- **Sequential Data (Form Trends):** LSTM (Long Short-Term Memory) or GRU. These are great for catching "streaks" in player performance.
- **Similarity:** K-Means or Cosine Similarity (using embeddings).

## 3. Most Important for Placements/Internships
- **Feature Engineering:** Showing you can turn raw stats (goals, assists) into meaningful features (ICT Density, Form EWMA) is 70% of the value.
- **Explaining the "Why":** Using SHAP or LIME to explain why the model recommended a player.
- **Data Pipeline:** Handling missing values and ensuring data integrity.

## 4. TensorFlow vs Scikit-learn
- **Scikit-learn** is absolutely enough for 90% of FPL tasks (regression, clustering, classification).
- **TensorFlow** is only necessary if you are doing advanced Deep Learning (e.g., analyzing heatmaps as images) or complex Time-Series forecasting. For a portfolio, Scikit-learn + XGBoost is a very strong combination.

## 5. Implementation Phases
### Phase 1: Data & Grounding (Weeks 1-2)
- Fetch data from FPL API (`/bootstrap-static/`).
- Clean duplicates and handle missing minutes.
- Build the first regression model (XGBoost) for next-week points.

### Phase 2: Feature Expansion (Weeks 3-4)
- Add "Underlying Stats" (xG, xA) from Understat.
- Implement Clustering to find "Hidden Gems".
- Build the "Captaincy Score" logic (weighted multi-factor model).

### Phase 3: The Frontend/Dashboard (Weeks 5-6)
- Build a React or Streamlit dashboard.
- Integrate "AI Insights" (using Gemini or LLMs to explain the stats).

## 6. How to Structure Football Data
- **Static Table:** Player IDs, Names, Teams.
- **Temporal Table:** Gameweek-by-gameweek stats for every player.
- **Fixture Table:** Difficulty rankings, Home/Away, Dates.
- **Team Table:** ELO rankings, offensive/defensive form.

## 7. Simplifications for Beginners
- Start with **Mean Absolute Error (MAE)** instead of complex custom loss functions.
- Use **StandardScaler** for everything until you understand normalization logic.
- Focus on **Last 5 Games** as a fixed window instead of dynamic EWMA.

## 8. Making it Placement-Level
- **Hyperparameter Tuning:** Show you used `GridSearchCV` or `Optuna`.
- **Cross-Validation:** Use `TimeSeriesSplit` (standard CV is wrong for temporal football data).
- **Architecture Documentation:** Like the one provided in this app.
