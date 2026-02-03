# How to Customize Your Valentine Site

**Everything is controlled from one file: `config.js`**  
You never need to edit `index.html`, `styles.css`, or `script.js`.

---

## Quick start (under 5 minutes)

1. **Open `config.js`** in any text editor (Notepad, TextEdit, VS Code, etc.).
2. **Change only the text inside the quotes.**  
   Keep the quotes `"..."` and the commas. Replace the words between the quotes with your own.
3. **Save the file**, then open `index.html` in your browser (double‑click or drag into Chrome, Edge, Safari, etc.).
4. **Add your files to the same folder** as the site:
   - Your photo (e.g. `us.jpeg`) — use the same filename you put in `photoPath`.
   - Your song (e.g. `song.mp3`) — use the same filename you put in `musicPath`.  
   Music is optional; if you don’t add a file, the site still works.

---

## What each part of config.js does

| Section in config.js | What it changes on the site |
|---------------------|-----------------------------|
| **photoPath** | The image file name (e.g. `"us.jpeg"`). Put the image in the same folder as the site. |
| **photoAlt** | Short description of the photo (for accessibility). |
| **photoCaption** | The line above the photo (e.g. “my favorite photo & my favorite person”). |
| **openOverlayText** | The first thing they see, e.g. “Tap to open ❤️”. |
| **introEyebrow** | Small line before the main intro (e.g. “Hey baby…”). |
| **introTitle** | The main intro line (e.g. “I have a very important question for you 💭”). |
| **spellWord** | The word they tap in order in the game. Use capitals and spaces, e.g. `"JOELIE RAE"`. |
| **gameTitle** | Title above the spelling game (e.g. “Pop quiz time 💕”). |
| **gameIntro** | Short line under the title (e.g. “The most beautiful girl there is.”). |
| **gameHint** | Instruction under that (e.g. “Tap the letters in the right order.”). |
| **gameCompleteMessage** | Message when they finish the game (e.g. “That’s you. My beautiful girlfriend 💖”). |
| **questionText** | The big question (e.g. “Joelie Rae, will you be my Valentine? ❤️”). |
| **successTitle** | Heading after they say Yes (e.g. “LET’S GO!!! 💘”). |
| **successSubtitle1** | First line under that. |
| **successSubtitle2** | Second line under that. |
| **letterButtonLabel** | Label on the button that opens the letter (e.g. “A Digital Letter”). |
| **bookTitle** | Title on the “book” cover (same as the button if you like). |
| **noButtonCaption** | The funny line that appears when they keep dodging the No button. |
| **letterTitle** | Heading at the top of your letter (e.g. “A Recognition Spoken in Peace”). |
| **letterParagraphs** | The body of the letter — each `"..."` is one paragraph. You can have as many as you want. |
| **letterSignOff** | The closing line (e.g. “forever yours, nilidon”). You can add the date here — use `<br>` then type the date on the next line (e.g. `"forever yours, nilidon<br>February 1, 2025"`). |
| **musicPath** | Your song file name (e.g. `"song.mp3"`). Put the file in the same folder. Optional. |

---

## Letter formatting (optional)

Inside any **letter paragraph** you can use:

- **New line:** type `<br>` where you want a line break.  
  Example: `"First line.<br>Second line."`
- **Bold:** wrap the words in `<strong>` and `</strong>`.  
  Example: `"<strong>I promise to always choose you</strong>"`

You can combine them in one paragraph. `<br>` also works in **letterSignOff** (e.g. to put the date on the next line). Don’t use these in other parts of the config (e.g. not in titles or button labels).

---

## Rules to avoid errors

- **Keep the quotes.** Every value must stay inside `"..."`. Don’t remove the quotes or the commas at the end of lines.
- **Don’t break the structure.** Don’t delete lines like `photoPath:` or `letterParagraphs: [` or the closing `};`.
- **Spell Word:** Use ALL CAPS and spaces as you want them to appear (e.g. `"JOELIE RAE"`). This is the word they spell in the game.
- **File names:** `photoPath` and `musicPath` must match the exact file names in the folder (including `.jpeg`, `.mp3`, etc.).

---

## If something doesn’t work

- **Photo or music not showing:** Check that the file is in the **same folder** as `index.html` and that the name in config (e.g. `"us.jpeg"`) matches the file name exactly, including capitals.
- **Page looks broken:** Make sure you didn’t delete a quote `"` or a comma. Compare with a fresh copy of `config.js` if you have one.
- **Changes not showing:** Save `config.js` and refresh the browser (F5 or Ctrl+R / Cmd+R).

---

## Files you should not edit

| File | Why |
|------|-----|
| `index.html` | Page structure — changing it can break the site. |
| `styles.css` | Design and layout — changing it can break the look. |
| `script.js` | Behavior and logic — changing it can break features. |

All of your personal text, photo, music, and letter content are controlled only from **config.js**.
