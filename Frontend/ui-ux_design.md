# UI/UX Design Specifications
## Notion-Style Workspace

---

## 🎨 Color Palette

### Primary Colors
- **Primary:** `#5d7d2e` (Green)
- **Secondary:** `#1976D2` (Blue)

### Background & Surface
- **Background:** `#FAFAFA`
- **Cards:** `#FFFFFF`

### Text Colors
- **Primary Text:** `#1A1A1A`
- **Muted Text:** `#6B7280`
- **Border:** `#E5E7EB`

---

## 📖 Typography

### Font Families
- **Primary:** Inter (body text)
- **Code:** JetBrains Mono (code blocks)

### Font Sizes
- **Headings:** 24px / 20px / 16px
- **Body:** 14px
- **Code:** 13px

---

## 📏 Spacing System

### Base Units
- **Base unit:** 4px
- **Container padding:** 16px / 24px / 32px
- **Grid system:** 8px

---

## 🎯 UI Patterns

### Core Components
- Sidebar navigation
- Block-based editor
- Hover actions
- Drag handles
- Command palette (/)

### Icon System
- **Library:** Lucide React
- **Sizes:** 16px / 20px

---

## 📚 References

### Design Inspiration
- [Notion.so](https://notion.so) - Interface patterns
- [Linear](https://linear.app) - Design system

### Documentation
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility classes
- [Lucide](https://lucide.dev) - Icon library

---

## 🛠️ Implementation Notes

### CSS Variables
```css
:root {
  --primary: #2E7D32;
  --secondary: #1976D2;
  --background: #FAFAFA;
  --card: #FFFFFF;
  --text-primary: #1A1A1A;
  --text-muted: #6B7280;
  --border: #E5E7EB;
}
```

### Tailwind Config
```javascript
// Key color mappings for Tailwind CSS
primary: '#2E7D32',
secondary: '#1976D2',
background: '#FAFAFA'
```