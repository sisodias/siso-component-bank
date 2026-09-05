'use client';

import React from 'react';
import {
  Autocomplete,
  Button,
  GridLayout,
  Group,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  SearchField as AriaSearchField,
  Select,
  SelectValue,
  Size,
  Virtualizer,
  useFilter,
  type SearchFieldProps as AriaSearchFieldProps,
  type ValidationResult
} from 'react-aria-components';
import { Smile, Search, X } from 'lucide-react';
import { CompactEmoji } from 'emojibase';

// ====== 50 эмодзи ======
const emojisRaw: CompactEmoji[] = [
  { label: 'grinning face', unicode: '😀', tags: ['smile', 'happy'] },
  { label: 'grinning face with big eyes', unicode: '😃', tags: ['smile', 'happy'] },
  { label: 'grinning face with smiling eyes', unicode: '😄', tags: ['smile', 'happy'] },
  { label: 'beaming face with smiling eyes', unicode: '😁', tags: ['smile', 'happy'] },
  { label: 'grinning squinting face', unicode: '😆', tags: ['lol'] },
  { label: 'grinning face with sweat', unicode: '😅', tags: ['awkward'] },
  { label: 'face with tears of joy', unicode: '😂', tags: ['lol', 'funny'] },
  { label: 'rolling on the floor laughing', unicode: '🤣', tags: ['lol', 'funny'] },
  { label: 'slightly smiling face', unicode: '🙂', tags: ['smile'] },
  { label: 'upside-down face', unicode: '🙃', tags: ['sarcasm'] },
  { label: 'winking face', unicode: '😉', tags: ['wink'] },
  { label: 'smiling face with smiling eyes', unicode: '😊', tags: ['happy'] },
  { label: 'smiling face with halo', unicode: '😇', tags: ['angel'] },
  { label: 'smiling face with hearts', unicode: '🥰', tags: ['love'] },
  { label: 'smiling face with heart-eyes', unicode: '😍', tags: ['love'] },
  { label: 'star-struck', unicode: '🤩', tags: ['amazed'] },
  { label: 'face blowing a kiss', unicode: '😘', tags: ['kiss'] },
  { label: 'kissing face', unicode: '😗', tags: ['kiss'] },
  { label: 'kissing face with smiling eyes', unicode: '😙', tags: ['kiss'] },
  { label: 'kissing face with closed eyes', unicode: '😚', tags: ['kiss'] },
  { label: 'smiling face', unicode: '☺️', tags: ['smile'] },
  { label: 'face savoring food', unicode: '😋', tags: ['yum'] },
  { label: 'face with tongue', unicode: '😛', tags: ['playful'] },
  { label: 'winking face with tongue', unicode: '😜', tags: ['playful'] },
  { label: 'zany face', unicode: '🤪', tags: ['crazy'] },
  { label: 'squinting face with tongue', unicode: '😝', tags: ['playful'] },
  { label: 'money-mouth face', unicode: '🤑', tags: ['rich'] },
  { label: 'hugging face', unicode: '🤗', tags: ['hug'] },
  { label: 'face with hand over mouth', unicode: '🤭', tags: ['oops'] },
  { label: 'shushing face', unicode: '🤫', tags: ['quiet'] },
  { label: 'thinking face', unicode: '🤔', tags: ['hmm'] },
  { label: 'zipper-mouth face', unicode: '🤐', tags: ['secret'] },
  { label: 'face with raised eyebrow', unicode: '🤨', tags: ['suspicious'] },
  { label: 'neutral face', unicode: '😐', tags: ['meh'] },
  { label: 'expressionless face', unicode: '😑', tags: ['blank'] },
  { label: 'smirking face', unicode: '😏', tags: ['smirk'] },
  { label: 'unamused face', unicode: '😒', tags: ['annoyed'] },
  { label: 'face with rolling eyes', unicode: '🙄', tags: ['eyeroll'] },
  { label: 'grimacing face', unicode: '😬', tags: ['awkward'] },
  { label: 'lying face', unicode: '🤥', tags: ['lie'] },
  { label: 'relieved face', unicode: '😌', tags: ['relieved'] },
  { label: 'pensive face', unicode: '😔', tags: ['sad'] },
  { label: 'sleepy face', unicode: '😪', tags: ['tired'] },
  { label: 'drooling face', unicode: '🤤', tags: ['yum'] },
  { label: 'sleeping face', unicode: '😴', tags: ['sleep'] },
  { label: 'face with medical mask', unicode: '😷', tags: ['sick'] },
  { label: 'face with thermometer', unicode: '🤒', tags: ['sick'] },
  { label: 'face with head-bandage', unicode: '🤕', tags: ['injured'] },
  { label: 'nauseated face', unicode: '🤢', tags: ['sick'] },
  { label: 'face vomiting', unicode: '🤮', tags: ['sick'] },
];

// ====== Стили ======
const styles = `
.emoji-picker { display: inline-flex; }

/* Кнопка-превью: фиксированный размер и центрирование */
.emoji-picker > button {
  width: 48px;
  height: 48px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

/* Контейнер поповера и сетка */
.emoji-picker-popover {
  padding: 12px;
  width: 320px;
  max-height: 360px;
  overflow: hidden;
  display: grid;
  gap: 12px;
}

.emoji-cell {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  font-size: 28px;
  cursor: pointer;
  border-radius: 8px;
}
.emoji-cell[data-hovered] { background: rgba(0,0,0,0.06); }
.emoji-cell[data-pressed] { background: rgba(0,0,0,0.12); }

/* Поисковое поле */
.react-aria-SearchField { display: flex; align-items: center; }
.react-aria-Group {
  display: flex; align-items: center; gap: 8px; padding: 0 8px;
  width: 100%; height: 36px; border: 1px solid #ccc; border-radius: 9999px;
}
.react-aria-Input { flex: 1; border: none; background: none; outline: none; }
.react-aria-Button { border: none; background: #aaa; color: #fff; border-radius: 9999px; }
.react-aria-Button[data-pressed] { background: #888; }
.react-aria-SearchField[data-empty] .react-aria-Button { display: none; }
.react-aria-FieldError { font-size: 12px; color: red; }

/* Размер выбранного эмодзи в превью */
.emoji-preview {
  display: block;
  font-size: 32px;   /* меняй это значение как хочешь */
  line-height: 1;    /* чтобы не было вертикального смещения */
}
`;

interface SearchFieldProps extends AriaSearchFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
}

function SearchField({ label, description, errorMessage, placeholder, ...props }: SearchFieldProps) {
  return (
    <AriaSearchField {...props} className="react-aria-SearchField">
      {label && <Label>{label}</Label>}
      <Group role="presentation" className="react-aria-Group">
        <Search size={14} />
        <Input placeholder={placeholder} className="react-aria-Input" />
        <Button className="react-aria-Button" aria-label="Clear search">
          <X size={14} />
        </Button>
      </Group>
      {description && <span slot="description">{description}</span>}
      {errorMessage && (
        <span slot="errorMessage" className="react-aria-FieldError">
          {typeof errorMessage === 'function'
            ? errorMessage({} as ValidationResult)
            : errorMessage}
        </span>
      )}
    </AriaSearchField>
  );
}

export default function EmojiPicker() {
  const { contains } = useFilter({ sensitivity: 'base' });
  const emojis = emojisRaw.filter((e) => !e.label.startsWith('regional indicator'));

  return (
    <>
      <style>{styles}</style>
      <Select aria-label="Emoji" className="emoji-picker">
        <Button>
          <SelectValue>
            {({ isPlaceholder, defaultChildren }) => (
              // Всегда одна и та же обёртка — гарантирует одинаковое центрирование
              <span className="emoji-preview">
                {isPlaceholder ? <Smile size={28} /> : defaultChildren}
              </span>
            )}
          </SelectValue>
        </Button>

        <Popover>
          <Autocomplete filter={contains}>
            <div className="emoji-picker-popover">
              <SearchField aria-label="Search" autoFocus placeholder="Search emoji…" />
              <Virtualizer
                layout={GridLayout}
                layoutOptions={{
                  minItemSize: new Size(48, 48),
                  maxItemSize: new Size(48, 48),
                  minSpace: new Size(8, 8),
                  preserveAspectRatio: true,
                }}
              >
                <ListBox items={emojis} aria-label="Emoji list" layout="grid">
                  {(item) => (
                    <ListBoxItem
                      id={item.unicode}
                      value={item}
                      textValue={item.label + ' ' + (item.tags || []).join(' ')}
                      className="emoji-cell"
                    >
                      {item.unicode}
                    </ListBoxItem>
                  )}
                </ListBox>
              </Virtualizer>
            </div>
          </Autocomplete>
        </Popover>
      </Select>
    </>
  );
}
