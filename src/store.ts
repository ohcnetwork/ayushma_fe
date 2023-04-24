import { atom } from "jotai";
import { Storage } from "./utils/storage";

export const storageAtom = atom<Storage>(JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCAL_STORAGE || "storage") || "{}") as Storage);