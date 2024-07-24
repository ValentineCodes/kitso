import React, { useState, useContext, createContext, ReactNode, SetStateAction } from "react";

type AuthContextType = 'profile_creation' | 'profile_recovery'

type ProcedureContextType = {
    authContext: AuthContextType;
    setAuthContext: (context: SetStateAction<AuthContextType>) => void;
}


const ProcedureContext = createContext<ProcedureContextType | undefined>(undefined);

export const ProcedureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authContext, setAuthContext] = useState<AuthContextType>('profile_creation')

    return (
        <ProcedureContext.Provider value={{ authContext, setAuthContext }}>
            {children}
        </ProcedureContext.Provider>
    )
}

export const useProcedureContext = () => {
    const context = useContext(ProcedureContext)

    if (!context) {
        throw new Error('useProcedureContext must be used within an AppProvider');
    }
    return context;
}