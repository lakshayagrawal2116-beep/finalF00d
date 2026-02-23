import React from 'react'
import "./Verify.css"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import axios from 'axios';
import api from '../../api/axios';

const Verify = () => {
    const [searchParams, SetSearchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        if (!orderId || !success) {
            navigate("/");
            return;
        }

        try {
            const response = await axios.post(url + "/api/order/verify", { success, orderId })
            if (response.data.success) {
                navigate("/myorders")
            }
            else {
                toast.error(response.data.message || "Payment verification failed");
                navigate("/")
            }
        } catch (error) {
            console.error("Verification error:", error);
            toast.error("Network error during verification");
            navigate("/")
        }
    }


    useEffect(() => {
        verifyPayment();

    }, [])

    return (
        <div className='verify'>
            <div className='spinner'></div>
        </div>
    )
}

export default Verify