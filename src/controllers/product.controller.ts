import { Request, Response } from "express";

import { T } from "../libs/types/common";

import Errors from "../libs/Errors";
import ProductService from "../models/Product.service.";

const productService = new ProductService();
const productController: T = {};

productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log("getAllProducts");
    res.render("products");
  } catch (err) {
    console.log("Error on getAllProducts", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard.message);
  }
};

productController.createNewProduct = async (req: Request, res: Response) => {
  try {
    console.log("createNewProduct");
  } catch (err) {
    console.log("Error on createNewProduct", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard.message);
  }
};

productController.updateChoosenProduct = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("updateChoosenProduct");
  } catch (err) {
    console.log("Error on updateChoosenProduct", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard.message);
  }
};

export default productController;
