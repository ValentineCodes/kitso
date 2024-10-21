import { useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView } from 'native-base';
import React from 'react';
import LSP7Token from '../../../../../components/cards/tokens/LSP7Token';
import NetworkToken from '../../../../../components/cards/tokens/NetworkToken';
import { useProfile } from '../../../../../context/ProfileContext';

type Props = {};

export default function Tokens({}: Props) {
  const navigation = useNavigation();
  const { lsp5ReceivedAssets } = useProfile();

  const viewNetworkTokenDetails = () => {
    // @ts-ignore
    navigation.navigate('NetworkTokenDetails');
  };
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      pt={75}
      p={2}
    >
      <Pressable onPress={viewNetworkTokenDetails}>
        <NetworkToken />
      </Pressable>

      {lsp5ReceivedAssets
        .filter(token => token.type === 'LSP7')
        .map(token => (
          <LSP7Token
            key={token.name}
            address={token.address}
            image={token.image}
            name={token.name}
            symbol={token.symbol}
          />
        ))}
    </ScrollView>
  );
}
