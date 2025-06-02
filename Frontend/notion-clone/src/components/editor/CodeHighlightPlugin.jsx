import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { useEffect } from 'react';

export default function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext();

  // Handle keyboard shortcuts for code formatting
  useEffect(() => {
    return editor.registerCommand(
      'FORMAT_CODE',
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const isCode = $getSelectionStyleValueForProperty(
            selection,
            'code',
            false
          );
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
          return true;
        }
        return false;
      },
      1
    );
  }, [editor]);

  // Handle keyboard shortcut for toggling code block
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Handle Cmd/Ctrl + E for code block
      if ((event.metaKey || event.ctrlKey) && event.key === 'e') {
        event.preventDefault();
        editor.dispatchCommand('FORMAT_CODE');
      }
    };

    return editor.registerRootListener((rootElement, prevRootElement) => {
      if (prevRootElement) {
        prevRootElement.removeEventListener('keydown', handleKeyDown);
      }
      if (rootElement) {
        rootElement.addEventListener('keydown', handleKeyDown);
      }
    });
  }, [editor]);

  return null;
}
