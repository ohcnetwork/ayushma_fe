import { atom } from 'jotai';

export const authTokenAtom = atom<string | null>(null);
export const apiUrlAtom = atom<string | null>(null);