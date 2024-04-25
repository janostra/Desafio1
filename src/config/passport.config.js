//Instalamos: npm i passport passport-local

//Importamos los módulos: 

const passport = require("passport");
const local = require("passport-local");

//Estrategia con GitHub
const GitHubStrategy = require("passport-github2");

//Me traigo el UserModel y las funciones de bcrypt. 
const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository;
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository;


const LocalStrategy = local.Strategy; 

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        //Le decis que queres acceder al objeto request
        usernameField: "email"
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body;

        try {
            //Verificamos si ya existe un registro con ese mail
            let user = await userRepository.buscarUsuario(email);
            if(user) return done(null, false);
            //Si no existe, voy a crear un registro nuevo: 

            // Crear un nuevo carrito para el usuario
            const cart = await cartRepository.crearCarrito();
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: cart._id
            }

            let result = await userRepository.crearUsuario(newUser);
            
            //Si todo resulta bien, podemos mandar done con el usuario generado. 
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }))

    //Agregamos otra estrategia, ahora para el "login":
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            //Primero verifico si existe un usuario con ese email:
            const user = await UserModel.findOne({email});
            if(!user) {
                console.log("Este usuario no existeeeeeee ahhh");
                return done(null, false);
            }
            //Si existe, verifico la contraseña: 
            if(!isValidPassword(password, user)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({_id:id});
        done(null, user);
    })

    //Acá vamos a desarrollar nuestra estrategia para GitHub: 
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.ca1cb0acb7969ea5",
        clientSecret: "1ebb921dbca07016260779d2837c532c415ed3cc",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        //Opcional: si ustedes quieren ver como llega el perfil del usuario: 
        console.log(profile); 
        try {
            let user = await UserModel.findOne({email: profile._json.email});
            if(!user) {
                //Si no encuentro ningun usuario con este email, lo voy a crear:
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "secreto",
                    age: 37,
                    email: profile._json.email,
                    password: "secreto",
                    admin: false
                }
                //Una vez que tengo el nuevo usuario, lo guardo en MongoDB
                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))
}

module.exports = initializePassport;