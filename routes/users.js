const express = require("express");
const router = express.Router();
const crypto = require("crypto")
const { User } = require('../models');
const { createLoginForm, createRegistrationForm, bootstrapField } = require('../forms');
const { checkIfAuth } = require("../middlewares")

const hashedPW = (password) => {
    const sha256 = crypto.createHash("sha256")
    const hash = sha256.update(password).digest("base64")
    return hash
}

router.get('/register', (req, res) => {
    const registerForm = createRegistrationForm();
    res.render('users/register', {
        'form': registerForm.toHTML(bootstrapField)
    })
})

router.post("/register", async (req, res) => {
    const registerForm = createRegistrationForm()
    registerForm.handle(req, {
        success: async (form) => {
            const user = new User({
                username: form.data.username,
                email: form.data.email,
                password: hashedPW(form.data.password)
            })
            await user.save()
            req.session.save()
            req.flash("success_messages", "Successful sign up")
            res.redirect("/user/login")
        },
        error: (form) => {
            res.render("users/register", {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get("/login", (req, res) => {
    const loginForm = createLoginForm()
    res.render("users/login", {
        form: loginForm.toHTML(bootstrapField)
    })
})

router.post("/login", async (req, res) => {
    const loginForm = createLoginForm()
    loginForm.handle(req, {
        success: async (form) => {
            let user = await User.where({
                email: form.data.email
            }).fetch({
                require: false
            })
            if (!user) {
                req.flash("error_messages", "Invalid login")
                res.redirect("/user/login")
            } else {
                if (user.get("password") === hashedPW(form.data.password)) {
                    req.session.user = {
                        id: user.get("id"),
                        username: user.get("username"),
                        email: user.get("email")
                    }
                    req.session.save()
                    console.log(req.session.user)
                    req.flash("success_messages", "Welcome back", user.get("username"))
                    res.redirect("/user/profile")
                } else {
                    req.flash("error_messages", "Invalid login")
                    res.redirect("/user/login")
                }
            }
        }, error: (form) => {
            req.flash("error_messages", "Got some issues, boss. Please try again.")
            res.render("users/login", {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get("/profile", [checkIfAuth], (req, res) => {
    const user = req.session.user;
    if (!user) {
        req.flash("error_messages", "You do not have permission to view this")
        res.redirect("/user/login")
    } else {
        res.render("users/profile", {
            user: user
        })
    }
})

router.get("/logout", (req, res) => {
    req.session.user = null
    req.flash("success_messages", "See you!")
    res.redirect("/user/login")
})

module.exports = router