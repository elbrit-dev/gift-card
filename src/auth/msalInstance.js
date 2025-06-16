import { PublicClientApplication } from "@azure/msal-browser";

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_TENANT_ID}`,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || "https://elbirt-dev.netlify.app/",
  },
  cache: {
    cacheLocation: "localStorage", // <-- this persists even after refresh!
    storeAuthStateInCookie: true,
  },

});