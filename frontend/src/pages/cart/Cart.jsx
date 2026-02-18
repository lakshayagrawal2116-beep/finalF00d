import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useState } from 'react';
import api from '../../api/axios';
const Cart = () => {
    const{cartItems,food_list,removeFromCart,getTotalCartAmount,url}=useContext(StoreContext);
    const navigate=useNavigate();
    const deliveryFee = getTotalCartAmount() === 0 ? 0 : 50
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);

    const applyCoupon = async () => {
  try {
    const res = await api.post(
       "/coupon/apply",
      {
        code: coupon,
        cartTotal: getTotalCartAmount()
      },
      { headers: { token } }
    );

    setDiscount(res.data.discount);
    toast.success("Coupon applied 🎉");
  } catch (err) {
    toast.error(err.response.data.message);
  }
};




  return (
    <div className='cart'>
        <div className='cart-items'>
            <div className='cart-items-title'>
                <p>Items</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>

            </div>
            <br/>
            <hr/>
            {food_list.map((items,index)=>{
                if(cartItems[items._id]>0){
                    return(
                        <div>
                        <div className='cart-items-title cart-items-item'>
                            <img src={url+"/images/"+items.image} alt=''/>
                            <p>{items.name}</p>
                            <p>₹ {items.price}</p>
                            <p>{cartItems[items._id]}</p>
                            <p>₹ {items.price*cartItems[items._id]}</p>
                            <p onClick={()=>removeFromCart(items._id)} className='cross'>x</p>

                        </div>
                        <hr/>
                        </div>
                    )
                }

            })}
        </div>
        <div className='cart-bottom'>
            <div className='cart-total'>
                <h2>Cart Totals</h2>
                <div>
                    <div className='cart-total-details'>
                        <p>Subtotal</p>
                        <p>₹ {getTotalCartAmount()}</p>
                    </div>
                    <hr/>
                    <div className='cart-total-details'>
                        <p>Delivery Fee</p>
                        <p>₹ {deliveryFee}</p>
                       
                    </div>
                    <hr/>
                    <div className='cart-total-details'>
                        <p>Discount</p>
                        <p>-₹ {discount}</p>
                       
                    </div>
                    <hr/>
                    <div className='cart-total-details'>
                        <p>Total</p>
                        <b>₹ {getTotalCartAmount()+deliveryFee-discount}</b>
                    </div>
                </div>
                <button onClick={()=>navigate('/order')}>Proceed to Checkout</button>
            </div>
            <div className='cart-promocode'>
                {/* <div>
                    <p>If you have a promo code ,Enter it here</p>
                    <div className='cart-promocode-input'>
                        <input type='text' placeholder='promo code' value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} />
                        <button onClick={applyCoupon} >Submit</button>
                    </div>
                </div> */}
            </div>
        </div>


    </div>
  )
}

export default Cart