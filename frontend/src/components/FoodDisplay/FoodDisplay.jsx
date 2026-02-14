import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import Loader from '../Loader/Loader'

const FoodDisplay = ({ category, mode }) => {

  const { food_list, search ,loading} = useContext(StoreContext);
  if (loading) {
  return <p style={{ textAlign: "center" }}>Loading Menu Please Wait...</p>
}


  const filteredFood = food_list.filter(item => {
    const categoryMatch =
      category === "All" || category === item.category;

    const vegMatch =
      mode === false || item.mode === "veg";

    const searchMatch =
      item.name.toLowerCase().includes(search.toLowerCase());

    return categoryMatch && vegMatch && searchMatch;
  });

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>

      <div className='food-display-list'>
        {filteredFood.map((item, index) => (
          <FoodItem
            key={index}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
          />
        ))}

        


        {filteredFood.length === 0 && (
          <p className="no-result">No food found</p>
        )}
      </div>
    </div>
  )
}

export default FoodDisplay
