import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import createApiInstance from "../utilities/apiAuth";


const FranchiseeContext = createContext();

export function FranchiseeProvider({children}) {
  //this will be the selected franchisee
  const navigate = useNavigate();
  
  const [franchisees, setFranchisees] = useState({});
  const [selectedFranchisee, setSelectedFranchisee] = useState({});

  useEffect(()=> {
    const api = createApiInstance(navigate);
    const fetchFranchisees = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if(token){
        const res = await api.get('/franchisees/list');
        setFranchisees(res.data);
        }else{
          console.log('No User Logged In');
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchFranchisees();
  }, [navigate]);

  const handleRowSelect = (franchisee) => {
    setSelectedFranchisee(franchisee);
    localStorage.setItem('selectedFranchisee', JSON.stringify(franchisee));
  }


  return (
    <FranchiseeContext.Provider value={{franchisees, selectedFranchisee, setSelectedFranchisee, handleRowSelect}}>
      {children}
    </FranchiseeContext.Provider>
  )

}

export function useFranchisee () {
  return useContext(FranchiseeContext)
}
  