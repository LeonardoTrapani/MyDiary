import React, { useState, } from "react";
import { Animated, Easing, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { RegularText } from "./StyledText";
import { View } from "./Themed";
import { Ionicons } from '@expo/vector-icons';

const Accordion: React.FC<{
  title: string;
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}> = (props) => {
  const [isOpened, setIsOpened] = useState(false);

  const pressHandler = () => {
    setIsOpened((prev) => !prev)
  }

  return <View style={[styles.container, props.style]}>
    <View>
      <TouchableOpacity onPress={pressHandler} style={[styles.main, isOpened ? {} : {
        borderBottomWidth: 1,
        borderColor: "#0000001e",
      }]}>
        <RegularText style={styles.text}>{props.title}</RegularText>
        <Ionicons name="chevron-down" size={24} color="#ccc" style={{
          transform: [{ rotate: isOpened ? '180deg' : '0deg' }]
        }} />
      </TouchableOpacity>
    </View>
    {
      isOpened && <View style={styles.children}>
        {props.children}
      </View>
    }
  </View >
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    justifyContent: 'center',
    fontSize: 17
  },
  main: {
    height: 55,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    flexDirection: 'row',
    fontSize: 17,
  },
  text: {
    fontSize: 17,
    color: '#ccc',
  },
  children: {
    borderBottomWidth: 1,
    borderColor: "#0000001e",
  }
})

export default Accordion
