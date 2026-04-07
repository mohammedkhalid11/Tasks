import { Navigate, Outlet } from "react-router";    
import{jwtDecode} from 'jwt-decode'

const decodeToken= (Token)=> {
    try{
        const decode=jwtDecode (token);
return decode;
    }catch (error){
console.error('lnva;id token:',error);
return null;
    }
    }
const Guard = ()=>{
    const token =localStorage.getItem('token');
    const isTokenValid=()=>{
        if (!token) return false;
        const decode= decodeToken (token);
        if (decode.exp <=currentime){
            localStorage.removeltem('token');
            return false;
        }


        return true
    };
return isTokenValid()? <Outlet /> :<Navigate to="/" />;


};



export default Guard; 