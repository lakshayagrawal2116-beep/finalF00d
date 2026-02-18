import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({
  id,
  name,
  price,
  description,
  image,
  flashSale = false,
  discountPercentage = 0
}) => {

  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  // 🔥 Calculate discounted price
  const discountedPrice = flashSale
    ? Math.round(price - (price * discountPercentage) / 100)
    : price;

  return (
    <div className='food-item'>

      <div className='food-item-img-container'>

        {/* 🔴 FLASH SALE BADGE */}
        {flashSale && (
          <span className="discount-badge">
            {discountPercentage}% OFF
          </span>
        )}

        <img
          className='food-item-image'
          src={url + "/images/" + image}
          alt=''
        />

        {!cartItems[id] ? (
          <img
            className='add'
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=''
          />
        ) : (
          <div className='food-item-counter'>
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt=''
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt=''
            />
          </div>
        )}

      </div>

      <div className='food-item-info'>
        <div className='food-item-name-rating'>
          <p>{name}</p>
          <img src={assets.rating_starts} alt='' />
        </div>

        <p className='food-item-desc'>{description}</p>

        {/* 💰 PRICE SECTION */}
        {flashSale ? (
          <div className="food-item-price">
            <span className="old-price">₹ {price}</span>
            <span className="new-price">₹ {discountedPrice}</span>
          </div>
        ) : (
          <p className='food-item-price'>₹ {price}</p>
        )}
      </div>

    </div>
  )
}

export default FoodItem;
