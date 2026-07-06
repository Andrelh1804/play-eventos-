import React, { useState } from "react";
import { 
  BookOpen, HelpCircle, GraduationCap, Award, FileText, CheckCircle2, 
  ChevronRight, Brain, Sparkles, Check, CheckSquare, RefreshCw
} from "lucide-react";

interface LmsWikiModuleProps {
  activeEvent: any;
}

export default function LmsWikiModule({ activeEvent }: LmsWikiModuleProps) {
  // Wiki category selected state
  const [selectedCategory, setSelectedCategory] = useState<string>("seguranca");

  // LMS Course state
  const [activeCourse, setActiveCourse] = useState<string>("staff");
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<any>({});
  const [certified, setCertified] = useState<boolean>(false);

  // Wiki SOPs list
  const wikiPOPs = {
    seguranca: [
      { id: "pop-s1", title: "POP-S01: Protocolo de Evacuação de Emergência", text: "Em caso de acionamento do COE, desligar imediatamente o painel elétrico de potência principal do palco, liberar trincos das catracas eletrônicas para abertura de pânico e disparar mensagens automáticas nos megafones." },
      { id: "pop-s2", title: "POP-S02: Credenciamento e Controle de Acesso VIP", text: "Todo convidado com credencial corporativa deve ser escaneado duas vezes: na triagem externa e na portaria de isolamento acústico dos camarotes." }
    ],
    financeiro: [
      { id: "pop-f1", title: "POP-F01: Alçada de Reembolso de Ticket por Cancelamento", text: "Cancelamentos de inscrições por razões climáticas devem ser aprovados eletronicamente pelo Supervisor Financeiro em até 48 horas. Reembolsos acima de R$ 5.000 exigem a validação expressa do Diretor Executivo." },
      { id: "pop-f2", title: "POP-F02: Emissão e Fechamento de NFS-e por Lote", text: "As notas fiscais de serviço municipais de faturamento de ingressos devem ser transmitidas em lote consolidado via API da prefeitura ao término de cada dia de evento." }
    ],
    logistica: [
      { id: "pop-l1", title: "POP-L01: Cronometragem RFID e Equipamentos em Pista", text: "Os leitores térmicos de chips RFID posicionados nas marcações de Km da pista devem ser calibrados com baterias backup de lítio e testados com o veículo batedor com 60 minutos de antecedência." },
      { id: "pop-l2", title: "POP-L02: Descarte Ambiental e Logística Reversa", text: "Toda cooperativa de reciclagem contratada deve pesar o lixo coletado no balcão de pesagem oficial para geração do cupom de auditoria fiscal de compensação de carbono." }
    ]
  };

  const activePOPs = (wikiPOPs as any)[selectedCategory] || wikiPOPs.seguranca;

  // LMS Course Details and Quiz
  const courses = {
    staff: {
      title: "Treinamento Geral de Staff de Apoio (PLAY+ Operator)",
      desc: "Capacitação completa para fiscais de pista, controladores de acesso, voluntários e produtores de campo operarem as ferramentas do EventOS.",
      questions: [
        { id: "q1", text: "Qual o procedimento de segurança prioritário em caso de alarmes de tempestade severa com raios?", options: ["Esperar o show terminar", "Desligar palcos e abrir portões de pânico imediatamente", "Mudar o local do palco principal"], answer: 1 },
        { id: "q2", text: "Como o staff monitora as equipes e equipamentos em tempo real?", options: ["Pelo aplicativo do participante", "Via rádio analógico apenas", "Pelo painel de comando do EventOS usando GIS e GPS integrado"], answer: 2 }
      ]
    },
    sponsors: {
      title: "Guia de Atendimento e Expositor de Estandes",
      desc: "Instruções operacionais para parceiros comerciais montarem marcas e utilizarem leitores de pulseira RFID dos visitantes para captar leads qualificados.",
      questions: [
        { id: "q1", text: "Como o expositor captura os dados de contato do visitante no estande?", options: ["Anotando em papel", "Escaneando a pulseira RFID/QR Code do participante pelo aplicativo", "Perguntando o RG"], answer: 1 },
        { id: "q2", text: "Qual a cota máxima de emissão de NF-e para patrocínios?", options: ["Sempre definida pelo contrato homologado no ERP", "Não há imposto", "Sempre 5% fixo independente do município"], answer: 0 }
      ]
    }
  };

  const activeCourseData = (courses as any)[activeCourse] || courses.staff;

  const handleSelectOption = (qId: string, optIdx: number) => {
    setQuizAnswers((prev: any) => ({ ...prev, [qId]: optIdx }));
  };

  const handleEvaluateQuiz = () => {
    let correctCount = 0;
    activeCourseData.questions.forEach((q: any) => {
      if (quizAnswers[q.id] === q.answer) correctCount++;
    });

    const isPassed = correctCount === activeCourseData.questions.length;
    setQuizScore(correctCount);
    if (isPassed) {
      setCertified(true);
      alert("Parabéns! Você gabaritou o quiz de treinamento corporativo. Sua credencial de operador foi certificada digitalmente com sucesso!");
    } else {
      setCertified(false);
      alert("Pontuação insuficiente! Revise os POPs e manuais na Wiki e tente novamente para conquistar seu certificado.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-100" id="lms-wiki-container">
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* PANEL 1: WIKI CORPORATIVA - POPs & TUTORIALS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              Wiki Corporativa (Biblioteca de POPs & Procedimentos)
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1.5 rounded">
              CONHECIMENTO
            </span>
          </div>

          <p className="text-xs text-slate-400">Pesquise e consulte os Procedimentos Operacionais Padrão (POPs) normatizados para as operações:</p>

          {/* Category selection */}
          <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[
              { id: 'seguranca', label: 'Segurança & Crise' },
              { id: 'financeiro', label: 'Financeiro & Impostos' },
              { id: 'logistica', label: 'Logística & Pista' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-1 px-3 py-1.5 rounded-md text-[11px] font-mono font-bold transition-all text-center ${
                  selectedCategory === cat.id
                    ? 'bg-slate-850 text-cyan-400 border border-slate-750'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {activePOPs.map((pop: any) => (
              <div key={pop.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                <span className="text-xs font-mono font-bold text-slate-200 block">{pop.title}</span>
                <p className="text-slate-400 text-[11px] font-sans leading-relaxed">{pop.text}</p>
                <div className="text-[9px] font-mono text-slate-500 text-right">
                  Última revisão técnica: Q3 2026 • Status: Homologado
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* PANEL 2: LMS SYSTEM - TRAINING & COURSE QUIZ */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-cyan-400 animate-bounce" />
              LMS - Treinamentos & Certificados Online
            </h4>
            <span className="text-[10px] font-mono text-cyan-400">QUALIFICAÇÃO STAFF</span>
          </div>

          {/* Course select tab buttons */}
          <div className="flex gap-1.5 border-b border-slate-800 pb-2">
            <button
              onClick={() => {
                setActiveCourse("staff");
                setQuizScore(null);
                setQuizAnswers({});
                setCertified(false);
              }}
              className={`px-3 py-1 text-xs font-sans font-bold transition-all ${
                activeCourse === 'staff' ? 'text-cyan-400 border-b-2 border-cyan-500 pb-2 -mb-2.5' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Curso Staff Geral
            </button>
            <button
              onClick={() => {
                setActiveCourse("sponsors");
                setQuizScore(null);
                setQuizAnswers({});
                setCertified(false);
              }}
              className={`px-3 py-1 text-xs font-sans font-bold transition-all ${
                activeCourse === 'sponsors' ? 'text-cyan-400 border-b-2 border-cyan-500 pb-2 -mb-2.5' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Curso Expositor/Parceiro
            </button>
          </div>

          <div className="space-y-4 pt-1.5">
            <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
              <h5 className="text-xs font-bold text-slate-100 font-display">{activeCourseData.title}</h5>
              <p className="text-slate-400 text-[11px] leading-relaxed">{activeCourseData.desc}</p>
            </div>

            {/* Questions layout */}
            <div className="space-y-4">
              {activeCourseData.questions.map((q: any, qIdx: number) => (
                <div key={q.id} className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 font-sans block">
                    {qIdx + 1}. {q.text}
                  </span>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    {q.options.map((opt: string, optIdx: number) => {
                      const isSelected = quizAnswers[q.id] === optIdx;
                      return (
                        <div 
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                            isSelected 
                              ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300' 
                              : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-cyan-400' : 'border-slate-800'
                            }`}>
                              {isSelected && <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>}
                            </span>
                            <span>{opt}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleEvaluateQuiz}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-sans font-bold text-xs py-2 rounded-xl transition-colors"
              style={{ minHeight: "40px" }}
            >
              Enviar Respostas do Quiz
            </button>

            {/* Certification status badge issue */}
            {certified && (
              <div className="bg-emerald-950/40 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3.5 animate-bounce">
                <div className="p-2.5 bg-emerald-900 text-emerald-300 rounded-full">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider leading-none mb-1">PLAY+ OPERATOR CERTIFICATE</h5>
                  <p className="text-[10px] text-slate-300 font-sans">
                    Certificação emitida digitalmente para o perfil: <strong className="text-white">Staff André</strong>. ID: #LMS-CRT-88019.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
