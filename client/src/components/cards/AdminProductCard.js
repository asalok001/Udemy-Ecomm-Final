import React from "react";
import { Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import laptop from "../../images/laptop.jpg";
import { Link } from "react-router-dom";

const { Meta } = Card;

const AdminProductCard = (props) => {
    const { title, description, images, slug } = props.product;

    // const removeProduct = () => {
    //     props.removeProductHandler('Slug');
    // };

    return (
        <Card
            // hoverable
            cover={
                <img
                    src={images && images.length ? images[0].uril : laptop}
                    style={{ height: "150px", objectFit: "cover" }}
                    className="p-1"
                />
            }
            actions={[
                <Link to={`/admin/product/${slug}`}>
                    <EditOutlined className="text-warning" />
                </Link>,
                <DeleteOutlined
                    className="text-danger"
                    onClick={() => props.removeProductHandler(slug)}
                />,
            ]}
        >
            <Meta
                title={title}
                description={`${description && description.substring(0, 10)}..... `}
            />
        </Card>
    );
};

export default AdminProductCard;
