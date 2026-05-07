import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Brain, 
  TrendingUp, 
  Activity, 
  AlertCircle, 
  ChevronRight, 
  ChevronUp,
  ChevronDown,
  Star,
  Info,
  ArrowUpRight,
  Filter,
  Users,
  Target
} from 'lucide-react';
import { mockPlayers } from '@/src/dataService';
import { Player } from '@/src/types';
import { getPlayerScoutingReport } from '@/src/geminiService';
import { MLEngine, PredictionResult } from '@/src/lib/mlEngine';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export default function PredictiveDashboard() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player>(mockPlayers[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [scoutingReport, setScoutingReport] = useState<any>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const teams = useMemo(() => {
    const allTeams = mockPlayers.map(p => p.team);
    return Array.from(new Set(allTeams)).sort();
  }, []);

  const filteredPlayers = useMemo(() => {
    return mockPlayers.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.team.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTeam = selectedTeam ? p.team === selectedTeam : true;
      return matchesSearch && matchesTeam;
    });
  }, [searchQuery, selectedTeam]);

  const scrollSideBar = (direction: 'up' | 'down') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        top: direction === 'up' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    // Simulate real-time re-training/inference
    setTimeout(() => {
      const result = MLEngine.getPrediction(selectedPlayer);
      setPredictionResult(result);
      setAnalyzing(false);
    }, 1500);
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      // Run ML Inference
      const result = MLEngine.getPrediction(selectedPlayer);
      setPredictionResult(result);
      
      // Get AI scouting context
      const report = await getPlayerScoutingReport(selectedPlayer);
      setScoutingReport(report);
      setLoading(false);
    }
    loadData();
  }, [selectedPlayer]);

  const chartData = useMemo(() => {
    return (selectedPlayer.nextFivePredictions || [0,0,0,0,0]).map((pts, i) => ({
      name: `GW${25 + i}`,
      points: pts
    }));
  }, [selectedPlayer]);

  const featureData = useMemo(() => {
    return predictionResult?.featureImportance || [];
  }, [predictionResult]);

  return (
    <div className="h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-hidden">
      {/* Top Professional Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Brain className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">Scout AI <span className="font-light text-slate-400">Pro</span></h1>
            <p className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">Fantasy Prediction Engine</p>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Find any player or team..."
            className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            Predictor Active
          </Badge>
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-500">
            {mockPlayers.length}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Results List */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Users size={14} /> Total Players
            </span>
            <div className="flex items-center gap-1 bg-slate-200/50 px-2 py-0.5 rounded text-[10px] font-bold text-slate-500">
              {filteredPlayers.length} <span className="opacity-50">ENTITIES</span>
            </div>
          </div>
          
          {/* Team Filter Section */}
          <div className="bg-white px-4 py-2 border-b border-slate-100">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Quick Filter / Team</span>
            <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1 px-1">
              <button 
                onClick={() => setSelectedTeam(null)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all shrink-0 border ${!selectedTeam ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
              >
                All Teams
              </button>
              {teams.map(team => (
                <button 
                  key={team}
                  onClick={() => setSelectedTeam(team)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all shrink-0 border ${selectedTeam === team ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
                >
                  {team}
                </button>
              ))}
            </div>
            {/* Scroll Navigation Buttons */}
            <div className="flex gap-1 mt-2">
              <button 
                onClick={() => scrollSideBar('up')}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 py-1 rounded flex items-center justify-center transition-colors"
                title="Scroll Up"
              >
                <ChevronUp size={14} />
              </button>
              <button 
                onClick={() => scrollSideBar('down')}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 py-1 rounded flex items-center justify-center transition-colors"
                title="Scroll Down"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 bg-slate-50/20 overflow-y-auto custom-scrollbar">
            <div className="p-3 space-y-2 pb-20">
              {filteredPlayers.map((player) => (
                <div 
                  key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border-2 relative overflow-hidden group ${
                    selectedPlayer.id === player.id 
                    ? 'bg-white border-indigo-600 shadow-md ring-4 ring-indigo-50' 
                    : 'bg-white border-transparent hover:border-slate-200 hover:shadow-sm'
                  }`}
                >
                  {selectedPlayer.id === player.id && (
                    <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-600 rounded-bl-2xl flex items-center justify-center">
                       <ChevronRight size={14} className="text-white" />
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm font-black tracking-tight ${selectedPlayer.id === player.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {player.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                        player.position === 'FWD' ? 'bg-orange-100 text-orange-700' :
                        player.position === 'MID' ? 'bg-emerald-100 text-emerald-700' :
                        player.position === 'DEF' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {player.position}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{player.team}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Price</span>
                      <span className="text-xs font-black text-indigo-600">£{player.price}m</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <TrendingUp size={10} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-emerald-700">{player.form.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Panel: Main Analysis */}
        <main className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 bg-slate-50">
          {/* Header Stats */}
          <div className="flex justify-between items-start">
            <div className="flex gap-6 items-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 shadow-inner">
                <Users size={40} strokeWidth={1.5} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedPlayer.name}</h2>
                  <Badge className="bg-indigo-600 text-white hover:bg-indigo-700">{selectedPlayer.position}</Badge>
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                  <span className="flex items-center gap-1"><Activity size={14} className="text-indigo-400" /> {selectedPlayer.team}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><ArrowUpRight size={14} className="text-indigo-400" /> £{selectedPlayer.price}m</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-600"><Star size={14} className="fill-emerald-600" /> Form: {selectedPlayer.form}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleAnalyze}
              disabled={analyzing}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-slate-900 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {analyzing ? <TrendingUp size={18} className="animate-bounce" /> : <Brain size={18} />}
              Refresh Forecast
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project points card */}
            <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden ring-1 ring-slate-200/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Target size={14} className="text-indigo-600" /> Ensemble Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-indigo-600">
                    {predictionResult?.ensemblePoints.toFixed(1) || selectedPlayer.expectedPoints.toFixed(1)}
                  </span>
                  <span className="text-sm font-bold text-slate-400 uppercase">Predicted Pts</span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] uppercase font-bold mb-1.5">
                      <span className="text-slate-400">Confidence Model Score</span>
                      <span className="text-indigo-600">{predictionResult?.confidenceScore || 88}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full transition-all duration-1000" 
                        style={{ width: `${predictionResult?.confidenceScore || 88}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Model breakdown - real ML feel */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Model Consensus</span>
                    {predictionResult?.modelPredictions.map((m, i) => (
                      <div key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${i === 2 ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                          <span className="text-[10px] font-medium text-slate-500">{m.modelName}</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">{m.predictedPoints.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Global Insights & Ensemble Reasons */}
            <Card className="lg:col-span-2 border-none shadow-sm bg-white rounded-3xl overflow-hidden ring-1 ring-slate-200/50">
              <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                  <div className="flex items-center gap-2"><Brain size={14} className="text-indigo-500" /> Prediction Intelligence & XAI</div>
                  {scoutingReport && <Badge className="bg-white text-indigo-600 border border-indigo-200 shadow-sm">{scoutingReport.verdict}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Explainable AI (Inference Reasons)</h4>
                    <div className="space-y-1.5">
                      {predictionResult?.explainability.map((reason, i) => (
                        <div key={i} className="flex items-start gap-2 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/50">
                          <div className="mt-0.5 text-indigo-500"><ChevronRight size={12} /></div>
                          <p className="text-[11px] text-indigo-900 font-medium">{reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Scouting Summary</h4>
                    <p className="text-slate-600 text-xs leading-relaxed font-normal italic">
                      "{scoutingReport?.summary || 'Selecting player for analysis...'}"
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-48 space-y-4">
                  <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-lg overflow-hidden relative group">
                    <Activity className="absolute -right-2 -bottom-2 text-slate-800 w-16 h-16 opacity-50 group-hover:scale-110 transition-transform" />
                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Model Metrics</h4>
                    <div className="space-y-2 relative z-10">
                      <div className="flex justify-between">
                        <span className="text-[10px] text-slate-400">RMSE</span>
                        <span className="text-xs font-bold text-emerald-400">{predictionResult?.metrics.rmse || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-slate-400">MAE</span>
                        <span className="text-xs font-bold text-emerald-400">{predictionResult?.metrics.mae || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] text-slate-400">R-Squared</span>
                        <span className="text-xs font-bold text-indigo-400">{predictionResult?.metrics.r2 || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`rounded-2xl p-4 text-white shadow-lg relative overflow-hidden group transition-all ${
                    predictionResult?.recommendation.type === 'danger' ? 'bg-rose-600' :
                    predictionResult?.recommendation.type === 'warning' ? 'bg-amber-500' :
                    predictionResult?.recommendation.type === 'success' ? 'bg-emerald-600' :
                    predictionResult?.recommendation.type === 'primary' ? 'bg-indigo-600' :
                    'bg-slate-700'
                  }`}>
                    {/* Background Icon Accent */}
                    {predictionResult?.recommendation.icon === 'Star' && <Star size={60} className="absolute -right-4 -bottom-4 text-white/10 rotate-12" />}
                    {predictionResult?.recommendation.icon === 'AlertCircle' && <AlertCircle size={60} className="absolute -right-4 -bottom-4 text-white/10 rotate-12" />}
                    {predictionResult?.recommendation.icon === 'TrendingUp' && <TrendingUp size={60} className="absolute -right-4 -bottom-4 text-white/10 rotate-12" />}
                    {predictionResult?.recommendation.icon === 'Target' && <Target size={60} className="absolute -right-4 -bottom-4 text-white/10 rotate-12" />}
                    {predictionResult?.recommendation.icon === 'Activity' && <Activity size={60} className="absolute -right-4 -bottom-4 text-white/10 rotate-12" />}

                    <h4 className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${
                      predictionResult?.recommendation.type === 'warning' ? 'text-amber-100' : 'text-white/70'
                    }`}>
                      Recommendation
                    </h4>
                    <p className="text-sm font-black tracking-tight mb-1">
                      {predictionResult?.recommendation.label || 'ANALYZING...'}
                    </p>
                    <p className={`text-[10px] leading-tight font-medium ${
                      predictionResult?.recommendation.type === 'warning' ? 'text-amber-50' : 'text-white/80'
                    }`}>
                      {predictionResult?.recommendation.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Machine Learning Advanced Visualization Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feature Importance Chart */}
            <Card className="border-none shadow-sm bg-white rounded-3xl p-6 ring-1 ring-slate-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Target size={14} className="text-indigo-600" /> Feature Importance (SHAP Analysis)
                </h3>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureData} layout="vertical" margin={{ left: 0, right: 30 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="feature" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                      width={100}
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ border: 'none', borderRadius: '8px', fontSize: '10px' }}
                    />
                    <Bar dataKey="importance" radius={[0, 4, 4, 0]} barSize={20}>
                      {featureData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#818cf8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Overall Player Stats Grid */}
            <Card className="border-none shadow-sm bg-white rounded-3xl p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Activity size={14} className="text-indigo-400" /> Overall Player Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Total Points', value: selectedPlayer.totalPoints, icon: <ChevronRight size={14} className="text-indigo-400" /> },
                  { label: 'Goals Scored', value: selectedPlayer.goals, icon: <ChevronRight size={14} className="text-indigo-400" /> },
                  { label: 'Assists', value: selectedPlayer.assists, icon: <ChevronRight size={14} className="text-indigo-400" /> },
                  { label: 'ICT Index', value: selectedPlayer.ictIndex, icon: <ChevronRight size={14} className="text-indigo-400" /> },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1 p-2 bg-slate-50/50 rounded-xl">
                    <div className="flex items-center justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-1">
                      {stat.label}
                    </div>
                    <span className="text-xl font-black text-slate-900 tabular-nums tracking-tighter">
                      {typeof stat.value === 'number' && stat.value % 1 !== 0 ? stat.value.toFixed(1) : stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Footer Info */}
      <footer className="h-10 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> All Systems Operational</span>
          <span>Last Updated: 12m ago</span>
        </div>
        <div className="flex gap-1.5 items-center">
          <AlertCircle size={12} className="text-indigo-400" />
          <span>Professional Fantasy Analytics Interface</span>
        </div>
      </footer>
    </div>
  );
}
