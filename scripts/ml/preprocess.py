import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder

def preprocess_fpl_data(df):
    """
    Standard preprocessing pipeline for FPL data.
    """
    # 1. Handling missing values
    df = df.fillna(0)
    
    # 2. Feature Engineering: Form Score
    # Weighted average of last 5 game points
    df['form_score'] = df.groupby('player_id')['points'].transform(lambda x: x.rolling(window=5).mean())
    
    # 3. Feature Engineering: ICT Index (Influence, Creativity, Threat)
    df['ict_weighted'] = (df['influence'] * 0.3) + (df['creativity'] * 0.3) + (df['threat'] * 0.4)
    
    # 4. Encoding categorical data (Position, Team)
    le = LabelEncoder()
    df['position_encoded'] = le.fit_transform(df['position'])
    
    return df

if __name__ == "__main__":
    # Mock usage
    data = pd.DataFrame({
        'player_id': [1, 1, 1, 1, 1],
        'points': [2, 5, 8, 1, 12],
        'influence': [10, 20, 30, 5, 40],
        'creativity': [5, 10, 15, 2, 20],
        'threat': [15, 25, 35, 10, 50],
        'position': ['FWD', 'FWD', 'FWD', 'FWD', 'FWD']
    })
    processed = preprocess_fpl_data(data)
    print("Preprocessing successful. Sample data:")
    print(processed.head())
