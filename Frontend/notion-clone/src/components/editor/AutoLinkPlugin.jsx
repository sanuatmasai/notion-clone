import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createTextNode, $getSelection, $isRangeSelection } from 'lexical';
import { $createLinkNode } from '@lexical/link';

// Matches URLs starting with http://, https://, ftp://, or www.
const URL_MATCHER =
  /((https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}))/g;

// Matches email addresses
const EMAIL_MATCHER =
  /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;

// Matches phone numbers in various formats
const PHONE_NUMBER_MATCHER =
  /(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g;

function AutoLinkPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeListener = editor.registerNodeTransform(
      'text',
      (node) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          return;
        }

        const text = node.getTextContent();
        let match = null;
        let linkMatch = null;

        // Check for URLs
        linkMatch = URL_MATCHER.exec(text);
        if (linkMatch !== null) {
          const url = linkMatch[0];
          const urlMatchStart = linkMatch.index;
          const urlMatchEnd = urlMatchStart + url.length;
          
          // Only transform if the cursor is at the end of the URL
          const selectionOffset = selection.anchor.offset;
          if (selectionOffset === urlMatchEnd) {
            const linkUrl = url.startsWith('http') ? url : `https://${url}`;
            const linkNode = $createLinkNode(linkUrl, { rel: 'noreferrer', target: '_blank' });
            const nodes = [
              $createTextNode(text.substring(0, urlMatchStart)),
              linkNode.append($createTextNode(url)),
              $createTextNode(text.substring(urlMatchEnd))
            ];
            
            node.replace(...nodes);
            return;
          }
        }

        // Check for emails
        linkMatch = EMAIL_MATCHER.exec(text);
        if (linkMatch !== null) {
          const email = linkMatch[0];
          const emailMatchStart = linkMatch.index;
          const emailMatchEnd = emailMatchStart + email.length;
          
          const selectionOffset = selection.anchor.offset;
          if (selectionOffset === emailMatchEnd) {
            const linkNode = $createLinkNode(`mailto:${email}`);
            const nodes = [
              $createTextNode(text.substring(0, emailMatchStart)),
              linkNode.append($createTextNode(email)),
              $createTextNode(text.substring(emailMatchEnd))
            ];
            
            node.replace(...nodes);
            return;
          }
        }

        // Check for phone numbers
        linkMatch = PHONE_NUMBER_MATCHER.exec(text);
        if (linkMatch !== null) {
          const phone = linkMatch[0];
          const phoneMatchStart = linkMatch.index;
          const phoneMatchEnd = phoneMatchStart + phone.length;
          
          const selectionOffset = selection.anchor.offset;
          if (selectionOffset === phoneMatchEnd) {
            const cleanPhone = phone.replace(/[^0-9+]/g, '');
            const linkNode = $createLinkNode(`tel:${cleanPhone}`);
            const nodes = [
              $createTextNode(text.substring(0, phoneMatchStart)),
              linkNode.append($createTextNode(phone)),
              $createTextNode(text.substring(phoneMatchEnd))
            ];
            
            node.replace(...nodes);
            return;
          }
        }
      }
    );

    return () => {
      removeListener();
    };
  }, [editor]);

  return null;
}

export default AutoLinkPlugin;
