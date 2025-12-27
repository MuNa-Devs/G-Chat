import { createContext, useContext, useState } from "react";
import LoadingScreen from "../pages/loading_screen/LoadingScreen";

export const UiContext = createContext();

export default function UiContextProvider({ children }){
    const [override, setOverride] = useState(null);

    return (
        <UiContext.Provider
            value={{
                override,
                setOverride
            }}
        >
            {children}
        </UiContext.Provider>
    );
}

export function UiContextController({ children }){
    const {override} = useContext(UiContext);

    if (override === "loading") return <LoadingScreen />

    return children;
}