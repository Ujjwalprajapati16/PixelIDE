import { connectDB } from "@/config/connectDB";
import FileModel from "@/models/FilesModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ projectId: string; fileName: string }> }
) {
  const { projectId, fileName } = await context.params;

  if (!projectId || !fileName) {
    return new NextResponse("Missing projectId or fileName", {
      status: 400,
      headers: {
        "content-type": "text/plain",
      },
    });
  }

  const extension = fileName.split(".").pop();

  try {
    await connectDB();

    const file = await FileModel.findOne({ name: fileName, projectId });

    if (!file) {
      return new NextResponse("File not found", {
        status: 404,
        headers: {
          "content-type": "text/plain",
        },
      });
    }

    let content = file.content;

    if (extension === "html") {
      const host = request.headers.get("host");
      const protocol = host?.includes("localhost") ? "http" : "https";
      const domain = `${protocol}://${host}`;
      const baseURL = `${domain}/api/file/${projectId}`;

      // Fix broken href/src by replacing them with correct API links
      content = content.replace(/(src|href)=["'](.*?)["']/g, (_:any, attr:any, path:any) => {
        // Prevent rewriting external or absolute URLs
        if (path.startsWith("http") || path.startsWith("//")) return `${attr}="${path}"`;
        return `${attr}="${baseURL}/${path}"`;
      });

      return new NextResponse(content, {
        headers: {
          "content-type": "text/html",
        },
      });
    }

    if (extension === "css") {
      return new NextResponse(content, {
        headers: {
          "content-type": "text/css",
        },
      });
    }

    if (extension === "js") {
      return new NextResponse(content, {
        headers: {
          "content-type": "application/javascript",
        },
      });
    }

    return new NextResponse(content, {
      headers: {
        "content-type": "text/plain",
      },
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: {
        "content-type": "text/plain",
      },
    });
  }
}
