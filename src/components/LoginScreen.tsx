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
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { CustomRole } from "../types";
import { handleFirebaseError, FriendlyError } from "../lib/errorHandler";
import PlayLogo from "./PlayLogo";

interface LoginScreenProps {
  roles: CustomRole[];
  onAuthSuccess: (userId: string, userEmail: string, userName: string) => void;
  onBackToLanding?: () => void;
}

export default function LoginScreen({ roles, onAuthSuccess, onBackToLanding }: LoginScreenProps) {
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
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-4 font-sans relative" id="firebase-auth-screen">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {onBackToLanding && (
        <button 
          onClick={onBackToLanding}
          className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-yellow-500 transition-colors bg-zinc-900/40 border border-zinc-800/80 hover:border-yellow-500/20 px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o site
        </button>
      )}

      <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <PlayLogo size="sm" showReflection={false} />
          </div>
          <p className="text-[10px] text-yellow-500 font-mono uppercase tracking-widest font-bold">Play+ Cognitive Core System</p>
        </div>

        {/* Auth Tabs */}
        <div className="flex bg-black p-1 rounded-xl border border-zinc-900">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(""); setFriendlyError(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              !isSignUp ? "bg-zinc-900 text-yellow-500 shadow-md border border-zinc-800" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(""); setFriendlyError(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              isSignUp ? "bg-zinc-900 text-yellow-500 shadow-md border border-zinc-800" : "text-zinc-400 hover:text-zinc-200"
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
            className="w-full bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer border border-zinc-800"
            style={{ minHeight: "44px" }}
          >
            <Chrome className="h-4 w-4 text-yellow-500" />
            Entrar com o Google
          </button>

          <div className="flex items-center gap-2">
            <div className="h-[1px] bg-zinc-900 flex-1"></div>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Ou via E-mail Corporativo</span>
            <div className="h-[1px] bg-zinc-900 flex-1"></div>
          </div>
        </div>

        {/* Real Firebase Form */}
        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
          
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-zinc-500" /> Nome Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: André Luis"
                className="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-500 transition-all"
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-zinc-500" /> E-mail Operacional
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: seu@email.com.br"
              className="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-500 transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-zinc-500" /> Senha Segura
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo de 6 caracteres"
              className="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-500 transition-all"
              required
            />
          </div>

          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Atribuir Perfil de Acesso Corporativo</label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-500 transition-all cursor-pointer"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id} className="bg-black text-zinc-300">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-xs py-3.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
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
        <div className="border-t border-zinc-900 pt-5 space-y-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <Sparkles className="h-3 w-3 text-yellow-500 animate-pulse" />
            <span>Preservar Perfis de Demonstração (Fast Sandbox)</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("admin")}
              className="bg-black hover:bg-zinc-900 border border-zinc-900 hover:border-yellow-500/20 text-left p-2.5 rounded-xl transition-all"
            >
              <span className="block text-[10px] font-bold text-zinc-300">CEO / Administrador</span>
              <span className="block text-[8px] text-zinc-500 mt-0.5">Acesso total irrestrito</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("operacional")}
              className="bg-black hover:bg-zinc-900 border border-zinc-900 hover:border-yellow-500/20 text-left p-2.5 rounded-xl transition-all"
            >
              <span className="block text-[10px] font-bold text-zinc-300">Gerente Operacional</span>
              <span className="block text-[8px] text-zinc-500 mt-0.5">COE, Kanban & Checklists</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("financeiro")}
              className="bg-black hover:bg-zinc-900 border border-zinc-900 hover:border-yellow-500/20 text-left p-2.5 rounded-xl transition-all"
            >
              <span className="block text-[10px] font-bold text-zinc-300">Diretor Financeiro</span>
              <span className="block text-[8px] text-zinc-500 mt-0.5">Faturamento & BI</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("staff_campo")}
              className="bg-black hover:bg-zinc-900 border border-zinc-900 hover:border-yellow-500/20 text-left p-2.5 rounded-xl transition-all"
            >
              <span className="block text-[10px] font-bold text-zinc-300">Staff / Apoio</span>
              <span className="block text-[8px] text-zinc-500 mt-0.5">Painel simplificado</span>
            </button>
          </div>
        </div>

        {/* Security badge and token note */}
        <div className="bg-black p-3 rounded-xl border border-zinc-900 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-zinc-400 leading-normal">
            <strong>Autenticação via JWT Tokens</strong>: Todas as credenciais de e-mail e senha são criptografadas e processadas diretamente pelo nó do Firebase Auth do Google.
          </p>
        </div>

      </div>
    </div>
  );
}
