import {BlurView} from '@react-native-community/blur';
import {VStack, Icon, View, Text, Button} from 'native-base';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import {COLORS} from '../utils/constants';
import {FONT_SIZE} from '../utils/styles';

interface SeedPhraseProps {
  mnemonic: string | undefined;
  onReveal?: () => void
};

interface SeedPhraseCoverProps {
    onReveal?: () => void
}

function SeedPhraseCover({onReveal}: SeedPhraseCoverProps) {
    const [showSeedPhrase, setShowSeedPhrase] = useState(false);

    const reveal = () => {
        setShowSeedPhrase(true)

        if(onReveal) onReveal()
    }

    if(showSeedPhrase) return

    return (
        <>
        <BlurView
          style={styles.blurView}
          blurType="light"
          blurAmount={6}
          reducedTransparencyFallbackColor="white"
        />
        <VStack style={styles.seedPhraseMask} space={2}>
          <Text fontSize={FONT_SIZE['xl']} bold textAlign="center">
            Tap to reveal your seed phrase
          </Text>
          <Text fontSize={FONT_SIZE['md']} textAlign="center">
            Make sure no one is watching your screen
          </Text>
          <Button
            py="3"
            borderRadius={25}
            bgColor="#2AB858"
            w="24"
            mt="2"
            leftIcon={
              <Icon
                as={<MaterialIcons name="visibility" color="white" />}
                size="md"
              />
            }
            onPress={reveal}
            _pressed={{opacity: 0.8}}>
            <Text color="white" bold fontSize={FONT_SIZE['lg']}>
              View
            </Text>
          </Button>
        </VStack>
      </>
    )
}

export default function SeedPhrase({mnemonic, onReveal}: SeedPhraseProps) {
  return (
    <View style={styles.seedPhraseContainer}>
      {/* Seed phrase wrapper */}
      <View style={styles.seedPhraseWrapper}>
        {mnemonic?.split(' ').map((word, index) => (
          <Text key={word} style={styles.word}>
            {index + 1}. {word}
          </Text>
        ))}
      </View>

      <SeedPhraseCover onReveal={onReveal} />
    </View>
  );
}

const styles = StyleSheet.create({
  seedPhraseContainer: {
    width: '100%',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 40,
    padding: 15,
  },
  seedPhraseWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  seedPhraseWord: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '50%',
  },
  word: {
    width: '45%',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  blurView: {
    position: 'absolute',
    top: -20,
    left: -20,
    bottom: -20,
    right: -20,
  },
  seedPhraseMask: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
