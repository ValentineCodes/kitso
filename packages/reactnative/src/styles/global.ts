import { Dimensions, StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from './screenDimensions';

export default StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15
  },
  logo: {
    position: 'absolute',
    top: 10,
    left: 10
  },
  scanIcon: {
    width: WINDOW_WIDTH * 0.07,
    aspectRatio: 1
  }
});
