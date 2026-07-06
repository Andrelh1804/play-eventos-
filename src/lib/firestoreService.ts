import { db, auth } from "./firebase";
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  writeBatch 
} from "firebase/firestore";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Loads a collection from Firestore. If it is empty and initialData is provided,
 * it seeds the collection with initialData and returns it.
 */
export async function loadCollection<T extends { id: string }>(
  collectionName: string,
  initialData?: T[]
): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty && initialData && initialData.length > 0) {
      console.log(`Seeding collection "${collectionName}" with initial data...`);
      const batch = writeBatch(db);
      
      for (const item of initialData) {
        const docRef = doc(db, collectionName, item.id);
        batch.set(docRef, item);
      }
      
      try {
        await batch.commit();
      } catch (writeErr: any) {
        if (writeErr?.message?.toLowerCase().includes("permission") || writeErr?.code?.includes("permission-denied") || writeErr?.message?.toLowerCase().includes("insufficient")) {
          handleFirestoreError(writeErr, OperationType.WRITE, collectionName);
        }
        throw writeErr;
      }
      return initialData;
    }
    
    const items: T[] = [];
    snapshot.forEach((doc) => {
      items.push(doc.data() as T);
    });
    
    return items;
  } catch (error: any) {
    console.error(`Error loading collection "${collectionName}":`, error);
    if (error?.message?.toLowerCase().includes("permission") || error?.code?.includes("permission-denied") || error?.message?.toLowerCase().includes("insufficient")) {
      handleFirestoreError(error, OperationType.GET, collectionName);
    }
    // Fallback to initial data if loading fails
    return initialData || [];
  }
}

/**
 * Saves a document to Firestore.
 */
export async function saveDocument(
  collectionName: string,
  docId: string,
  data: any
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
  } catch (error: any) {
    console.error(`Error saving document in "${collectionName}":`, error);
    if (error?.message?.toLowerCase().includes("permission") || error?.code?.includes("permission-denied") || error?.message?.toLowerCase().includes("insufficient")) {
      handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${docId}`);
    }
    throw error;
  }
}

/**
 * Deletes a document from Firestore.
 */
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error: any) {
    console.error(`Error deleting document in "${collectionName}":`, error);
    if (error?.message?.toLowerCase().includes("permission") || error?.code?.includes("permission-denied") || error?.message?.toLowerCase().includes("insufficient")) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${docId}`);
    }
    throw error;
  }
}
