# Science Island

Educational games for Grade 5 Science (Egyptian curriculum, Languages track, first term). Reesho the parrot is the coach.
Players pick a chapter first; every chapter has its own map, game, questions and Champions board.

- `index.html`: home. Pick the grade, the track (Languages or Arabic) and type a first name
- `chapters.html`: the nine chapters of the term; a chapter opens when it is marked `ready` in `chapters.js`
- `chapters.js`: the chapter list (title, lessons, questions file, game, map picture and stop positions, colours)
- `map.html`: the chosen chapter's map with its stops (game, Chapter Quest, Daily 5, Review, Champions)
- `arm.html`: Arm Mechanic, Chapter 1's game: an interactive arm showing muscles contracting and relaxing
- `quiz.html`: `#quest` (questions on the whole chapter), `#daily` (Daily 5), `#review` (spaced repetition) for the chosen chapter
- `champions.html`: this week's top 10 for the chosen chapter (resets every Saturday)
- `questions.js`: Chapter 1, 23 ideas from the school book (all four lessons 1-1 to 1-4), each with 2-4 phrasings, plus 3 bonus ideas from the Column "The Camel" (`bonus: true`: one comes after the Boss round, never counts for the stars, not in Daily 5). Other chapters get their own file (`questions_ch2.js`, ...)
- `questions_ar.js`: the same ideas (same ids) in Arabic, worded like the Arabic school book, for the Arabic track
- `common.js` / `common.css`: shared player profiles, chapters, XP levels, streaks, sounds, Arabic voice, Champions board
- Visitor statistics: Google Analytics 4, loaded from `common.js` (`GA_ID`); page views and approximate location only, no player names
- `firebase-config.js`: paste the Firebase web config here to make the Champions board online
- `assets/voice/`: Reesho's Arabic voice clips: `ok1`–`ok8`, `bad1`–`bad4`, `streak`, `boss`, `box`, `finish`, `hello`, `level`, `champion` (all `.mp3`; the phrases are listed in `VOICE_TEXT` in `common.js`)

Progress is saved per player on each device, separately for each chapter (XP and the daily streak are shared). Several children can share one device.

## Arabic track
A player who picks **Arabic** on the home page sees every page in Arabic, right to left (the home page stays bilingual).
`common.js` gives `SI.isAr()`, `SI.T(en, ar)` and `SI.chTitle(chapter)`; static HTML carries `data-ar` (text), `data-ar-label` (aria-label/title) and `data-ar-ph` (placeholder).
The Arabic track has its own Champions board (the board key includes the track). A chapter opens for Arabic players only when it has `questionsAr` in `chapters.js`.

## Adding a chapter
1. Write `questions_chN.js` (same format as `questions.js`, sets `window.IDEAS`).
2. Build the chapter's game page; it starts with `SI.requireChapter('chN')` and saves its result in `SI.updateChProf(c => { c.game = {best, stars, plays}; }, 'chN')`.
3. In `chapters.js` fill in `questions`, `game`, `map` (picture + stop positions) and set `ready: true`.
4. For the Arabic track add `questions_chN_ar.js` (same ids) and `questionsAr`, `titleAr`, `game.nameAr`, `game.hintAr` in `chapters.js`; wrap the game page's text in `SI.T()` / `data-ar`.
