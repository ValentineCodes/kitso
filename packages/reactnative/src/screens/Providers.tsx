import React from 'react'

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { MenuProvider } from 'react-native-popup-menu';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ModalOptions, ModalProvider, createModalStack } from 'react-native-modalfy';

import { ProcedureProvider } from '../context/ProcedureContext';

// Modals
import SignTransactionModal from '../components/modals/SignTransactionModal';
import SignMessageModal from '../components/modals/SignMessageModal';
import TxReceiptModal from '../components/modals/TxReceiptModal';
import SignTransferModal from '../components/modals/SignTransferModal';
import ConsentModal from '../components/modals/ConsentModal';

import { ProfileProvider } from '../context/ProfileContext';

type Props = {
  children: JSX.Element
}

const modalConfig = { SignTransactionModal, SignMessageModal, TxReceiptModal, SignTransferModal, ConsentModal }
const defaultOptions: ModalOptions = { backdropOpacity: 0.6, disableFlingGesture: true }

const modalStack = createModalStack(modalConfig, defaultOptions)

export default function Providers({ children }: Props) {
  return (
    <GestureHandlerRootView>
      <ToastProvider>
        <MenuProvider>
          <SafeAreaProvider>
            <ProfileProvider>
              <ModalProvider stack={modalStack}>
                  <ProcedureProvider>
                    {children}
                  </ProcedureProvider>
              </ModalProvider>
            </ProfileProvider>
          </SafeAreaProvider>
        </MenuProvider>
      </ToastProvider>
    </GestureHandlerRootView>
  )
}