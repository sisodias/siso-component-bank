import React, { useState } from 'react';

export const Component = () => {
  const [activeTab, setActiveTab] = useState('Notes');
  const [selectedNoteId, setSelectedNoteId] = useState(1);
  const [title, setTitle] = useState('Architecture Research');
  const [content, setContent] = useState(`The project explores the intersection of digital archives and physical layout systems.

1. Layout Physics
The interface relies on a strict separation of concerns, mimicking a filing cabinet. The tabs at the top provide context switching without losing the sense of permanence.

2. Visual DNA
- Colors: Monochromatic warm greys with high contrast black ink.
- Typography: Functional, grotesque sans-serif.
- Shapes: Softened geometric forms, specifically the tab shape.

To Do:
- [ ] Finalize color contrast ratios
- [ ] Export SVG assets for the folder tabs
- [ ] Review mobile responsiveness logic

Reference material includes early 20th-century Dutch design manuals and industrial filing systems.`);

  const notes = [
    {
      id: 1,
      time: '10:42 AM',
      title: 'Architecture Research',
      preview: 'Notes on the brutalist movement and its impact on modern web design.',
    },
    {
      id: 2,
      time: 'Yesterday',
      title: 'Meeting: Cirkel Sector',
      preview: 'Discuss timeline for the archival project launch. Key stakeholders...',
    },
    {
      id: 3,
      time: 'Oct 24',
      title: 'Material Palette',
      preview: 'Concrete, raw steel, unbleached paper. Need to source textures.',
    },
    {
      id: 4,
      time: 'Oct 22',
      title: 'Typography System',
      preview: 'Exploring monospace pairings for the header sections.',
    },
  ];

  const tabs = ['Notes', 'Projects', 'Archive'];

  const styles = {
    body: {
      backgroundColor: '#D8E6F3',
      color: '#111111',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      WebkitFontSmoothing: 'antialiased',
    },
    appWindow: {
      width: '95vw',
      height: '90vh',
      maxWidth: '1400px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    tabsContainer: {
      display: 'flex',
      alignItems: 'flex-end',
      paddingLeft: '20px',
      height: '48px',
      position: 'relative',
      zIndex: 10,
    },
    tab: (isActive: boolean, index: number) => ({
      padding: isActive ? '12px 32px' : '12px 32px 10px',
      fontSize: '14px',
      fontWeight: isActive ? 600 : 500,
      letterSpacing: '0.02em',
      color: '#111111',
      backgroundColor: isActive ? '#EAEAE6' : index === 1 ? '#CED7DE' : '#94A3B0',
      borderRadius: '12px 12px 0 0',
      marginRight: '-12px',
      cursor: 'pointer',
      position: 'relative',
      boxShadow: '-1px 0 0 rgba(0,0,0,0.05)',
      clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)',
      minWidth: '140px',
      textAlign: 'center',
      zIndex: isActive ? 3 : index === 1 ? 2 : 1,
    }),
    appBody: {
      backgroundColor: '#EAEAE6',
      flex: 1,
      borderRadius: '12px',
      borderTopLeftRadius: 0,
      position: 'relative',
      zIndex: 5,
      display: 'flex',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    },
    sidebar: {
      width: '320px',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #000000',
      backgroundColor: '#EAEAE6',
    },
    sidebarHeader: {
      padding: '24px',
      borderBottom: '1px solid #000000',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sidebarTitle: {
      fontSize: '18px',
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    iconBtn: {
      width: '28px',
      height: '28px',
      border: '1px solid transparent',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    },
    noteList: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px 0',
    },
    noteItem: (isSelected: boolean) => ({
      padding: '16px 24px',
      cursor: 'pointer',
      borderLeft: `3px solid ${isSelected ? '#111111' : 'transparent'}`,
      backgroundColor: isSelected ? 'rgba(0,0,0,0.05)' : 'transparent',
      transition: 'background 0.15s',
    }),
    noteMeta: {
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: '#555555',
      marginBottom: '4px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    noteTitle: {
      fontSize: '15px',
      fontWeight: 500,
      marginBottom: '4px',
      color: '#111111',
    },
    notePreview: {
      fontSize: '13px',
      color: '#555555',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineHeight: 1.4,
    },
    mainEditor: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      backgroundColor: '#EAEAE6',
    },
    editorHeader: {
      padding: '32px 32px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    editorMeta: {
      fontSize: '13px',
      color: '#555555',
      marginBottom: '8px',
    },
    editorTitleInput: {
      width: '100%',
      fontSize: '32px',
      fontWeight: 400,
      color: '#111111',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      letterSpacing: '-0.01em',
    },
    editorContent: {
      flex: 1,
      padding: '0 32px 32px',
      overflowY: 'auto',
      maxWidth: '800px',
    },
    editorTextarea: {
      width: '100%',
      height: '100%',
      border: 'none',
      resize: 'none',
      background: 'transparent',
      outline: 'none',
      fontSize: '16px',
      lineHeight: 1.6,
      color: '#111111',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.appWindow}>
        <div style={styles.tabsContainer}>
          {tabs.map((tab, index) => (
            <div
              key={tab}
              style={styles.tab(activeTab === tab, index)}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div style={styles.appBody}>
          <div style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
              <div style={styles.sidebarTitle}>All Notes</div>
              <div style={styles.iconBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
            </div>

            <div style={styles.noteList}>
              {notes.map((note) => (
                <div
                  key={note.id}
                  style={styles.noteItem(selectedNoteId === note.id)}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setTitle(note.title);
                  }}
                >
                  <div style={styles.noteMeta}>
                    <span>{note.time}</span>
                  </div>
                  <div style={styles.noteTitle}>{note.title}</div>
                  <div style={styles.notePreview}>{note.preview}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.mainEditor}>
            <div style={styles.editorHeader}>
              <div style={{ flex: 1 }}>
                <div style={styles.editorMeta}>Last edited today at 10:42 AM</div>
                <input
                  type="text"
                  style={styles.editorTitleInput}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div style={{ fontSize: '24px', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
              </div>
            </div>

            <div style={styles.editorContent}>
              <textarea
                style={styles.editorTextarea}
                spellCheck={false}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

