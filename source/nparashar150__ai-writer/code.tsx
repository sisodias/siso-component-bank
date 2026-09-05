'use client';

import { useEditor, EditorContent, BubbleMenu as TiptapBubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Sparkles,
  Loader2,
  Wand2,
  ArrowRight,
  Check,
  X,
  Quote
} from 'lucide-react';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Editor } from '@tiptap/react';

// ============================================================================
// Utils
// ============================================================================

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// UI Components
// ============================================================================

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none cursor-pointer",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
        icon: 'h-9 w-9 p-0'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  style,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      style={style}
      {...props}
    />
  );
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]', className)}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

function TooltipProvider({ delayDuration = 0, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger {...props} />;
}

function TooltipContent({ className, sideOffset = 4, children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 max-w-sm rounded-md px-3 py-1.5 text-xs shadow-md bg-popover text-popover-foreground',
          className
        )}
        {...props}>
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root {...props} />;
}

function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger {...props} />;
}

function PopoverContent({ className, align = 'center', sideOffset = 4, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-72 rounded-md border border-border bg-popover p-4 shadow-md outline-none',
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

// ============================================================================
// Slash Command Types & Default Commands
// ============================================================================

export interface SlashCommandItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: (editor: Editor) => void;
  keywords?: string[];
}

const defaultCommands: SlashCommandItem[] = [
  {
    title: 'Heading 1',
    description: 'Large section heading',
    icon: <Heading1 className='h-4 w-4' />,
    command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    keywords: ['h1', 'heading1', 'title']
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: <Heading2 className='h-4 w-4' />,
    command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    keywords: ['h2', 'heading2', 'subtitle']
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: <Heading3 className='h-4 w-4' />,
    command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    keywords: ['h3', 'heading3']
  },
  {
    title: 'Bullet List',
    description: 'Create a bulleted list',
    icon: <List className='h-4 w-4' />,
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
    keywords: ['ul', 'bullet', 'unordered']
  },
  {
    title: 'Numbered List',
    description: 'Create a numbered list',
    icon: <ListOrdered className='h-4 w-4' />,
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
    keywords: ['ol', 'numbered', 'ordered']
  },
  {
    title: 'Code Block',
    description: 'Insert a code block',
    icon: <Code className='h-4 w-4' />,
    command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    keywords: ['code', 'pre', 'preformatted']
  },
  {
    title: 'Quote',
    description: 'Insert a quote',
    icon: <Quote className='h-4 w-4' />,
    command: (editor) => {
      // Check if we're already in a blockquote
      if (editor.isActive('blockquote')) {
        // If already in blockquote, unwrap it
        editor.chain().focus().lift('blockquote').run();
      } else {
        const { selection } = editor.state;
        const { $from } = selection;
        
        // Find the paragraph node we're currently in
        let paragraphStart = $from.start();
        let paragraphEnd = $from.end();
        let depth = $from.depth;
        
        // Walk up the node tree to find the paragraph
        while (depth >= 0) {
          const nodeAtDepth = $from.node(depth);
          if (nodeAtDepth.type.name === 'paragraph') {
            paragraphStart = $from.start(depth);
            paragraphEnd = $from.end(depth);
            break;
          }
          depth--;
        }
        
        // If we're not in a paragraph (e.g., in a heading), convert to paragraph first
        if (depth < 0) {
          editor.chain().focus().setParagraph().wrapIn('blockquote').run();
        } else {
          // Select only the paragraph node and wrap it
          editor
            .chain()
            .focus()
            .setTextSelection({ from: paragraphStart, to: paragraphEnd })
            .wrapIn('blockquote')
            .run();
        }
      }
    },
    keywords: ['quote', 'blockquote', 'citation']
  },
  {
    title: 'Link',
    description: 'Insert a link',
    icon: <LinkIcon className='h-4 w-4' />,
    command: (editor) => {
      const url = window.prompt('Enter URL:');
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    },
    keywords: ['link', 'url', 'href']
  },
  {
    title: 'Bold',
    description: 'Make text bold',
    icon: <Bold className='h-4 w-4' />,
    command: (editor) => editor.chain().focus().toggleBold().run(),
    keywords: ['bold', 'strong']
  },
  {
    title: 'Italic',
    description: 'Make text italic',
    icon: <Italic className='h-4 w-4' />,
    command: (editor) => editor.chain().focus().toggleItalic().run(),
    keywords: ['italic', 'emphasis']
  }
];

// ============================================================================
// Bubble Menu Component
// ============================================================================

interface BubbleMenuProps {
  editor: Editor;
  onAIAction?: (action: string) => void;
}

function BubbleMenu({ editor, onAIAction }: BubbleMenuProps) {
  if (!editor) return null;

  const isActive = (name: string) => {
    if (name === 'bold') return editor.isActive('bold');
    if (name === 'italic') return editor.isActive('italic');
    if (name === 'underline') return editor.isActive('underline');
    if (name === 'strike') return editor.isActive('strike');
    if (name === 'code') return editor.isActive('code');
    return false;
  };

  const handleFormat = (format: string) => {
    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'underline':
        editor.chain().focus().toggleUnderline().run();
        break;
      case 'strike':
        editor.chain().focus().toggleStrike().run();
        break;
      case 'code':
        editor.chain().focus().toggleCode().run();
        break;
      case 'link':
        const url = window.prompt('Enter URL:');
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
        break;
    }
  };

  return (
    <TiptapBubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className='flex items-center gap-1 rounded-lg border border-border bg-popover p-1 shadow-lg'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => handleFormat('bold')}
            className={cn('h-8 w-8 p-0', isActive('bold') && 'bg-accent')}>
            <Bold className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Bold</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => handleFormat('italic')}
            className={cn('h-8 w-8 p-0', isActive('italic') && 'bg-accent')}>
            <Italic className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Italic</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => handleFormat('underline')}
            className={cn('h-8 w-8 p-0', isActive('underline') && 'bg-accent')}>
            <UnderlineIcon className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Underline</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => handleFormat('strike')}
            className={cn('h-8 w-8 p-0', isActive('strike') && 'bg-accent')}>
            <Strikethrough className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Strikethrough</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => handleFormat('code')}
            className={cn('h-8 w-8 p-0', isActive('code') && 'bg-accent')}>
            <Code className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Code</TooltipContent>
      </Tooltip>

      <Separator orientation='vertical' className='h-6' />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='ghost' size='sm' onClick={() => handleFormat('link')} className='h-8 w-8 p-0'>
            <LinkIcon className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Add Link</TooltipContent>
      </Tooltip>

      {onAIAction && (
        <>
          <Separator orientation='vertical' className='h-6' />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onAIAction('rewrite')}
                className='h-8 w-8 p-0 text-primary hover:text-primary/80'>
                <Sparkles className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>AI Rewrite</TooltipContent>
          </Tooltip>
        </>
      )}
    </TiptapBubbleMenu>
  );
}

// ============================================================================
// Slash Command Component
// ============================================================================

interface SlashCommandProps {
  editor: Editor;
  items?: SlashCommandItem[];
  onAIAction?: (action: string) => void;
  onOpenChange?: (isOpen: boolean) => void;
}

function SlashCommand({ editor, items = defaultCommands, onAIAction, onOpenChange }: SlashCommandProps) {
  const [show, setShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState('');
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const allItems = onAIAction
    ? [
        ...items,
        {
          title: 'AI Continue',
          description: 'Continue writing with AI',
          icon: <Sparkles className='h-4 w-4' />,
          command: () => onAIAction('complete'),
          keywords: ['ai', 'continue', 'complete']
        },
        {
          title: 'AI Rewrite',
          description: 'Rewrite selected text with AI',
          icon: <Sparkles className='h-4 w-4' />,
          command: () => onAIAction('rewrite'),
          keywords: ['ai', 'rewrite', 'improve']
        }
      ]
    : items;

  const filteredItems = allItems.filter((item) => {
    if (!query) return true;
    const searchQuery = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery) ||
      item.keywords?.some((keyword) => keyword.toLowerCase().includes(searchQuery))
    );
  });

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!show) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        event.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        event.stopPropagation();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        if (filteredItems[selectedIndex]) {
          const { selection } = editor.state;
          const { $from } = selection;
          
          // Get the current node (paragraph) start position
          let nodeStart = $from.start();
          let node = $from.node();
          
          // If we're not in a paragraph, find the paragraph node
          if (node.type.name !== 'paragraph') {
            let depth = $from.depth;
            while (depth > 0) {
              const nodeAtDepth = $from.node(depth);
              if (nodeAtDepth.type.name === 'paragraph') {
                nodeStart = $from.start(depth);
                node = nodeAtDepth;
                break;
              }
              depth--;
            }
          } else {
            nodeStart = $from.start();
          }
          
          // Get text from the start of this paragraph to cursor
          const textBeforeCursor = editor.state.doc.textBetween(nodeStart, $from.pos, ' ');
          const match = textBeforeCursor.match(/(?:^|\s)\/(\S*)$/);
          
          if (match) {
            // Calculate the exact position of the slash command
            const slashPos = $from.pos - match[0].length;
            
            // Delete only the slash command text from the current paragraph
            editor.chain().focus().deleteRange({ from: slashPos, to: $from.pos }).run();
          }

          setTimeout(() => {
            filteredItems[selectedIndex].command(editor);
          }, 0);

          setShow(false);
          setQuery('');
          onOpenChange?.(false);
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setShow(false);
        setQuery('');
        onOpenChange?.(false);
        const { selection } = editor.state;
        const { $from } = selection;
        const paragraphStart = $from.start(-1);
        const textBeforeCursor = editor.state.doc.textBetween(paragraphStart, $from.pos, ' ');
        const slashMatch = textBeforeCursor.match(/(?:^|\s)\/(\S*)$/);
        if (slashMatch) {
          const slashPos = $from.pos - slashMatch[0].length;
          editor.chain().focus().deleteRange({ from: slashPos, to: $from.pos }).run();
        }
      }
    },
    [show, selectedIndex, filteredItems, editor, onOpenChange]
  );

  useEffect(() => {
    if (show) {
      document.addEventListener('keydown', handleKeyDown, true);
      return () => document.removeEventListener('keydown', handleKeyDown, true);
    }
  }, [show, handleKeyDown]);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const { selection } = editor.state;
      const { $from } = selection;
      
      try {
        // Get the paragraph node
        const paragraphStart = $from.start(-1);
        
        // Get text from start of paragraph to cursor (use space as separator to handle newlines)
        const textBeforeCursor = editor.state.doc.textBetween(paragraphStart, $from.pos, ' ');
        
        // Check if we have "/" at the start of paragraph or after whitespace
        // This regex matches:
        // - "/" at the very start (^/)
        // - "/" after a space (\s/)
        // Followed by optional non-space characters
        const slashMatch = textBeforeCursor.match(/(?:^|\s)\/(\S*)$/);

        if (slashMatch) {
          const queryText = slashMatch[1] || '';
          setQuery(queryText);
          setShow(true);
          setSelectedIndex(0);
          onOpenChange?.(true);
        } else {
          // Only hide if there's definitely no slash command
          if (!textBeforeCursor.trim().endsWith('/')) {
            setShow(false);
            setQuery('');
            onOpenChange?.(false);
          }
        }
      } catch (error) {
        // Silently fail if there's an error
        setShow(false);
        setQuery('');
        onOpenChange?.(false);
      }
    };

    editor.on('update', handleUpdate);
    editor.on('selectionUpdate', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
      editor.off('selectionUpdate', handleUpdate);
    };
  }, [editor, onOpenChange]);

  if (!show || !editor || filteredItems.length === 0) {
    return null;
  }

  const { selection } = editor.state;
  const { $from } = selection;
  const coords = editor.view.coordsAtPos($from.pos);

  return (
    <div
      className='fixed z-50 w-64 rounded-lg border border-border bg-popover p-1 shadow-lg'
      style={{
        top: `${coords.top + 20}px`,
        left: `${coords.left}px`
      }}
      onMouseDown={(e) => e.preventDefault()}>
      <div className='max-h-80 overflow-y-auto'>
        {filteredItems.map((item, index) => (
          <div
            key={item.title}
            ref={index === selectedIndex ? selectedRef : null}
            className={cn('w-full', index === selectedIndex && 'bg-accent rounded')}>
            <Button
              variant='ghost'
              className={cn('w-full justify-start gap-2 px-2 py-1.5 text-sm h-auto')}
              onClick={() => {
                const { selection } = editor.state;
                const { $from } = selection;
                
                // Get the current node (paragraph) start position
                // We need to find the actual paragraph node, not just the parent
                let nodeStart = $from.start();
                let node = $from.node();
                
                // If we're not in a paragraph, find the paragraph node
                if (node.type.name !== 'paragraph') {
                  // Walk up to find paragraph
                  let depth = $from.depth;
                  while (depth > 0) {
                    const nodeAtDepth = $from.node(depth);
                    if (nodeAtDepth.type.name === 'paragraph') {
                      nodeStart = $from.start(depth);
                      node = nodeAtDepth;
                      break;
                    }
                    depth--;
                  }
                } else {
                  nodeStart = $from.start();
                }
                
                // Get text from the start of this paragraph to cursor
                const textBeforeCursor = editor.state.doc.textBetween(nodeStart, $from.pos, ' ');
                const slashMatch = textBeforeCursor.match(/(?:^|\s)\/(\S*)$/);

                if (slashMatch) {
                  // Calculate the exact position of the slash command
                  const slashPos = $from.pos - slashMatch[0].length;
                  
                  // Delete only the slash command text from the current paragraph
                  editor.chain().focus().deleteRange({ from: slashPos, to: $from.pos }).run();
                }

                // Execute the command after deletion
                setTimeout(() => {
                  item.command(editor);
                }, 0);

                setShow(false);
                setQuery('');
                onOpenChange?.(false);
              }}>
              <span className='text-muted-foreground'>{item.icon}</span>
              <div className='flex flex-col items-start'>
                <span className='font-medium'>{item.title}</span>
                <span className='text-xs text-muted-foreground'>{item.description}</span>
              </div>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main AI Writer Component
// ============================================================================

export interface AIWriterProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  onAIAction?: (action: string, prompt: string) => Promise<string>;
  className?: string;
  minHeight?: string;
}

type AIAction = 'complete' | 'rewrite' | 'expand' | 'shorten' | 'improve' | 'tone';

export function AIWriter({
  content = '',
  onChange,
  placeholder = 'Start writing...',
  onAIAction,
  className,
  minHeight = '400px'
}: AIWriterProps) {
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiSuggestion, setAISuggestion] = useState<string | null>(null);
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const slashCommandOpenRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer'
        }
      }),
      Placeholder.configure({
        placeholder
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to);
      setSelectedText(text);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[200px] px-4 py-3 text-foreground'
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter' && slashCommandOpenRef.current) {
          event.preventDefault();
          return true;
        }
        return false;
      }
    }
  });

  const handleAIAction = useCallback(
    async (action: AIAction) => {
      if (!editor || !onAIAction) return;

      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to);

      if (!selectedText && action !== 'complete') {
        const fullText = editor.getText();
        if (!fullText.trim()) return;
      }

      setIsAILoading(true);
      setSelectedText(selectedText || editor.getText());

      try {
        const prompt = getAIPrompt(action, selectedText || editor.getText());
        const result = await onAIAction(action, prompt);

        if (action === 'complete') {
          editor.chain().focus().insertContent(result).run();
        } else if (selectedText) {
          editor.chain().focus().deleteSelection().insertContent(result).run();
        } else {
          editor.commands.setContent(result);
        }
      } catch (error) {
        console.error('AI action failed:', error);
      } finally {
        setIsAILoading(false);
        setAISuggestion(null);
        setShowAISuggestion(false);
      }
    },
    [editor, onAIAction]
  );

  const getAIPrompt = (action: AIAction, text: string): string => {
    const prompts: Record<AIAction, string> = {
      complete: `Continue writing from: "${text.slice(-100)}"`,
      rewrite: `Rewrite this text to be clearer and more engaging: "${text}"`,
      expand: `Expand this text with more details and examples: "${text}"`,
      shorten: `Make this text more concise while keeping the key points: "${text}"`,
      improve: `Improve this text for better clarity, flow, and impact: "${text}"`,
      tone: `Rewrite this text in a more professional tone: "${text}"`
    };
    return prompts[action];
  };

  const handleFormat = useCallback(
    (format: string) => {
      if (!editor) return;

      switch (format) {
        case 'bold':
          editor.chain().focus().toggleBold().run();
          break;
        case 'italic':
          editor.chain().focus().toggleItalic().run();
          break;
        case 'underline':
          editor.chain().focus().toggleUnderline().run();
          break;
        case 'strike':
          editor.chain().focus().toggleStrike().run();
          break;
        case 'code':
          editor.chain().focus().toggleCode().run();
          break;
        case 'h1':
          editor.chain().focus().toggleHeading({ level: 1 }).run();
          break;
        case 'h2':
          editor.chain().focus().toggleHeading({ level: 2 }).run();
          break;
        case 'h3':
          editor.chain().focus().toggleHeading({ level: 3 }).run();
          break;
        case 'bulletList':
          editor.chain().focus().toggleBulletList().run();
          break;
        case 'orderedList':
          editor.chain().focus().toggleOrderedList().run();
          break;
        case 'link':
          const url = window.prompt('Enter URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
          break;
      }
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  const isActive = (name: string, options?: any) => {
    if (name === 'bold') return editor.isActive('bold');
    if (name === 'italic') return editor.isActive('italic');
    if (name === 'underline') return editor.isActive('underline');
    if (name === 'strike') return editor.isActive('strike');
    if (name === 'code') return editor.isActive('code');
    if (name === 'heading') return editor.isActive('heading', options);
    if (name === 'bulletList') return editor.isActive('bulletList');
    if (name === 'orderedList') return editor.isActive('orderedList');
    return false;
  };

  return (
    <div className={cn('flex flex-col border border-border rounded-lg bg-background overflow-hidden', className)}>
      {/* Toolbar */}
      <div className='flex items-center gap-1 p-2 border-b border-border bg-muted/50 flex-wrap'>
        {/* Formatting Tools */}
        <div className='flex items-center gap-1'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleFormat('bold')}
                className={cn('h-8 w-8 p-0', isActive('bold') && 'bg-accent')}>
                <Bold className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold (Ctrl+B)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleFormat('italic')}
                className={cn('h-8 w-8 p-0', isActive('italic') && 'bg-accent')}>
                <Italic className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic (Ctrl+I)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleFormat('underline')}
                className={cn('h-8 w-8 p-0', isActive('underline') && 'bg-accent')}>
                <UnderlineIcon className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Underline (Ctrl+U)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleFormat('strike')}
                className={cn('h-8 w-8 p-0', isActive('strike') && 'bg-accent')}>
                <Strikethrough className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Strikethrough</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleFormat('code')}
                className={cn('h-8 w-8 p-0', isActive('code') && 'bg-accent')}>
                <Code className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Code</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation='vertical' className='h-6' />

        {/* Headings */}
        <div className='flex items-center gap-1'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleFormat('h1')}
                className={cn('h-8 w-8 p-0', isActive('heading', { level: 1 }) && 'bg-accent')}>
                <Heading1 className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Heading 1</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleFormat('h2')}
                className={cn('h-8 w-8 p-0', isActive('heading', { level: 2 }) && 'bg-accent')}>
                <Heading2 className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Heading 2</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleFormat('h3')}
                className={cn('h-8 w-8 p-0', isActive('heading', { level: 3 }) && 'bg-accent')}>
                <Heading3 className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Heading 3</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation='vertical' className='h-6' />

        {/* Lists */}
        <div className='flex items-center gap-1'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleFormat('bulletList')}
                className={cn('h-8 w-8 p-0', isActive('bulletList') && 'bg-accent')}>
                <List className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleFormat('orderedList')}
                className={cn('h-8 w-8 p-0', isActive('orderedList') && 'bg-accent')}>
                <ListOrdered className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Numbered List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='sm' onClick={() => handleFormat('link')} className='h-8 w-8 p-0'>
                <LinkIcon className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Link</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation='vertical' className='h-6' />

        {/* AI Actions */}
        {onAIAction && (
          <>
            <Popover open={showAISuggestion} onOpenChange={setShowAISuggestion}>
              <PopoverTrigger asChild>
                <Button variant='ghost' size='sm' className='h-8 gap-1.5 text-primary hover:text-primary/80'>
                  <Sparkles className='h-4 w-4' />
                  <span className='text-xs font-medium'>AI</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-64 p-2' align='start'>
                <div className='space-y-1'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start gap-2'
                    onClick={() => handleAIAction('complete')}
                    disabled={isAILoading}>
                    <Wand2 className='h-4 w-4' />
                    Continue Writing
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start gap-2'
                    onClick={() => handleAIAction('rewrite')}
                    disabled={isAILoading || !selectedText}>
                    <ArrowRight className='h-4 w-4' />
                    Rewrite
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start gap-2'
                    onClick={() => handleAIAction('expand')}
                    disabled={isAILoading || !selectedText}>
                    <ArrowRight className='h-4 w-4' />
                    Expand
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start gap-2'
                    onClick={() => handleAIAction('shorten')}
                    disabled={isAILoading || !selectedText}>
                    <ArrowRight className='h-4 w-4' />
                    Shorten
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start gap-2'
                    onClick={() => handleAIAction('improve')}
                    disabled={isAILoading || !selectedText}>
                    <Sparkles className='h-4 w-4' />
                    Improve
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start gap-2'
                    onClick={() => handleAIAction('tone')}
                    disabled={isAILoading || !selectedText}>
                    <Sparkles className='h-4 w-4' />
                    Change Tone
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {isAILoading && (
              <div className='flex items-center gap-2 text-xs text-muted-foreground ml-2'>
                <Loader2 className='h-3 w-3 animate-spin' />
                <span>AI is thinking...</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Editor Content */}
      <div className='flex-1 overflow-auto relative' style={{ minHeight }}>
        {editor && <BubbleMenu editor={editor} onAIAction={onAIAction ? (action) => handleAIAction(action as AIAction) : undefined} />}
        {editor && (
          <SlashCommand
            editor={editor}
            onAIAction={onAIAction ? (action) => handleAIAction(action as AIAction) : undefined}
            onOpenChange={(isOpen) => {
              slashCommandOpenRef.current = isOpen;
            }}
          />
        )}
        <EditorContent editor={editor} />
      </div>

      {/* AI Suggestion Bubble */}
      {aiSuggestion && (
        <div className='border-t border-border bg-muted/50 p-3'>
          <div className='flex items-start justify-between gap-2'>
            <div className='flex-1'>
              <p className='text-xs font-medium mb-1 text-muted-foreground'>AI Suggestion:</p>
              <p className='text-sm'>{aiSuggestion}</p>
            </div>
            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='sm'
                className='h-7 w-7 p-0'
                onClick={() => {
                  if (editor && aiSuggestion) {
                    editor.chain().focus().insertContent(aiSuggestion).run();
                    setAISuggestion(null);
                  }
                }}>
                <Check className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='sm' className='h-7 w-7 p-0' onClick={() => setAISuggestion(null)}>
                <X className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIWriter;
