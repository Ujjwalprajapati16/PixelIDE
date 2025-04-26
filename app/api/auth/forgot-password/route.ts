import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function POST(request : NextRequest) {
    const host = request.headers.get("host"); // domain
    const protocol = host?.includes("localhost") ? "http" : "https"; // protocol
    const domain = `${protocol}://${host}`; // domain
    try {
        const { email } = await request.json();

        if(!email) {
            return NextResponse.json({
                error: "Email is required",
            }, {
                status: 400,
            })
        }

        const existsUser = await UserModel.findOne({ email });
        if(!existsUser) {
            return NextResponse.json({
                error: "User not found",
            }, {
                status: 404,
            })
        }

        const payload = {
            id : existsUser?._id?.toString()
        }

        var token = jwt.sign(payload, process.env.FORGOT_PASSWORD_SECRET_KEY!, { expiresIn: 60 * 60 });

        const URL = `${domain}/reset-password/${token}`;
        // sending mail


        return NextResponse.json({
            message: "Check your email for reset password link",
        }, {
            status: 200,
        })
    } catch (error) {
        return NextResponse.json({
            error: "Something went wrong",
        }, {
            status: 500,
        })
    }
}