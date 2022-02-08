import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import { getUserOrders } from "../../functions/user";
import UserNav from "../../components/nav/UserNav";
import ShowPaymentInfo from '../../components/cards/ShowPaymentInfo';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';

const History = () => {
    const [orders, setOrders] = useState([]);

    const { user } = useSelector(state => ({ ...state }));


    useEffect(() => {
        loadOrders();
    }, []);
    console.log("Payments at Orders history", orders);

    const loadOrders = () => {
        getUserOrders(user.token).then(res => {
            setOrders(res.data);
            console.log('Orders and payment by user', JSON.stringify(res.data[0], null, 4));
        })
            .catch(err => {
                console.log('Error at User Hisory', err);
            });
    };

    const showOrderTable = (order) => (
        <table className="table table-bordered">
            <thead className="thead-light">
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Color</th>
                    <th scope="col">Count</th>
                    <th scope="col">Shipping</th>
                </tr>
            </thead>
            <tbody>
                {order.products.map((p, i) => (
                    <tr key={i}>
                        <td><b>{p.product.title}</b></td>
                        <td>{p.product.price}</td>
                        <td>{p.product.brand}</td>
                        <td>{p.color}</td>
                        <td>{p.count}</td>
                        <td>{p.product.shipping === "YES" ? <CheckCircleOutlined className="text-success" /> : <CloseCircleOutlined className="text-danger" />}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );


    // const showDownloadLink = () => (
    //     <PDFViewer>
    //         <Document>
    //             <Page size='A4'>
    //                 <View>
    //                     <Text>Section# 1</Text>
    //                     <Text>Section# 2</Text>
    //                 </View>
    //             </Page>
    //         </Document>
    //     </PDFViewer>
    // );

    const showDownloadLink = () => (
        // <PDFDownloadLink document={
        <Document>
            <Page size='A4'>
                <View>
                    <Text>Section# 1</Text>
                    <Text>Section# 2</Text>
                </View>
            </Page>
        </Document>
        // }
        //     fileName='Invoice.pdf'
        //     className='btn btn-block btn-outline-primary btn-sm'
        // >
        //     Download PDF
        // </PDFDownloadLink>
    );

    const showOrders = () =>
        orders.flatMap((order, i) => (
            <div className="m-5 p-5 card" key={i}>
                <ShowPaymentInfo order={order} />
                {showOrderTable(order)}
                <div className="row">
                    <div className="col">
                        {showDownloadLink()}
                    </div>
                </div>
            </div>
        ));


    return (
        <div className="containe-fluuid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col text-center">
                    <h4>{orders.length > 0 ? "User Purchase Orers" : "No Orders"}</h4>
                    {showOrders()}
                </div>
            </div>
        </div>
    );
};

export default History;