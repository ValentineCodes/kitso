import { Abi, AbiFunction } from 'abitype';
import { Pressable, Text, View, VStack } from 'native-base';
import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { Address } from 'viem';
import useContractRead from '../../../../../../hooks/scaffold-eth/useContractRead';
import { COLORS } from '../../../../../../utils/constants';
import ContractInput from './ContractInput';
import {
  getFunctionInputKey,
  getInitialFormState,
  getParsedContractFunctionArgs
} from './utilsContract';

type Props = {
  contractAddress: Address;
  abiFunction: AbiFunction;
  abi: Abi;
};

export default function ReadOnlyFunctionForm({
  contractAddress,
  abiFunction,
  abi
}: Props) {
  const [form, setForm] = useState<Record<string, any>>(() =>
    getInitialFormState(abiFunction)
  );
  const [result, setResult] = useState<any>();
  const toast = useToast();

  const { isLoading: isFetching, refetch } = useContractRead({
    address: contractAddress,
    functionName: abiFunction.name,
    abi: abi,
    args: getParsedContractFunctionArgs(form),
    enabled: false,
    onError: (error: any) => {
      toast.show(JSON.stringify(error), {
        type: 'danger'
      });
    }
  });

  const inputElements = abiFunction.inputs.map((input, inputIndex) => {
    const key = getFunctionInputKey(abiFunction.name, input, inputIndex);
    return (
      <ContractInput
        key={key}
        setForm={updatedFormValue => {
          setResult(undefined);
          setForm(updatedFormValue);
        }}
        form={form}
        stateObjectKey={key}
        paramType={input}
      />
    );
  });

  function renderResult() {
    if (result.map)
      return result.map((data: any) => (
        <Text key={Math.random().toString()} fontSize={'sm'}>
          {typeof data == 'object' && isNaN(data)
            ? JSON.stringify(data)
            : data.toString()}
        </Text>
      ));

    return (
      <Text fontSize={'sm'}>
        {typeof result == 'object' && isNaN(result)
          ? JSON.stringify(result)
          : result.toString()}
      </Text>
    );
  }

  return (
    <View>
      <Text fontSize={'md'} fontWeight={'medium'} my={'2'}>
        {abiFunction.name}
      </Text>
      {inputElements}
      {result !== null && result !== undefined && (
        <VStack bgColor={COLORS.primaryLight} p={'2'} rounded={'2xl'} mt={'2'}>
          <Text fontSize={'md'} fontWeight={'semibold'}>
            Result:
          </Text>
          {renderResult()}
        </VStack>
      )}

      <Pressable
        _pressed={{ backgroundColor: 'rgba(39, 184, 88, 0.5)' }}
        onPress={async () => {
          const data = await refetch();
          setResult(data);
        }}
        isDisabled={isFetching}
        flexDir="row"
        alignSelf={'flex-end'}
        justifyContent="center"
        alignItems="center"
        my={'2'}
        w={'20'}
        py={'2'}
        borderRadius={'3xl'}
        bgColor={COLORS.primaryLight}
      >
        {isFetching && (
          <ActivityIndicator
            color={COLORS.primary}
            style={{ marginRight: 4 }}
            size={16}
          />
        )}
        <Text fontSize={'md'} fontWeight={'medium'} color={COLORS.primary}>
          Read
        </Text>
      </Pressable>
    </View>
  );
}
