import { atom } from 'jotai';

export const authTokenAtom = atom<string | null>(null);