import React, {useContext, createContext, useEffect, useState} from 'react';
import createApiInstance from '../utilities/apiAuth';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export function UserProvider({children}) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  // const api = createApiInstance(navigate);

  useEffect(() => {
    const api = createApiInstance(navigate);
    const fetchUserData = async () => {
      try {
        const res = await api.get('/user');
        console.log(JSON.stringify(res.data, null, 2));
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserData();
  }, [navigate]);

  return (
  <UserContext.Provider value={{user}}>
    {children}
  </UserContext.Provider>
  )


}

export function useUser() {
  return useContext(UserContext);
}
