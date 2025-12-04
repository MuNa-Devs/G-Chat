import react from "react";
import ReactDOM from "react-dom";
import Sidebar from "../../reusable_component/DashBoardSideBar";

export default function DashBoard(){    
    return(
        <div>
            <Sidebar page="dashboard" location="/dashboard"/>
        </div>
    );
}