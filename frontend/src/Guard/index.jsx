import { useState, useEffect } from "react";
import http  from "../utils/http";
import { Navigate,Outlet } from "react-router-dom";
import Loader from "../components/Shared/Loader";


const [authorised, setAuthorised] = useState(false);
const [loader,setLoader] = useState(true);
const [userType, setUser] = useState(null);


const Guard = ({endpoint,role,children}) =>{
    useEffect(() =>{
        const verifyToken = () =>{

        };
        verifyToken();
    },[endpoint]);

    if(loader) return <Loader/>
}