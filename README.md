# Science Island

Educational games for Grade 5 Science (Egyptian curriculum, Languages track, first term). Reesho the parrot is the coach.
Players pick a chapter first; every chapter has its own map, game, questions and Champions board.

- `index.html`: home. Pick the grade, the track (Languages or Arabic) and type a first name
- `chapters.html`: the nine chapters of the term; a chapter opens when it is marked `ready` in `chapters.js`
- `chapters.js`: the chapter list (title, lessons, questions file, game, map picture and stop positions, colours)
- `map.html`: the chosen chapter's map with its stops (game, Chapter Quest, Daily 5, Review, Champions)
- `arm.html`: Arm Mechanic, Chapter 1's game: an interactive arm showing muscles contracting and relaxing
- `seasons.html`: Season Explorer, Chapter 2's game: the player moves through a year and watches a luffa plant and a lizard change with the temperature (3 stages: Warm Up, Missions, Speed Round "high or low temperature?")
- `quiz.html`: `#quest` (questions on the whole chapter), `#daily` (Daily 5), `#review` (spaced repetition) for the chosen chapter
- `champions.html`: this week's top 10 for the chosen chapter (resets every Saturday)
- `questions.js`: Chapter 1, 23 ideas from the school book (all four lessons 1-1 to 1-4), each with 2-4 phrasings, plus 3 bonus ideas from the Column "The Camel" (`bonus: true`: one comes after the Boss round, never counts for the stars, not in Daily 5). Other chapters get their own file (`questions_ch2.js`, ...)
- `questions_ar.js`: the same ideas (same ids) in Arabic, worded like the Arabic school book, for the Arabic track
- `questions_ch2.js` / `questions_ch2_ar.js`: Chapter 2 "Changes in the Seasons", 15 ideas from the school book (lessons 2-1 and 2-2, pages 20-25) plus 3 bonus ideas from the Column "Desert Wisdom" (pages 26-27)
- `ch2_art.js`: Chapter 2's drawings made in code (the luffa through the year, the lizard, the rock scene). The game uses them, and so do the chapter's tap pictures (`plantYear`, `lizardSummer`, `lizardWinter`)
- `assets/map_ch2.svg`, `assets/bg_ch2.svg`: Chapter 2's map and page background, drawn by `tools/make_ch2_map.js` (run `node tools/make_ch2_map.js` after changing it)
- `common.js` / `common.css`: shared player profiles, chapters, XP levels, streaks, sounds, Arabic voice, Champions board
- Visitor statistics: Google Analytics 4, loaded from `common.js` (`GA_ID`); page views and approximate location only, no player names
- `firebase-config.js`: paste the Firebase web config here to make the Champions board online
- `assets/voice/`: Reesho's Arabic voice clips: `ok1`–`ok8`, `bad1`–`bad4`, `streak`, `boss`, `box`, `finish`, `hello`, `level`, `champion` (all `.mp3`; the phrases are listed in `VOICE_TEXT` in `common.js`)

Progress is saved per player on each device, separately for each chapter (XP and the daily streak are shared). Several children can share one device.

## Boy or girl, hello and goodbye
- New players pick boy or girl (`players[id].g = 'm' | 'f'`); older players are asked once when they tap their name.
- `SI.G(boy, girl)` picks the Arabic wording; `SI.voice(kind)` plays `<id>_f.mp3` for girls when the phrase has a girl version (silent until that file exists, never the boy's phrase).
- `SI.visit()` → intro (first time), hello (same day), back (yesterday), miss (2-6 days), missbig (7+ days); `SI.greet()` shows Reesho's welcome after the name is tapped.
- `SI.bye()` (👋 button on chapters and map): browsers cannot talk when a tab closes, so goodbye is a button.

## Releasing an update (cache stamp)
Every page loads the shared files with a stamp, e.g. `common.js?v=20261010c`. On each release change the stamp in all pages
(one search-and-replace of the old stamp). Without it, phones may keep an old cached `common.js` next to new pages and the site breaks.

## Owner tools
- `admin.html`: the owner's page (not linked from the game). Google sign-in; only the owner's account passes (same Firestore rule as reviews.html: reading `feedback`). "آخر التعديلات" lists recent changes from `changes.js` with direct links; below it every question of a chapter in English and Arabic side by side. New and changed phrasings are marked on this device (it remembers what you have already seen; "علّمت الكل كمتشاف" resets the marks).
- `quiz.html#preview`: every phrasing one by one, nothing saved. Opens only on a device where the owner signed in on admin.html in the last 30 days (otherwise it is the normal Quest). `quiz.html#preview=B6.2&lang=ar` opens one phrasing in Arabic (`lang=en` for English).
- `arm.html#stage2` / `#stage3`: jump straight to a stage of Arm Mechanic (`seasons.html#stage2` / `#stage3` for Season Explorer).
- After each change, add a line to `changes.js`.

## Arabic track
A player who picks **Arabic** on the home page sees every page in Arabic, right to left (the home page stays bilingual).
`common.js` gives `SI.isAr()`, `SI.T(en, ar)` and `SI.chTitle(chapter)`; static HTML carries `data-ar` (text), `data-ar-label` (aria-label/title) and `data-ar-ph` (placeholder).
The Arabic track has its own Champions board (the board key includes the track). A chapter opens for Arabic players only when it has `questionsAr` in `chapters.js`.

## Adding a chapter
1. Write `questions_chN.js` (same format as `questions.js`, sets `window.IDEAS`).
2. Build the chapter's game page; it starts with `SI.requireChapter('chN')` and saves its result in `SI.updateChProf(c => { c.game = {best, stars, plays}; }, 'chN')`.
3. In `chapters.js` fill in `questions`, `game`, `map` (picture + stop positions) and set `ready: true`.
   If the chapter has its own tap pictures, put them in a drawings file that adds them to `window.CH_DIAGRAMS` and name it in `art` (see `ch2_art.js`).
4. For the Arabic track add `questions_chN_ar.js` (same ids) and `questionsAr`, `titleAr`, `game.nameAr`, `game.hintAr` in `chapters.js`; wrap the game page's text in `SI.T()` / `data-ar`.
