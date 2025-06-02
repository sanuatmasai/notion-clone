import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND } from 'lexical';
import { $isListNode, ListNode } from '@lexical/list';
import { useEffect } from 'react';

const MAX_INDENT_LEVEL = 4;

export default function ListMaxIndentLevelPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INDENT_CONTENT_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }

        const nodes = selection.getNodes();
        const currentNode = nodes[0]?.getParent() || nodes[0];

        if ($isListNode(currentNode)) {
          const listNode = currentNode;
          const listParent = listNode.getParent();
          
          // Check if we've reached the maximum indent level
          let currentIndent = 0;
          let current = listNode;
          
          while (current !== null && $isListNode(current)) {
            currentIndent++;
            current = current.getParent();
          }
          
          if (currentIndent >= MAX_INDENT_LEVEL) {
            return true; // Prevent further indentation
          }
        }

        return false; // Let the default behavior handle it
      },
      1
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      OUTDENT_CONTENT_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }

        const nodes = selection.getNodes();
        const currentNode = nodes[0]?.getParent() || nodes[0];

        if ($isListNode(currentNode)) {
          const listNode = currentNode;
          const listParent = listNode.getParent();
          
          // Check if we're at the root level
          if (!listParent || !$isListNode(listParent)) {
            return true; // Prevent outdenting from root level
          }
        }

        return false; // Let the default behavior handle it
      },
      1
    );
  }, [editor]);

  return null;
}
