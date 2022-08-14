import { View } from './Themed';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { MediumText } from './StyledText';

const Snackbar: React.FC<{
  text: string;
  color: string;
}> = (props) => {
  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <View style={[styles.container, { marginBottom: insets?.bottom }]}>
          <View style={[styles.snackbar]}>
            <MediumText style={[{ color: props.color }, styles.text]}>
              {props.text}
            </MediumText>
          </View>
        </View>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 100,
    padding: 20,
  },
  snackbar: {
    borderRadius: 10,
    height: 50,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
});
export default Snackbar;
