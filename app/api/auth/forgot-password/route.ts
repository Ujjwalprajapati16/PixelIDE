import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ForgotPasswordEmail } from "@/components/template/ForgotPasswordEmail";
import { sendMail } from "@/lib/nodemailer";
import { connectDB } from "@/config/connectDB";

export async function POST(request: NextRequest) {
    const host = request.headers.get("host"); // domain
    const protocol = host?.includes("localhost") ? "http" : "https"; // protocol
    const domain = `${protocol}://${host}`; // full domain

    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        await connectDB();

        const existsUser = await UserModel.findOne({ email });

        if (!existsUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const payload = {
            id: existsUser?._id?.toString(),
        };

        const token = jwt.sign(payload, process.env.FORGOT_PASSWORD_SECRET_KEY!, {
            expiresIn: "1h", // 1 hour expiration
        });

        const resetURL = `${domain}/reset-password/${token}`;

        // Send email
        await sendMail(
            existsUser.email,
            "Reset Your Password | PixelIDE",
            ForgotPasswordEmail(existsUser.name, resetURL)
        );

        return NextResponse.json(
            { message: "Check your email for the reset password link." },
            { status: 200 }
        );

    } catch (error) {
        console.error("Forgot Password Error:", error);

        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
