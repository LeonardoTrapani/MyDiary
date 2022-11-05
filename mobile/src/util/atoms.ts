import { atom } from "jotai";
import { SubjectType } from "./react-query-hooks";

export const activeSubjectAtom = atom<SubjectType | null>(null);
export const activeInfoDayAtom = atom<
  | undefined
  | {
      minutesToComplete?: number;
      minutesToAssign: number;
      date: string;
      initialFreeTime: number;
    }
>(undefined);
export const globalActiveConnectionAtom = atom<boolean | undefined>(undefined);
