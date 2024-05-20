const passport = require("passport");
const {faker} = require("@faker-js/faker");

const passportCall = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if(error) {
                return next(error);
            }
            if(!user) {
                res.status(401).send({error: info.message ? info.message : info.toString()});
            }

            req.user = user; 
            next();
        })(req, res, next)
    }
}


const authorization = (roles) => {
    return async (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).send({message: "No tenes permisooo amiguitooo"});
        }
        next();
    }
}

function generarCodigoUnico() {
    // Generar un número aleatorio único utilizando Math.random()
    const randomNumber = Math.random().toString(36).substring(2, 10);

    // Obtener la marca de tiempo actual en milisegundos utilizando Date.now()
    const timestamp = Date.now().toString(36);

    // Combinar el número aleatorio y la marca de tiempo para crear un código único
    const codigoUnico = randomNumber + timestamp;

    return codigoUnico;
}

const generarProductos = () => {
    return {
        id: faker.database.mongodbObjectId(), 
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        stock: parseInt(faker.string.numeric()), 
        description: faker.commerce.productDescription(),
        img: faker.image.avatar(),
        code: faker.string.alphanumeric(16),
        thumbail: faker.image.url(),
        category: faker.commerce.productAdjective()

    }
}


module.exports = {
    passportCall,
    authorization,
    generarCodigoUnico,
    generarProductos
}