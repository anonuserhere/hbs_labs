const express = require("express");
const router = express.Router();
const { Poster, Category } = require("../models");
const { bootstrapField, createProductForm } = require("../forms");
const { checkIfAuth } = require("../middlewares");

// router.get("/", async (req, res) => {
//   let posters = await Poster.collection().fetch({
//     withRelated: ["category"],
//   });
//   res.render("posters/index", {
//     posters: posters.toJSON(),
//   });
// });

router.get("/", async (req, res) => {
  let posters = await Poster.collection().fetch();
  res.render("posters/index", {
    posters: posters.toJSON(),
  });
});

router.post("/", async (req, res) => {
  console.log("post /create");
  const productForm = createProductForm();
  productForm.handle(req, {
    success: async (form) => {
      const poster = new Poster(form.data);
      await poster.save();
      res.redirect("/posters");
    },
    error: async (form) => {
      res.render("posters/create"),
      {
        form: form.toHTML(bootstrapField),
      };
    },
    // "empty" :{
    //   //re-render
    // }
  });
});

router.get("/create", [checkIfAuth], async (req, res) => {
  console.log(req.params);
  const productForm = createProductForm();
  res.render("posters/create", {
    form: productForm.toHTML(bootstrapField),
  });
});

router.post("/create", [checkIfAuth], async (req, res) => {
  const productForm = createProductForm();
  productForm.handle(req, {
    success: async (form) => {
      const poster = new Poster();
      poster.set("title", form.data.title);
      poster.set("description", form.data.description);
      poster.set("cost", form.data.cost);
      poster.set("stock", form.data.stock);
      poster.set("height", form.data.height);
      poster.set("width", form.data.width);
      await poster.save();
      res.redirect("/posters");
    },
  });
});

router.post("/create", [checkIfAuth], async (req, res) => {
  const allCategories = (await Category.fetchAll()).invokeMap((category) => {
    return [category.get("id"), category.get("name")];
  });
  const productForm = createProductForm();
  productForm.handle(req, {
    success: async (form) => {
      let { tags, ...posterData } = form.data;
      const poster = new Poster(posterData);
      await poster.save();
      if (tags) {
        await poster.tags().attach(tags.split(","));
      }
      req.flash("success_messages", `New Product ${poster.get('title')} has been created`)
      res.redirect("/posters");
    },
    error: async (form) => {
      res.render("posters/create", {
        form: productForm.toHTML(bootstrapField),
      });
    },
  });
});

router.get("/:id/update", [checkIfAuth], async (req, res) => {
  const poster = await Poster.where({
    id: req.params.id,
  }).fetch({
    require: true,
  });

  const productForm = createProductForm();
  productForm.fields.title.value = poster.get("title");
  productForm.fields.cost.value = poster.get("cost");
  productForm.fields.stock.value = poster.get("stock");
  productForm.fields.description.value = poster.get("description");
  productForm.fields.height.value = poster.get("height");
  productForm.fields.width.value = poster.get("width");
  productForm.fields.category_id.value = poster.get("category_id");

  res.render("posters/update", {
    form: productForm.toHTML(bootstrapField),
    poster: poster.toJSON(),
  });
});

router.post("/:id/update", [checkIfAuth], async (req, res) => {
  const poster = await Poster.where({
    id: req.params.id,
  }).fetch({
    require: true,
  });

  const productForm = createProductForm();
  productForm.handle(req, {
    success: async (form) => {
      poster.set(form.data);
      poster.save();
      res.redirect("/posters");
    },
    error: async (form) => {
      res.render("posters/update", {
        form: form.toHTML(bootstrapField),
        poster: poster.toJSON(),
      });
    },
  });
});

router.get("/:id/delete", [checkIfAuth], async (req, res) => {
  const poster = await Poster.where({
    id: req.params.id,
  }).fetch({
    require: true,
  });
  res.render("posters/delete", {
    poster: poster.toJSON(),
  });
});

router.post("/:id/delete", [checkIfAuth], async (req, res) => {
  const poster = await Poster.where({
    id: req.params.id,
  }).fetch({
    require: true,
  });
  await poster.destroy();
  res.redirect("/posters");
});

// router.post("/:id/update", async (req, res) => {
//   const allCategories = await Category.fetchAll().map((category) => {
//     return [category.get("id"), category.get("name")];
//   });
//   const poster = await Poster.where({
//     id: req.params.id,
//   }).fetch({
//     require: true,
//   });

//   const productForm = createProductForm(allCategories);
//   productForm.handle(req, {
//     success: async (form) => {
//       poster.set(form.data);
//       poster.save();
//       res.redirect("/posters");
//     },
//     error: async (form) => {
//       res.render("posters/update", {
//         form: form.toHTML(bootstrapField),
//       });
//     },
//   });
// });

module.exports = router;
