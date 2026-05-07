import { GoogleGenAI } from "@google/genai";
import { Player } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getPlayerScoutingReport(player: Player) {
  const prompt = `
    Analyze this Fantasy Premier League player and provide a clear, simple scouting report. Use easy-to-understand language.
    Player: ${player.name}
    Team: ${player.team}
    Price: £${player.price}m
    Form: ${player.form}/10
    xG: ${player.xG}
    xA: ${player.xA}
    Expected Points (next GW): ${player.expectedPoints}
    Injury Risk: ${player.injuryRisk}
    
    Structure your response as a JSON object:
    {
      "summary": "Clear, simple one-sentence explanation of the player's potential.",
      "ml_insights": ["Key point about current performance", "Key point about upcoming matches"],
      "verdict": "Buy, Sell, or Hold",
      "captaincy_score": 0-100
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    // Fallback logic when Gemini is unavailable or over quota
    const isHighForm = player.form > 7;
    const isGoodFix = player.fixtures[0].difficulty <= 2;
    
    return {
      summary: `[Fallback Analysis] ${player.name} is currently showing ${isHighForm ? 'strong' : 'steady'} form heading into a GW against ${player.fixtures[0].opponent}.`,
      ml_insights: [
        `${player.name} ICT involvement remains ${player.ictIndex > 10 ? 'elite' : 'stable'}.`,
        `Upcoming fixture difficulty rated at ${player.fixtures[0].difficulty}/5.`
      ],
      verdict: isHighForm && isGoodFix ? "Essential Buy" : isHighForm ? "Strong Hold" : "Monitor",
      captaincy_score: Math.round((player.form * 8) + (10 - player.fixtures[0].difficulty * 2)),
      isFallback: true
    };
  }
}

export async function getAIPredictionExplanation(player: Player) {
    const prompt = `
      Act as a football analyst. Explain why the system predicts these points for ${player.name} using simple words.
      Current Stats: xG: ${player.xG}, xA: ${player.xA}, ICT Index: ${player.ictIndex}, Form: ${player.form}.
      Next Fixture Difficulty: ${player.fixtures[0].difficulty}/5.
      
      List the top 3 simple reasons why this player will do well or poorly.
      Include a "Confidence Score" for the prediction.
      
      Response Format:
      {
        "features": [{"name": "Reason Title", "importance": 0-1, "reason": "Simple explanation"}],
        "model_confidence": 0.0-1.0
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });
      return JSON.parse(response.text || '{}');
    } catch (error: any) {
      console.error("Gemini Error:", error);
      return { 
        features: [
          { name: "Historical Form", importance: 0.8, reason: "Consistent points returns in recent matches." },
          { name: "Fixture Difficulty", importance: 0.7, reason: "The upcoming match presents a tactical challenge." }
        ], 
        model_confidence: 0.85,
        isFallback: true 
      };
    }
}
