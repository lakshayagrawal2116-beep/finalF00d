import React, { useContext, useEffect, useState } from 'react'
import "./MyOrders.css"
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

import { assets } from '../../assets/assets';
import api from '../../api/axios';
const MyOrders = () => {
    const { url, token } = useContext(StoreContext);

    const [data, SetData] = useState([]);
    const [ratings, setRatings] = useState({});

    const fetchOrders = async () => {
        const response = await api.post("/order/userorders", {}, { headers: { token } })
        SetData(response.data.data);
    }

    const handleRate = async (orderId, foodId, rating) => {
        try {
            const response = await api.post("/food/rate", { orderId, foodId, rating }, { headers: { token } });
            if (response.data.success) {
                setRatings(prev => ({ ...prev, [`${orderId}_${foodId}`]: rating }));
                alert("Rating submitted successfully!");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to submit rating.");
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token])
    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className='container'>
                {data.map((order, index) => {
                    return (
                        <div key={index} className='my-orders-order'>
                            <img src={assets.parcel_icon} alt='' />
                            <p>{order.items.map((item, index) => {
                                if (index === order.items.length - 1) {
                                    return item.name + " x " + item.quantity

                                }
                                else {
                                    return item.name + " x " + item.quantity + ", "



                                }
                            })}</p>
                            <p>{order.amount}.00</p>
                            <p>Items:{order.items.length}</p>
                            <p><span>&#x25cf;</span><b>{order.status}</b></p>
                            <button onClick={fetchOrders}>Track Order</button>

                            {order.status === "Delivered" && (
                                <div className="order-rating-section" style={{ gridColumn: "1 / -1", marginTop: "10px", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "5px" }}>
                                    <p style={{ fontWeight: "bold", marginBottom: "5px" }}>Rate your items:</p>
                                    {order.items.map((item, idx) => {
                                        const currentRating = ratings[`${order._id}_${item._id}`] || item.rating || 0;
                                        return (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: "5px" }}>
                                                <span style={{ minWidth: "120px" }}>{item.name}</span>
                                                <div>
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <span
                                                            key={star}
                                                            style={{ cursor: 'pointer', fontSize: '20px', color: '#ffc107' }}
                                                            onClick={() => handleRate(order._id, item._id, star)}
                                                        >
                                                            {star <= currentRating ? '★' : '☆'}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )

                })}
            </div>
        </div>
    )
}

export default MyOrders