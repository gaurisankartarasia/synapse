// src/utils/messageFormatter.ts

/**
 * Formats message text with support for:
 * - Markdown-like formatting
 * - Code blocks
 * - Basic text styling
 */
export const formatMessageText = (text: string): string => {
    // Escape HTML to prevent XSS
    let formattedText = escapeHtml(text);
  
    // Code blocks (```)
    formattedText = formattedText.replace(/```([\s\S]*?)```/g, (match, p1) => 
      `<pre class="bg-gray-100 p-2 rounded-md overflow-x-auto"><code>${escapeHtml(p1.trim())}</code></pre>`
    );
  
    // Inline code (``)
    formattedText = formattedText.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');
  
    // Bold (**text**)
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
    // Italic (*text*)
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
    // Headers (#, ##, ###)
    formattedText = formattedText.replace(/^(#{1,3})\s(.*)$/gm, (match, hashes, content) => {
      const level = hashes.length;
      const headerClass = {
        1: 'text-2xl font-bold mt-4 mb-2',
        2: 'text-xl font-semibold mt-3 mb-1',
        3: 'text-lg font-medium mt-2 mb-1'
      }[level];
      return `<h${level} class="${headerClass}">${content}</h${level}>`;
    });
  
    // Links
    formattedText = formattedText.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, 
      '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  
    // Lists
    formattedText = formatLists(formattedText);
  
    // Newlines to <br>
    formattedText = formattedText.replace(/\n/g, '<br>');
  
    return formattedText;
  };
  
  /**
   * Escapes HTML to prevent XSS
   */
  const escapeHtml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  
  /**
   * Formats ordered and unordered lists
   */
  const formatLists = (text: string): string => {
    // Unordered lists (- )
    text = text.replace(/^-\s(.*)$/gm, '<li class="list-disc ml-4">$1</li>');
    
    // Ordered lists (1. )
    text = text.replace(/^\d+\.\s(.*)$/gm, '<li class="list-decimal ml-4">$1</li>');
    
    // Wrap consecutive list items
    text = text.replace(/(<li.*?>.*?<\/li>)(\s*<li.*?>.*?<\/li>)+/g, (match) => 
      `<ul class="my-2">${match}</ul>`
    );
  
    return text;
  };