// import in caolan forms
const { widgets } = require("forms");
const forms = require("forms");
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;

var bootstrapField = function (name, object) {
  if (!Array.isArray(object.widget.classes)) {
    object.widget.classes = [];
  }
  if (object.widget.classes.indexOf("form-control") === -1) {
    object.widget.classes.push("form-control");
  }

  var validationclass = object.value && !object.error ? "is-valid" : "";
  validationclass = object.error ? "is-invalid" : validationclass;
  if (validationclass) {
    object.widget.classes.push(validationclass);
  }

  var label = object.labelHTML(name);
  var error = object.error
    ? '<div class="invalid-feedback">' + object.error + "</div>"
    : "";

  var widget = object.widget.toHTML(name, object);
  return '<div class="form-group">' + label + widget + error + "</div>";
};

const createProductForm = () => {
  return forms.create({
    title: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    cost: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    description: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    stock: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    height: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    width: fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
    }),
    image_url: fields.string({
      required: false,
      widget: widgets.hidden()
    }),
    category_id: fields.string({
      label: "Category",
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ["form-label"],
      },
      // widget: forms.widgets.select(),
      // choices: categories,
    }),
  });
};

const createRegistrationForm = () => {
  return forms.create({
    'username': fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label']
      }
    }),
    'email': fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label']
      }
    }),
    'password': fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label']
      }
    }),
    'confirm_password': fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label']
      },
      validators: [validators.matchField('password')]
    })
  })
}

const createLoginForm = () => {
  return forms.create({
    'email': fields.string({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label']
      }
    }),
    'password': fields.password({
      required: true,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label']
      }
    }),
  })
}

const createSearchForm = () => {
  return forms.create({
    'title': fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label']
      }
    }),
    'min_cost': fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label']
      },
      'validators': [validators.integer()]
    }),
    'max_cost': fields.string({
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label']
      },
      'validators': [validators.integer()]
    }),
    'category_id': fields.string({
      label: 'Category',
      required: false,
      errorAfterField: true,
      cssClasses: {
        label: ['form-label']
      },
      // widget: widgets.select(),
      // choices: categories
    }),
    // 'tags': fields.string({
    //     required:false,
    //     errorAfterField: true,
    //     cssClasses: {
    //         label: ['form-label']
    //     },
    // widget: widgets.multipleSelect(),
    // choices: tags
  })
}

module.exports = { createProductForm, bootstrapField, createRegistrationForm, createLoginForm, createSearchForm };
