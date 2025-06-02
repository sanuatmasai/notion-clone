import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { $wrapNodes } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createParagraphNode } from 'lexical';
import { $createCodeNode } from '@lexical/code';
import { $createListNode, ListNode } from '@lexical/list';
import { useCallback, useState } from 'react';
import { $createLinkNode } from '@lexical/link';

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [isLink, setIsLink] = useState(false);
  const [url, setUrl] = useState('');

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLink(true);
      return;
    }

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createLinkNode(url));
      }
      setIsLink(false);
      setUrl('');
    });
  }, [editor, isLink, url]);

  const formatText = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatBlock = (blockType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        switch (blockType) {
          case 'paragraph':
            $wrapNodes(selection, () => $createParagraphNode());
            break;
          case 'h1':
            $wrapNodes(selection, () => $createHeadingNode('h1'));
            break;
          case 'h2':
            $wrapNodes(selection, () => $createHeadingNode('h2'));
            break;
          case 'h3':
            $wrapNodes(selection, () => $createHeadingNode('h3'));
            break;
          case 'bullet':
            $wrapNodes(selection, () => $createListNode('bullet'));
            break;
          case 'number':
            $wrapNodes(selection, () => $createListNode('number'));
            break;
          case 'quote':
            $wrapNodes(selection, () => $createQuoteNode());
            break;
          case 'code':
            $wrapNodes(selection, () => $createCodeNode());
            break;
        }
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => formatBlock('paragraph')}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Paragraph"
      >
        P
      </button>
      <button
        onClick={() => formatBlock('h1')}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Heading 1"
      >
        H1
      </button>
      <button
        onClick={() => formatBlock('h2')}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Heading 2"
      >
        H2
      </button>
      <button
        onClick={() => formatBlock('bullet')}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Bullet List"
      >
        •
      </button>
      <button
        onClick={() => formatBlock('number')}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Numbered List"
      >
        1.
      </button>
      <button
        onClick={() => formatBlock('quote')}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Quote"
      >
        "
      </button>
      <button
        onClick={() => formatBlock('code')}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Code Block"
      >
        {'</>'}
      </button>
      <div className="border-l border-gray-300 mx-2 h-6"></div>
      <button
        onClick={() => formatText('bold')}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 font-bold"
        title="Bold"
      >
        B
      </button>
      <button
        onClick={() => formatText('italic')}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 italic"
        title="Italic"
      >
        I
      </button>
      <button
        onClick={() => formatText('underline')}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 underline"
        title="Underline"
      >
        U
      </button>
      <button
        onClick={() => formatText('strikethrough')}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 line-through"
        title="Strikethrough"
      >
        S
      </button>
      <div className="border-l border-gray-300 mx-2 h-6"></div>
      <div className="relative">
        <button
          onClick={insertLink}
          className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isLink ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
          title="Insert Link"
        >
          🔗
        </button>
        {isLink && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-gray-800 rounded shadow-lg z-10">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              className="p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  insertLink();
                } else if (e.key === 'Escape') {
                  setIsLink(false);
                  setUrl('');
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolbarPlugin;
