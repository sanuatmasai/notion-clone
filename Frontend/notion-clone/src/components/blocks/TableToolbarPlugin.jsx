import React, { useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { useTranslation } from 'react-i18next';

const TableToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: 3, columns: 3 });
  }, [editor]);

  return (
    <button
      onClick={handleClick}
      className="toolbar-item"
      title={t('toolbar.insertTable')}
      aria-label={t('toolbar.insertTable')}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="3" y1="15" x2="21" y2="15"></line>
        <line x1="12" y1="3" x2="12" y2="21"></line>
      </svg>
      <span className="text">{t('toolbar.table')}</span>
    </button>
  );
};

export default TableToolbarPlugin;
