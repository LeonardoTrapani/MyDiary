import { AxiosError } from "axios";
import React from "react";
import { ActivityIndicator } from "react-native";
import { AddHomeworkStackScreenProps } from "../../types";
import Error from "../components/Error";
import { RegularText } from "../components/StyledText";
import { View } from "../components/Themed";
import { useGetDataFromAxiosError } from "../util/axiosUtils";
import { Subject, useSubjects } from "../util/react-query-hooks";

const ChooseSubjectScreen = ({
  navigation,
}: AddHomeworkStackScreenProps<"ChooseSubject">) => {
  const { data: subjects, error: subjectsError, isLoading } = useSubjects();

  const getDataFromAxiosError = useGetDataFromAxiosError(
    subjectsError as AxiosError,
    "an error has occurred fetching the subjects"
  );
  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (subjectsError) {
    const err = getDataFromAxiosError();
    return <Error text={err} />;
  }
  return <View>{subjects && <SubjectsList subjects={subjects} />}</View>;
};

const SubjectsList: React.FC<{
  subjects: Subject[];
}> = (props) => {
  return (
    <View>
      {props.subjects.map((subject) => {
        return (
          <RegularText
            key={subject.id}
            style={{
              color: subject.color,
            }}
          >
            {subject.name}
          </RegularText>
        );
      })}
    </View>
  );
};

export default ChooseSubjectScreen;
