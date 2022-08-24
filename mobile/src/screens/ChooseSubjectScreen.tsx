import { AxiosError } from "axios";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  AddHomeworkStackParamList,
  AddHomeworkStackScreenProps,
} from "../../types";
import Error from "../components/Error";
import { BoldText, MediumText } from "../components/StyledText";
import { View } from "../components/Themed";
import { useGetDataFromAxiosError } from "../util/axiosUtils";
import { Subject as SubjectType, useSubjects } from "../util/react-query-hooks";
import globalStyles from "../constants/Syles";
import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import { navigationRef } from "../navigation";

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
  subjects: SubjectType[];
}> = (props) => {
  return (
    <View style={[styles.subjectList, globalStyles.smallShadow]}>
      <FlatList
        data={props.subjects}
        scrollEnabled={false}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => <SingleSubject subject={item} />}
      />
    </View>
  );
};

const Separator: React.FC = () => {
  return (
    <View
      style={{
        paddingHorizontal: 14,
      }}
    >
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: "#0000001e",
        }}
      ></View>
    </View>
  );
};

const SingleSubject: React.FC<{ subject: SubjectType }> = ({ subject }) => {
  return (
    <TouchableOpacity style={[styles.subject]}>
      <MediumText style={styles.subjectText}>{subject.name}</MediumText>
      <ColoredCircle color={subject.color} />
    </TouchableOpacity>
  );
};

const ColoredCircle: React.FC<{ color: string }> = ({ color }) => {
  return (
    <View
      style={[
        styles.circle,
        {
          backgroundColor: color,
        },
      ]}
    ></View>
  );
};

export const ChooseSubjectAddIcon: React.FC = () => {
  const { primary } = useTheme().colors;

  const navigation = useNavigation<NavigationProp<AddHomeworkStackParamList>>();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("AddSubject");
      }}
    >
      <Ionicons name="add" size={32} color={primary} />
    </TouchableOpacity>
  );
};

export const AddSubjectScreen: React.FC = () => {
  return (
    <View>
      <BoldText>ADD SUBJECT</BoldText>
    </View>
  );
};

const styles = StyleSheet.create({
  subjectText: {
    fontSize: 18,
  },
  right: {
    backgroundColor: "red",
  },
  subject: {
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  subjectList: {
    margin: 14,
    paddingVertical: 2,
    borderRadius: 16,
  },
  circle: {
    aspectRatio: 1,
    borderRadius: 1000,
    borderColor: "#000",
    borderWidth: 0.2,
  },
});
export default ChooseSubjectScreen;
