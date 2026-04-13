import { API_URL } from "./api";    
export const getUsers =async ()=>{
  const response = await fetch(`${API_URL}/api/Auth/GetUsers`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
});
return response.json();
}


