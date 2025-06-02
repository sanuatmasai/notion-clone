import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createTableNode, INSERT_TABLE_COMMAND } from '@lexical/table';
import { $createParagraphNode, $getSelection, $isRangeSelection } from 'lexical';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TablePlugin = () => {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_TABLE_COMMAND,
      ({ rows, columns }) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const tableNode = $createTableNode();
          
          // Create header row
          const headerRow = $createTableRowNode();
          for (let i = 0; i < columns; i++) {
            const headerCell = $createParagraphNode();
            headerRow.append(headerCell);
          }
          tableNode.append(headerRow);
          
          // Create data rows
          for (let i = 1; i < rows; i++) {
            const row = $createTableRowNode();
            for (let j = 0; j < columns; j++) {
              const cell = $createParagraphNode();
              row.append(cell);
            }
            tableNode.append(row);
          }
          
          selection.insertNodes([tableNode]);
          const firstCell = tableNode.getFirstChild()?.getFirstChild();
          if (firstCell) {
            firstCell.selectStart();
          }
        }
        return true;
      },
      1
    );
  }, [editor]);

  useEffect(() => {
    // Register table commands
    const unregisterTableCommand = editor.registerCommand(
      'INSERT_TABLE',
      () => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: 3, columns: 3 });
        return true;
      },
      1
    );

    return () => {
      unregisterTableCommand();
    };
  }, [editor]);

  return null;
};

export default TablePlugin;
