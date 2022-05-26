import express from "express";
import * as jose from "jose";
import { User } from "./types";

const app = express();

// optional: pass in DEBUG=debug [start command]
const DEBUG = process.env.DEBUG?.includes("debug");

app.get("/", (req, res) => {
  res.json({
    project: "jose",
    time: Date.now(),
  });
});

// this is long lived, has an internal cache of the keys
const JWKS = jose.createRemoteJWKSet(
  new URL("https://ryanrampersad.auth0.com/.well-known/jwks.json"),
  { cooldownDuration: 1000 * 60 * 5 /* 5 minutes */ }
);

app.use("/", async (req, res, next) => {
  const originalUrl = req.originalUrl;
  const authorization = req.headers.authorization;

  console.log(`⚪️ request: ${originalUrl}`);

  if (!authorization || !authorization?.startsWith("Bearer ")) {
    console.warn("🔴 no authorization header");
    return res.status(401).end();
  }

  const jwt = authorization.substring(7, authorization.length);

  try {
    const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS, {
      issuer: "https://ryanrampersad.auth0.com/",
      audience: "https://jose.ryanrampersad.com",
    });

    console.log(`🟢 ${JSON.stringify(payload, null, 2)}`);

    req.user = payload;
  } catch (err: any) {
    let code = 19000;
    // there may be more errors we should handle
    // https://github.com/panva/jose/tree/main/docs/classes
    if (err?.code === "ERR_JWKS_NO_MATCHING_KEY") {
      console.warn("🟠 no matching key jwks found");
      code = 19001;
    } else if (err?.code === "ERR_JWT_CLAIM_VALIDATION_FAILED") {
      console.warn(`🟠 ${err?.claim ?? "unknown"} was unexpected`);
      code = 19002;
    } else if (err?.code === "ERR_JWT_EXPIRED") {
      console.warn(`🟠 token expired from ${err?.claim ?? "unknown"}`);
      code = 19003;
    } else {
      console.log(`🔴`);
      console.error(err);
      code = 190133;
    }

    if (DEBUG) {
      res.json({ code });
    }

    return res.status(403).end();
  }

  next();
});

app.get("/me", (req, res) => {
  const user = req.user;

  return res.json({ user });
});

app.get("/products", (req, res) => {
  res.json({
    products: [
      { id: 1, name: "cookies" },
      { id: 2, name: "soup" },
      { id: 3, name: "eggs" },
    ],
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is ready at: http://localhost:${port}`);
});
