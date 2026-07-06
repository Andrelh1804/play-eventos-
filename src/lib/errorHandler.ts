/**
 * PLAY+EVENTOS (EventOS Enterprise) — CENTRALIZED ERROR HANDLER
 * Translates Firebase Auth & Firestore system errors into user-friendly Portuguese messages.
 */

export interface FriendlyError {
  code: string;
  title: string;
  message: string;
  actionRequired?: string;
}

export function handleFirebaseError(error: any): FriendlyError {
  const code = error?.code || "";
  const originalMessage = error?.message || "";

  // 1. Firebase Authentication Errors
  if (code.startsWith("auth/")) {
    switch (code) {
      case "auth/operation-not-allowed":
        return {
          code,
          title: "Provedor de Login Desabilitado",
          message: "O método de autenticação selecionado não está ativado no seu Firebase Console.",
          actionRequired: "Acesse o Console do Firebase -> Authentication -> Sign-in method e ative o provedor correspondente (E-mail/Senha ou Google)."
        };
      case "auth/invalid-email":
        return {
          code,
          title: "E-mail Inválido",
          message: "O formato do e-mail inserido é inválido.",
          actionRequired: "Certifique-se de preencher um e-mail corporativo válido (ex: operador@playeventos.com)."
        };
      case "auth/user-disabled":
        return {
          code,
          title: "Conta Desativada",
          message: "Esta conta de operador foi temporariamente suspensa por conformidade de segurança.",
          actionRequired: "Entre em contato com o administrador do sistema ou o painel NOC/COE."
        };
      case "auth/user-not-found":
        return {
          code,
          title: "Operador Não Encontrado",
          message: "Nenhum cadastro foi localizado com o e-mail informado.",
          actionRequired: "Caso seja o seu primeiro acesso, alterne para a aba 'Cadastrar' para criar sua credencial."
        };
      case "auth/wrong-password":
        return {
          code,
          title: "Senha Incorreta",
          message: "A senha inserida não corresponde ao e-mail informado.",
          actionRequired: "Verifique o Caps Lock ou digite novamente. Caso tenha esquecido, solicite a redefinição de senha."
        };
      case "auth/invalid-credential":
        return {
          code,
          title: "Credenciais Inválidas",
          message: "O par e-mail e senha informado está incorreto ou expirado.",
          actionRequired: "Verifique as informações digitadas e tente de novo."
        };
      case "auth/email-already-in-use":
        return {
          code,
          title: "E-mail já Cadastrado",
          message: "O e-mail digitado já está em uso por outro operador no EventOS.",
          actionRequired: "Utilize a aba 'Entrar' para acessar sua conta ou registre com um e-mail corporativo diferente."
        };
      case "auth/weak-password":
        return {
          code,
          title: "Senha Fraca",
          message: "A senha fornecida não atende aos requisitos mínimos de criptografia.",
          actionRequired: "Aumente a segurança de sua senha utilizando pelo menos 6 caracteres contendo letras e números."
        };
      case "auth/popup-closed-by-user":
        return {
          code,
          title: "Janela Fechada",
          message: "O pop-up de login do Google foi fechado antes do término do processo.",
          actionRequired: "Clique novamente em 'Entrar com o Google' e mantenha a janela aberta até a conclusão."
        };
      case "auth/cancelled-popup-request":
        return {
          code,
          title: "Operação Cancelada",
          message: "A autenticação foi cancelada por causa de múltiplas tentativas simultâneas.",
          actionRequired: "Por favor, aguarde alguns segundos e tente o login novamente."
        };
      default:
        return {
          code,
          title: "Falha de Autenticação",
          message: originalMessage || "Ocorreu uma anomalia ao tentar autenticar seu acesso.",
          actionRequired: "Recarregue a página ou tente novamente mais tarde."
        };
    }
  }

  // 2. Firestore Permission & Database Errors
  if (code.includes("permission-denied") || originalMessage.toLowerCase().includes("permission") || originalMessage.toLowerCase().includes("insufficient")) {
    return {
      code: "firestore/permission-denied",
      title: "Permissão do Firestore Insuficiente",
      message: "Erro de Regras de Segurança: O banco de dados recusou a operação de leitura ou escrita.",
      actionRequired: "Copie as regras de segurança descritas no 'Auditoria & Go-Live Hub' e cole-as na aba 'Rules' do seu Cloud Firestore no Firebase Console."
    };
  }

  // 3. Network or other errors
  return {
    code: code || "system/unknown",
    title: "Erro Operacional",
    message: originalMessage || "Uma falha inesperada impediu a comunicação com os serviços de nuvem.",
    actionRequired: "Verifique sua conexão de rede. Caso o erro persista, consulte as diretrizes SRE no manual do NOC."
  };
}
