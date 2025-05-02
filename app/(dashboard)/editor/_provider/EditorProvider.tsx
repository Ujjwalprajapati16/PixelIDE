'use client'
import { createContext, useContext, useState } from "react"

interface TEditorProvider {
    isLoading :boolean
    setIsLoading : (value : boolean) => void
}

const initialValue = {
    isLoading : false,
    setIsLoading : () => {}
}

const EditorProvider = createContext<TEditorProvider>(initialValue);

export const useEditorContext = () => useContext(EditorProvider);

export function EditorProviderComp({children} : {children: React.ReactNode}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleLoading = (value? : boolean) => {
        setIsLoading(value || false);
    }
    return (
        <EditorProvider.Provider value={{
            isLoading : isLoading,
            setIsLoading : handleLoading
        }}>
            {children}
        </EditorProvider.Provider>
    )
}