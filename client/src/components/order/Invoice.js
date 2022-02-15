import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../tableStyle.css";

const Invoice = (props) => {
    let doc = new jsPDF("landscape", "px", "a4", "false");

    let data = props.order.products.map((element) => [
        element.product.title,
        element.product.price,
        element.product.brand,
        element.product.quantity,
        element.color,
    ]);

    const downloadPdf = () => {
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

        console.log("orders  are", props.order);
        let headers = [["Title", "Price", "Brand", "Quantity", "Colour"]];

        let content = {
            startY: 110,
            head: headers,
            body: data,
        };

        doc.autoTable(content);
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
