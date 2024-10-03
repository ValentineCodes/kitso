import React from 'react'

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { MenuProvider } from 'react-native-popup-menu';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ModalOptions, ModalProvider, createModalStack } from 'react-native-modalfy';

import { ProcedureProvider } from '../context/ProcedureContext';
import SignTransactionModal from '../components/modals/SignTransactionModal';
import SignMessageModal from '../components/modals/SignMessageModal';
import TxReceiptModal from '../components/modals/TxReceiptModal';
import SignTransferModal from '../components/modals/SignTransferModal';

type Props = {
  children: JSX.Element
}

const modalConfig = { SignTransactionModal, SignMessageModal, TxReceiptModal, SignTransferModal }
const defaultOptions: ModalOptions = { backdropOpacity: 0.6, disableFlingGesture: true }

const modalStack = createModalStack(modalConfig, defaultOptions)

export default function Providers({ children }: Props) {
  return (
    <GestureHandlerRootView>
      <ToastProvider>
        <MenuProvider>
          <SafeAreaProvider>
            <ModalProvider stack={modalStack}>
                <ProcedureProvider>
                  {children}
                </ProcedureProvider>
            </ModalProvider>
          </SafeAreaProvider>
        </MenuProvider>
      </ToastProvider>
    </GestureHandlerRootView>
  )
}