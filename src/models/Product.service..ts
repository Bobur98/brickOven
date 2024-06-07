import { ProductInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { Product } from "../libs/types/product";
import Errors from "../libs/Errors";
import { HttpCode } from "../libs/Errors";
import { Message } from "../libs/Errors";

class ProductService {
  private readonly productModel;
  constructor() {
    this.productModel = ProductModel;
  }

  /** SPA **/

  /** SSR **/
  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      console.log("1", input);
      return await this.productModel.create(input);
    } catch (err) {
      console.log("2");

      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default ProductService;
