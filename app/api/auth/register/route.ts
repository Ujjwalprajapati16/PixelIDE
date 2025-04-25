import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";
import { connectDB } from "@/config/connectDB";

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();
        if (!name || !email || !password) {
            return NextResponse.json({ message: "Please fill all fields" }, { status: 400 });
        }

        await connectDB();

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        // Create new user
        const newUser = new UserModel({ name, email, password });
        await newUser.save();

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/auth/register:", error);
        return NextResponse.json({ message: "Failed to register user" }, { status: 500 });
    }
}
