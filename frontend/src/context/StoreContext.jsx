import { createContext, useEffect, useState } from "react";
export const StoreContext= createContext(null)
import axios from "axios";
const StoreContextProvider =(props)=>{

    const[cartItems,SetCartItems]=useState({});
    const [search, setSearch] = useState("");


    const url = import.meta.env.VITE_BASE_URL
    const [token,SetToken]= useState("");
    const [food_list,SetFoodList] =useState([]);
    const[loading,setLoading]=useState(true);

    const addToCart=async(itemId)=>{
        if(!cartItems[itemId]){
            SetCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else{
            SetCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }

        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }
    const removeFromCart=async(itemId)=>{

        SetCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }

    }

  const getTotalCartAmount = () => {
  let totalAmount = 0;

  for (const item in cartItems) {
    if (cartItems[item] > 0) {
      const itemInfo = food_list.find(
        (product) => product._id === item
      );

      // 🛡️ SAFETY CHECK
      if (!itemInfo) continue;

      totalAmount += itemInfo.price * cartItems[item];
    }
  }

  return totalAmount;
};


    const fetchFoodList = async () => {
  try {
    const response = await axios.get(url + "/api/food/list");
    SetFoodList(response.data.data || []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


    const loadCartData=async(token)=>{
        const response =await axios.post(url+"/api/cart/get",{},{headers:{token}})
        SetCartItems(response.data.cartData);
    }

    useEffect(()=>{
        
        async function loadData(){
            await fetchFoodList();
            if(localStorage.getItem("token")){
            SetToken(localStorage.getItem("token"));
            await loadCartData(localStorage.getItem("token"));
        }

        }
        loadData();
    },[])


    const contextValue={
        food_list,
        cartItems,
        loading,
        SetCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        SetToken,
        search,
        setSearch

    }

    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;