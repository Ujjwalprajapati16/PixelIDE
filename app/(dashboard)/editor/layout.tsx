import EditorHeader from "./_component/EditorHeader";

export default function EditorLayout({children}: {children: React.ReactNode}) {
    return (
        <div>
            <EditorHeader />
            {children}
        </div>
    )
}