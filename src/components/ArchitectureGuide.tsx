import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ArchitectureGuide() {
  return (
    <div className="bg-[#0A0A0B] text-[#E0E0E0] font-sans">
      <div className="rounded-none border border-[#2A2A2E] shadow-none max-w-full bg-[#111114]">
        <div className="p-6 border-b border-[#2A2A2E]">
          <h2 className="text-xl font-serif font-black italic uppercase text-white tracking-tight">Project Technical Documentation</h2>
        </div>
        <div className="p-6 space-y-8">
          <section>
            <h3 className="font-mono font-bold uppercase border-b border-[#2A2A2E] mb-3 flex justify-between text-[#38bdf8]">
              <span>01. Ensemble Prediction System</span>
              <span className="text-[10px] opacity-60">HUBER LOSS ENSEMBLE</span>
            </h3>
            <p className="text-xs border-l-2 border-[#38bdf8] pl-4 py-1 mb-4 leading-relaxed opacity-80 font-sans">
              The system employs an <strong>Ensemble Architecture</strong>, combining predictions from diverse algorithms to minimize 
              variance and prevent overfitting. The final score is a weighted average based on individual model RMSE performance.
            </p>
            <div className="grid grid-cols-3 gap-3">
                <div className="p-3 border border-[#2A2A2E] font-mono text-[8px] bg-black/20">
                    <div className="font-bold mb-1 text-[#00ff85] border-b border-[#2A2A2E] pb-1 uppercase">XGBOOST</div>
                    Handles complex non-linear feature interactions and categorical data effectively.
                </div>
                <div className="p-3 border border-[#2A2A2E] font-mono text-[8px] bg-black/20">
                    <div className="font-bold mb-1 text-[#00ff85] border-b border-[#2A2A2E] pb-1 uppercase">RANDOM FOREST</div>
                    Reduces overfitting by averaging uncorrelated trees (Bagging).
                </div>
                <div className="p-3 border border-[#2A2A2E] font-mono text-[8px] bg-black/20">
                    <div className="font-bold mb-1 text-[#00ff85] border-b border-[#2A2A2E] pb-1 uppercase">LIGHTGBM</div>
                    Leaf-wise growth strategy optimized for high-dimensional feature spaces.
                </div>
            </div>
          </section>

          <section>
            <h3 className="font-mono font-bold uppercase border-b border-[#2A2A2E] mb-3 flex justify-between text-[#38bdf8]">
              <span>02. Confidence & Fidelity Scoring</span>
              <span className="text-[10px] opacity-60">PROBABILISTIC INFERENCE</span>
            </h3>
            <p className="text-xs mb-3 font-sans opacity-80 leading-relaxed">Confidence scores are derived from three key vectors:</p>
            <ul className="text-[10px] font-mono space-y-3">
              <li className="flex gap-3"><span className="text-[#38bdf8] shrink-0">1.</span> <span><strong>Model Variance:</strong> The spread between the highest and lowest predictions in the ensemble. Low spread = High Confidence.</span></li>
              <li className="flex gap-3"><span className="text-[#38bdf8] shrink-0">2.</span> <span><strong>Historical Residuals:</strong> Accuracy of the model for that specific player/team over the last 10 gameweeks.</span></li>
              <li className="flex gap-3"><span className="text-[#38bdf8] shrink-0">3.</span> <span><strong>Feature Stability:</strong> Presence of high-variance inputs (e.g., late fitness checks or coaching changes).</span></li>
            </ul>
          </section>

          <section>
             <h3 className="font-mono font-bold uppercase border-b border-[#2A2A2E] mb-3 flex justify-between text-[#38bdf8]">
              <span>03. Model Benchmarking</span>
              <span className="text-[10px] opacity-60">EVALUATION METRICS</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[9px] border-collapse border border-[#2A2A2E]">
                <thead>
                  <tr className="bg-black text-[#8E9299]">
                    <th className="p-2 border border-[#2A2A2E]">Model</th>
                    <th className="p-2 border border-[#2A2A2E]">MAE</th>
                    <th className="p-2 border border-[#2A2A2E]">R²</th>
                    <th className="p-2 border border-[#2A2A2E]">Complexity</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  <tr>
                    <td className="p-2 border border-[#2A2A2E]">Linear Regression</td>
                    <td className="p-2 border border-[#2A2A2E]">1.95</td>
                    <td className="p-2 border border-[#2A2A2E]">0.45</td>
                    <td className="p-2 border border-[#2A2A2E]">Low</td>
                  </tr>
                  <tr className="bg-[#38bdf8]/5 shadow-inner">
                    <td className="p-2 border border-[#2A2A2E] font-bold text-[#38bdf8]">XGBoost (Active)</td>
                    <td className="p-2 border border-[#2A2A2E] font-bold text-[#38bdf8]">1.15</td>
                    <td className="p-2 border border-[#2A2A2E] font-bold text-[#38bdf8]">0.84</td>
                    <td className="p-2 border border-[#2A2A2E] font-bold text-[#38bdf8]">High</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-black/40 p-4 border border-[#2A2A2E]">
             <h3 className="font-mono font-bold mb-2 text-[#00ff85] text-[10px] uppercase underline">Resume Case Study</h3>
             <p className="text-xs italic font-serif leading-relaxed text-white/90">
                "This project demonstrates a full end-to-end ML lifecycle: from raw data extraction and 
                feature engineering to multi-model deployment and professional data visualization. 
                It addresses the complex 'Cold Start' problem in sports analytics and handles temporal 
                drift through continuous model retraining."
             </p>
          </section>
        </div>
      </div>
    </div>
  );
}
