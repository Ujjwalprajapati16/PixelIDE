import { connectDB } from "@/config/connectDB";
import { authOptions } from "@/lib/authOptions";
import ProjectModel from "@/models/ProjectModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        
        const recentProject = await ProjectModel.find({}).sort({ createdAt: -1 }).limit(10).select("-__v -updatedAt").lean();
        
        return NextResponse.json({ 
            message : "Recent project fetched successfully",
            data : recentProject,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            error: "Error in GET /api/recent-project-update"
        }, { status: 500 });
    }
}