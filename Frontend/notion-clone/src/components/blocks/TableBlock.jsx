import React, { useState, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey, $isTableNode } from '@lexical/table';
import { $isTableRowNode, $createTableRowNode } from '@lexical/table';
import { $isTableCellNode, $createTableCellNode } from '@lexical/table';
import { $createParagraphNode } from 'lexical';
import { useTranslation } from 'react-i18next';

const TableBlock = ({ nodeKey, rows = 3, columns = 3, theme }) => {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleAddRow = useCallback(() => {
    editor.update(() => {
      const tableNode = $getNodeByKey(nodeKey);
      if ($isTableNode(tableNode)) {
        const newRow = $createTableRowNode();
        const colCount = tableNode.getFirstChild()?.getChildrenSize() || columns;
        
        for (let i = 0; i < colCount; i++) {
          const cell = $createTableCellNode(1);
          cell.append($createParagraphNode());
          newRow.append(cell);
        }
        
        tableNode.append(newRow);
      }
    });
  }, [editor, nodeKey, columns]);

  const handleAddColumn = useCallback(() => {
    editor.update(() => {
      const tableNode = $getNodeByKey(nodeKey);
      if ($isTableNode(tableNode)) {
        const rows = tableNode.getChildren();
        for (const row of rows) {
          if ($isTableRowNode(row)) {
            const cell = $createTableCellNode(1);
            cell.append($createParagraphNode());
            row.append(cell);
          }
        }
      }
    });
  }, [editor, nodeKey]);

  const handleDeleteRow = useCallback(() => {
    editor.update(() => {
      const tableNode = $getNodeByKey(nodeKey);
      if ($isTableNode(tableNode)) {
        const rows = tableNode.getChildren();
        const lastRow = rows[rows.length - 1];
        if ($isTableRowNode(lastRow) && rows.length > 1) {
          lastRow.remove();
        }
      }
    });
  }, [editor, nodeKey]);

  const handleDeleteColumn = useCallback(() => {
    editor.update(() => {
      const tableNode = $getNodeByKey(nodeKey);
      if ($isTableNode(tableNode)) {
        const rows = tableNode.getChildren();
        for (const row of rows) {
          if ($isTableRowNode(row)) {
            const cells = row.getChildren();
            const lastCell = cells[cells.length - 1];
            if ($isTableCellNode(lastCell) && cells.length > 1) {
              lastCell.remove();
            }
          }
        }
      }
    });
  }, [editor, nodeKey]);

  const showControls = isHovered || isFocused;
  
  return (
    <div 
      className={`relative my-4 border border-gray-200 dark:border-gray-700 rounded-md ${showControls ? 'ring-2 ring-primary-500' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={-1}
    >
      <div 
        contentEditable={false}
        className="absolute -top-8 right-0 flex space-x-1 bg-white dark:bg-gray-800 p-1 rounded-t-md border border-b-0 border-gray-200 dark:border-gray-700 opacity-0 transition-opacity duration-200"
        style={{ opacity: showControls ? 1 : 0 }}
      >
        <button 
          onClick={handleAddRow}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          title={t('table.addRow')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button 
          onClick={handleDeleteRow}
          className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
          title={t('table.deleteRow')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
        <button 
          onClick={handleAddColumn}
          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          title={t('table.addColumn')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90)">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button 
          onClick={handleDeleteColumn}
          className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
          title={t('table.deleteColumn')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90)">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-t border-gray-200 dark:border-gray-700 first:border-t-0">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td 
                    key={`${rowIndex}-${colIndex}`}
                    className="border-l border-gray-200 dark:border-gray-700 p-2 first:border-l-0"
                  >
                    <div className="min-h-6"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableBlock;
