import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSideConfig } from "../../../config/server";
export const handler = NextAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token, user }) {
      return session;
    },
    async jwt({ token, user, account, profile, session }) {
      return { ...token, ...user };
    },
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        apikey: { label: "API Key", type: "password" },
      },

      async authorize(credentials) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const leagalUsers = getServerSideConfig().users;
        if (!credentials?.username || !credentials?.password) {
          throw new Error("missing information");
        }
        if (credentials?.password !== leagalUsers.get(credentials?.username)) {
          throw new Error("invalide username/password");
        }

        return {
          name: credentials?.username.split("@")[0],
          id: credentials?.username,
          email: credentials?.username,
          api: credentials?.apikey,
        };

        // If no error and we have user data, return it

        //return JSON.parse(JSON.stringify(user));;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
