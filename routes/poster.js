const express = require("express");
const router = express.Router();
const { Poster } = require("../models");
const { bootstrapField, createProductForm } = require("../forms");
const { KnexTimeoutError } = require("knex");

router.get("/", async (req, res) => {
  let posters = await Poster.collection().fetch();
  res.render("posters/index", {
    posters: posters.toJSON(),
  });
});

router.post("/", async (req, res) => {
  console.log("post /create");
  const productForm = createProductForm()
  productForm.handle(req, {
    "success": async (form) => {
      const poster = new Poster(form.data);
      await poster.save();
      res.redirect("/posters");
    },
    "error": async (form) => {
      res.render("posters/create"), {
        form: form.toHTML(bootstrapField)
      }
    },
    // "empty" :{
    //   //re-render
    // }
  });
})

router.get("/create", async (req, res) => {
  console.log(req.params)
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
      poster.set("title", form.data.title);
      poster.set("description", form.data.description);
      poster.set("cost", form.data.cost);
      poster.set("stock", form.data.stock)
      poster.set("height", form.data.height)
      poster.set("width", form.data.width)
      await poster.save();
      res.redirect("/posters");
    },
  });
});

router.post('/create', async (req, res) => {
  const productForm = createProductForm();
  productForm.handle(req, {
    'success': async (form) => {
      let { tags, ...posterData } = form.data;
      const poster = new Poster(posterData);
      await poster.save();
      if (tags) {
        await poster.tags().attach(tags.split(","));
      }
      // req.flash("success_messages", `New Product ${poster.get('title')} has been created`)
      res.redirect('/posters');
    },
    'error': async (form) => {
      res.render('posters/create', {
        'form': productForm.toHTML(bootstrapField)
      })
    }
  })
})

router.get("/:id/update", async (req, res) => {
  const poster = await Poster.where({
    id: req.params.id
  }).fetch({
    require: true
  })

  const productForm = createProductForm()
  productForm.fields.title.value = poster.get("title")
  productForm.fields.cost.value = poster.get("cost")
  productForm.fields.stock.value = poster.get("stock")
  productForm.fields.description.value = poster.get("description")
  productForm.fields.height.value = poster.get("height")
  productForm.fields.width.value = poster.get("width")

  res.render("posters/update", {
    "form": productForm.toHTML(bootstrapField),
    "poster": poster.toJSON()
  })
})

router.post("/:id/update", async (req, res) => {
  const poster = await Poster.where({
    id: req.params.id
  }).fetch({
    require: true
  })

  const productForm = createProductForm();
  productForm.handle(req, {
    "success": async (form) => {
      poster.set(form.data)
      poster.save()
      res.redirect("/posters")
    },
    "error": async (form) => {
      res.render('posters/update', {
        'form': form.toHTML(bootstrapField),
        "poster": poster.toJSON()
      })
    }
  })
})

router.get("/:id/delete", async (req, res) => {
  const poster = await Poster.where({
    id: req.params.id
  }).fetch({
    require: true
  })
  res.render("posters/delete", {
    poster: poster.toJSON()
  })
})

router.post("/:id/delete", async (req, res) => {
  const poster = await Poster.where({
    id: req.params.id
  }).fetch({
    require: true
  })
  await poster.destroy()
  res.redirect("/posters")
})

module.exports = router;
