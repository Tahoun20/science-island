# Science Island

Educational games for Grade 5 Science (Egyptian curriculum), Chapter 1: Bones and Muscles. Koko the parrot is the coach.

- `index.html`: home. Pick the grade, the track (Languages now, Arabic soon) and type a first name
- `map.html`: island map with five stops
- `arm.html`: Arm Mechanic, an interactive arm showing muscles contracting and relaxing
- `quiz.html`: `#quest` (20 questions on the whole chapter), `#daily` (Daily 5), `#review` (spaced repetition)
- `champions.html`: this week's top 10 (resets every Saturday)
- `questions.js`: 20 ideas from the school book, each with 2-3 phrasings
- `common.js` / `common.css`: shared player profiles, XP levels, streaks, sounds, Arabic voice, Champions board
- Visitor statistics: Google Analytics 4, loaded from `common.js` (`GA_ID`); page views and approximate location only, no player names
- `firebase-config.js`: paste the Firebase web config here to make the Champions board online
- `assets/voice/`: Koko's Arabic voice clips: `ok1`–`ok8`, `bad1`–`bad4`, `streak`, `boss`, `box`, `finish`, `hello`, `level`, `champion` (all `.mp3`; the phrases are listed in `VOICE_TEXT` in `common.js`)

Progress is saved per player on each device. Several children can share one device.
