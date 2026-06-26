import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
  emailAndPassword: { 
    enabled: true, 
  },
  socialProviders:{
    google:{
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },

  database: mongodbAdapter(db, {
    client
  }),

  user:{
    additionalFields:{
      role:{
        default: 'patient'
      }
    }
  },

  session: {
      cookieCache: {                  // 3. cookieCache alada vabe thakbe
      enabled: true,
      strategy: "jwt",
         maxAge: 180 * 24 * 60 * 60   
    }
  },

  plugins:[
    jwt()
  ]
});