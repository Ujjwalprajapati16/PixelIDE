import { connectDB } from "@/config/connectDB";
import UserModel from "@/models/User";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs"; 

export async function POST(req: NextRequest) {
  try {
    const { password, userId } = await req.json();

    if (!password || !userId) {
      return new Response(
        JSON.stringify({ error: "Password and User ID are required" }),
        { status: 400 }
      );
    }

    await connectDB();

    const user = await UserModel.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Compare new password with existing hashed password
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return new Response(
        JSON.stringify({ error: "New password must be different from old password" }),
        { status: 400 }
      );
    }

    // Update password
    user.password = password;  
    await user.save();         

    return new Response(
      JSON.stringify({ message: "Password reset successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset Password Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
