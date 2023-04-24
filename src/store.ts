import { atom } from "jotai";
import { Storage } from "./utils/storage";

export const storageAtom = atom<Storage>((null as any) as Storage);