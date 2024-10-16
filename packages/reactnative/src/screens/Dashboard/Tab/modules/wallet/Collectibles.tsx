import {ScrollView} from 'native-base';
import React from 'react';
import LSP8Token from '../../../../../components/cards/tokens/LSP8Token';
import {useProfile} from '../../../../../context/ProfileContext';

type Props = {};

export default function Collectibles({}: Props) {
  const {lsp5ReceivedAssets} = useProfile();

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
      bgColor={'white'}
      p={2}>
      {lsp5ReceivedAssets
        .filter(token => ['LSP8', 'LSP8 COLLECTION'].includes(token.type))
        .map(token => (
          <LSP8Token
            key={token.name}
            address={token.address}
            name={token.name}
            symbol={token.symbol}
            image={token.image}
            type={token.type}
          />
        ))}
    </ScrollView>
  );
}
