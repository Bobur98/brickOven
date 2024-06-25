import {
  ProductInput,
  ProductInquiry,
  ProductInquiryByAdmin,
  ProductUpdateInput,
} from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { Product } from "../libs/types/product";
import Errors from "../libs/Errors";
import { HttpCode } from "../libs/Errors";
import { Message } from "../libs/Errors";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { T } from "../libs/types/common";
import { ProductCollection, ProductStatus } from "../libs/enums/product.enum";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";
import ViewService from "./View.service";
import { ObjectId } from "mongoose";

class ProductService {
  private readonly productModel;
  public viewService;

  constructor() {
    this.productModel = ProductModel;
    this.viewService = new ViewService();
  }

  /** SPA **/
  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
    const match: T = { productStatus: ProductStatus.PROCESS };
    if (inquiry.productCollection)
      match.productCollection = inquiry.productCollection;

    if (inquiry.search) {
      match.productName = { $regex: new RegExp(inquiry.search, "i") };
    }

    const sort: T =
      inquiry.order === "productPrice"
        ? { [inquiry.order]: 1 }
        : { [inquiry.order]: -1 };

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit }, // boshlangich nta malumotni tashlab yubor
        { $limit: inquiry.limit * 1 }, // tashlab yuborilgan malumotdan boshlab limit nechta bolsa shuncha malumotni ol
      ])
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async getProduct(
    memberId: ObjectId | null,
    id: string
  ): Promise<Product> {
    const productId = shapeIntoMongooseObjectId(id);

    let result = await this.productModel
      .findOne({
        _id: productId,
        productStatus: ProductStatus.PROCESS,
      })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (memberId) {
      // Check Existance
      const input: ViewInput = {
        memberId: memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      };
      const existView = await this.viewService.checkViewExistance(input);
      // Insert New Log

      if (!existView) {
        console.log("PLANNING TO INSERT NEW VIEW");
        await this.viewService.insertMemberView(input);
      }

      // Increase Counts
      result = await this.productModel
        .findByIdAndUpdate(
          productId,
          { $inc: { productViews: +1 } },
          { new: true }
        )
        .exec();
    }

    return result;
  }
  /** SSR **/
  // public async getAllProducts(): Promise<any> {
  //   // string => ObjectId

  //   const result = await this.productModel.find().exec();
  //   if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

  //   return result;
  // }

  public async getProductsByAdmin(
    inquiry: ProductInquiryByAdmin
  ): Promise<any> {
    const pipeline: any[] = [];

    // Match stage to filter by productCollection if provided
    if (inquiry.productCollection) {
      pipeline.push({
        $match: { productCollection: inquiry.productCollection },
      });
    }

    // Match stage to search by productName if search query provided
    if (inquiry.search) {
      pipeline.push({
        $match: { productName: { $regex: new RegExp(inquiry.search, "i") } },
      });
    }

    // Pagination stages
    pipeline.push(
      { $skip: (inquiry.page - 1) * inquiry.limit },
      { $limit: inquiry.limit }
    );

    // Pipeline for counting total documents without pagination
    const countPipeline: any[] = [];

    if (inquiry.productCollection) {
      countPipeline.push({
        $match: { productCollection: inquiry.productCollection },
      });
    }

    if (inquiry.search) {
      countPipeline.push({
        $match: { productName: { $regex: new RegExp(inquiry.search, "i") } },
      });
    }

    countPipeline.push({ $count: "totalProducts" });

    const [result, countResult] = await Promise.all([
      this.productModel.aggregate(pipeline).exec(),
      this.productModel.aggregate(countPipeline).exec(),
    ]);

    const totalProducts =
      countResult.length > 0 ? countResult[0].totalProducts : 0;
    const totalPages = Math.ceil(totalProducts / inquiry.limit);

    if (!result) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    const data = {
      result,
      totalProducts,
      totalPages,
    };

    return data;
  }
  // public async getProductsByCategory(
  //   productCategory: ProductCollection
  // ): Promise<Product[]> {
  //   const result = await this.productModel
  //     .find({ productCollection: productCategory })
  //     .exec();
  //   if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

  //   return result;
  // }

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      return await this.productModel.create(input);
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateChosenProduct(
    id: string,
    input: ProductUpdateInput
  ): Promise<Product> {
    // string => ObjectId
    id = shapeIntoMongooseObjectId(id);

    const result = await this.productModel
      .findOneAndUpdate({ _id: id }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.UPDATE_FAILED);

    return result;
  }
}

export default ProductService;
