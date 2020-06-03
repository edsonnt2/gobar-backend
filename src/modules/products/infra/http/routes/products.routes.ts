import { Router } from 'express';
import multer from 'multer';
import configUpload from '@config/upload';

import validatorsProduct from '../validators/productsValidators';
import ProductsControllers from '../controllers/ProductsControllers';
import ImageProductsControllers from '../controllers/ImageProductsControllers';

const productRouter = Router();
const productsControllers = new ProductsControllers();
const imageProductsControllers = new ImageProductsControllers();
const upload = multer(configUpload.multer);

productRouter.post(
  '/',
  validatorsProduct.productCreate,
  productsControllers.create,
);

productRouter.patch(
  '/image',
  validatorsProduct.productImage,
  upload.single('image'),
  imageProductsControllers.update,
);

export default productRouter;
