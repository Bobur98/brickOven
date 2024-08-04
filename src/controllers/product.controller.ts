import { Request, Response } from "express";

import { T } from "../libs/types/common";

import Errors, { HttpCode, Message } from "../libs/Errors";
import ProductService from "../models/Product.service.";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import {
  ProductInput,
  ProductInquiry,
  ProductInquiryByAdmin,
} from "../libs/types/product";
import { ProductCollection } from "../libs/enums/product.enum";

const productService = new ProductService();
const productController: T = {};

productController.getProducts = async (req: Request, res: Response) => {
  try {
    const { page, limit, order, productCollection, search } = req.query;
    const inquiry: ProductInquiry = {
      order: String(order),
      page: Number(page),
      limit: Number(limit),
    };
    if (productCollection)
      inquiry.productCollection = productCollection as ProductCollection;

    if (search) inquiry.search = String(search);

    const result = await productService.getProducts(inquiry);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.getProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const memberId = req.member?._id ?? null;
    const result = await productService.getProduct(memberId, id);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SSR */
// productController.getAllProducts = async (req: Request, res: Response) => {
//   try {
//     console.log("getAllProducts");
//     const data = await productService.getAllProducts();
//     console.log(data, "data");

//     res.render("products", { products: data });
//   } catch (err) {
//     console.log("Error on getAllProducts: ", err);
//     if (err instanceof Errors) res.status(err.code).json(err);
//     else res.status(Errors.standard.code).json(Errors.standard);
//   }
// };

productController.getProductsByAdmin = async (req: Request, res: Response) => {
  try {
    const { page, limit, productCollection, search } = req.query;
    const inquiry: ProductInquiryByAdmin = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };
    if (productCollection)
      inquiry.productCollection = productCollection as ProductCollection;

    if (search) inquiry.search = String(search);

    const data = await productService.getProductsByAdmin(inquiry);

    res.render("products", {
      products: data.result,
      currentPage: inquiry?.page,
      totalPages: data?.totalPages,
    });
  } catch (err) {
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.createNewProduct = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    if (!req.files?.length)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

    const data: ProductInput = req.body;

    data.productImages = req.files?.map((ele) => {
      return ele.path.replace(/\\/g, "/");
    });

    await productService.createNewProduct(data);

    res.send(
      `<script>alert("Successful creation"); window.location.replace("/admin/product/all")</script>`
    );
  } catch (err) {
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script>alert("${message}"); window.location.replace("/admin/product/all")</script>`
    );
  }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const result = await productService.updateChosenProduct(id, req.body);

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
export default productController;
