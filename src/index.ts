import express from "express";
import * as jose from "jose";

const app = express();

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
    return res.status(403).end();
  }

  const jwt = authorization.substring(7, authorization.length);

  try {
    const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS, {
      issuer: "https://ryanrampersad.auth0.com/",
      audience: "https://jose.ryanrampersad.com",
    });

    console.log(`🟢 ${JSON.stringify(payload, null, 2)}`);
  } catch (err: any) {
    // there may be more errors we should handle
    // https://github.com/panva/jose/tree/main/docs/classes
    if (err?.code === "ERR_JWKS_NO_MATCHING_KEY") {
      console.warn("🟠 no matching key jwks found");
    } else if (err?.code === "ERR_JWT_CLAIM_VALIDATION_FAILED") {
      console.warn(`🟠 ${err?.claim ?? "unknown"} was unexpected`);
    } else {
      console.log(`🔴`);
      console.error(err);
    }

    return res.status(403).end();
  }

  next();
});

app.get("/authenticated", (req, res) => {
  res.json({
    message: "this would be authenticated",
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is ready at: http://localhost:${port}`);
});
