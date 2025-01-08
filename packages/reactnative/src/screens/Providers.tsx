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
// Modals
import BioModal from '../components/modals/BioModal';
import ConsentModal from '../components/modals/ConsentModal';
import ImageCaptureModal from '../components/modals/ImageCaptureModal';
import PrivateKeyModal from '../components/modals/PrivateKeyModal';
import QRCodeModal from '../components/modals/QRCodeModal';
import QRCodeScanner from '../components/modals/QRCodeScanner';
import ReceiveModal from '../components/modals/ReceiveModal';
import SignMessageModal from '../components/modals/SignMessageModal';
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
  BioModal,
  SignTransactionModal,
  SignMessageModal,
  TxReceiptModal,
  SignTransferModal,
  ConsentModal,
  ImageCaptureModal,
  ReceiveModal,
  PrivateKeyModal,
  QRCodeModal,
  QRCodeScanner
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
