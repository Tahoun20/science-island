/* Grade 5 Science (Languages) · Chapter 2 Changes in the Seasons
   15 core ideas from the school book, both lessons (2-1 and 2-2): Point!, Warm Up, Try, Exercise (pages 20-25),
   plus 3 bonus ideas from the Column "Desert Wisdom, the Fennec Fox and Traditional Clothes" (pages 26-27).
   Same format as questions.js. Ideas: P = plants (2-1), T = animals and temperature (2-2), D = desert column (bonus).
   Tap diagrams (drawn in ch2_art.js): plantYear -> sprout | flower | fruit | wither ;
                                       lizardSummer / lizardWinter -> rock | crevice | sand
*/
window.CHAPTER = { id: 'g5-lang-ch2', title: 'Changes in the Seasons', grade: 'Grade 5', track: 'Languages' };

window.IDEAS = [
  /* ---------- 2-1 Changes over a Year ---------- */
  { id: 'P1', lesson: 1, concept: 'Plants change with the seasons',
    explain: 'Plants grow and change their appearance significantly depending on the seasonal temperature.',
    variants: [
      { type: 'tf', mode: 'timed', seconds: 10, level: 'easy', q: 'Plants grow and change their appearance depending on the seasonal temperature.', answer: 0 },
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'Plants grow and change their appearance depending on the seasonal ___.', options: ['temperature', 'wind', 'noise'], answer: 0 },
      { type: 'mc', mode: 'normal', level: 'medium', q: 'Why does the same plant look so different in summer and in winter?', options: ['Because the temperature changes with the seasons', 'Because it becomes a different kind of plant', 'Because plants only grow at night', 'Because its seeds change colour'], answer: 0 }
    ] },
  { id: 'P2', lesson: 1, concept: 'Seeds sprout when it gets warmer',
    explain: 'When the temperature gets higher, seeds sprout and plants start growing fast.',
    variants: [
      { type: 'mc', mode: 'timed', seconds: 15, level: 'easy', q: 'When does a plant sprout and start growing fast?', options: ['When the temperature gets higher', 'When the temperature gets lower'], answer: 0 },
      { type: 'tf', mode: 'timed', seconds: 10, level: 'easy', q: 'Seeds sprout and grow fast when the temperature gets lower.', answer: 1 },
      { type: 'mc', style: 'story', mode: 'normal', level: 'medium', q: 'Omar planted luffa seeds. For weeks nothing happened. Then the weather got warm, and little green shoots came out of the soil. What made the seeds sprout?', options: ['The temperature got higher', 'The temperature got lower', 'The wind blew harder', 'The plant withered'], answer: 0 }
    ] },
  { id: 'P3', lesson: 1, concept: 'Summer: tall stems, wide leaves, flowers',
    explain: 'In summer, when the temperature is high, plants grow their stems tall, spread their leaves wide and produce flowers.',
    variants: [
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'In summer, the temperature gets ___, so many plants spread their leaves wide.', options: ['higher', 'lower'], answer: 0 },
      { type: 'fill', mode: 'normal', level: 'medium', q: 'In summer, many plants spread their leaves wide and ___ their flowers.', options: ['produce', 'scatter'], answer: 0 },
      { type: 'mc', style: 'odd', mode: 'normal', level: 'medium', q: 'Which one does NOT happen to plants in summer, when the temperature is high?', options: ['Stems grow tall', 'Leaves spread wide', 'Flowers are produced', 'The plant withers'], answer: 3 },
      { type: 'match', mode: 'normal', level: 'medium', q: 'It is summer and the temperature is high. Match each part of the plant to what happens to it.', left: ['Stems', 'Leaves', 'Flowers'], right: ['Grow tall', 'Spread wide', 'Are produced'], answer: [0, 1, 2] }
    ] },
  { id: 'P4', lesson: 1, concept: 'Winter: plants start to wither',
    explain: 'In winter, when the temperature is low, plants start to wither.',
    variants: [
      { type: 'tf', mode: 'timed', seconds: 10, level: 'easy', q: 'In winter, when the temperature is low, plants start to wither.', answer: 0 },
      { type: 'tap', diagram: 'plantYear', mode: 'timed', seconds: 15, level: 'easy', q: 'Tap the picture that shows the plant in winter.', answer: 'wither' },
      { type: 'mc', style: 'spot', mode: 'normal', level: 'medium', q: '“Plants start to wither when the temperature gets high in summer.” Choose the right fix.', options: ['Plants start to wither when the temperature gets low in winter', 'Plants start to wither when they produce flowers', 'Plants never wither'], answer: 0 }
    ] },
  { id: 'P5', lesson: 1, concept: 'Seeds for the next generation',
    explain: 'In winter plants start to wither, but they produce seeds for the next generation.',
    variants: [
      { type: 'mc', mode: 'timed', seconds: 15, level: 'easy', q: 'What is left behind after the luffa withers in the winter to produce the next generation?', options: ['Seeds', 'Flowers', 'Leaves', 'Stems'], answer: 0 },
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'In winter, plants start to wither, but they produce ___ for the next generation.', options: ['seeds', 'flowers', 'leaves'], answer: 0 },
      { type: 'mc', style: 'story', mode: 'normal', level: 'medium', q: 'Salma opens a dry, brown luffa fruit. What does she find packed inside?', options: ['Lots of seeds that will sprout next year', 'Fresh yellow flowers', 'Wide green leaves', 'Nothing at all'], answer: 0 }
    ] },
  { id: 'P6', lesson: 1, concept: 'The order of a plant’s yearly cycle',
    explain: 'A plant’s yearly cycle: the seeds sprout, then the flowers bloom, then the fruit grows.',
    variants: [
      { type: 'order', mode: 'normal', level: 'medium', q: 'Put a plant’s yearly cycle in the correct order.', items: ['Flowers bloom', 'Seeds sprout', 'Fruit grows'], answer: [1, 0, 2] },
      { type: 'mc', mode: 'normal', level: 'medium', q: 'Which is the correct order for a plant’s yearly cycle?', options: ['Seeds sprout → Flowers bloom → Fruit grows', 'Fruit grows → Flowers bloom → Seeds sprout', 'Seeds sprout → Fruit grows → Flowers bloom'], answer: 0 },
      { type: 'order', mode: 'normal', level: 'medium', q: 'Put how a luffa changes over the year in order.', items: ['The fruit turns brown', 'The seeds are planted', 'The flowers bloom'], answer: [1, 2, 0] },
      { type: 'tap', diagram: 'plantYear', mode: 'timed', seconds: 15, level: 'easy', q: 'Tap what comes FIRST in a plant’s yearly cycle.', answer: 'sprout' }
    ] },
  { id: 'P7', lesson: 1, boss: true, concept: 'Plants do not just wither and die',
    explain: 'Plants don’t just “wither and die”. They produce seeds, which wait for the next warm season and continue the life cycle the following year.',
    variants: [
      { type: 'mc', mode: 'boss', level: 'hard', q: 'A luffa plant withers in winter. Why is this NOT the end of its life cycle?', options: ['It produced seeds that will sprout when the warm season comes', 'Its withered leaves turn green again in summer', 'Its brown fruit turns back into a flower', 'Plants have no life cycle'], answer: 0 },
      { type: 'mc', style: 'story', mode: 'boss', level: 'hard', q: 'In winter Mona is sad: “The luffa that was so big has already withered…” Her friend points at the brown fruit and says, “Don’t worry!” Why?', options: ['It is full of seeds that will sprout next year', 'The brown fruit will turn green again tomorrow', 'Luffa plants grow best when it is cold', 'A withered plant needs no seeds'], answer: 0 },
      { type: 'mc', style: 'spot', mode: 'boss', level: 'hard', q: '“When the temperature gets low, plants wither and die, so nothing is left for the next year.” Choose the right fix.', options: ['Plants wither, but they produce seeds that continue the life cycle the following year', 'Plants never wither when the temperature is low', 'Plants wither, and the same leaves grow back the next day'], answer: 0 }
    ] },

  /* ---------- 2-2 Animals and Temperature ---------- */
  { id: 'T1', lesson: 2, concept: 'Animal activity changes with temperature',
    explain: 'The activities of animals like lizards, snakes and frogs change significantly depending on the temperature.',
    variants: [
      { type: 'tf', mode: 'timed', seconds: 10, level: 'easy', q: 'The activities of animals like lizards, snakes and frogs change depending on the temperature.', answer: 0 },
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'The activities of animals like lizards, snakes and frogs change depending on the ___.', options: ['temperature', 'colour of the sky', 'day of the week'], answer: 0 },
      { type: 'tf', mode: 'normal', level: 'medium', q: 'A lizard moves in exactly the same way on hot days and on cold days.', answer: 1 }
    ] },
  { id: 'T2', lesson: 2, concept: 'High temperature: active and quick',
    explain: 'When the temperature is high, animals like lizards become more active. They move quickly to find food or escape danger.',
    variants: [
      { type: 'mc', mode: 'timed', seconds: 15, level: 'easy', q: 'When do lizards become most active?', options: ['When the temperature is high', 'When the temperature is low'], answer: 0 },
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'Lizards and other animals can move quickly when the temperature gets ___.', options: ['high', 'low'], answer: 0 },
      { type: 'mc', style: 'story', mode: 'normal', level: 'medium', q: 'It is daytime in summer. Ali sees a lizard basking in the sun on a sunny rock. Suddenly a cat comes near. What can the lizard do?', options: ['Move quickly to escape the danger', 'Only move very slowly, because it is hot', 'Stay still, because it is hibernating', 'Nothing, because lizards cannot move in summer'], answer: 0 },
      { type: 'tap', diagram: 'lizardSummer', mode: 'normal', level: 'medium', q: 'It is daytime in summer. Tap where the lizard is basking in the sun.', answer: 'rock' }
    ] },
  { id: 'T3', lesson: 2, concept: 'Low temperature: slow',
    explain: 'When the temperature is low, the body movements of animals like lizards become slow, and they do not move much.',
    variants: [
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'Lizards and other animals become slow when the temperature gets ___.', options: ['low', 'high'], answer: 0 },
      { type: 'tf', mode: 'timed', seconds: 10, level: 'easy', q: 'When the temperature is low, lizards move faster.', answer: 1 },
      { type: 'match', mode: 'normal', level: 'medium', q: 'Match the temperature to how a lizard moves.', left: ['High temperature', 'Low temperature'], right: ['More active, moves quickly', 'Slow, does not move much'], answer: [0, 1] }
    ] },
  { id: 'T4', lesson: 2, concept: 'Where lizards spend the cold winter',
    explain: 'During cold winters, lizards and similar animals stay still in the soil or in rock crevices.',
    variants: [
      { type: 'mc', mode: 'timed', seconds: 15, level: 'easy', q: 'Where do lizards and similar animals often spend their time during the cold winter?', options: ['Staying still in the soil or in rock crevices', 'Moving around actively'], answer: 0 },
      { type: 'tap', diagram: 'lizardWinter', mode: 'normal', level: 'medium', q: 'It is a cold winter day. Tap where the lizard is staying still.', answer: 'crevice' },
      { type: 'mc', style: 'story', mode: 'normal', level: 'medium', q: 'On a cold winter day, Youssef searches the park and cannot find any lizards. Where did they go?', options: ['They are staying still in the soil or in rock crevices', 'They are running on the sunny rocks', 'They flew to a warmer country', 'They withered like plants'], answer: 0 }
    ] },
  { id: 'T5', lesson: 2, concept: 'Hibernation',
    explain: 'During cold winters, animals like lizards stay still in the soil or in rock crevices to conserve energy. This is called hibernation.',
    variants: [
      { type: 'mc', mode: 'timed', seconds: 15, level: 'easy', q: 'What is it called when animals stay still to conserve energy during the cold winter?', options: ['Hibernation', 'Reproduction', 'Sprouting', 'Withering'], answer: 0 },
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'In cold winters, lizards stay still in the soil or in rock crevices. This is called ___.', options: ['hibernation', 'sprouting', 'withering'], answer: 0 },
      { type: 'mc', mode: 'normal', level: 'medium', q: 'Why do lizards stay still in the soil or in rock crevices during the cold winter?', options: ['To conserve energy', 'To find more food', 'To grow faster', 'To escape the hot sun'], answer: 0 },
      { type: 'tf', mode: 'normal', level: 'medium', q: 'Hibernation means that an animal moves around more to keep warm in winter.', answer: 1 }
    ] },
  { id: 'T6', lesson: 2, concept: 'Warm seasons, and surviving the winter',
    explain: 'Many animals are active, grow and reproduce during warm seasons. When it gets cold, they survive the winter in various ways. Birds like flamingos and ducks come to warm Egypt to spend the winter.',
    variants: [
      { type: 'fill', mode: 'timed', seconds: 15, level: 'easy', q: 'Many animals are active, grow and reproduce during ___ seasons.', options: ['warm', 'cold'], answer: 0 },
      { type: 'mc', mode: 'normal', level: 'medium', q: 'How do birds like flamingos and ducks spend the winter?', options: ['They come to warm Egypt', 'They hibernate in rock crevices', 'They wither and leave seeds', 'They stay still in the soil'], answer: 0 },
      { type: 'mc', style: 'odd', mode: 'normal', level: 'medium', q: 'Which one do many animals NOT do during the warm seasons?', options: ['Stay active', 'Grow', 'Reproduce', 'Hibernate'], answer: 3 },
      { type: 'tf', mode: 'normal', level: 'medium', q: 'When it gets cold, all animals survive the winter in exactly the same way.', answer: 1 }
    ] },
  { id: 'T7', lesson: 2, boss: true, concept: 'The same lizard in summer and in winter',
    explain: 'A lizard is affected by the temperature. When it is high, the lizard is active and quick. In the cold winter it stays still in the soil or in rock crevices to conserve energy.',
    variants: [
      { type: 'mc', style: 'story', mode: 'boss', level: 'hard', q: 'It is a cold winter morning. Kareem can still run around the park, but the lizard he saw in summer is nowhere. Which sentence explains this?', options: ['Lizards are affected by the temperature, so in the cold they stay still and hibernate', 'Lizards run so fast in the cold that Kareem cannot see them', 'Lizards wither in winter, like plants', 'Kareem cannot really run when it is cold'], answer: 0 },
      { type: 'mc', mode: 'boss', level: 'hard', q: 'In summer a lizard basks on a sunny rock and moves quickly. In winter it stays still in a rock crevice. What changed its behaviour?', options: ['The temperature: high in summer and low in winter', 'The colour of the rock', 'The shape of the rock crevice', 'Nothing changed, it only looks different'], answer: 0 },
      { type: 'mc', style: 'spot', mode: 'boss', level: 'hard', q: '“During cold winters, lizards become more active and move quickly to keep warm.” Choose the right fix.', options: ['During cold winters, lizards stay still in the soil or in rock crevices to conserve energy', 'During cold winters, lizards move quickly to find food', 'During cold winters, lizards produce seeds'], answer: 0 }
    ] },
  { id: 'T8', lesson: 2, boss: true, concept: 'Plants and animals both follow the temperature',
    explain: 'Plants and animals both change with the seasonal temperature. In the warm season plants sprout, grow and flower, and animals are active. In the cold winter plants wither and leave seeds, and animals like lizards hibernate.',
    variants: [
      { type: 'match', mode: 'boss', level: 'hard', q: 'Match each living thing to what it does in the cold winter.', left: ['Luffa plant', 'Lizard', 'Flamingo'], right: ['Withers and leaves seeds', 'Stays still in a rock crevice', 'Comes to warm Egypt'], answer: [0, 1, 2] },
      { type: 'mc', mode: 'boss', level: 'hard', q: 'What do a luffa plant and a lizard have in common?', options: ['Both change a lot when the seasonal temperature changes', 'Both hibernate in rock crevices', 'Both produce seeds in winter', 'Neither of them is affected by the temperature'], answer: 0 },
      { type: 'mc', style: 'story', mode: 'boss', level: 'hard', q: 'Laila visits the same garden in summer and again in winter. Which note did she write in WINTER?', options: ['The luffa has withered and left seeds. I cannot find any lizards.', 'The luffa is full of flowers. The lizards are running fast.', 'The luffa seeds are sprouting. A lizard is basking on a sunny rock.', 'The luffa leaves are spreading wide. The lizards are looking for food.'], answer: 0 }
    ] },

  /* ---------- Bonus: Column "Desert Wisdom, the Fennec Fox and Traditional Clothes" (enrichment, not in the core 15) ---------- */
  { id: 'D1', lesson: 2, bonus: true, concept: 'The fennec fox’s giant ears',
    explain: 'The fennec fox is the smallest fox in the world. Its giant ears act like a radiator: warm blood flows through tiny blood vessels under the skin of the ears, the desert wind blows on them, and the fox’s body cools down.',
    variants: [
      { type: 'mc', mode: 'normal', level: 'medium', q: 'How do a fennec fox’s giant ears help it in the hot desert?', options: ['Warm blood flows to the ears and the wind cools it, so the body cools down', 'They store water for long trips', 'They keep the fox warm like a blanket', 'They protect its feet from the hot sand'], answer: 0 },
      { type: 'tf', mode: 'normal', level: 'easy', q: 'The fennec fox is the smallest fox in the world.', answer: 0 }
    ] },
  { id: 'D2', lesson: 2, bonus: true, concept: 'Hair under the fennec fox’s paws',
    explain: 'The fennec fox has long hair on the soles of its paws, just like wearing socks. This hair works as a shield to protect its feet from the hot sand.',
    variants: [
      { type: 'mc', mode: 'normal', level: 'medium', q: 'During the day, the desert sand gets extremely hot. What protects the fennec fox’s feet?', options: ['Long hair on the soles of its paws, like socks', 'Its giant ears', 'Thick hooves', 'A layer of water'], answer: 0 },
      { type: 'fill', mode: 'normal', level: 'medium', q: 'The fennec fox has long ___ on the soles of its paws to protect its feet from the hot sand.', options: ['hair', 'nails', 'bones'], answer: 0 }
    ] },
  { id: 'D3', lesson: 2, bonus: true, concept: 'Why the galabeya is loose',
    explain: 'The galabeya is loose and baggy. The air inside warms up, becomes lighter and floats up, and fresh air comes in from the bottom. This air circulation helps sweat evaporate faster and takes away body heat. A white galabeya also reflects the sunlight.',
    variants: [
      { type: 'mc', mode: 'normal', level: 'medium', q: 'Why is the traditional Egyptian galabeya so loose and baggy?', options: ['Air moves between the cloth and the body and takes away body heat', 'To make the body heavier', 'To stop any air from reaching the skin', 'To keep sweat on the skin'], answer: 0 },
      { type: 'mc', mode: 'normal', level: 'medium', q: 'What does a WHITE galabeya do with the sunlight?', options: ['It reflects the sunlight to block the heat', 'It soaks up all the sunlight', 'It turns the sunlight into water', 'It does nothing'], answer: 0 },
      { type: 'tf', mode: 'normal', level: 'easy', q: 'Inside a loose galabeya, the warm air becomes lighter and floats up, and fresh air comes in from the bottom.', answer: 0 }
    ] }
];
