import { API_URL } from "./api";    
export const getGenres =async ()=>{
  const response = await fetch(`${API_URL}/api/Genres`,{
    method:"GET",
    headers:{
      "Contect-Type": "application/json",
       "Authorization":`Bearer${localStorage.getltem("token")}`,
    },  
});
return response.json();
}
export const addGenre =async (genre)=>{
  const response = await fetch(`${API_URL}/api/Genres`,{
    method:"POST",
    headers:{
      "Contect-Type": "application/json",
       "Authorization":`Bearer${localStorage.getltem("token")}`,
    },
body:JSON.stringify(genre)
});
return response.json();
}

export const updateGenre =async (genre)=>{
  const response = await fetch(`${API_URL}/api/Genres/${genre.id}`,{
    method:"PuT",
    headers:{
      "Contect-Type": "application/json",
       "Authorization":`Bearer${localStorage.getltem("token")}`,
    },
body:JSON.stringify(genre)
});
return response.json();
}

export const deleteGenre =async (id)=>{
  const response = await fetch(`${API_URL}/api/Genres/${id}`,{
    method:"DELETE",
    headers:{
      "Contect-Type": "application/json",
       "Authorization":`Bearer${localStorage.getltem("token")}`,
    },
body:JSON.stringify(genre)
});
return response.json();
}