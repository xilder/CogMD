import { clsx, type ClassValue } from 'clsx';
import {
  calculatePKCECodeChallenge,
  generateRandomCodeVerifier,
} from 'oauth4webapi';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitaliseWords(text: string) {
  if (!text) return '';
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

export const handleGoogleLogin = async () => {
  const verifier = generateRandomCodeVerifier();

  const challenge = await calculatePKCECodeChallenge(verifier);
  sessionStorage.setItem('code_verifier', verifier);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const redirectUrl = `${window.location.origin}/callback`;

  const params = new URLSearchParams({
    provider: 'google',
    redirect_to: redirectUrl,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });

  window.location.href = `${supabaseUrl}/auth/v1/authorize?${params.toString()}`;
};
