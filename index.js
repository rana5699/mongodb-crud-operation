const express = require("express");
const mongoose = require("mongoose");
// !create server port 3007 and app
const app = express();
const port = 3007;
app.use(express.json());

// !connected with mongodb use mongoose
const connectedWithDb = async () => {
  try {
    mongoose.connect("mongodb://127.0.0.1:27017/productsDb");
    console.log("Connect sucssesfully with mongoDB");
  } catch (error) {
    console.log("nOT Connect with mongoDB");
  }
};
// ! create product scchema
const productSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

// ! create products model
const productsModel = mongoose.model("products", productSchema);

// ! create POST method From CRUD
app.post("/product", async (req, res) => {
  try {
    const newProduct = new productsModel({
      brand: req.body.brand,
      model: req.body.model,
      description: req.body.description,
      price: req.body.price,
    });
    const newProductData = await newProduct.save();
    res.status(200).send(newProductData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ! create Read (GET) method From CRUD
app.get("/products", async (req, res) => {
  try {
    const totalProdcuts = await productsModel.countDocuments();
    const products = await productsModel.find();
    if (products) {
      res.status(200).send({
        sucsses: true,
        message: "Found all products",
        totalProdcuts,
        products,
      });
    } else {
      res.status(404).send({
        sucsses: false,
        message: "Products Not avilable here",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ! get products by id
app.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const productById = await productsModel.findById({ _id: productId });
    if (productById) {
      res.status(200).send({
        sucsses: true,
        message: `Found product by this ID : {productId}`,
        productById,
      });
    } else {
      res.status(200).send({
        sucsses: false,
        message: `NOT Found product by this ID : {productId}`,
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
// ! get products by BRAND
app.get("/product/:brand", async (req, res) => {
  try {
    const brand = req.params.brand;
    const productByBrand = await productsModel.find({ brand: brand });
    if (productByBrand) {
      const total = await productsModel.countDocuments({ brand: brand });
      res.status(200).send({
        sucsses: true,
        message: `Found all ${brand} products`,
        total,
        productByBrand,
      });
    } else {
      res.status(404).send({
        sucsses: false,
        message: `Not Found  ${brand} products`,
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ! get products by BRAND id
app.get("/product/:brand/:id", async (req, res) => {
  try {
    const brandId = req.params.id;
    const brandById = await productsModel.findById({ _id: brandId });
    if (brandById) {
      res.status(200).send({
        sucsses: true,
        message: `Found  ${brandId} product`,
        brandById,
      });
    } else {
      res.status(404).send({
        sucsses: false,
        message: `Not Found  ${brandId} product`,
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// !  DELETE method From CRUD
app.delete("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deleteItem = await productsModel.findByIdAndDelete({ _id: id });
    if (deleteItem) {
      res.status(200).send({
        sucsses: true,
        message: `Delete  ${id} products`,
        deleteItem,
      });
    } else {
      res.status(404).send({
        sucsses: false,
        message: `Not Found  ${id} products`,
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// !  DELETE method From CRUD brand id
app.delete("/product/:brand/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deleteItem = await productsModel.findByIdAndDelete({ _id: id });
    if (deleteItem) {
      res.status(200).send({
        sucsses: true,
        message: `Delete  ${id} products`,
        deleteItem,
      });
    } else {
      res.status(404).send({
        sucsses: false,
        message: `Not Found  ${id} products`,
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// !  UPDATE(PUT) method From CRUD
app.put("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateProduct = await productsModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          brand: req.body.brand,
          model: req.body.model,
          description: req.body.description,
          price: req.body.price,
        },
      }
    );
    if (updateProduct) {
      res.status(200).send({
        sucsses: true,
        message: `Update this  ${id} products`,
        updateProduct,
      });
    } else {
      res.status(404).send({
        sucsses: false,
        message: `not found this  ${id} products`,
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// ! sever home page
app.get("/", async (req, res) => {
  res.status(200).send("<h3>This server home page</h3>");
});
// ! server run
app.listen(port, async () => {
  console.log(`server run at http://localhost:${port}`);
  await connectedWithDb();
});
