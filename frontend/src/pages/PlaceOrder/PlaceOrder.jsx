import React, { useContext, useEffect } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const PlaceOrder = () => {

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const { getTotalCartAmount,token,food_list,cartItems,url } = useContext(StoreContext)
  const [data,SetData] =useState({
    firstName:"",
    lastName:"",
    email:"",
    city:"",
    street:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })

  const onChangeHandler=(event)=>{
    const name=event.target.name;
    const value=event.target.value;
    SetData(data=>({...data,[name]:value}))
  }

 const placeOrder = async (event) => {
  event.preventDefault();

  let orderItems = [];

  food_list.forEach((item) => {
    if (cartItems[item._id] > 0) {
      orderItems.push({
        ...item,
        quantity: cartItems[item._id]
      });
    }
  });

  const deliveryFee = getTotalCartAmount() === 0 ? 0 : 50;

  const orderData = {
    address: data,
    items: orderItems,
    couponCode,
    discountAmount:discount,
    amount: getTotalCartAmount() + deliveryFee-discount
  };

  try {
    const response = await axios.post(
      url + "/api/order/place",
      orderData,
      { headers: { token } }
    );

    if (response.data.success) {
      window.location.replace(response.data.session_url);
    } else {
      alert("Order failed");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
}
    const navigate=useNavigate();
     useEffect(()=>{
      if(!token){
        toast.error("Please Login first to Proceed")
        navigate('/cart')
        

      }
      else if(getTotalCartAmount()==0){

        toast.error("Please add some food items first")
        
        navigate('/cart')


      }
     },[token])



     const applyCoupon = async () => {
  try {
    const res = await axios.post(
      url + "/api/coupon/apply",
      {
        code: couponCode,
        cartTotal: getTotalCartAmount()
      },
      { headers: { token } }
    );

    setDiscount(res.data.discount);
    alert("Coupon applied successfully 🎉");

  } catch (error) {
    alert(error.response?.data?.message || "Invalid coupon");
    setDiscount(0);
  }
};


     
  
const deliveryFee = getTotalCartAmount() === 0 ? 0 : 50

  return (
    <form
      className='place-order'
      onSubmit={placeOrder}
    >
      {/* LEFT */}  
      <div className='place-order-left'>
        <p className='title'>Delivery Information</p>

        <div className='multi-fields'>
          <input  required name='firstName'onChange={onChangeHandler} value={data.firstName} type='text' placeholder='First name' />
          <input  required name='lastName'onChange={onChangeHandler} value={data.lastName} type='text' placeholder='Last name' />
        </div>

        <input  required name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Email address' />
        <input required  name='street'onChange={onChangeHandler} value={data.street} type='text' placeholder='Street' />

        <div className='multi-fields'>
          <input required name='city'onChange={onChangeHandler} value={data.city} type='text' placeholder='City' />
          <input required name='state'onChange={onChangeHandler} value={data.state} type='text' placeholder='State' />
        </div>

        <div className='multi-fields'>
          <input required name='zipcode'onChange={onChangeHandler} value={data.zipcode} type='text' placeholder='Zip Code' />
          <input required name='country'onChange={onChangeHandler} value={data.country} type='text' placeholder='Country' />
        </div>

        <input required name='phone'onChange={onChangeHandler} value={data.phone} type='text' placeholder='Phone' />
      </div>

      {/* RIGHT */}
      <div className='place-order-right'>
        <div className='cart-total'>
          <h2>Cart Totals</h2>

          <div className='cart-total-details'>
            <p>Subtotal</p>
            <p>₹ {getTotalCartAmount()}</p>
          </div>

          <hr />

          <div className='cart-total-details'>
            <p>Delivery Fee</p>
            <p>₹ {deliveryFee}</p>
          </div>

          <hr />

          <div className="cart-total-details">
  <input
    type="text"
    placeholder="Enter coupon code"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
  />
  <button type="button" onClick={applyCoupon}>
    Apply
  </button>
</div>

{discount > 0 && (
  <>
    <hr />
    <div className="cart-total-details">
      <p>Discount</p>
      <p>- ₹ {discount}</p>
    </div>
  </>
)}


          <div className='cart-total-details'>
            <p>Total</p>
            <b>₹ {getTotalCartAmount() + deliveryFee-discount}</b>
          </div>

          <button type="submit">Proceed to Payment</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
