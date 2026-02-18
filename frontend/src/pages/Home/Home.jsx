import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';
import Veg from '../../components/VegMode/Veg';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
const Home = () => {

    const [category,SetCategory] =useState("All")
    const [mode,SetMode]=useState(false);
    const { flashSaleItems } = useContext(StoreContext);
console.log("FLASH SALE ITEMS:", flashSaleItems);




  return (
    <div>
        <Header/>
        <ExploreMenu category={category} SetCategory={SetCategory}/>
        <Veg mode={mode} SetMode={SetMode}/>
        <FoodDisplay category={category} mode={mode}/>
        <AppDownload/>
    </div>
  )
}

export default Home;