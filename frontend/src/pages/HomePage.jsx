import {useState,useEffect} from 'react';
import MyNavBar from '../components/MyNavBar';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Grid from '../components/Grid';  
export default function HomePage() {
    let [loggedInUser,setLoggedInUser] = useState("");
    let [emailId,setEmail] = useState("");
    useEffect(()=>{
        setLoggedInUser(localStorage.getItem("loggedInUser"))
        setEmail(localStorage.getItem('emailId'));

        
    },[]);

    const navigate = useNavigate();
    console.log(loggedInUser);
    const handleLogout =async (event)=>{
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        setTimeout(()=>{
            <MySpinner/>
        },5000);
        navigate('/login');
    }
    return (  
        <div className="homepage">
            <MyNavBar dropdownTitle={loggedInUser} logoutCallback = {handleLogout}/>
            <h1>Welcome to Chromoto SAR</h1>
            <Grid/>
            <h2>Welcome {loggedInUser}</h2>
            <ToastContainer/>
        </div>        
    );
}

