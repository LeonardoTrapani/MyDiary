import { atom } from "jotai";
import { Subject } from "./react-query-hooks";

export const activeSubjectAtom = atom<Subject | null>(null);
export const activeInfoDayAtom = atom<
  | undefined
  | {
      minutesToComplete: number;
      minutesToAssign: number;
      date: string;
      initialFreeTime: number;
    }
>(undefined);
