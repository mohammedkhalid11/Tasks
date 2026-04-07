import { API_URL } from "./api";    
export const login =async (data)=>{
  const response = await fetch(`${API_URL})/api/Auth/Login`,{
    method:"POST",
    headers:{
      "Contect-Type": "application/json",

    },
    body:JSON.stringify(data),
});
return response.json();
}


