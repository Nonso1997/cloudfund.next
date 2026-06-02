import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

export const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
export const isFirebaseEnabled = Boolean(projectId && clientEmail && privateKey && firebaseApiKey);

function getFirebaseApp() {
  if (!isFirebaseEnabled) {
    return null;
  }

  return (
    getApps()[0] ||
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
  );
}

const app = getFirebaseApp();

export const firebaseAuth = app ? getAuth(app) : null;
export const firestore = app ? getFirestore(app) : null;
