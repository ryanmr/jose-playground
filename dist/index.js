"use strict";
var _express = _interopRequireDefault(require("express"));
var jose = _interopRequireWildcard(require("jose"));
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
const app = (0, _express).default();
app.get("/", (req, res)=>{
    res.json({
        project: "jose",
        time: Date.now()
    });
});
// this is long lived, has an internal cache of the keys
const JWKS = jose.createRemoteJWKSet(new URL("https://ryanrampersad.auth0.com/.well-known/jwks.json"), {
    cooldownDuration: 1000 * 60 * 5 /* 5 minutes */ 
});
app.use("/", function() {
    var _ref = _asyncToGenerator(function*(req, res, next) {
        const originalUrl = req.originalUrl;
        const authorization = req.headers.authorization;
        console.log(`⚪️ request: ${originalUrl}`);
        if (!authorization || !(authorization === null || authorization === void 0 ? void 0 : authorization.startsWith("Bearer "))) {
            console.warn("🔴 no authorization header");
            return res.status(403).end();
        }
        const jwt = authorization.substring(7, authorization.length);
        try {
            const { payload , protectedHeader  } = yield jose.jwtVerify(jwt, JWKS, {
                issuer: "https://ryanrampersad.auth0.com/",
                audience: "https://jose.ryanrampersad.com"
            });
            console.log(`🟢 ${JSON.stringify(payload, null, 2)}`);
        } catch (err) {
            // there may be more errors we should handle
            // https://github.com/panva/jose/tree/main/docs/classes
            if ((err === null || err === void 0 ? void 0 : err.code) === "ERR_JWKS_NO_MATCHING_KEY") {
                console.warn("🟠 no matching key jwks found");
            } else if ((err === null || err === void 0 ? void 0 : err.code) === "ERR_JWT_CLAIM_VALIDATION_FAILED") {
                var ref;
                console.warn(`🟠 ${(ref = err === null || err === void 0 ? void 0 : err.claim) !== null && ref !== void 0 ? ref : "unknown"} was unexpected`);
            } else {
                console.log(`🔴`);
                console.error(err);
            }
            return res.status(403).end();
        }
        next();
    });
    return function(req, res, next) {
        return _ref.apply(this, arguments);
    };
}());
app.get("/authenticated", (req, res)=>{
    res.json({
        message: "this would be authenticated"
    });
});
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`server is ready at: http://localhost:${port}`);
});
