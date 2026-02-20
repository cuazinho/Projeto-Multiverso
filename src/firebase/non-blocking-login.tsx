
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  OAuthProvider
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance);
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password);
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password);
}

/** Initiate Discord sign-in via OAuth (non-blocking). */
export function initiateDiscordSignIn(authInstance: Auth): void {
  const provider = new OAuthProvider('discord.com');
  // Note: Discord provider must be configured in Firebase Console first.
  signInWithPopup(authInstance, provider).catch((error) => {
    console.error("Erro ao autenticar com Discord:", error);
  });
}
