# FuturisticFileUploader

## What it is
A cyberpunk-themed file uploader with drag-and-drop, multi-file support, simulated upload progress, and file preview generation.

## What it's used for
- Drag-and-drop file uploads with visual feedback
- Multi-file selection with progress tracking
- Image previews for image files
- File type icons for non-image files
- Expand/collapse upload panel

## Props
None — self-contained component with internal state management.

## Notes
- Uses `styled-jsx` for custom CSS animations (pulse, scrollbar)
- Simulates upload progress with `setInterval`
- Revokes object URLs on removal to prevent memory leaks
- Depends on: `lucide-react` icons, `@/lib/utils` (cn function)

## Source
21st.dev