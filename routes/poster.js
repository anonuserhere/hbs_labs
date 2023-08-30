const express = require("express");
const router = express.Router();
const { Poster } = require("../models");
const { bootstrapField, createProductForm } = require("../forms");

router.get("/", async (req, res) => {
  let posters = await Poster.collection().fetch();
  res.render("posters/index", {
    posters: posters.toJSON(),
  });
});

router.get("/create", async (req, res) => {
  const productForm = createProductForm();
  res.render("posters/create", {
    form: productForm.toHTML(bootstrapField),
  });
});

router.post("/create", async (req, res) => {
  const productForm = createProductForm();
  productForm.handle(req, {
    success: async (form) => {
      const poster = new Poster();
      poster.set("title", form.data.name);
      poster.set("description", form.data.description);
      poster.set("price", form.data.cost);
      await poster.save();
      res.redirect("/posters");
    },
  });
});

router.post("/", async (req, res) => {
  console.log("post /create");
  productForm.handle(req, {
    "success": async (form) => {
      const product = new Poster(form.data);
      await product.save();
      res.redirect("/posters");
    },
    "error": async (form) => {
      res.render("posters/create"), {
        form: form.toHTML(bootstrapField)
      }
    }
  });
})

module.exports = router;
