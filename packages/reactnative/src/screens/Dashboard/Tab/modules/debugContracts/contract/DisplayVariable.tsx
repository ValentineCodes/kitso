import { Abi, AbiFunction } from 'abitype';
import { HStack, Pressable, Spinner, Text, VStack } from 'native-base';
import React, { useEffect } from 'react';
import { useToast } from 'react-native-toast-notifications';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import { Address, isAddress } from 'viem';
import AddressComp from '../../../../../../components/scaffold-eth/Address';
import useContractRead from '../../../../../../hooks/scaffold-eth/useContractRead';
import { COLORS } from '../../../../../../utils/constants';
import { FONT_SIZE } from '../../../../../../utils/styles';

type Props = {
  contractAddress: Address;
  abiFunction: AbiFunction;
  abi: Abi;
  refreshDisplayVariables: boolean;
};

export default function DisplayVariable({
  contractAddress,
  abiFunction,
  abi,
  refreshDisplayVariables
}: Props) {
  const toast = useToast();

  const {
    data: result,
    isLoading: isFetching,
    refetch
  } = useContractRead({
    address: contractAddress,
    functionName: abiFunction.name,
    abi: abi,
    onError: error => {
      console.error(error);
      toast.show(JSON.stringify(error), {
        type: 'danger'
      });
    }
  });

  useEffect(() => {
    refetch();
  }, [refreshDisplayVariables]);

  const renderResult = () => {
    if (result === null || result === undefined) return;

    if (typeof result == 'object' && isNaN(result)) {
      return <Text fontSize={'sm'}>{JSON.stringify(result)}</Text>;
    }
    if (typeof result == 'object' && isNaN(result)) {
      return <Text fontSize={'sm'}>{JSON.stringify(result)}</Text>;
    }
    if (isAddress(result.toString())) {
      return <AddressComp address={result.toString()} />;
    }

    return <Text fontSize={'sm'}>{result.toString()}</Text>;
  };

  return (
    <VStack space={1} mb={'4'}>
      <HStack alignItems={'center'} space={2}>
        <Text fontSize={'lg'} fontWeight={'semibold'}>
          {abiFunction.name}
        </Text>
        <Pressable onPress={async () => await refetch()}>
          {isFetching ? (
            <Spinner size={1.2 * FONT_SIZE['sm']} color={COLORS.primary} />
          ) : (
            <MaterialIcons
              name="cached"
              color="blue"
              size={1.2 * FONT_SIZE['sm']}
            />
          )}
        </Pressable>
      </HStack>
      {renderResult()}
    </VStack>
  );
}
