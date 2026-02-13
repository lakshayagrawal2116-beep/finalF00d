import { useEffect, useState } from "react";
import axios from "axios";
import './CouponList.css'
const CouponList = () => {

  const url = import.meta.env.VITE_BASE_URL
  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(
        `${url}/api/coupon/list`
      );
      if (res.data.success) {
        setCoupons(res.data.data);
      }
    } catch (error) {
      alert("Failed to load coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    
    <div className="coupon-container">
        <hr/>
  <h2>Coupons List</h2>

  {coupons.length === 0 ? (
    <p className="empty-text">No coupons found</p>
  ) : (
    <div className="table-wrapper">
      <table className="coupon-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Value</th>
            <th>Min Order</th>
            <th>Used</th>
            <th>Limit</th>
            <th>Expiry</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {coupons.map((c) => (
            <tr key={c._id}>
              <td className="code">{c.code}</td>
              <td className="type">{c.discountType}</td>
              <td>
                {c.discountType === "flat"
                  ? `₹${c.discountValue}`
                  : `${c.discountValue}%`}
              </td>
              <td>₹{c.minOrderAmount}</td>
              <td>{c.usedCount}</td>
              <td>{c.usageLimit}</td>
              <td>{new Date(c.expiryDate).toLocaleDateString()}</td>
              <td>
                <span
                  className={`status ${
                    c.active ? "active" : "inactive"
                  }`}
                >
                  {c.active ? "Active" : "Disabled"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

  );
};

export default CouponList;