import Cookies from 'js-cookie';
export async function dataFetch(url, method="GET",body=""){
    const token = Cookies.get('token');
    console.log('Token:', token);
    if(!token) return false;
    if(!method=="GET") {
       const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    const resJson = await res.json();
    if (resJson.authentication=== false) return false;

    return resJson; 
    }
    
    if(!method=="POST") {
        const res = await fetch(url, {
         method: 'POST',
         body: JSON.stringify(body),
         headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`
         }
     })
     const resJson = await res.json();
     if (resJson.authentication=== false) return false;
 
     return resJson; 
     }

}



export  function verify() {
    const token = Cookies.get('token');
    if(!token)
    {
        return false;
    }
    return true;
}