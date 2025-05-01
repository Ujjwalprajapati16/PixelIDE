'use client'
import Image from 'next/image';
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state';
import {html} from '@codemirror/lang-html';
import {javascript, javascriptLanguage} from '@codemirror/lang-javascript';
import {css, cssLanguage} from '@codemirror/lang-css';

const CodeEditor = () => {
  const serachParams = useSearchParams();
  const file = serachParams.get("file");
  const [elements, setElements] = useState<HTMLElement | null>(null);

  const ref = useCallback((node : HTMLElement | null) => {
    if(!node) {
      return;
    }
    setElements(node);
  }, []);

  useEffect(() => {
    if(!elements) {
      return;
    }

    const state = EditorState.create({
      doc : "",
      extensions : [
        basicSetup,
        // html, css, javascript
      ]
    });

    const view = new EditorView({
      state : state,
      parent : elements
    });

    return () => {
      view.destroy();
    }
  }, [file, elements]);

  return (
    <div className='p-2 pb-10'>
      {
        !file ? (
          <div className='flex items-center justify-center flex-col bg-white rounded-md p-4 pb-7'>
            <Image 
              src={"/editor file.svg"}
              width={320}
              height={320}
              alt='editor'
            />
            <p className='text-2xl text-slate-400'>No file is open</p>
          </div>
        ) : (
          <div className='relative flex-1 h-full min-h-[calc(100vh-3.5rem)] bg-white w-full overflow-auto' ref={ref}>
            
          </div>
        )
      }
    </div>
  )
}

export default CodeEditor