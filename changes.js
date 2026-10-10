/* What changed on the site, newest first. Shown on admin.html under "آخر التعديلات".
   Each item: text (Arabic), and optional links [{label, href}] that open the change directly.
   Preview links: quiz.html#preview=ID.n&lang=ar|en  ·  game stages: arm.html#stage2 / #stage3 */
window.CHANGES = [
  { date: '2026-10-10', title: 'ريشو بيكلم الولد والبنت صح، وبيرحّب ويودّع',
    items: [
      { text: 'سؤال «ولد ولا بنت؟» عند تسجيل لاعب جديد، واللاعب القديم بيتسأل مرة واحدة لما يدوس على اسمه.', links: [{ label: 'الصفحة الرئيسية', href: 'index.html' }] },
      { text: 'كلام ريشو بالعربي بقى بيتغيّر حسب الولد والبنت (يا بطل / يا بطلة، جرّب / جرّبي…).' },
      { text: 'ترحيب بعد ما الطالب يختار اسمه: تعريف بريشو أول مرة، و«أهلًا بيك تاني»، و«وحشتني» بعد كام يوم، وترحيب كبير بعد أسبوع.' },
      { text: 'زرار 👋 في صفحة الفصول والخريطة: ريشو يودّع الطالب ويشجعه يرجع بكرة.' },
      { text: 'جمل صوت جديدة محتاجة تتسجّل (القائمة في ملف reesho-voice-clips.txt). لحد ما تتسجّل الكلام بيظهر مكتوب بس من غير صوت.' }
    ] },
  { date: '2026-10-10', title: 'أداة المعاينة وصفحة الأدمن',
    items: [
      { text: 'صفحة الأدمن دي بتفتح بحساب جوجل بتاع صاحب الموقع بس: آخر التعديلات، وكل الأسئلة بالعربي والإنجليزي جنب بعض، والجديد والمعدّل بيتعلّم لوحده.' },
      { text: 'معاينة أي سؤال من غير ما تلعب من الأول (بتشتغل بعد الدخول هنا، لمدة ٣٠ يوم على نفس الجهاز).', links: [{ label: 'افتح المعاينة', href: 'quiz.html#preview' }] },
      { text: 'لعبة الذراع تفتح من المرحلة ٢ أو ٣ على طول.', links: [{ label: 'المرحلة ٢', href: 'arm.html#stage2' }, { label: 'المرحلة ٣', href: 'arm.html#stage3' }] }
    ] },
  { date: '2026-10-10', title: 'تغطية الفصل الأول كاملة + أسئلة الجمل',
    items: [
      { text: 'مفاصل الرجل: الخصر والركبتان والكاحلان (B7.4).', links: [{ label: 'عربي', href: 'quiz.html#preview=B7.4&lang=ar' }, { label: 'English', href: 'quiz.html#preview=B7.4&lang=en' }] },
      { text: 'الضلوع تحمي القلب والرئتين (S4.4).', links: [{ label: 'عربي', href: 'quiz.html#preview=S4.4&lang=ar' }, { label: 'English', href: 'quiz.html#preview=S4.4&lang=en' }] },
      { text: 'المس ظهرك: العمود الفقري (S5.4).', links: [{ label: 'عربي', href: 'quiz.html#preview=S5.4&lang=ar' }, { label: 'English', href: 'quiz.html#preview=S5.4&lang=en' }] },
      { text: 'أسئلة إضافية من العمود الإثرائي «الجمل» (C1–C3)، سؤال واحد منها بعد التحدي الكبير.', links: [{ label: 'عربي', href: 'quiz.html#preview=C1.1&lang=ar' }, { label: 'English', href: 'quiz.html#preview=C1.1&lang=en' }] }
    ] },
  { date: '2026-10-10', title: 'الهوية الجديدة',
    items: [
      { text: 'اسم الموقع «متفوّق» وجملة «يلا نكتشفها سوا!» في الصفحة الرئيسية، والبغبغان اسمه «ريشو».', links: [{ label: 'الصفحة الرئيسية', href: 'index.html' }] }
    ] },
  { date: '2026-10-10', title: 'العلوم بالعربي (الفصل الأول)',
    items: [
      { text: 'مسار «عربي»: الموقع كله بالعربي ومن اليمين للشمال، وأسئلة الفصل الأول بلغة كتاب الوزارة العربي.', links: [{ label: 'كل الأسئلة بالعربي', href: 'quiz.html#preview&lang=ar' }] },
      { text: 'درس ١-٤ «أجسام الحيوانات» اتضاف للنسختين (A1–A3).', links: [{ label: 'عربي', href: 'quiz.html#preview=A1.1&lang=ar' }, { label: 'English', href: 'quiz.html#preview=A1.1&lang=en' }] }
    ] }
];
