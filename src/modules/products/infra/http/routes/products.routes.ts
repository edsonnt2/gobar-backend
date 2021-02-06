import { Router } from 'express';
import multer from 'multer';
import configUpload from '@config/upload';

import validatorsProduct from '../validators/productsValidators';
import ProductsControllers from '../controllers/ProductsControllers';
import ImageProductsControllers from '../controllers/ImageProductsControllers';
import CategoryProductControllers from '../controllers/CategoryProductControllers';
import CategoryProviderControllers from '../controllers/CategoryProviderControllers';
import SearchProductsControllers from '../controllers/SearchProductsControllers';

const ProductRouter = Router();
const productsControllers = new ProductsControllers();
const imageProductsControllers = new ImageProductsControllers();
const searchProductsControllers = new SearchProductsControllers();
const categoryProductControllers = new CategoryProductControllers();
const categoryProviderControllers = new CategoryProviderControllers();

const upload = multer(configUpload.multer);

ProductRouter.post(
  '/',
  upload.single('image'),
  validatorsProduct.productCreate,
  productsControllers.create,
);

ProductRouter.patch(
  '/image',
  validatorsProduct.productImage,
  upload.single('image'),
  imageProductsControllers.update,
);

ProductRouter.get(
  '/search',
  validatorsProduct.search,
  searchProductsControllers.index,
);

ProductRouter.get(
  '/find',
  validatorsProduct.show,
  searchProductsControllers.show,
);

ProductRouter.get(
  '/categories/search-product',
  validatorsProduct.search,
  categoryProductControllers.index,
);

ProductRouter.get(
  '/categories/search-provider',
  validatorsProduct.search,
  categoryProviderControllers.index,
);

export default ProductRouter;
