import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../tableStyle.css";

const Invoice = (props) => {
    const { title, price, brand, color, quantity } =
        props.order.products[0].product;
    console.log("All Orders are", props.order);

    <table id="mytable" style="display: none">
        <thead>
            <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Brand</th>
                <th>Quantity</th>
                <th>Colour</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{title}</td>
                <td>{price}</td>
                <td>{brand}</td>
                <td>{quantity}</td>
                <td>{color}</td>
            </tr>
        </tbody>
    </table>;
    const dates = new Date();
    let doc = new jsPDF("landscape", "px", "a4", "false");

    // let title = [];
    // let price = [];
    // let brand = [];
    // let quantity = [];
    // let color = [];
    // let rows = [];
    // props.order.products.forEach((element) => {
    //     // console.log("Elenents valuse", element);
    //     title.push(element.product.title);
    //     price.push(element.product.price);
    //     brand.push(element.product.brand);
    //     quantity.push(element.product.quantity);
    //     color.push(element.color);
    //     // rows.push(
    //     //     element.product.title,
    //     //     element.product.price,
    //     //     element.product.brand,
    //     //     element.product.quantity,
    //     //     element.product.color
    //     // );
    // });

    // console.log('All variables are', title, price, brand, quantity, color);

    // console.log('All Rows', rows);

    let head = ["Title", "Price", "Brand", "Quantity", "Colour"];

    const downloadPdf = (tableData) => {
        doc
            .setFontSize(12)
            .setTextColor("gray")
            .text(285, 30, new Date().toLocaleString());
        doc.setFontSize(24).setTextColor("blue").text(280, 60, "Order Invoice");
        doc.setFontSize(12).setTextColor("black").text(285, 80, "Udemy E-Commerce");
        doc
            .setFontSize(18)
            .setTextColor("black")
            .setFont("helvetica", "bold")
            .text(20, 100, "Order- Summary");

        // doc.html(tableData, { function() { doc.save('invoice.pdf'); } });

        // doc.autoTable(head, rows, { startY: 110 });
        console.log("Titles are", title);

        doc.autoTable({
            html: "#mytable",
            bodyStyle: { marginTop: 110 },
            // columnStyles: {

            //     invoice: { halign: "center", fontSize: 24, textColor: "blue" },
            //     // author: { valign: 'middle', fontSize: 12, textColor: "black" },
            // },
            // margin: { top: 110 },
            // head: [["Title", "Price", "Brand", "Quantity", "Colour"]],

            // body: [
            //     // ['A1', 'a2', 'a3', 'a4', 'a5'],
            //     // ['A1', 'a2', 'a3', 'a4', 'a5'],
            //     // ['A1', 'a2', 'a3', 'a4', 'a5'],
            //     // ['A1', 'a2', 'a3', 'a4', 'a5'],
            //     // [{ content: rows, colSpan: 5, rowSpan: 10 }],
            //     // [rows]
            //     [[title], [price], [brand], [quantity], [color]],

            // ],
        });

        doc.save("invoice2.pdf");
        return doc;
    };

    return (
        <div>
            <button
                className="btn btn-block btn-outline-primary"
                onClick={downloadPdf}
            >
                Download Details
            </button>
        </div>
    );
};
export default Invoice;
