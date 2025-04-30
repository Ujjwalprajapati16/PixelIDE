import { connectDB } from "@/config/connectDB";
import { authOptions } from "@/lib/authOptions";
import { htmlBoilerplateCode, jsBoilerplateCode, styleBoilerplateCode } from "@/lib/sampleCode";
import FileModel from "@/models/FilesModel";
import ProjectModel from "@/models/ProjectModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Create project
export async function POST(request: NextRequest) {
    try {
        const { name } = await request.json();
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!name) {
            return NextResponse.json({ message: "Project name is required" }, { status: 400 });
        }

        await connectDB();

        // Optional: Remove faulty unique index on name if global
        try {
            await FileModel.collection.dropIndex("name_1");
        } catch (e) {
            // Ignore if index doesn't exist
        }

        const existingProject = await ProjectModel.findOne({ name, userId: session.user.id });
        if (existingProject) {
            return NextResponse.json({ message: "Project already exists" }, { status: 400 });
        }

        const project = await ProjectModel.create({
            name,
            userId: session.user.id,
        });

        await Promise.all([
            FileModel.create({ name: "index.html", projectId: project._id, content: htmlBoilerplateCode }),
            FileModel.create({ name: "style.css", projectId: project._id, content: styleBoilerplateCode }),
            FileModel.create({ name: "script.js", projectId: project._id, content: jsBoilerplateCode }),
        ]);

        return NextResponse.json({ message: "Project created successfully", projectId: project._id }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({
            message: "Error creating project",
            error: error.message,
        }, { status: 500 });
    }
}

// Get projects
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const projectId = searchParams.get("projectId");
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 6;
        const skip = (page - 1) * limit;

        const filterProject: any = {
            userId: session.user.id,
        };

        if (projectId) {
            filterProject._id = projectId;
        }

        const projects = await ProjectModel.find(filterProject)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("-__v -updatedAt")
            .lean();

        const totalCount = await ProjectModel.countDocuments(filterProject);
        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            message: "Projects fetched successfully",
            data: projects,
            totalPages,
            totalCount,
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            message: "Error fetching projects",
            error: error.message,
        }, { status: 500 });
    }
}
