import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Verify the token
    try {
      const verifyToken: any = jwt.verify(token, process.env.FORGOT_PASSWORD_SECRET_KEY!);

      return NextResponse.json(
        {
          message: "Token is valid",
          expired: false,
          userId: verifyToken ? verifyToken?.id : null,
        },
        { status: 200 }
      );
    } catch (verifyError: any) {
      // Handle token errors separately
      return NextResponse.json(
        {
          error: "Invalid or expired token",
          expired: true,
        },
        { status: 401 }
      );
    }

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
