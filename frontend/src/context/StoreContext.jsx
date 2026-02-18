import { createContext, useEffect, useState } from "react";
export const StoreContext= createContext(null)
import axios from "axios";
import api from "../api/axios";


const StoreContextProvider =(props)=>{

    const[cartItems,SetCartItems]=useState({});
    const [search, setSearch] = useState("");


    const url = import.meta.env.VITE_BASE_URL
    const [token,SetToken]= useState("");
    const [food_list,SetFoodList] =useState([]);
    const[loading,setLoading]=useState(true);
    const [flashSaleItems, setFlashSaleItems] = useState([]);


    useEffect(() => {
  const handleSessionExpired = () => {
    SetToken("");        // 🔥 THIS FIXES NAVBAR
    SetCartItems({});
  };

  window.addEventListener("session-expired", handleSessionExpired);

  return () => {
    window.removeEventListener("session-expired", handleSessionExpired);
  };
}, []);


    const addToCart=async(itemId)=>{
        if(!cartItems[itemId]){
            SetCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else{
            SetCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }

        if(token){
            await api.post(url+"/cart/add",{itemId},{headers:{token}})
        }
    }
    const removeFromCart=async(itemId)=>{

        SetCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
        if(token){
            await api.post("/cart/remove",{itemId},{headers:{token}})
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
    const response = await api.get("/food/list");
    SetFoodList(response.data.data || []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

     /* 🔥 FETCH FLASH SALE ITEMS */
  const fetchFlashSaleItems = async () => {
    try {
      const res = await api.get("/food/flash-sale");
      setFlashSaleItems(res.data.data || []);
    } catch (err) {
      console.error("Error fetching flash sale items", err);
    }
  };


    const loadCartData=async(token)=>{
        const response =await api.post("/cart/get",{},{headers:{token}})
        SetCartItems(response.data.cartData);
    }

    useEffect(()=>{
        
        async function loadData(){
            await fetchFoodList();
            await fetchFlashSaleItems();
            if(localStorage.getItem("token")){
            SetToken(localStorage.getItem("token"));
            await loadCartData(localStorage.getItem("token"));
        }

        }

        loadData();
        const interval = setInterval(() => {
    fetch(`${url}/ping`)
      .then(() => console.log("🔁 Backend pinged"))
      .catch(() => {});
  }, 5 * 60 * 1000); // every 5 minutes

  return () => clearInterval(interval);
    },[])


    const contextValue={
        food_list,
        flashSaleItems,
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