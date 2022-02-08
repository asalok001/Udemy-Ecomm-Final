const express = require("express");
const router = express.Router();

const { authCheck, adminCheck } = require("../middleware/auth");
const {
    create,
    listAll,
    remove,
    read,
    update,
    list,
    totalCount,
    productStar,
    listRelated,
    searchFilters,
} = require("../controllers/product");

router.post("/product", authCheck, adminCheck, create);
router.get("/products/total", totalCount);
router.get("/products/:count", listAll); // /products/10
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);
router.put("/product/:slug", authCheck, adminCheck, update);

router.post("/products", list);

// rating
router.put('/product/star/:productId', authCheck, productStar);

// related products
router.get('/product/related/:productId', listRelated);

// search and filter
router.post('/search/filters', searchFilters);
module.exports = router;
