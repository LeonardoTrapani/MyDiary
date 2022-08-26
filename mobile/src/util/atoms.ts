import { atom } from "jotai";
import { Subject } from "./react-query-hooks";

export const activeSubjectAtom = atom<Subject | null>(null);
