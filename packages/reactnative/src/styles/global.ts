import {Dimensions, StyleSheet} from 'react-native';
import { DEVICE_WIDTH } from './screenDimensions';

export default StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
  logo: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  scanIcon: {
    width: DEVICE_WIDTH * 0.07,
    aspectRatio: 1
  }
});
