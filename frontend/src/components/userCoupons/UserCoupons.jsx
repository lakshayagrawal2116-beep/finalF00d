import { useEffect, useState } from "react";
import api from "../../api/axios";


const UserCoupons = ({ onApply }) => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      const res = await api.get("/coupon/active");
      if (res.data.success) {
        setCoupons(res.data.data);
      }
    };
    fetchCoupons();
  }, []);

  return (
    <div>
      <h3>Available Coupons</h3>

      {coupons.length === 0 && <p>No coupons available</p>}

      {coupons.map(c => (
        <div key={c.code} style={{ border: "1px solid #ccc", padding: 10 }}>
          <p><b>{c.code}</b></p>
          <p>
            {c.discountType === "flat"
              ? `₹${c.discountValue} OFF`
              : `${c.discountValue}% OFF`}
          </p>
          <p>Min Order ₹{c.minOrderAmount}</p>
          <button onClick={() => onApply(c.code)}>Apply</button>
        </div>
      ))}
    </div>
  );
};

export default UserCoupons;
