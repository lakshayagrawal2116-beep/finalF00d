import React, { useContext, useState, useEffect } from 'react'
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
  discountPercentage = 0,
  flashSaleEndsAt,
  flashSaleStartsAt,
  averageRating = 0
}) => {

  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  const [timeLeft, setTimeLeft] = useState(null);

  const now = new Date();

  // Debug Log
  if (flashSale) {
    console.log(`Item: ${name}`, { flashSale, start: flashSaleStartsAt, end: flashSaleEndsAt, now });
  }

  const isSaleActive =
    flashSale &&
    flashSaleStartsAt &&
    flashSaleEndsAt &&
    new Date(flashSaleStartsAt) <= now &&
    new Date(flashSaleEndsAt).getTime() > now;

  useEffect(() => {
    if (isSaleActive) {
      const timer = setInterval(() => {
        const now = new Date();
        const end = new Date(flashSaleEndsAt);
        const distance = end - now;

        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft(null);
        } else {
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSaleActive, flashSaleEndsAt]);

  const discountedPrice = isSaleActive
    ? Math.round(price - (price * discountPercentage) / 100)
    : price;

  return (
    <div className='food-item'>

      <div className='food-item-img-container'>

        {isSaleActive && (
          <span className="discount-badge">
            {discountPercentage}% OFF
          </span>
        )}

        {isSaleActive && timeLeft && (
          <span className="flash-sale-timer">
            ⏱ {timeLeft}
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
          <div className='food-item-rating' style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} style={{ color: star <= Math.round(averageRating || 0) ? '#ffc107' : '#e4e5e9', fontSize: '18px' }}>
                ★
              </span>
            ))}
            {averageRating > 0 && <span style={{ marginLeft: '4px', fontSize: '12px', color: '#666', fontWeight: 'bold' }}>{averageRating}</span>}
          </div>
        </div>

        <p className='food-item-desc'>{description}</p>

        {isSaleActive ? (
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
