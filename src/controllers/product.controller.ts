import { Request, Response } from "express";

import { T } from "../libs/types/common";

import Errors, { HttpCode, Message } from "../libs/Errors";
import ProductService from "../models/Product.service.";
import { AdminRequest } from "../libs/types/member";
import { ProductInput } from "../libs/types/product";

const productService = new ProductService();
const productController: T = {};

/** SSR **/

productController.getAllProducts = async (req: AdminRequest, res: Response) => {
  try {
    console.log("getAllProducts");
    res.render("products");
  } catch (err) {
    console.log("Error on getAllProducts", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard.message);
  }
};

productController.createNewProduct = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("createNewProduct");
    if (!req.files?.length) {
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.IMAGE_REQUIRED);
    }

    const data: ProductInput = req.body;
    data.productImages = req.files?.map((ele) => {
      return ele.path.replace(/\\/g, "/");
    });

    await productService.createNewProduct(data);

    res.send(
      `<script> alert("Successful creation!"); window.replace("/admin/product/all)</script>`
    );
  } catch (err) {
    console.log("Error on createNewProduct", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.replace("/admin/product/all)</script>`
    );
  }
};

productController.updateChoosenProduct = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("updateChoosenProduct");
    const id = req.params.id;
    const result = await productService.updateChoosenProduct(id, req.body);
    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error on updateChoosenProduct", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard.message);
  }
};

export default productController;
