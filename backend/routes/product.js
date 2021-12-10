const express = require('express')
const router = express.Router();


const { getProducts, newProduct, getSingleProduct, updateProduct } = require('../controllers/productController')


router.route('/products').get(getProducts);
router.route('/admin/products/:id').get(getSingleProduct);
router.route('/admin/products/:id').put(updateProduct);

router.route('/product/new').post(newProduct);


module.exports = router;