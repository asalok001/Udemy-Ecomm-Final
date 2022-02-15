// import React from "react";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import "../../tableStyle.css";

// const Invoice = (props) => {
//     // const { title, price, brand, color, quantity } =
//     //     props.order.products[0].product;
//     // console.log("All Orders are", props.order);


//     // let title = [];
//     // let price = [];
//     // let brand = [];
//     // let quantity = [];
//     // let color = [];
//     // let rows = [];
//     // props.order.products.map((element) => {
//     //     console.log("Elenents valuse", element);
//     //     title = element.product.title;
//     //     price = element.product.price;
//     //     brand = element.product.brand;
//     //     quantity = element.product.quantity;
//     //     color = element.product.color;

//     // title.push(element.product.title);
//     // price.push(element.product.price);
//     // brand.push(element.product.brand);
//     // quantity.push(element.product.quantity);
//     // color.push(element.color);
//     // rows.push(
//     //     element.product.title,
//     //     element.product.price,
//     //     element.product.brand,
//     //     element.product.quantity,
//     //     element.product.color
//     // );
//     // });

//     // let head = ["Title", "Price", "Brand", "Quantity", "Colour"];

//     let doc = new jsPDF("landscape", "px", "a4", "false");

//     let data = props.order.products.map((element) => [
//         element.product.title,
//         element.product.price,
//         element.product.brand,
//         element.product.quantity,
//         element.color,
//     ]);
//     const downloadPdf = (tableData) => {

//         doc
//             .setFontSize(12)
//             .setTextColor("gray")
//             .text(285, 30, new Date().toLocaleString());
//         doc.setFontSize(24).setTextColor("blue").text(280, 60, "Order Invoice");
//         doc.setFontSize(12).setTextColor("black").text(285, 80, "Udemy E-Commerce");
//         doc
//             .setFontSize(18)
//             .setTextColor("black")
//             .setFont("helvetica", "bold")
//             .text(20, 100, "Order- Summary");

//         console.log("orders  are", props.order);
//         let headers = [["Title", "Price", "Brand", "Quantity", "Colour"]];

//         let content = {
//             startY: 50,
//             head: headers,
//             body: data
//         };

//         doc.autoTable(content);
//         doc.save("invoice2.pdf");
//         return doc;
//     };

//     // doc.autoTable({
//     // html: "#mytable",
//     // bodyStyle: { marginTop: 110 },
//     // didDrawCell: function (data) {
//     //     if (data.column.index === 5 && data.cell.section === 'body') {
//     //         var td = data.cell.raw;
//     //         var img = td.getElementsByTagName('img')[0];
//     //         var dim = data.cell.height - data.cell.padding('vertical');
//     //         var textPos = data.cell.textPos;
//     // doc.addImage(img.src, textPos.x, textPos.y, dim, dim);
//     //     }
//     // }
//     // columnStyles: {
//     //     invoice: { halign: "center", fontSize: 24, textColor: "blue" },
//     // author: { valign: 'middle', fontSize: 12, textColor: "black" },
// }, ;
// // margin: { top: 110 },
// // head: [["Title", "Price", "Brand", "Quantity", "Colour"]],

// // body: [
// //     // ['A1', 'a2', 'a3', 'a4', 'a5'],
// //     // ['A1', 'a2', 'a3', 'a4', 'a5'],
// //     // ['A1', 'a2', 'a3', 'a4', 'a5'],
// //     // ['A1', 'a2', 'a3', 'a4', 'a5'],
// //     // [{ content: rows, colSpan: 5, rowSpan: 10 }],

// // showTable()
// // [{ ...title }, { ...price }, { ...brand }, { ...quantity }, { ...color }]
// // [
// //     { ...rows.title },
// //     { ...rows.price },
// //     { ...rows.brand },
// //     { ...rows.quantity },
// //     { ...rows.color },
// // ],
// // [[title], [price], [brand], [quantity], [color]],
// // [{ title }, { price }, { brand }, { quantity }, { color }]
// //     ],
// // });

// // doc.save("invoice2.pdf");
// // return doc;
// // };

// return (
//     <div>
//         <button
//             className="btn btn-block btn-outline-primary"
//             onClick={downloadPdf}
//         >
//             Download Details
//         </button>
//     </div>
// );
//     }
// // export default Invoice;
