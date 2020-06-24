import { Router } from 'express';
import multer from 'multer';
import configUpload from '@config/upload';

import validatorsProduct from '../validators/productsValidators';
import ProductsControllers from '../controllers/ProductsControllers';
import ImageProductsControllers from '../controllers/ImageProductsControllers';
import CategoryProductControllers from '../controllers/CategoryProductControllers';
import CategoryProviderControllers from '../controllers/CategoryProviderControllers';

const productRouter = Router();
const productsControllers = new ProductsControllers();
const imageProductsControllers = new ImageProductsControllers();
const categoryProductControllers = new CategoryProductControllers();
const categoryProviderControllers = new CategoryProviderControllers();

const upload = multer(configUpload.multer);

productRouter.post(
  '/',
  upload.single('image'),
  validatorsProduct.productCreate,
  productsControllers.create,
);

productRouter.patch(
  '/image',
  validatorsProduct.productImage,
  upload.single('image'),
  imageProductsControllers.update,
);

productRouter.get(
  '/categories/search-product',
  validatorsProduct.searchCategory,
  categoryProductControllers.index,
);

productRouter.get(
  '/categories/search-provider',
  validatorsProduct.searchCategory,
  categoryProviderControllers.index,
);

export default productRouter;
