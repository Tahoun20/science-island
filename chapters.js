/* Science Island · chapter list for Grade 5 Science, first term (Languages track).
   A chapter opens for players when `ready` is true. To publish a new chapter, fill in:
     titleAr   : the chapter title in the Arabic school book (Arabic track)
     questions : file with that chapter's window.IDEAS (for example 'questions_ch2.js')
     questionsAr : the same questions in Arabic for the Arabic track (for example 'questions_ch2_ar.js')
                   A chapter opens for Arabic-track players only when it has questionsAr.
     game      : the chapter's own interactive game { href, name, nameAr, icon, hint, hintAr }
     map       : { img, stops } - stop positions in percent of the picture, in this order:
                 game, Chapter Quest, Daily 5, Review, Champions  ->  [x, y, label side]
     art       : optional script with the chapter's own drawings; it adds the tap pictures of its questions
                 to window.CH_DIAGRAMS (for example 'ch2_art.js') and is loaded before the questions
     cover     : optional picture for the chapter card (otherwise the icon is shown)
     quizBg    : optional background picture for the question pages
     theme     : optional colours, for example { primary:'#2f8f5b', 'primary-d':'#237047' }
   Lesson names follow the school book. */
window.CHAPTERS = [
  { id: 'ch1', n: 1, title: 'Bones and Muscles', titleAr: 'العظام والعضلات', icon: '🦴', tint: '#dff1f8', ready: true,
    lessons: ['Bones and Muscles', 'Structure of Bones', 'Whole Body Skeleton', 'Animal Bodies'],
    lessonsAr: ['العظام والعضلات', 'تركيب العظام', 'الهيكل العظمي الكامل للجسم', 'أجسام الحيوانات'],
    questions: 'questions.js', questionsAr: 'questions_ar.js',
    game: { href: 'arm.html', name: 'Arm Mechanic', nameAr: 'ميكانيكي الذراع', icon: '🦾', hint: 'See how your muscles pull your bones!', hintAr: 'شوف إزاي عضلاتك بتشد عظامك!' },
    map: { img: 'assets/map_island.jpg', stops: [[59.6, 82.9, 'left'], [54.6, 67.1, 'right'], [41.3, 51.4, 'right'], [39.6, 38.1, 'left'], [68.2, 12.5, 'below']] },
    cover: 'assets/map_island.jpg', quizBg: 'assets/bg_park.jpg' },

  { id: 'ch2', n: 2, title: 'Changes in the Seasons', titleAr: 'التغيرات في الفصول', icon: '🍂', tint: '#fdebd3', ready: true,
    lessons: ['Changes over a Year', 'Animals and Temperature'],
    lessonsAr: ['التغيرات خلال السنة', 'الحيوانات ودرجة الحرارة'],
    questions: 'questions_ch2.js', questionsAr: 'questions_ch2_ar.js', art: 'ch2_art.js',
    game: { href: 'seasons.html', name: 'Season Explorer', nameAr: 'مستكشف الفصول', icon: '🌡️', hint: 'Travel through the year and see what the temperature changes!', hintAr: 'رحلة خلال السنة: درجة الحرارة بتغيّر إيه؟' },
    map: { img: 'assets/map_ch2.svg', stops: [[30, 82, 'right'], [63, 68, 'left'], [36, 51, 'right'], [65, 37, 'left'], [44, 14, 'below']] },
    cover: 'assets/map_ch2.svg', quizBg: 'assets/bg_ch2.svg' },

  { id: 'ch3', n: 3, title: 'Conditions for Germination', titleAr: 'شروط الإنبات', icon: '🌱', tint: '#e2f4dc', ready: false,
    lessons: ['Inside the Seed', 'Water and Germination', 'Air and Germination', 'Temperature and Germination', 'Summary of Germination'] },

  { id: 'ch4', n: 4, title: 'Conditions for Growth', titleAr: 'شروط النمو', icon: '🌿', tint: '#d9f2e4', ready: false,
    lessons: ['Sunlight and Growth', 'Fertilizer and Growth'] },

  { id: 'ch5', n: 5, title: 'From Flower to Fruit', titleAr: 'من الزهرة إلى الثمرة', icon: '🌼', tint: '#fdf3c9', ready: false,
    lessons: ['Structure of a Luffa Flower', 'How to Use a Microscope', 'Pollination and How Fruits Grow'] },

  { id: 'ch6', n: 6, title: 'Human Growth and Reproduction', titleAr: 'نمو الإنسان وتكاثره', icon: '🧒', tint: '#fde3dc', ready: false,
    lessons: ['Stages of Human Growth', 'Similarities between Parents and Children', 'Conditions for Healthy Growth'] },

  { id: 'ch7', n: 7, title: 'Animal Growth and Reproduction', titleAr: 'نمو الحيوانات وتكاثرها', icon: '🐣', tint: '#fff0cf', ready: false,
    lessons: ['Animals that Give Birth', 'Animals that Lay Eggs', 'Comparing Animals and Preserving the Species'] },

  { id: 'ch8', n: 8, title: 'Changes in Weather', titleAr: 'تغيرات الطقس', icon: '⛅', tint: '#e3ecfb', ready: false,
    lessons: ['Clouds and Weather', 'Clouds Movement', 'Weather Forecast'] },

  { id: 'ch9', n: 9, title: 'Water Cycle', titleAr: 'دورة الماء', icon: '💧', tint: '#d8eefb', ready: false,
    lessons: ['Water Evaporation', 'Water in the Air', 'Where Does Water Go?'] }
];
