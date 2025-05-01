import { SidebarProvider } from "@/components/ui/sidebar";
import EditorHeader from "./_component/EditorHeader";
import EditorSidebar from "./_component/EditorSidebar";

export default function EditorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <EditorHeader />
            <SidebarProvider>
                {/* Editor sidebar */}
                <EditorSidebar />
                {/* editor and file open */}
                <main>
                    {children}
                </main>
            </SidebarProvider>
        </div>
    )
}