import React from 'react'

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { MenuProvider } from 'react-native-popup-menu';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ModalOptions, ModalProvider, createModalStack } from 'react-native-modalfy';
import { ProcedureProvider } from '../context/ProcedureContext';

type Props = {
  children: JSX.Element
}

const modalConfig = {}
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