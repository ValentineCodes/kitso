import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  createModalStack,
  ModalOptions,
  ModalProvider
} from 'react-native-modalfy';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import ConsentModal from '../components/modals/ConsentModal';
import ImageCaptureModal from '../components/modals/ImageCaptureModal';
import SignMessageModal from '../components/modals/SignMessageModal';
// Modals
import SignTransactionModal from '../components/modals/SignTransactionModal';
import SignTransferModal from '../components/modals/SignTransferModal';
import TxReceiptModal from '../components/modals/TxReceiptModal';
// Contexts
import { ProcedureProvider } from '../context/ProcedureContext';
import { ProfileProvider } from '../context/ProfileContext';

type Props = {
  children: JSX.Element;
};

const modalConfig = {
  SignTransactionModal,
  SignMessageModal,
  TxReceiptModal,
  SignTransferModal,
  ConsentModal,
  ImageCaptureModal
};
const defaultOptions: ModalOptions = {
  backdropOpacity: 0.6,
  disableFlingGesture: true
};

const modalStack = createModalStack(modalConfig, defaultOptions);

export default function Providers({ children }: Props) {
  return (
    <GestureHandlerRootView>
      <ToastProvider>
        <MenuProvider>
          <SafeAreaProvider>
            <ProfileProvider>
              <ModalProvider stack={modalStack}>
                <ProcedureProvider>{children}</ProcedureProvider>
              </ModalProvider>
            </ProfileProvider>
          </SafeAreaProvider>
        </MenuProvider>
      </ToastProvider>
    </GestureHandlerRootView>
  );
}
