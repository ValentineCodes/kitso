import { useNavigation } from '@react-navigation/native';
import { HStack, Icon, Pressable, View } from 'native-base';
import React from 'react';
import { Dimensions } from 'react-native';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { FONT_SIZE } from '../../utils/styles';
import ProgressStepIndicator from '../ProgressStepIndicator';

type Props = {
  progress: number;
  steps: number;
};

const ProgressIndicatorHeader = ({ progress, steps }: Props) => {
  const navigation = useNavigation();

  return (
    <HStack alignItems="center">
      <Pressable
        onPress={() => navigation.goBack()}
        _pressed={{ opacity: 0.4 }}
      >
        <Icon
          as={<Ionicons name="arrow-back-outline" />}
          size={1.3 * FONT_SIZE['xl']}
          color="black"
        />
      </Pressable>
      <View
        position="absolute"
        top={3.5}
        left={Dimensions.get('window').width * 0.19}
      >
        <ProgressStepIndicator
          steps={steps}
          progress={progress}
          width={Dimensions.get('window').width * 0.5}
          size={Dimensions.get('window').width * 0.04}
        />
      </View>
    </HStack>
  );
};

export default ProgressIndicatorHeader;
