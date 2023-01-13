import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { AxiosError } from "axios";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SettingStackScreenProps } from "../../types";
import ErrorComponent from "../components/ErrorComponent";
import SmallCard from "../components/SmallCard";
import { MediumText } from "../components/StyledText";
import { useGetDataFromAxiosError } from "../util/axiosUtils";
import { SubjectType, useSubjects } from "../util/react-query-hooks";
import { ColoredCircle } from "./ChooseSubjectScreen";

const SubjectScreen = ({ navigation }: SettingStackScreenProps<"Subject">) => {
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
    return <ErrorComponent text={err} />;
  }
  return (
    <View>
      {subjects && (
        <SubjectsList
          onPressSubject={() => {
            console.log("pressed a subject");
          }}
          subjects={subjects}
        />
      )}
    </View>
  );
};

export const SubjectsList: React.FC<{
  subjects: SubjectType[];
  onPressSubject: () => void;
}> = (props) => {
  const { card } = useTheme().colors;

  return (
    <FlatList
      data={props.subjects}
      scrollEnabled={true}
      renderItem={({ item, index }) => (
        <SingleSubject
          key={index}
          subject={item}
          i={index}
          lastI={props.subjects.length - 1}
          onPressSubject={props.onPressSubject}
        />
      )}
    />
  );
};

export const SingleSubject: React.FC<{
  subject: SubjectType;
  i: number;
  lastI: number;
  onPressSubject: () => void;
}> = ({ subject, onPressSubject, i, lastI }) => {
  const { primary } = useTheme().colors;
  const subjectPressHandler = () => {
    onPressSubject();
  };

  return (
    <SmallCard
      onPress={() => {
        console.log("a");
      }}
      isFirst={i === 0}
      isLast={i === lastI}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <ColoredCircle color={subject.color} />
          <MediumText style={styles.subjectText}>{subject.name}</MediumText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity>
            <Ionicons
              name="pencil"
              size={17}
              //color={primary}
              style={{ opacity: 0.8, marginRight: 5 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="trash-bin"
              size={17}
              style={{ opacity: 0.8 }}
              color={primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SmallCard>
  );
};
const styles = StyleSheet.create({
  subjectText: {
    fontSize: 18,
    marginLeft: 12,
  },
});
export default SubjectScreen;
