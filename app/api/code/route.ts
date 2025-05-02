import { connectDB } from "@/config/connectDB";
import { authOptions } from "@/lib/authOptions";
import FileModel from "@/models/FilesModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId, fileName } = await request.json();
    if (!projectId || !fileName) {
      return NextResponse.json(
        { error: "Project ID and file name are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const file = await FileModel.findOne({
      projectId: projectId,
      name: fileName,
    });

    if (!file) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "File fetched successfully",
        data: file,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/code error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, fileId } = await request.json();

    if (!fileId || content === undefined) {
      return NextResponse.json(
        { error: "File ID and content are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedFile = await FileModel.findByIdAndUpdate(
      fileId,
      { content },
      { new: true }
    );

    if (!updatedFile) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "File updated successfully",
        data: updatedFile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/code error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
