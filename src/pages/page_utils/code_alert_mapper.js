
export default function codeAlertMapper(code){
    switch (code) {
        case 0: return "All the fields are required!";

        case 1: return "Invalid E-Mail.\nUse your GITAM mail.";

        case 20: return "Password must contain atleast one lower-case letter!";

        case 21: return "Passwort must contain atleast one upper-case letter!";

        case 22: return "Password must contain atleast one digit!";

        case 23: return "Password must contain atleast one special character!";

        case 24: return "Password is too short!\nShould be atleast 8 characters long";

        case 25: return "Password is too obvious!\nTry other combinations";

        case 3: return "Registration failed! Try again";

        case 4: return "Email already registered!";

        case 5: return "Database/Server error";

        default: return "Something went wrong!";
    }
}