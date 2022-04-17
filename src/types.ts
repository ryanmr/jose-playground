export interface User {
  // these are copied right out of the /node_modules/jose/dist/types/types.d.ts

  iss?: string;
  sub?: string;
  aud?: string | string[];
  jti?: string;
  nbf?: number;
  exp?: number;
  iat?: number;

  // all other claims would need to be checked and handled accordingly
  [propName: string]: unknown;
}
