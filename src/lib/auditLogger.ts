import { saveDocument, loadCollection } from "./firestoreService";

export interface AuditLog {
  id: string;
  time: string; // ISO string or formatted local time
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  type: 'Finanças' | 'Contratos' | 'Acesso' | 'Operações' | 'Eventos' | 'Segurança';
  metadata?: any;
}

/**
 * Structured logger that writes critical platform events to Firebase Firestore
 */
export async function logPlatformEvent(
  userId: string,
  userName: string,
  userEmail: string,
  action: string,
  type: AuditLog['type'],
  metadata?: any
): Promise<AuditLog> {
  const logId = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const timeStr = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const newLog: AuditLog = {
    id: logId,
    time: timeStr,
    userId,
    userName,
    userEmail,
    action,
    type,
    metadata: metadata || null
  };

  try {
    // Write directly to the "audit_logs" Firestore collection
    await saveDocument("audit_logs", logId, newLog);
    console.log(`[Audit Logger] Structured event logged: "${action}" (${type})`);
  } catch (err) {
    console.error("Failed to persist structured audit log to Firestore:", err);
  }

  return newLog;
}

/**
 * Loads the latest audit logs from Firestore
 */
export async function fetchAuditLogs(): Promise<AuditLog[]> {
  try {
    const logs = await loadCollection<AuditLog>("audit_logs");
    // Sort logs descending by timestamp/ID
    return logs.sort((a, b) => b.id.localeCompare(a.id));
  } catch (error) {
    console.error("Failed to load audit logs from Firestore:", error);
    return [];
  }
}
