'use client'
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { StateEffect } from '@codemirror/state';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { toast } from 'sonner';
import Axios from '@/lib/Axios';

const CodeEditor = () => {
  const searchParams = useSearchParams();
  const file = searchParams.get('file');
  const { projectId } = useParams();
  const [fileId, setFileId] = useState('');
  const [content, setContent] = useState('');
  const containerRef = useRef(null);
  const editorRef = useRef<EditorView | null>(null);

  // Determine language mode based on file extension
  const getLanguageExtension = useCallback(() => {
    if (file?.endsWith('.html')) return html();
    if (file?.endsWith('.css')) return css();
    if (file?.endsWith('.js')) return javascript();
    return [];
  }, [file]);

  // Save helper using the specific fileId
  const saveFileContent = useCallback(async (id : any, fileContent : any) => {
    try {
      await Axios.put('api/code', { fileId: id, content: fileContent });
      toast.success('File saved successfully!');
    } catch (error:any) {
      toast.error(error?.response?.data?.error || 'Failed to save file');
    }
  }, []);

  useEffect(() => {
    if (!file || !projectId || !containerRef.current) return;

    const initializeEditor = async () => {
      try {
        // Fetch file content and id
        const response = await Axios.post('api/code', { projectId, fileName: file });
        if (response.status !== 200) throw new Error('Fetch error');
        const id = response.data.data._id;
        const fetchedContent = response.data.data.content || '';

        setFileId(id);
        setContent(fetchedContent);

        // Extensions: language mode, save keymap, change listener
        const languageExt = getLanguageExtension();
        const changeListener = EditorView.updateListener.of(update => {
          if (update.docChanged) setContent(update.state.doc.toString());
        });
        const saveKeymap = keymap.of([{ 
          key: 'Mod-s',
          preventDefault: true,
          run: view => {
            const current = view.state.doc.toString();
            saveFileContent(id, current);
            return true;
          }
        }]);

        // Create or update editor state
        const state = EditorState.create({
          doc: fetchedContent,
          extensions: [
            basicSetup,
            languageExt,
            saveKeymap,
            changeListener
          ],
        });

        if (!editorRef.current) {
          if (containerRef.current) {
            editorRef.current = new EditorView({ state, parent: containerRef.current });
          }
        } else {
          editorRef.current.setState(state);
        }
      } catch (error : any) {
        toast.error(error?.response?.data?.error || 'Something went wrong');
      }
    };

    initializeEditor();

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [file, projectId, getLanguageExtension, saveFileContent]);

  return (
    <div className='p-2 pb-10'>
      {!file ? (
        <div className='flex items-center justify-center flex-col bg-white rounded-md p-4 pb-7'>
          <Image src='/editor file.svg' width={320} height={320} alt='editor' />
          <p className='text-2xl text-slate-400'>No file is open</p>
        </div>
      ) : (
        <div
          className='relative flex-1 h-full min-h-[calc(100vh-3.5rem)] bg-white w-full overflow-auto'
          ref={containerRef}
        />
      )}
    </div>
  );
};

export default CodeEditor;