import { createContext, useContext, useState } from "react";
import LoadingScreen from "../pages/loading_screen/LoadingScreen";

export const UiContext = createContext();

export default function UiContextProvider({ children }){
    const [override, setOverride] = useState(null);

    // Room Filter:
    const [room_filter, setRoomFilter] = useState("my");

    return (
        <UiContext.Provider
            value={{
                override,
                setOverride,
                room_filter,
                setRoomFilter
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