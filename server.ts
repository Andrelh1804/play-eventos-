import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    aiEnabled: !!ai, 
    timestamp: new Date().toISOString() 
  });
});

// Gemini AI Event Planner Endpoint
app.post("/api/gemini/planning", async (req, res) => {
  const { name, category, venue, date, budget, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "O nome do evento é obrigatório." });
  }

  // Robust mock response fallback in case Gemini API is not configured or fails
  const getMockPlanning = () => {
    return {
      timeline: [
        { title: "Definição de Conceito e Identidade", dateOffset: -90, description: "Criação da identidade visual do evento, logotipos e paleta de cores." },
        { title: "Abertura de Vendas do 1º Lote", dateOffset: -60, description: "Início da comercialização dos ingressos promocionais nas plataformas parceiras." },
        { title: "Fechamento com Fornecedores Críticos", dateOffset: -45, description: "Assinatura dos contratos de alimentação (buffet), som, luz e segurança." },
        { title: "Divulgação em Redes Sociais e Imprensa", dateOffset: -30, description: "Lançamento de campanhas direcionadas e assessoria de imprensa." },
        { title: "Montagem da Infraestrutura", dateOffset: -1, description: "Instalação dos palcos, stands, painéis de LED e testes de som/luz." },
        { title: "Dia do Evento - Operação Completa", dateOffset: 0, description: "Execução geral, recepção, credenciamento, COE ativo e pós-evento." }
      ],
      checklists: [
        { title: "Revisar alvará municipal de funcionamento", category: "legal", priority: "high" },
        { title: "Contratar ambulância UTI móvel com médico", category: "security", priority: "high" },
        { title: "Instalar gerador de energia redundante para som/LED", category: "infra", priority: "high" },
        { title: "Disparar e-mail marketing para base de leads", category: "marketing", priority: "medium" },
        { title: "Validar link de internet dedicada com contingência 4G", category: "infra", priority: "high" },
        { title: "Realizar treinamento de atendimento com o staff local", category: "production", priority: "medium" }
      ],
      budgetBreakdown: [
        { category: "Infraestrutura & Espaço", percentage: 35, cost: budget * 0.35 },
        { category: "Som, Luz & Painéis de LED", percentage: 25, cost: budget * 0.25 },
        { category: "Catering & Alimentação", percentage: 20, cost: budget * 0.20 },
        { category: "Marketing & Atração", percentage: 12, cost: budget * 0.12 },
        { category: "Segurança & Limpeza", percentage: 8, cost: budget * 0.08 }
      ],
      riskAnalysis: [
        { risk: "Queda de energia da concessionária", impact: "high", mitigation: "Contratação de geradores sob demanda com acionamento automático de 100KVA." },
        { risk: "Instabilidade na internet para check-in e vendas locais", impact: "high", mitigation: "Uso de roteadores dual-SIM 4G/5G dedicados e modo check-in offline." },
        { risk: "Baixa adesão de patrocinadores corporativos", impact: "medium", mitigation: "Criação de cotas alternativas com maior entrega digital e branding nas lives do evento." }
      ],
      pricingSuggestions: [
        { name: "Ingresso Promocional / Early Bird", price: 120, description: "Quantidade limitada para estimular vendas rápidas." },
        { name: "Ingresso Inteira (Lote Normal)", price: 250, description: "Preço cheio para sustentabilidade financeira." },
        { name: "Área VIP / Experiência Premium", price: 500, description: "Acesso exclusivo com buffet e lounge privativo." }
      ]
    };
  };

  if (!ai) {
    console.log("No GEMINI_API_KEY provided, returning beautiful mock plan fallback.");
    return res.json({ 
      source: "simulation", 
      data: getMockPlanning() 
    });
  }

  try {
    const prompt = `Você é a inteligência artificial da plataforma SaaS Enterprise "PLAY+EVENTOS" (Event Operating System). 
Sua tarefa é elaborar um planejamento estratégico, plano de custos e análise de risco completos e ultra-profissionais para um evento baseado nas seguintes informações:
- Nome do Evento: ${name}
- Categoria: ${category}
- Local/Espaço: ${venue}
- Data do Evento: ${date}
- Orçamento Disponível (R$): ${budget}
- Descrição: ${description || "Sem descrição informada"}

Retorne um objeto JSON estrito com as seguintes propriedades exatamente no formato especificado:
1. "timeline": lista de objetos com "title" (título do marco), "dateOffset" (número de dias antes do evento, ex: -60, -30, -1, 0) e "description" (detalhamento do que fazer).
2. "checklists": lista de objetos com "title" (ação a realizar), "category" (pode ser "infra", "security", "marketing", "finance", "legal", "production", "sports") e "priority" (pode ser "low", "medium", "high").
3. "budgetBreakdown": lista de objetos representando o centro de custos ideal contendo "category" (categoria de gasto), "percentage" (porcentagem de 0 a 100) e "cost" (valor estimado em R$ baseado no orçamento).
4. "riskAnalysis": lista de objetos com "risk" (descrição do risco), "impact" (alto, médio, baixo) e "mitigation" (estratégia de mitigação detalhada).
5. "pricingSuggestions": lista de objetos com sugestão de ingressos contendo "name" (nome do lote/categoria), "price" (preço sugerido em R$) e "description" (motivo da escolha/benefício).

Importante: Responda apenas em Português do Brasil com dados realistas e adequados ao tipo de evento informado.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  dateOffset: { type: Type.INTEGER },
                  description: { type: Type.STRING }
                },
                required: ["title", "dateOffset", "description"]
              }
            },
            checklists: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  priority: { type: Type.STRING }
                },
                required: ["title", "category", "priority"]
              }
            },
            budgetBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  percentage: { type: Type.INTEGER },
                  cost: { type: Type.NUMBER }
                },
                required: ["category", "percentage", "cost"]
              }
            },
            riskAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  risk: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  mitigation: { type: Type.STRING }
                },
                required: ["risk", "impact", "mitigation"]
              }
            },
            pricingSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                },
                required: ["name", "price", "description"]
              }
            }
          },
          required: ["timeline", "checklists", "budgetBreakdown", "riskAnalysis", "pricingSuggestions"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Resposta vazia da inteligência artificial.");
    }

    const parsedData = JSON.parse(text.trim());
    return res.json({
      source: "gemini",
      data: parsedData
    });

  } catch (error: any) {
    console.error("Gemini API Error, falling back to simulated data:", error);
    return res.json({
      source: "simulation_fallback",
      error: error.message || "Erro desconhecido",
      data: getMockPlanning()
    });
  }
});

// Gemini Chat Copilot Endpoint for direct recommendations
app.post("/api/gemini/copilot", async (req, res) => {
  const prompt = req.body.prompt || req.body.message;

  if (!prompt) {
    return res.status(400).json({ error: "Mensagem obrigatória" });
  }

  if (!ai) {
    // Elegant fallback simulation
    const simulatedAnswers: Record<string, string> = {
      default: "Como consultor estratégico da PLAY+EVENTOS, sugiro focar no controle de check-in automatizado e no checklist operacional. Garanta que a ambulância UTI esteja locada 15 dias antes e verifique a redundância elétrica. Deseja que eu elabore uma planilha de custos específica?"
    };
    return res.json({
      source: "simulation",
      text: simulatedAnswers.default,
      reply: simulatedAnswers.default
    });
  }

  try {
    const systemPrompt = `Você é a inteligência artificial integradora "PLAY+COGNITIVE" embutida no EventOS "PLAY+EVENTOS". 
Seu papel é atuar como assessor sênior de produção de eventos, respondendo dúvidas com maestria estratégica.
Considere os dados do evento em contexto abaixo, caso fornecidos:
${req.body.eventContext ? JSON.stringify(req.body.eventContext) : "Nenhum evento ativo selecionado."}

Responda de forma assertiva, profissional e em Português do Brasil. Use parágrafos bem espaçados ou listas curtas.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7
      }
    });

    const replyText = response.text || "";

    return res.json({
      source: "gemini",
      text: replyText,
      reply: replyText
    });

  } catch (error: any) {
    console.error("Gemini Copilot Error:", error);
    return res.json({
      source: "simulation_fallback",
      text: "Instabilidade momentânea no processamento de linguagem natural. Recomenda-se validar a internet e o sinal dedicado no COE do evento.",
      reply: "Instabilidade momentânea no processamento de linguagem natural. Recomenda-se validar a internet e o sinal dedicado no COE do evento."
    });
  }
});

// Setup Vite Middleware or Static Assets Serving
const isProd = process.env.NODE_ENV === "production";

async function setupApp() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PLAY+EVENTOS server running on http://localhost:${PORT} in ${isProd ? "production" : "development"} mode.`);
  });
}

setupApp();
