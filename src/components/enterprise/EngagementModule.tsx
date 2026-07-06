import React, { useState } from "react";
import { 
  Users, MessageSquare, Heart, Award, Gift, Sparkles, Send, ShoppingBag, 
  CheckCircle, Zap, Coins, ArrowRight, UserCheck, Star
} from "lucide-react";

interface EngagementModuleProps {
  activeEvent: any;
}

export default function EngagementModule({ activeEvent }: EngagementModuleProps) {
  // Social Feed state
  const [posts, setPosts] = useState([
    { id: 1, author: "Juliana Rocha", role: "Atleta de Ciclismo", text: "Treino finalizado na pista principal! A estrutura está fantástica. Parabéns PLAY+ 🎉", likes: 14, comments: 2, liked: false },
    { id: 2, author: "Renato Silveira", role: "Patrocinador (Ambev)", text: "Nossos estandes de bebidas isotônicas já estão totalmente abastecidos e prontos para o início amanhã cedo!", likes: 28, comments: 5, liked: true },
  ]);
  const [newPostText, setNewPostText] = useState("");

  // AI Matchmaking state
  const [matchCategory, setMatchCategory] = useState<string>("all");
  const [matches, setMatches] = useState([
    { id: "m1", name: "Cezar Lemos", company: "Rider Tech", interest: "Ciclismo & Patrocínios", goal: "Procura investidores de marcas", matchRate: "98%" },
    { id: "m2", name: "Helena Castro", company: "Copa Run", interest: "Eventos Esportivos", goal: "Busca fornecedores de cronometragem RFID", matchRate: "92%" },
    { id: "m3", name: "Arthur Malta", company: "Ambev S/A", interest: "Patrocínios & Marketing", goal: "Busca parcerias esportivas e cotas master", matchRate: "89%" },
  ]);

  // Gamification state
  const [userPoints, setUserPoints] = useState(1450);
  const [missions, setMissions] = useState([
    { id: "ms1", text: "Fazer Check-in no Portal Principal", points: 150, completed: true },
    { id: "ms2", text: "Visitar 3 estandes de expositores na Arena Expo", points: 200, completed: false },
    { id: "ms3", text: "Completar pesquisa de satisfação pós-corrida", points: 100, completed: false },
    { id: "ms4", text: "Descarte de 5 latinhas no lixo reciclável ESG", points: 300, completed: true },
  ]);

  // Official Store Products
  const [storeProducts, setStoreProducts] = useState([
    { id: "p1", name: "Camiseta Oficial PLAY+ Sports", pointsCost: 600, brlPrice: 79, img: "👕" },
    { id: "p2", name: "Boné Tecnológico Run Dry", pointsCost: 400, brlPrice: 49, img: "🧢" },
    { id: "p3", name: "Squeeze Térmico Reutilizável ESG", pointsCost: 350, brlPrice: 39, img: "🥤" },
    { id: "p4", name: "Kit Mochila Atleta + Chip Cronômetro", pointsCost: 1000, brlPrice: 120, img: "🎒" },
  ]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    setPosts(prev => [
      {
        id: Date.now(),
        author: "Você (CEO André)",
        role: "Organizador Master",
        text: newPostText,
        likes: 0,
        comments: 0,
        liked: false
      },
      ...prev
    ]);
    setNewPostText("");
  };

  const handleLike = (id: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked };
      }
      return p;
    }));
  };

  const handleCompleteMission = (id: string, points: number) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, completed: true } : m));
    setUserPoints(prev => prev + points);
    alert(`Parabéns! Missão cumprida. +${points} pontos adicionados à sua carteira VIP.`);
  };

  const handleBuyProduct = (prodName: string, cost: number, currency: 'points' | 'brl') => {
    if (currency === 'points') {
      if (userPoints < cost) {
        alert("Pontos insuficientes para resgate!");
        return;
      }
      setUserPoints(prev => prev - cost);
      alert(`Sucesso! Você resgatou o produto "${prodName}" usando ${cost} pontos. Retire seu cupom de resgate com QR Code no balcão da loja oficial.`);
    } else {
      alert(`Sucesso! Compra do produto "${prodName}" realizada via cartão integrado. Vá até o balcão da loja para a retirada.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-100" id="engagement-module-container">
      
      {/* Top Banner indicating Points balance */}
      <div className="bg-gradient-to-r from-violet-950 to-indigo-950 border border-violet-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-violet-900 text-violet-300 rounded-lg">
            <Coins className="h-5 w-5 animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider">Seu Perfil & Programa de Fidelidade</h4>
            <span className="text-sm font-bold text-slate-100">Clube VIP PLAY+ EventOS (Fidelização & Cashback)</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-slate-950 p-2 rounded-xl border border-violet-900/40">
          <span className="text-xs font-mono text-slate-400">Carteira VIP:</span>
          <strong className="text-violet-400 font-mono text-sm">{userPoints} Pontos</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* PANEL A: NETWORKING FEED & SOCIAL PLATFORM */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-violet-400" />
              Rede Social do Evento (Networking)
            </h4>
            <span className="text-[10px] font-mono text-violet-400">LIVE FEED</span>
          </div>

          <form onSubmit={handleCreatePost} className="flex gap-2">
            <input
              type="text"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Compartilhe algo com os participantes..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg text-xs px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-violet-500"
            />
            <button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white p-1.5 rounded-lg shrink-0">
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {posts.map((post) => (
              <div key={post.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs space-y-2">
                <div className="flex justify-between items-baseline leading-none">
                  <div>
                    <span className="font-bold text-slate-200 block">{post.author}</span>
                    <span className="text-[9px] font-mono text-slate-500">{post.role}</span>
                  </div>
                </div>
                
                <p className="text-slate-300 text-[11px] font-sans leading-relaxed">{post.text}</p>

                <div className="flex gap-4 pt-1.5 border-t border-slate-900/60 text-[10px] font-mono text-slate-500">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 hover:text-rose-400 ${post.liked ? 'text-rose-500 font-bold' : ''}`}
                  >
                    <Heart className="h-3 w-3 fill-current" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-slate-300">
                    <MessageSquare className="h-3 w-3" />
                    <span>{post.comments} Comentários</span>
                  </button>
                  <button 
                    onClick={() => alert(`Você trocou cartões de visita digitais com ${post.author}. Contatos adicionados na agenda.`)}
                    className="ml-auto text-violet-400 hover:underline flex items-center gap-0.5"
                  >
                    <UserCheck className="h-3 w-3" />
                    <span>Trocar Contato</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* PANEL B: AI MATCHMAKING RECOMMENDATIONS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-violet-400" />
              IA Matchmaking (Conexões Inteligentes)
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1 rounded">
              98% ACCURACY
            </span>
          </div>

          <p className="text-xs text-slate-400">Nossa IA cruza seus interesses e dados cadastrais para recomendar parcerias de alto valor comercial:</p>

          <div className="space-y-3">
            {matches.map((m) => (
              <div key={m.id} className="p-3 bg-slate-950 border border-slate-850 rounded-lg text-xs space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-200">{m.name}</span>
                    <span className="text-[9px] text-slate-500 block font-mono">{m.company}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1.5 rounded leading-none">
                    {m.matchRate} Match
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                  <div><span className="text-slate-500">Interesse:</span> {m.interest}</div>
                  <div><span className="text-slate-500">Alvo:</span> {m.goal}</div>
                </div>

                <div className="text-right pt-1.5 border-t border-slate-900/60">
                  <button 
                    onClick={() => alert(`Solicitação de reunião enviada para ${m.name} (${m.company}) via chat interno.`)}
                    className="bg-violet-950 hover:bg-violet-900 text-violet-300 border border-violet-500/20 text-[10px] font-mono px-2.5 py-1 rounded"
                  >
                    Agendar Reunião de Negócios
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* PANEL C: GAMIFICATION & STORE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          
          {/* Active Missions */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4 w-4 text-violet-400" />
              Missões Ativas & Desafios
            </h4>
            
            <div className="space-y-2">
              {missions.map((ms) => (
                <div key={ms.id} className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg flex items-center justify-between text-xs">
                  <div className="space-y-0.5 max-w-[180px]">
                    <span className={`font-mono text-[11px] ${ms.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                      {ms.text}
                    </span>
                    <span className="text-[9px] text-violet-400 block font-mono">+{ms.points} Pontos VIP</span>
                  </div>
                  
                  {ms.completed ? (
                    <span className="text-emerald-400 font-mono text-[10px] font-bold">CONCLUÍDO</span>
                  ) : (
                    <button 
                      onClick={() => handleCompleteMission(ms.id, ms.points)}
                      className="bg-violet-600 hover:bg-violet-500 text-white font-mono text-[9px] px-2 py-0.5 rounded shrink-0"
                    >
                      Cumprir Missão
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Official Store Redeem */}
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag className="h-4 w-4 text-violet-400" />
              Loja Oficial PLAY+ (Comprar com Pontos ou BRL)
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {storeProducts.map((p) => (
                <div key={p.id} className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-center space-y-2">
                  <span className="text-2xl block">{p.img}</span>
                  <span className="font-bold text-slate-200 block truncate text-[10px] leading-tight" title={p.name}>
                    {p.name}
                  </span>
                  
                  <div className="space-y-1 pt-1 border-t border-slate-900/60">
                    <button 
                      onClick={() => handleBuyProduct(p.name, p.pointsCost, 'points')}
                      className="w-full bg-violet-950 hover:bg-violet-900 text-violet-300 text-[9px] py-1 rounded"
                    >
                      Resgatar {p.pointsCost} pts
                    </button>
                    <button 
                      onClick={() => handleBuyProduct(p.name, p.brlPrice, 'brl')}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 text-[9px] py-1 rounded border border-slate-850"
                    >
                      Comprar R$ {p.brlPrice}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
