import { createContext, useState } from "react";

export const DMContext = createContext(null);

export function DMProvider({ children }) {

    // Set the selected chat's ID
    const [chat_selected, setChatSelected] = useState(false);

    // Load the chat window until messages are fetched
    const [is_loading, setLoading] = useState(true);

    // To set selected contact's ID
    const [selected_contactID, setSelectedCID] = useState(null);

    // To set selected contact's details
    const [contact_details, setContactDetails] = useState({});

    // Add Contact toggle
    const [add_contact, setAddContact] = useState(false);

    return (
        <DMContext.Provider
            value={{
                chat_selected,
                setChatSelected,
                is_loading,
                setLoading,
                selected_contactID,
                setSelectedCID,
                contact_details,
                setContactDetails,
                add_contact,
                setAddContact
            }}
        >
            {children}
        </DMContext.Provider>
    );
}