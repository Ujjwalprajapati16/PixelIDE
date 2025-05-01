import { connectDB } from "@/config/connectDB";
import { authOptions } from "@/lib/authOptions";
import FileModel from "@/models/FilesModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const session = getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { name, projectId } = await request.json();

        if (!name || !projectId) {
            return NextResponse.json(
                { error: "Name and projectId are required" },
                { status: 400 }
            )
        }

        await connectDB();
        const checkFileName = await FileModel.findOne({
            name: name,
            projectId: projectId,
        });

        if (checkFileName) {
            return NextResponse.json(
                { error: "File already exists" },
                { status: 400 }
            )
        }

        const newFile = await FileModel.create({
            name: name,
            projectId: projectId,
        });

        return NextResponse.json(
            { message: "File created successfully", data: newFile },
            { status: 201 }
        )


    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    }
}