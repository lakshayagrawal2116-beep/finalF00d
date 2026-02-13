import { useState } from "react";
import axios from "axios";
import './AddCoupon.css'
import CouponList from "./CouponList";
const AddCoupon = ({url}) => {
  const [coupon, setCoupon] = useState({
    code: "",
    discountType: "flat",
    discountValue: "",
    minOrderAmount: "",
    expiryDate: ""
  });

  const onChange = (e) => {
    setCoupon({ ...coupon, [e.target.name]: e.target.value });
  };

  

  const createCoupon = async () => {
    try {
      const res = await axios.post(
        `${url}/api/coupon/create`,
        coupon
      );

      if (res.data.success) {
        alert("Coupon created successfully 🎉");
        setCoupon({
          code: "",
          discountType: "flat",
          discountValue: "",
          minOrderAmount: "",
          expiryDate: ""
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error creating coupon");
    }
  };

  return (
    <div className="coupon" style={{ padding: "20px" }}>
      <h2>Create Coupon</h2>

      <input className="coupon-options"
        name="code"
        placeholder="Coupon Code (e.g. SAVE50)"
        value={coupon.code}
        onChange={onChange}
      />

      <select className="coupon-options"
        name="discountType"
        value={coupon.discountType}
        onChange={onChange}
      >
        <option className="coupon-options" value="flat">Flat</option>
        <option className="coupon-options" value="percentage">Percentage</option>
      </select>

      <input className="coupon-options"
        name="discountValue"
        type="number"
        placeholder="Discount Value"
        value={coupon.discountValue}
        onChange={onChange}
      />

      <input className="coupon-options"
        name="minOrderAmount"
        type="number"
        placeholder="Minimum Order Amount"
        value={coupon.minOrderAmount}
        onChange={onChange}
      />

      <input className="coupon-options"
        name="expiryDate"
        type="date"
        value={coupon.expiryDate}
        onChange={onChange}
      />

      <button className="coupon-options " onClick={createCoupon}>Create Coupon</button>

      <CouponList/>
    </div>
  );
};

export default AddCoupon;
