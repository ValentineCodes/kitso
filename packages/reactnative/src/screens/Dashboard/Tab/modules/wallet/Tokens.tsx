import React from 'react';
import NetworkToken from '../../../../../components/cards/tokens/NetworkToken';
import {ScrollView} from 'native-base';
import LSP7Token from '../../../../../components/cards/tokens/LSP7Token';
import {useProfile} from '../../../../../context/ProfileContext';

type Props = {};

export default function Tokens({}: Props) {
  const {lsp5ReceivedAssets} = useProfile();

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, paddingBottom: 100}}
      pt={75}
      p={2}>
      <NetworkToken />

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
