
export default function isTokenExpired() {
  const token = localStorage.getItem('authToken');

  if(!token) return true; // if token is empty return true 

  const decodedToken = JSON.parse(atob(token.split('.')[1])); 
  const currentTime = Date.now() / 1000; // get current time in seconds

  return decodedToken.exp < currentTime;
}
