import { AxiosError } from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import {
  AddGradeStackScreenProps,
  AddHomeworkStackParamList,
  AddHomeworkStackScreenProps,
} from "../../types";
import { MediumText } from "../components/StyledText";
import { View } from "../components/Themed";
import { useGetDataFromAxiosError } from "../util/axiosUtils";
import {
  SubjectType as SubjectType,
  useSubjects,
  useValidToken,
} from "../util/react-query-hooks";
import globalStyles from "../constants/Syles";
import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import MyInput from "../components/MyInput";
import useInput from "../util/useInput";
import KeyboardWrapper from "../components/KeyboardWrapper";
import SolidButton from "../components/SolidButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewSubject } from "../api/subject";
import ErrorList from "../components/ErrorList";
import { useAtom } from "jotai";
import { activeSubjectAtom } from "../util/atoms";
import ErrorComponent from "../components/ErrorComponent";

const ChooseSubjectScreen = ({
  navigation,
}:
  | AddHomeworkStackScreenProps<"ChooseSubject">
  | AddGradeStackScreenProps<"ChooseSubject">) => {
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
    <View style={{ minHeight: "100%" }}>
      {subjects && (
        <SubjectsList
          subjects={subjects}
          onPressSubject={() => {
            navigation.pop();
          }}
        />
      )}
    </View>
  );
};

const SubjectsList: React.FC<{
  subjects: SubjectType[];
  onPressSubject: () => void;
}> = (props) => {
  const { card } = useTheme().colors;

  return (
    <FlatList
      data={props.subjects}
      style={[
        globalStyles.smallShadow,
        {
          backgroundColor: card,
          borderRadius: 20,
        },
      ]}
      scrollEnabled={true}
      ItemSeparatorComponent={Separator}
      renderItem={({ item, index }) => (
        <SingleSubject
          key={index}
          subject={item}
          onPressSubject={props.onPressSubject}
        />
      )}
    />
  );
};

const SingleSubject: React.FC<{
  subject: SubjectType;
  onPressSubject: () => void;
}> = ({ subject, onPressSubject }) => {
  const setSubject = useAtom(activeSubjectAtom)[1];
  const subjectPressHandler = () => {
    setSubject(subject);
    onPressSubject();
  };

  return (
    <TouchableOpacity style={[styles.subject]} onPress={subjectPressHandler}>
      <MediumText style={styles.subjectText}>{subject.name}</MediumText>
      <ColoredCircle color={subject.color} />
    </TouchableOpacity>
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

export const ColoredCircle: React.FC<{
  color: string;
  style?: StyleProp<ViewStyle>;
}> = ({ color, style }) => {
  return (
    <View
      style={[
        styles.circle,
        {
          backgroundColor: color,
        },
        style,
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

export const AddSubjectScreen = ({
  navigation,
}: AddHomeworkStackScreenProps<"AddSubject">) => {
  const queryClient = useQueryClient();
  const { data: validToken } = useValidToken();
  const addSubjectMutation = useMutation(
    (info: { name: string; color: string }) => {
      return createNewSubject(info.name, info.color, validToken);
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(["subject"]);
        queryClient.invalidateQueries(["allGrades"]);
        navigation.pop();
      },
    }
  );

  const {
    errorMessage: nameErrorMessage,
    value: nameValue,
    isValid: nameIsValid,
    validate: nameValidate,
    onChangeText: nameOnChange,
    hasError: nameHasError,
  } = useInput([
    {
      check: (value) => !!value,
      errorMessage: "insert a subject name",
    },
  ]);

  const [buttonPressed, setButtonPressed] = useState(false);

  const [activeColor, setActiveColor] = useState<string | undefined>();
  const [indexes, setIndexes] = useState<{
    rowIndex?: number;
    columnIndex?: number;
  }>({});

  const pickColorHandler = (
    rowIndex: number,
    columnIndex: number,
    color: string
  ) => {
    setActiveColor(color);
    setIndexes({
      rowIndex,
      columnIndex,
    });
  };

  const newSubjectSubmitHandler = () => {
    setButtonPressed(true);
    nameValidate();
    if (!nameIsValid || !activeColor) {
      return;
    }
    addSubjectMutation.mutate({ color: activeColor, name: nameValue });
  };

  const getDataFromAxiosError = useGetDataFromAxiosError(
    addSubjectMutation.error as AxiosError,
    "an error has occurred creating the subject"
  );

  return (
    <KeyboardWrapper>
      <View style={styles.createSubjcetInputContainer}>
        <View>
          <View style={styles.inputAndColorContainer}>
            <MyInput
              hasError={false}
              name="Subject name"
              errorMessage={nameErrorMessage}
              value={nameValue}
              onBlur={nameValidate}
              onChangeText={nameOnChange}
              style={styles.newSubjectInput}
            />
            <View
              style={[
                styles.coloredCircleNewSubject,
                { backgroundColor: activeColor },
              ]}
            ></View>
          </View>
          <ColorList
            columnIndexActive={indexes.columnIndex}
            onPickColor={pickColorHandler}
            rowIndexActive={indexes.rowIndex}
          />
          {addSubjectMutation.isError && (
            <ErrorComponent
              style={{ marginTop: 20 }}
              text={getDataFromAxiosError()}
            />
          )}
          <ErrorList
            errors={[
              { hasError: nameHasError, errorMessage: nameErrorMessage },
              {
                hasError: !activeColor && buttonPressed,
                errorMessage: "choose a color",
              },
            ]}
          />
        </View>
        <SolidButton
          title="Create subject"
          isLoading={addSubjectMutation.isLoading}
          onPress={newSubjectSubmitHandler}
        />
      </View>
    </KeyboardWrapper>
  );
};

const ColorList: React.FC<{
  rowIndexActive?: number;
  columnIndexActive?: number;
  onPickColor: (rowIndex: number, columnIndex: number, color: string) => void;
}> = (props) => {
  const { card } = useTheme().colors;
  const row1 = [
    "#fa1500",
    "#ff5900",
    "#fffb00",
    "#05f50d",
    "#0521f5",
    "#f505c5",
    "#a105f5",
  ];

  const row2 = [
    "#eb424a",
    "#ff9100",
    "#c2fc00",
    "#00c71b",
    "#00ccff",
    "#ff0073",
    "#883de3",
  ];

  const row3 = [
    "#850004",
    "#5e2f00",
    "#185200",
    "#150e45",
    "#440954",
    "#690532",
    "#000000",
  ];

  const rows = [row1, row2, row3];

  return (
    <View
      style={[
        styles.colorListContainer,
        {
          backgroundColor: card,
        },
      ]}
    >
      {rows.map((row, rowIndex) => {
        return (
          <View
            style={[styles.colorRow, { backgroundColor: card }]}
            key={rowIndex}
          >
            {row.map((color, columnIndex) => {
              return (
                <ColorPick
                  isActive={
                    rowIndex === props.rowIndexActive &&
                    columnIndex === props.columnIndexActive
                  }
                  rowIndex={rowIndex}
                  columnIndex={columnIndex}
                  key={color}
                  color={color}
                  onPress={props.onPickColor}
                />
              );
            })}
          </View>
        );
      })}
    </View>
  );
};
const ColorPick: React.FC<{
  color: string;
  rowIndex: number;
  columnIndex: number;
  isActive: boolean;
  onPress: (rowIndex: number, columnIndex: number, color: string) => void;
}> = (props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress(props.rowIndex, props.columnIndex, props.color);
      }}
    >
      <View
        style={[
          {
            backgroundColor: props.color,
          },
          styles.colorPick,
          props.isActive ? [styles.colorPickActive, globalStyles.shadow] : {},
        ]}
      ></View>
    </TouchableOpacity>
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
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 14,
    paddingHorizontal: 20,
  },
  circle: {
    aspectRatio: 1,
    borderRadius: 1000,
    borderColor: "#000",
    borderWidth: 0.2,
  },
  leftAction: {
    flex: 1,
    backgroundColor: "#497AFC",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  createSubjcetInputContainer: {
    padding: 15,
    justifyContent: "space-between",
    flex: 1,
  },
  colorListContainer: {
    marginTop: 30,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: "space-between",
  },
  colorListText: {
    fontSize: 19,
  },
  colorPick: {
    height: 30,
    margin: 5,
    aspectRatio: 1,
    borderRadius: 8,
  },
  colorPickActive: {
    transform: [{ scale: 1.4 }],
  },
  colorRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  inputAndColorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  newSubjectInput: {
    flexGrow: 1,
  },
  coloredCircleNewSubject: {
    height: 37,
    borderWidth: 0.2,
    borderColor: "#000",
    aspectRatio: 1,
    marginLeft: 7,
    borderRadius: 1000,
  },
});
export default ChooseSubjectScreen;
