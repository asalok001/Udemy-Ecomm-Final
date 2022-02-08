import React from "react";
import AdminNav from "../../components/nav/AdminNav";

const AdminDashboard = () => {
    return (
        <div className="containe-fluuid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>

                <div className="col">
                    <h4>All Products</h4>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
