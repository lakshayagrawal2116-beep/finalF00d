import React from 'react';
import './Delivery.css';

const Delivery = () => {
    return (
        <div className='delivery-page'>
            <h1>Delivery Information</h1>
            <div className='delivery-content'>
                <h2>Delivery Times</h2>
                <p>We aim to deliver your food as quickly as possible. Our standard delivery times vary depending on your location and the restaurant's preparation time. You can view the estimated delivery time for each order before you confirm your purchase.</p>

                <h2>Delivery Fees</h2>
                <p>Delivery fees are calculated based on your distance from the restaurant and the current demand. The exact delivery fee will be displayed at checkout.</p>

                <h2>Tracking Your Order</h2>
                <p>Once your order is placed, you can track its progress in real-time through our app or website. You will receive updates when your order is being prepared, when it has been picked up by the delivery partner, and when it is arriving.</p>

                <h2>Contactless Delivery</h2>
                <p>We offer contactless delivery options for your safety and convenience. You can select this option at checkout, and our delivery partner will follow your instructions on where to leave your order.</p>
            </div>
        </div>
    );
}

export default Delivery;
