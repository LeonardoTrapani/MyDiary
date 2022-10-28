import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { GradeStackScreenProps } from "../../types";
import { View } from "../components/Themed";
import { activeSubjectAtom } from "../util/atoms";
import { useAllGrades } from "../util/react-query-hooks";

const AddHomeworkModal = ({ route }: GradeStackScreenProps<"Add">) => {
  //when I exit reset the atom
  const { data } = useAllGrades();
  const [activeSubject, setActiveSubject] = useAtom(activeSubjectAtom);
  useEffect(() => {
    if (route.params?.Subject) {
      const { name, id, color } = route.params.Subject;
      setActiveSubject({ id, name, color });
    }
  }, [route.params, setActiveSubject]);
  console.log(activeSubject);
  return <View></View>;
};

export default AddHomeworkModal;
