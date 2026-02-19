import { useState, useEffect } from "react";
import http from "../utils/http";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/Shared/Loader";



const Guard = ({ endpoint, role, children }) => {

    
    const [authorised, setAuthorised] = useState(false);
    const [loader, setLoader] = useState(true);
    const [userType, setUser] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const { data } = await http.get(endpoint);
                sessionStorage.setItem("UserInfo", JSON.stringify(data));
                setUser(data?.role);
                setLoader(false);
                setAuthorised(true)
            } catch (err) {
                setUser(null);
                setLoader(false);
                setAuthorised(false)
            }
        };
        verifyToken();
    }, [endpoint]);

    if (loader) return <Loader />

    if(authorised && role == userType){
        return children
    }else{
        return <Navigate to="/"/>
    }
};
export default Guard