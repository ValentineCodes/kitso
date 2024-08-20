import { Divider, Button as RNButton, ScrollView, Text, VStack, View, Icon } from 'native-base'
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { BlurView } from "@react-native-community/blur";
// @ts-ignore
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons"
import Clipboard from '@react-native-clipboard/clipboard';
import "react-native-get-random-values"
import "@ethersproject/shims"
import { useNavigation } from '@react-navigation/native'
import SInfo from "react-native-sensitive-info";
import { useToast } from 'react-native-toast-notifications'
import { createWallet } from 'react-native-web3-wallet'

import ProgressIndicatorHeader from '../../../components/headers/ProgressIndicatorHeader';
import { COLORS, STORAGE_KEY } from '../../../utils/constants';
import { FONT_SIZE } from '../../../utils/styles';
import Button from '../../../components/Button';
import { useDispatch } from 'react-redux';
import { initAccounts } from '../../../store/reducers/Accounts';

interface Wallet {
    mnemonic: string;
    privateKey: string;
    address: string;
}

type Props = {}

export default function CreateController({ }: Props) {
    const navigation = useNavigation()

    const toast = useToast()

    const [wallet, setWallet] = useState<Wallet>()
    const [showSeedPhrase, setShowSeedPhrase] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const dispatch = useDispatch()

    const copySeedPhrase = () => {
        if (!wallet) {
            toast.show("Still generating wallet")
            return
        }

        Clipboard.setString(wallet.mnemonic)
        toast.show("Copied to clipboard", {
            type: 'success'
        })
    }

    const saveWallet = async () => {
        if (!wallet || !showSeedPhrase) {
            toast.show("Have you even copied your seed phrase?... YOU TWAT!", {
                type: 'warning'
            })
            return
        }
        try {
            // store mnemonic in secure storage
            await SInfo.setItem("mnemonic", wallet.mnemonic, STORAGE_KEY);

            const newAccount = {
                address: wallet.address,
                privateKey: wallet.privateKey,
            }

            // store controller account in secure and redux storage
            await SInfo.setItem("accounts", JSON.stringify([newAccount]), STORAGE_KEY)

            dispatch(initAccounts([{ ...newAccount, isImported: false }]))

            // @ts-ignore
            navigation.navigate("CreateProfile")
        } catch (error) {
            return
        }
    }

    const generateNewWallet = () => {
        setTimeout(async () => {
            const newWallet = await createWallet("")
            const wallet = {
                mnemonic: newWallet.mnemonic.join(" "),
                address: newWallet.address,
                privateKey: newWallet.privateKey
            }

            // @ts-ignore
            setWallet(wallet)
            setIsLoading(false)
        }, 100);
    }

    useEffect(() => {
        generateNewWallet()
    }, [])

    return (
        <View style={styles.container}>
            <ProgressIndicatorHeader progress={2} steps={4} />

            <Divider bgColor="muted.100" mt="8" mb="4" />

            <ScrollView flex="1">
                <Text textAlign="center" color={COLORS.primary} fontSize={1.7 * FONT_SIZE["xl"]} lineHeight="40" bold>Write Down Your Seed Phrase</Text>
                <Text textAlign="center" fontSize={FONT_SIZE["lg"]} my="2">This is your controller seed phrase. Write it down on a piece of paper and keep it in a safe place</Text>

                <Divider bgColor="muted.100" my="4" />

                {isLoading ? <View style={styles.loader}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : <View style={styles.seedPhraseContainer}>
                    <View style={styles.seedPhraseWrapper}>
                        {wallet?.mnemonic.split(" ").map((word, index) => (
                            <Text key={word} style={styles.word}>{index + 1}. {word}</Text>
                        ))}
                    </View>


                    {
                        !showSeedPhrase && (
                            <>
                                <BlurView
                                    style={styles.blurView}
                                    blurType="light"
                                    blurAmount={6}
                                    reducedTransparencyFallbackColor="white"
                                />
                                <VStack style={styles.seedPhraseMask} space={2}>
                                    <Text fontSize={FONT_SIZE['xl']} bold textAlign="center">Tap to reveal your seed phrase</Text>
                                    <Text fontSize={FONT_SIZE['md']} textAlign="center">Make sure no one is watching your screen</Text>
                                    <RNButton
                                        py="3"
                                        borderRadius={25}
                                        bgColor="#2AB858"
                                        w="24"
                                        mt="2"
                                        leftIcon={<Icon as={<MaterialIcons name="visibility" color="white" />} size="md" />}
                                        onPress={() => setShowSeedPhrase(true)}
                                        _pressed={{ opacity: 0.8 }}>
                                        <Text color="white" bold fontSize={FONT_SIZE['lg']}>View</Text>
                                    </RNButton>
                                </VStack>
                            </>
                        )
                    }

                </View>}


                <Divider bgColor="muted.100" my="4" />

                <Button type="outline" text="Copy To Clipboard" disabled={isLoading} onPress={copySeedPhrase} />
                <Button text="Next" disabled={isLoading} onPress={saveWallet} style={{ marginBottom: 50, marginTop: 20 }} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 15
    },
    loader: {
        height: 280,
        justifyContent: 'center',
        alignItems: "center",
    },
    seedPhraseContainer: {
        width: '100%',
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: 40,
        padding: 15
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
        width: "50%"
    },
    word: {
        width: '45%',
        padding: 10,
        backgroundColor: "#F5F5F5",
        borderRadius: 25,
        textAlign: "center",
        fontWeight: 'bold',
        marginBottom: 10
    },
    blurView: {
        position: "absolute",
        top: -20,
        left: -20,
        bottom: -20,
        right: -20
    },
    seedPhraseMask: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center'
    }
})