import { connectDB } from "@/config/connectDB";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider ({
            name : "Credentials",
            credentials : {
                email : { label : "Email", type : "text" },
                password : { label : "Password", type : "password" }
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials.password) {
                    throw new Error("Invalid credentials");
                }

                try {
                    await connectDB();

                    const user = await UserModel.findOne({
                        email : credentials.email
                    }).select("+password");
                    if(!user) {
                        throw new Error("No user found with this email");
                    }
                    const isValidPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if(!isValidPassword) {
                        throw new Error("Invalid password");
                    }
                    return {
                        id : user._id.toString(),
                        name : user.name,
                        email : user.email,
                        image : user.picture,
                    };
                } catch (error) {
                    console.error("Error in authorize:", error);
                    throw new Error("Invalid credentials");
                }
            }
        })
    ],
    callbacks : {
        async jwt({ token, user }) {
            if(user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if(session.user) {
                session.user.id = token.id as string;
            }
            return session;
        }

    },
    pages : {
        error : "/login",
        signIn : "/login",
    },
    session : {
        strategy : "jwt",
        maxAge : 30 * 24 * 60 * 60, // 30 days
    },
    secret : process.env.NEXTAUTH_SECRET
}