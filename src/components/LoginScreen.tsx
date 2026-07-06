import React, { useState } from "react";
import { 
  auth 
} from "../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { saveDocument } from "../lib/firestoreService";
import { 
  Shield, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  RefreshCw,
  Info,
  Chrome,
  AlertCircle
} from "lucide-react";
import { CustomRole } from "../types";
import { handleFirebaseError, FriendlyError } from "../lib/errorHandler";

interface LoginScreenProps {
  roles: CustomRole[];
  onAuthSuccess: (userId: string, userEmail: string, userName: string) => void;
}

export default function LoginScreen({ roles, onAuthSuccess }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [roleId, setRoleId] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [friendlyError, setFriendlyError] = useState<FriendlyError | null>(null);

  const handleGoogleLogin = async () => {
    setError("");
    setFriendlyError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const displayName = user.displayName || user.email?.split("@")[0] || "Operador";
      
      const userProfile = {
        id: user.uid,
        name: displayName,
        email: user.email || "",
        roleId: "admin", // default role for self sign-up
        status: "active" as const
      };

      await saveDocument("users", user.uid, userProfile);
      onAuthSuccess(user.uid, user.email || "", displayName);
    } catch (err: any) {
      console.error(err);
      const handled = handleFirebaseError(err);
      setFriendlyError(handled);
      setError(handled.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFriendlyError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const user = userCredential.user;
      const displayName = user.displayName || name || email.split("@")[0];
      
      onAuthSuccess(user.uid, user.email || email, displayName);
    } catch (err: any) {
      console.error(err);
      const errorCode = err?.code || "";
      const errorMsg = err?.message || "";
      const isUserNotFound = errorCode === "auth/user-not-found" || 
                            errorMsg.includes("auth/user-not-found") || 
                            errorMsg.includes("user-not-found");
      
      if (isUserNotFound) {
        // Automatically try to create account if it does not exist (useful for bootstrapping demo credentials)
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          const displayName = name || email.split("@")[0];

          const userProfile = {
            id: user.uid,
            name: displayName,
            email: email,
            roleId: roleId,
            status: "active" as const
          };

          await saveDocument("users", user.uid, userProfile);
          onAuthSuccess(user.uid, email, displayName);
          return;
        } catch (signUpErr: any) {
          console.error("Auto signup failed after user not found:", signUpErr);
        }
      }

      const handled = handleFirebaseError(err);
      setFriendlyError(handled);
      setError(handled.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFriendlyError(null);
    if (!name.trim()) {
      setError("Por favor, preencha o seu nome.");
      return;
    }
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user profile in Firestore
      const userProfile = {
        id: user.uid,
        name: name,
        email: email,
        roleId: roleId,
        status: "active" as const
      };

      await saveDocument("users", user.uid, userProfile);
      
      onAuthSuccess(user.uid, email, name);
    } catch (err: any) {
      console.error(err);
      const errorCode = err?.code || "";
      const errorMsg = err?.message || "";
      const isEmailInUse = errorCode === "auth/email-already-in-use" || 
                           errorMsg.includes("auth/email-already-in-use") || 
                           errorMsg.includes("email-already-in-use");

      if (isEmailInUse) {
        // Automatically try to log in since the account already exists!
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          const displayName = user.displayName || name || email.split("@")[0];
          onAuthSuccess(user.uid, user.email || email, displayName);
          return;
        } catch (loginErr: any) {
          console.error("Auto login failed after email in use:", loginErr);
        }
      }

      const handled = handleFirebaseError(err);
      setFriendlyError(handled);
      setError(handled.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole: string) => {
    setEmail(`${demoRole}@playeventos.com.br`);
    setPassword(`senha123_${demoRole}`);
    setName(
      demoRole === "admin" ? "André Luis (CEO)" :
      demoRole === "operacional" ? "Bruno Ramos (Ops)" :
      demoRole === "financeiro" ? "Carla Souza (CFO)" : "Lucas Mendes (Staff)"
    );
    setRoleId(demoRole);
    setIsSignUp(true);
    setError("");
    
    // Suggest signup
    alert(`Preparamos os dados de teste para o perfil [${demoRole.toUpperCase()}].\n\nCaso a conta não exista, basta clicar em "Criar Conta Operacional" para cadastrá-la em tempo real no Firebase.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans" id="firebase-auth-screen">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Header Branding */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex p-3 bg-indigo-950/40 rounded-2xl border border-indigo-500/20 mb-2">
            <Shield className="h-8 w-8 text-indigo-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight">EVENTOS OS</h1>
          <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Play+ Cognitive Core System</p>
        </div>

        {/* Auth Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
          <button
            onClick={() => { setIsSignUp(false); setError(""); setFriendlyError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              !isSignUp ? "bg-slate-900 text-indigo-300 shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => { setIsSignUp(true); setError(""); setFriendlyError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              isSignUp ? "bg-slate-900 text-indigo-300 shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Cadastrar
          </button>
        </div>

        {friendlyError ? (
          <div className="bg-rose-950/45 border border-rose-500/25 p-4 rounded-xl space-y-2 text-xs leading-relaxed" id="centralized-auth-error-banner">
            <div className="flex items-center gap-2 text-rose-300 font-bold font-display">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{friendlyError.title}</span>
            </div>
            <p className="text-rose-200/90 font-mono text-[11px]">{friendlyError.message}</p>
            {friendlyError.actionRequired && (
              <div className="pt-1.5 border-t border-rose-500/10 text-[10px] text-amber-300/90 font-sans">
                <span className="font-bold uppercase tracking-wider font-mono text-[9px] text-amber-400 block mb-0.5">Ação Necessária:</span>
                {friendlyError.actionRequired}
              </div>
            )}
          </div>
        ) : error ? (
          <div className="bg-rose-950/30 border border-rose-500/15 p-3 rounded-xl text-xs text-rose-400 font-mono leading-relaxed flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : null}

        {/* Google Sign-In (Highly Accessible) */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
            style={{ minHeight: "44px" }}
          >
            <Chrome className="h-4 w-4 text-slate-800" />
            Entrar com o Google
          </button>

          <div className="flex items-center gap-2">
            <div className="h-[1px] bg-slate-800/80 flex-1"></div>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Ou via E-mail Corporativo</span>
            <div className="h-[1px] bg-slate-800/80 flex-1"></div>
          </div>
        </div>

        {/* Real Firebase Form */}
        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
          
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-500" /> Nome Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: André Luis"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-500" /> E-mail Operacional
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: seu@email.com.br"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-500" /> Senha Segura
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo de 6 caracteres"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
              required
            />
          </div>

          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Atribuir Perfil de Acesso Corporativo</label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id} className="bg-slate-950 text-slate-300">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            style={{ minHeight: "44px" }}
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Processando Autenticação...
              </>
            ) : (
              <>
                {isSignUp ? "Criar Conta Operacional" : "Entrar no Sistema"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login presets */}
        <div className="border-t border-slate-850 pt-5 space-y-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
            <span>Preservar Perfis de Demonstração (Fast Sandbox)</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin("admin")}
              className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left p-2.5 rounded-xl transition-all"
            >
              <span className="block text-[10px] font-bold text-slate-300">CEO / Administrador</span>
              <span className="block text-[8px] text-slate-500 mt-0.5">Acesso total irrestrito</span>
            </button>
            <button
              onClick={() => handleDemoLogin("operacional")}
              className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left p-2.5 rounded-xl transition-all"
            >
              <span className="block text-[10px] font-bold text-slate-300">Gerente Operacional</span>
              <span className="block text-[8px] text-slate-500 mt-0.5">COE, Kanban & Checklists</span>
            </button>
            <button
              onClick={() => handleDemoLogin("financeiro")}
              className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left p-2.5 rounded-xl transition-all"
            >
              <span className="block text-[10px] font-bold text-slate-300">Diretor Financeiro</span>
              <span className="block text-[8px] text-slate-500 mt-0.5">Faturamento & BI</span>
            </button>
            <button
              onClick={() => handleDemoLogin("staff_campo")}
              className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left p-2.5 rounded-xl transition-all"
            >
              <span className="block text-[10px] font-bold text-slate-300">Staff / Apoio</span>
              <span className="block text-[8px] text-slate-500 mt-0.5">Painel simplificado</span>
            </button>
          </div>
        </div>

        {/* Security badge and token note */}
        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850/80 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-400 leading-normal">
            <strong>Autenticação via JWT Tokens</strong>: Todas as credenciais de e-mail e senha são criptografadas e processadas diretamente pelo nó do Firebase Auth do Google.
          </p>
        </div>

      </div>
    </div>
  );
}
