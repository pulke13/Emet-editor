EMET EDITOR - phone version (PWA)
=================================

The Android/phone version of your Windows compact text editor.
A "web app" you install to your home screen; works offline; no build credits needed.
Everything you write stays ON THE PHONE (nothing is uploaded).

WHAT IT DOES
  - Tabs: add (+), switch, rename (double-tap the tab name), close (x)
  - Rich text: bold, italic, underline, strikethrough, text color, highlight,
    bigger/smaller text, bullet & numbered lists, align left/center/right,
    clear formatting. (Toolbar scrolls sideways for more buttons.)
  - Insert (the +document button): tables, images, file attachments, audio notes
  - Bookmarks (the ribbon button): mark a line with a color; open the menu >
    "Bookmarks / Navigation" to jump between them
  - Snippets: menu > Snippets. Select text, "Save selection as snippet",
    then tap a snippet later to insert it anywhere
  - Reminders / alarms: menu > Reminders. Set a title + time; it beeps,
    vibrates and shows a notification when the time hits (allow notifications)
  - Hebrew / RTL: the "language" button flips the whole app to Hebrew and
    right-to-left; a document also auto-switches to RTL when you type Hebrew
  - Dark / light theme (moon button)
  - Find & replace (magnifier button)
  - Word / character count in the status bar; A- / A+ to zoom text

SAVING & MOVING YOUR DATA
  - Auto-saves as you type.
  - Menu > "Back up everything" makes one file that includes ALL tabs,
    snippets, reminders AND your images/audio/attachments. Menu > "Restore"
    loads it back (e.g. onto a new phone). You can also export a single tab
    as .html or .txt.

TO SEE IT ON A COMPUTER
  Open a terminal in this folder and run:  python -m http.server 5601
  Then open  http://localhost:5601

TO GET IT ONTO YOUR PHONE (free, no build credits) - same as the dashboard:
  Put this folder in a GitHub repo, turn on Pages (Settings > Pages), open the
  address on your phone, then browser menu > "Add to Home Screen".
  For a real .apk file, paste that address into https://www.pwabuilder.com

NOT INCLUDED (desktop-only, no phone equivalent)
  System tray, always-on-top, minimize-to-tray/auto-hide, single-instance
  window handling, Windows keyboard-layout detection.

STORAGE NOTE
  Text lives in the browser's local storage; images/audio/attachments live in
  the browser's IndexedDB (so large media doesn't fill up the small text quota).
  The backup file bundles both together.
