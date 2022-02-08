import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Button } from "antd";
import { StarOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom";

const RatingModal = (props) => {
    const { user } = useSelector((state) => ({ ...state }));
    const [modalVisible, setModalVisible] = useState(false);
    const history = useHistory();
    const { slug } = useParams();

    const handleModal = () => {
        if (user && user.token) {
            setModalVisible(true);
        } else {
            history.push({
                pathname: '/login',
                state: { from: `/product/${slug}` }
            });
        }
    };

    return (
        <>
            <div onClick={handleModal}>
                <StarOutlined className="text-danger" /> <br />{" "}
                {user ? "Leave Rating" : "Login to Leave Rating"}
            </div>
            <Modal
                title="Leave Your Rating"
                centered
                visible={modalVisible}
                onOk={() => {
                    setModalVisible(false);
                    toast.success("Thanks for your review, It will appear soon");
                }}
                onCancel={() => setModalVisible(false)}
            >
                {props.children}
            </Modal>
        </>
    );
};

export default RatingModal;
