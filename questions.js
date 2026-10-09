/* Grade 5 Science (Languages) · Chapter 1 Bones and Muscles
   23 core ideas from the school book, all four lessons (1-1 to 1-4) (Point!, Warm Up, Try, Exercise).
   Each idea has 2-3 phrasings ("variants"). Every game picks one phrasing per idea,
   so a student meets the same idea from a different angle each time.
   boss: true -> the idea is asked at the end in the Boss round.
   type: mc | tf | fill | order | match | tap ; style (mc only): odd | spot | story
   answer: mc/fill/tf -> option index (tf: 0 = True, 1 = False); order -> item indexes in order;
           match -> right index for each left item; tap -> target id
*/
window.CHAPTER = { id: 'g5-lang-ch1', title: 'Bones and Muscles', grade: 'Grade 5', track: 'Languages' };

window.IDEAS = [
  /* ---------- Muscles ---------- */
  { id: 'M1', lesson: 1, concept: 'Bones are hard, muscles are soft',
    explain: 'The body has hard, strong bones and soft muscles.',
    variants: [
      { type: 'tf', mode: 'timed', seconds: 10, level: 'easy', q: 'Muscles are soft parts inside our bodies.', answer: 0 },
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'The human body has hard, strong ___ and soft muscles.', options: ['bones', 'skin', 'hair'], answer: 0 },
      { type: 'match', mode: 'normal', level: 'medium', q: 'Match each part to how it feels.', left: ['Bones', 'Muscles'], right: ['Hard and strong', 'Soft'], answer: [0, 1] }
    ] },
  { id: 'M2', lesson: 1, concept: 'Muscles pull bones',
    explain: 'Muscles move the body by pulling the bones. They never push.',
    variants: [
      { type: 'mc', mode: 'timed', seconds: 15, level: 'easy', q: 'How do muscles move our bones?', options: ['By pulling them', 'By pushing them', 'By making them soft', 'Bones move by themselves'], answer: 0 },
      { type: 'tf', mode: 'timed', seconds: 10, level: 'easy', q: 'Muscles move the body by pushing the bones.', answer: 1 },
      { type: 'mc', style: 'spot', mode: 'normal', level: 'medium', q: '“Muscles push the bones to help us move.” Choose the right fix.', options: ['Muscles pull the bones to help us move', 'Muscles push the skin to help us move', 'Bones push the muscles to help us move'], answer: 0 }
    ] },
  { id: 'M3', lesson: 1, concept: 'Muscles contract and relax',
    explain: 'The body moves because muscles contract and relax. A contracting muscle pulls the bone.',
    variants: [
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'Muscles pull bones and move the body by ___.', options: ['contracting', 'relaxing', 'expanding'], answer: 0 },
      { type: 'mc', mode: 'normal', level: 'medium', q: 'Why can the human body move?', options: ['Because muscles contract and relax', 'Because bones bend in the middle', 'Because bones contract like muscles', 'Because the skin pulls the bones'], answer: 0 },
      { type: 'order', mode: 'normal', level: 'medium', q: 'Omar lifts his school bag. Put what happens in order.', items: ['The arm bends', 'The inner muscle contracts', 'The forearm bone is pulled up'], answer: [1, 2, 0] }
    ] },
  { id: 'M4', lesson: 1, concept: 'A contracting muscle gets hard',
    explain: 'When a muscle contracts, it becomes short, thick and hard.',
    variants: [
      { type: 'mc', mode: 'timed', seconds: 15, level: 'easy', q: 'When you bend your arm, what happens to the inner muscle (the biceps)?', options: ['It contracts and becomes thick and hard', 'It relaxes and becomes thin', 'It turns into bone', 'Nothing happens to it'], answer: 0 },
      { type: 'mc', style: 'odd', mode: 'normal', level: 'medium', q: 'Which word does NOT describe a contracting muscle?', options: ['Shorter', 'Harder', 'Pulling', 'Softer'], answer: 3 },
      { type: 'mc', style: 'story', mode: 'normal', level: 'medium', q: 'Mona bends her arm strongly and touches her biceps with her other hand. How does it feel?', options: ['Hard', 'Soft', 'Hollow', 'Bendy like rubber'], answer: 0 }
    ] },
  { id: 'M5', lesson: 1, concept: 'Bending the arm',
    explain: 'When you bend your arm, the inner muscle contracts and the outer muscle relaxes.',
    variants: [
      { type: 'tap', diagram: 'armBent', mode: 'timed', seconds: 20, level: 'easy', q: 'Tap the muscle that becomes hard when you bend your arm.', answer: 'in' },
      { type: 'mc', style: 'story', mode: 'normal', level: 'medium', q: 'Omar bends his arm to lift his heavy school bag. What are his arm muscles doing?', options: ['Inner muscle contracts, outer muscle relaxes', 'Outer muscle contracts, inner muscle relaxes', 'Both muscles contract', 'Both muscles push the bone'], answer: 0 },
      { type: 'match', mode: 'normal', level: 'medium', q: 'You bend your arm. Match each muscle to what it does.', left: ['Inner muscle (biceps)', 'Outer muscle (triceps)'], right: ['Contracts', 'Relaxes'], answer: [0, 1] }
    ] },
  { id: 'M6', lesson: 1, concept: 'Stretching the arm',
    explain: 'When you stretch your arm, the outer muscle contracts and the inner muscle relaxes.',
    variants: [
      { type: 'mc', mode: 'normal', level: 'medium', q: 'Which is correct when you stretch your arm?', options: ['The outer muscle contracts, and the inner muscle relaxes', 'The inner muscle contracts, and the outer muscle relaxes', 'Both muscles relax', 'Both muscles contract'], answer: 0 },
      { type: 'tap', diagram: 'armStraight', mode: 'normal', level: 'medium', q: 'Omar straightens his arm to push a door open. Tap the muscle that is contracting.', answer: 'out' },
      { type: 'tf', mode: 'timed', seconds: 10, level: 'easy', q: 'When you stretch your arm, the outer muscle relaxes.', answer: 1 }
    ] },
  { id: 'M7', lesson: 1, boss: true, concept: 'Two muscles work in turns',
    explain: 'Muscles can only pull. One muscle pulls to bend the arm, the other pulls to stretch it.',
    variants: [
      { type: 'mc', mode: 'boss', level: 'hard', q: 'Why does the arm need two muscles to bend and stretch?', options: ['A muscle can only pull, so another muscle must pull the other way', 'One muscle rests while the other grows', 'One muscle pushes and the other pulls', 'Two muscles make the bone softer'], answer: 0 },
      { type: 'mc', style: 'story', mode: 'boss', level: 'hard', q: 'Mona bends her arm to bring a cup to her mouth. Then she pushes a heavy door open with a straight arm. Which muscle contracts in each step?', options: ['Inner muscle, then outer muscle', 'Outer muscle, then inner muscle', 'Inner muscle both times', 'Outer muscle both times'], answer: 0 },
      { type: 'mc', mode: 'boss', level: 'hard', q: 'You bend and stretch your arm again and again. What are the two muscles doing?', options: ['Working in turns: when one contracts, the other relaxes', 'Both contracting at the same time', 'Both relaxing at the same time', 'Only the inner muscle is working'], answer: 0 }
    ] },

  /* ---------- 1-2 Structure of Bones ---------- */
  { id: 'B1', lesson: 2, concept: 'Bones support the body',
    explain: 'Bones are very hard. They support the body. Only the joints can bend.',
    variants: [
      { type: 'tf', mode: 'timed', seconds: 10, level: 'easy', q: 'Bones are very hard and support the body.', answer: 0 },
      { type: 'tf', mode: 'timed', seconds: 10, level: 'easy', q: 'Bones can bend anywhere in the middle.', answer: 1 },
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'Bones are very ___ and support the body.', options: ['hard', 'soft', 'thin'], answer: 0 }
    ] },
  { id: 'B2', lesson: 2, concept: 'Bones protect organs',
    explain: 'Bones protect important organs like the brain and the heart.',
    variants: [
      { type: 'mc', mode: 'timed', seconds: 15, level: 'easy', q: 'What do bones protect?', options: ['Important organs like the brain and heart', 'Only the hair', 'Only the skin', 'Bones do not protect anything'], answer: 0 },
      { type: 'mc', style: 'story', mode: 'normal', level: 'medium', q: 'Youssef bumps his head on a door, but his brain is safe. What protected it?', options: ['The skull bones', 'The cartilage', 'The arm muscles', 'The ribs'], answer: 0 },
      { type: 'tf', mode: 'timed', seconds: 10, level: 'easy', q: 'Bones support the body and also protect it.', answer: 0 }
    ] },
  { id: 'B3', lesson: 2, concept: 'Bones cannot move by themselves',
    explain: 'Bones cannot contract. Muscles contract and pull the bones.',
    variants: [
      { type: 'mc', style: 'odd', mode: 'normal', level: 'medium', q: 'Which of these is NOT a role of bones?', options: ['Supports the body firmly', 'Protects important organs like the brain and heart', 'Can contract and move by itself, like muscles'], answer: 2 },
      { type: 'tf', mode: 'timed', seconds: 10, level: 'easy', q: 'Bones can contract and relax like muscles.', answer: 1 },
      { type: 'mc', style: 'spot', mode: 'normal', level: 'medium', q: '“Bones move the body by contracting.” Choose the right fix.', options: ['Muscles move the body by contracting and pulling the bones', 'Bones move the body by relaxing', 'The skin moves the body by contracting'], answer: 0 }
    ] },
  { id: 'B4', lesson: 2, concept: 'Joint',
    explain: 'A joint is the place where bones connect. The body bends at joints.',
    variants: [
      { type: 'fill', mode: 'timed', seconds: 10, level: 'easy', q: 'The place where two bones meet and allow movement is called a ___.', options: ['joint', 'muscle', 'rib'], answer: 0 },
      { type: 'tap', diagram: 'armJoints', mode: 'timed', seconds: 15, level: 'easy', q: 'Tap the joint between the upper arm and the forearm.', answer: 'elbow' },
      { type: 'mc', mode: 'normal', level: 'medium', q: 'Which of these is a joint?', options: ['The knee', 'The skull', 'The ribs', 'The biceps'], answer: 0 }
    ] },
  { id: 'B5', lesson: 2, concept: 'Cartilage',
    explain: 'Joints have cartilage. It is a cushion so bones do not rub against each other and wear out.',
    variants: [
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'Joints have ___, which acts as a cushion so bones do not rub against each other.', options: ['cartilage', 'muscle', 'skin'], answer: 0 },
      { type: 'mc', mode: 'normal', level: 'medium', q: 'What do you call the part in joints that acts as a cushion?', options: ['Cartilage', 'Skull', 'Biceps', 'Rib'], answer: 0 },
      { type: 'mc', mode: 'normal', level: 'hard', q: 'What would happen if our joints had NO cartilage?', options: ['The bones would rub together and wear out', 'The bones would bend in the middle', 'The muscles would stop pulling', 'We would have more joints'], answer: 0 }
    ] },
  { id: 'B6', lesson: 2, boss: true, concept: 'Joints move in different ways',
    explain: 'Where a joint is decides how it can move. The elbow bends one way. The shoulder can turn around.',
    variants: [
      { type: 'mc', mode: 'boss', level: 'hard', q: 'Which statement correctly explains the movement of joints?', options: ['The direction and range of bending are decided by the location of the joint', 'All joints in the body can rotate in any direction', 'Joints cannot move at all', 'Only the elbow can move'], answer: 0 },
      { type: 'mc', style: 'story', mode: 'boss', level: 'hard', q: 'Ali’s elbow bends only one way, but his shoulder can turn in a circle. Why?', options: ['The place of the joint decides how it can move', 'The elbow has no cartilage', 'The shoulder has no bones', 'All joints really move the same way'], answer: 0 },
      { type: 'tap', diagram: 'armJoints', mode: 'boss', level: 'hard', q: 'Tap the joint that can bend in ONLY one direction.', answer: 'elbow' }
    ] },
  { id: 'B7', lesson: 2, concept: 'Joints in our body',
    explain: 'Shoulders, elbows, wrists, fingers, the waist, knees and ankles all bend at joints.',
    variants: [
      { type: 'order', mode: 'normal', level: 'medium', q: 'Put these arm joints in order from top to bottom.', items: ['Wrist', 'Shoulder', 'Elbow'], answer: [1, 2, 0] },
      { type: 'mc', style: 'odd', mode: 'normal', level: 'medium', q: 'Which one is NOT a joint?', options: ['Elbow', 'Knee', 'Wrist', 'Skull'], answer: 3 },
      { type: 'match', mode: 'normal', level: 'medium', q: 'Match each joint to where it is.', left: ['Elbow', 'Knee', 'Wrist'], right: ['In the middle of the arm', 'In the middle of the leg', 'Between the arm and the hand'], answer: [0, 1, 2] }
    ] },

  /* ---------- 1-3 Whole Body Skeleton ---------- */
  { id: 'S1', lesson: 3, concept: 'The skeleton',
    explain: 'The skeleton is made of many bones that combine to make the shape of the whole body.',
    variants: [
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'Many bones combine to make the shape of the whole body. This is called the ___.', options: ['skeleton', 'muscle', 'joint'], answer: 0 },
      { type: 'mc', mode: 'normal', level: 'medium', q: 'What is the skeleton?', options: ['Many bones connected together to make the shape of the body', 'One big bone in the back', 'All the muscles of the body', 'The skin that covers the body'], answer: 0 },
      { type: 'tf', mode: 'timed', seconds: 10, level: 'easy', q: 'The skeleton gives the whole body its shape.', answer: 0 }
    ] },
  { id: 'S2', lesson: 3, concept: 'About 206 bones',
    explain: 'The human body is made of about 206 connected bones.',
    variants: [
      { type: 'mc', mode: 'timed', seconds: 10, level: 'easy', q: 'About how many bones make up the human skeleton?', options: ['26', '106', '206', '306'], answer: 2 },
      { type: 'tf', mode: 'timed', seconds: 10, level: 'easy', q: 'The human body is made of about 206 connected bones.', answer: 0 },
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'The human body is made of about ___ connected bones.', options: ['206', '16', '2006'], answer: 0 }
    ] },
  { id: 'S3', lesson: 3, concept: 'Skull',
    explain: 'The skull wraps and protects the soft brain like a helmet.',
    variants: [
      { type: 'tf', mode: 'timed', seconds: 10, level: 'easy', q: 'The skull protects the brain like a helmet.', answer: 0 },
      { type: 'tap', diagram: 'skeleton', mode: 'timed', seconds: 15, level: 'easy', q: 'Tap the part that protects the brain.', answer: 'skull' },
      { type: 'mc', style: 'story', mode: 'normal', level: 'medium', q: 'Touch your head. It feels hard everywhere. Why?', options: ['A strong bone, the skull, protects the brain', 'There are many muscles there', 'It is made of cartilage', 'The ribs are there'], answer: 0 }
    ] },
  { id: 'S4', lesson: 3, concept: 'Ribs',
    explain: 'The ribs protect the heart and lungs in a cage-like shape.',
    variants: [
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'The ribs protect the heart and the ___.', options: ['lungs', 'stomach', 'brain'], answer: 0 },
      { type: 'tap', diagram: 'skeleton', mode: 'timed', seconds: 15, level: 'easy', q: 'Tap the bones that protect the heart and lungs.', answer: 'ribs' },
      { type: 'mc', style: 'story', mode: 'normal', level: 'medium', q: 'Kareem takes a deep breath and touches his chest. What does he feel?', options: ['Many thin bones lined up sideways', 'One big flat bone', 'Bumpy bones lined up from top to bottom', 'No bones at all'], answer: 0 }
    ] },
  { id: 'S5', lesson: 3, concept: 'Backbone supports the body',
    explain: 'The backbone is the pillar of the body. It supports the whole body.',
    variants: [
      { type: 'tap', diagram: 'skeleton', mode: 'timed', seconds: 15, level: 'easy', q: 'Tap the backbone.', answer: 'backbone' },
      { type: 'match', mode: 'normal', level: 'medium', q: 'Match each part to its job.', left: ['Skull', 'Ribs', 'Backbone'], right: ['Protects the brain', 'Protects the heart and lungs', 'Supports the whole body'], answer: [0, 1, 2] },
      { type: 'mc', style: 'odd', mode: 'normal', level: 'medium', q: 'Which one does NOT describe the ribs?', options: ['Thin bones', 'A cage shape', 'In the chest', 'The pillar that supports the whole body'], answer: 3 }
    ] },
  { id: 'S6', lesson: 3, boss: true, concept: 'The backbone bends',
    explain: 'The backbone is made of many small connected bones, so we can bend forward, backward, left and right.',
    variants: [
      { type: 'mc', style: 'spot', mode: 'boss', level: 'hard', q: '“The backbone is one big bone, so we cannot bend our back.” Choose the right fix.', options: ['The backbone is many small connected bones, so we can bend', 'The backbone is a muscle, so we can bend', 'The backbone is cartilage, so it is soft'], answer: 0 },
      { type: 'mc', style: 'story', mode: 'boss', level: 'hard', q: 'Adam bends forward to tie his shoes, then bends to the left to see his friend. What if his backbone were ONE solid bone?', options: ['He could not bend his back', 'His brain would not be protected', 'His ribs would fall off', 'His muscles would push instead of pull'], answer: 0 },
      { type: 'mc', mode: 'boss', level: 'hard', q: 'Why does the skeleton have a hard skull AND a backbone made of many small bones?', options: ['To protect the brain and still let us bend', 'To make the body lighter', 'So muscles can push the bones', 'So the skull can bend'], answer: 0 }
    ] },

  /* ---------- 1-4 Animal Bodies ---------- */
  { id: 'A1', lesson: 4, concept: 'Animals have backbones and joints',
    explain: 'Many animals, like dogs, cats and rabbits, have a backbone like humans, and joints in their front and back legs (limbs).',
    variants: [
      { type: 'tf', mode: 'timed', seconds: 10, level: 'easy', q: 'Many animals, like dogs, have a backbone just like humans.', answer: 0 },
      { type: 'mc', mode: 'normal', level: 'medium', q: 'Which statement correctly explains the structure of a dog’s front legs?', options: ['It has joints (bending parts), just like humans', 'It is one connected hard bone that does not bend anywhere', 'It has muscles but no bones', 'It can bend only at the paw'], answer: 0 },
      { type: 'mc', style: 'story', mode: 'normal', level: 'medium', q: 'Salma looks at her dog’s front leg and finds the part that matches a human “elbow”. Where is it?', options: ['Higher up the leg, away from the ground', 'Touching the ground', 'On the dog’s back', 'A dog has no such part'], answer: 0 }
    ] },
  { id: 'A2', lesson: 4, concept: 'Animals move with muscles and bones',
    explain: 'Animals like dogs and horses also move by their muscles contracting and pulling their bones, just like humans.',
    variants: [
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'Dogs and horses move by ___ contracting and pulling the bones, just like humans.', options: ['muscles', 'skin', 'hair'], answer: 0 },
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'A horse’s muscles contract and pull its ___ to move its body.', options: ['bones', 'hair', 'skin'], answer: 0 },
      { type: 'tf', mode: 'normal', level: 'medium', q: 'Muscles move bones by completely different rules in humans and in animals.', answer: 1 }
    ] },
  { id: 'A3', lesson: 4, boss: true, concept: 'Bones fit how an animal lives',
    explain: 'Bone length and how the muscles are attached differ a little depending on how the animal lives, like running fast or flying. The way bones and muscles move the body is very similar to humans.',
    variants: [
      { type: 'mc', mode: 'boss', level: 'hard', q: 'What does the difference in bone length and shape among animals depend on?', options: ['How the animal lives and moves (running, jumping, flying)', 'The colour of the animal’s body', 'How much water the animal drinks', 'Whether the animal has a backbone or not'], answer: 0 },
      { type: 'mc', style: 'story', mode: 'boss', level: 'hard', q: 'Omar holds a rabbit and sees that its back legs have very long bones. Why?', options: ['Long back-leg bones make it easy to jump', 'Long bones keep the rabbit warm', 'Long bones protect its heart and lungs', 'Long bones mean the rabbit has no joints'], answer: 0 },
      { type: 'mc', mode: 'boss', level: 'hard', q: 'Which statement correctly explains the body structure of animals?', options: ['Bone shapes differ because each animal is adapted to its own kind of movement', 'Animal muscles push bones, but human muscles pull them', 'Animals have no joints, so their legs do not bend', 'Every animal has exactly the same bones as a human'], answer: 0 }
    ] }
];
