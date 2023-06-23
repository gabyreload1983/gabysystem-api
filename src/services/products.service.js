import Products from "../dao/sqlManager/Products.js";
import ProductsRepository from "../repository/Products.repository.js";
import { formatProduct } from "../utils.js";

const productManager = new Products();
const productsRepository = new ProductsRepository(productManager);

export let searchBy = async (code, ean, description, stock) => {
  let products = [];
  if (code) products = await productsRepository.getByCode(code, stock);
  if (ean) products = await productsRepository.getByEan(ean, stock);
  if (description)
    products = await productsRepository.getByDescription(description, stock);

  if (products.length > 0) {
    const dollar = await productsRepository.getDollarValue();
    return products.map((product) => formatProduct(product, dollar));
  }
  return products;
};
