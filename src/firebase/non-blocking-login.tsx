
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  OAuthProvider,
  UserCredential
} from 'firebase/auth';

/** Initiate anonymous sign-in. Returns a Promise. */
export function initiateAnonymousSignIn(authInstance: Auth): Promise<UserCredential> {
  return signInAnonymously(authInstance);
}

/** Initiate email/password sign-up. Returns a Promise. */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(authInstance, email, password);
}

/** Initiate email/password sign-in. Returns a Promise. */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(authInstance, email, password);
}

/** Initiate Discord sign-in via OAuth. Returns a Promise. */
export function initiateDiscordSignIn(authInstance: Auth): Promise<UserCredential> {
  const provider = new OAuthProvider('discord.com');
  // Note: Discord provider must be configured in Firebase Console first.
  return signInWithPopup(authInstance, provider);
}
