/*
 * Ezoth — character data.
 *
 * Every fact below comes from the creator's original description (Thai,
 * kept verbatim in `source` / `descriptionTh`). English lines are a
 * re-wording for the interface only — they must not add or change meaning.
 *
 * VARIANTS
 * The site renders whichever variants are listed in `variants`. To add a new
 * version (e.g. a Fairy version, once the creator releases art + info):
 *   1. Put its images in assets/images/ezoth/<id>/
 *   2. Append an object to `variants` with the same shape as "devil"
 *   3. Optional: `theme` overrides CSS colors, `archive` adds version-only
 *      files, `profile.tags` adds version-only identity tags.
 * The variant switcher appears automatically once there are 2+ variants.
 * Nothing else in the code needs to change.
 */
window.EZOTH = {
  character: {
    name: "Ezoth",
    nameTh: "อีซอต",
    wordmark: ["EZO", "TH"],
    title: "The Devil",
    alias: "Satan",
    creator: {
      name: "Holly001.usagi",
      platform: "Facebook",
      url: "https://www.facebook.com/Holly001.usagi?locale=th_TH"
    },

    // Original description, exactly as written by the creator.
    // Paragraphs 1, 4 and 5 are the first description; 2 and 3 are the origin story.
    descriptionTh: [
      "อีซอตคือซาตานในเซ็ตติ้งของเราถึงรวมๆนามจะไม่ได้นิสัยดีอะไรมากมายแต่นางเป็นคนนึงเหมือนกันที่เข้าใจเรื่องความเจ็บปวดของชีวิต ถึงจะดูเปนนางแมวยั่วสวาทแต่น้องก็รักจริงหวังแต่งนะเออว่าไม่ด้ายย",
      "แต่เดิมอีซอต เป็นทูตสวรรค์อยู่แล้ว เป็นทูตสวรรค์ที่ทำงานให้พระเจ้า จนวันนึงพระเจ้าเริ่มสร้างมนุษย์อีชอตเลยค่อนข้างกังวลว่าตัวเองจะถูกลดค่า",
      "หลังจากหนีมาอยู่บนโลกมนุษย์อยู่นานอีช็อตก็เหมือนจะเก็ตความเป็นอยู่เลยไหลๆไปอยู่กับมนุษย์คอยกลืนกินบาปมั่วสุมกับมนุษย์คนอื่นๆ จนกระทั่งพอเจ้าตัวหนีมาอยู่ลอนดอนเลยบังเอิญรับเลี้ยงเด็กมาด้วยคนนึง คือ แพนโดร่า",
      "เป็นตัวละครที่ทุกท่านสามารถนำไปยูเมะได้ตามใจเลยนะคะ เนื่องจากตัวละครไม่มีบรรทัดฐานของความเป็นคนค่ะ",
      "จริงๆตาม lore น้องก็ไม่มีเพศไหลได้ตามนั้นและน้องค่อนข้างที่จะเป็นคนเก็บตัวเงียบๆไม่ค่อยพูดค่อยจาด้วยค่ะไว้เรื่องเพิ่มเติมอาจจะมาปล่อยในwebtoonค่า"
    ],

    // English re-wording of the same paragraphs, in the same order.
    descriptionEn: [
      "Ezoth is Satan in this setting. All told, not a particularly nice one — and yet one who understands the pain of living. They may look like a teasing, seductive cat, but make no mistake: they love for real, the serious, hoping-to-marry kind~",
      "Ezoth was originally an angel — an angel who worked for God. Then one day God began creating humans, and Ezoth grew rather anxious that they would be devalued.",
      "After fleeing to the human world and living there a long while, Ezoth seemed to get the hang of things, and drifted along among humans — swallowing sin, carousing with one human after another. Then, having fled to London, Ezoth by chance took in a child to raise: Pandora.",
      "Everyone is free to yume Ezoth however they like, because the character has no baseline of being human.",
      "According to the lore, Ezoth has no sex — it flows as it will. They are also rather introverted: quiet, and not much of a talker. More may be shared later in a webtoon."
    ],

    // A line in Ezoth's own voice, from the creator's notes on favourite food.
    quote: {
      th: "เจ้าลูกแมวนั่นชอบกินปลาดิบๆ ข้าละไม่เห็นจะเข้าใจเลยรสชาติจืดชืดชะมัดไม่เห็นมีเลือดในนั้นเลย",
      en: "That kitten loves raw fish. I don't understand it at all — it tastes so bland. There isn't any blood in it.",
      context: "Ezoth, on raw fish"
    },

    // Short identity tags for the profile. Front = English, back = Thai source.
    tags: [
      { en: "Satan of this setting", th: "อีซอตคือซาตานในเซ็ตติ้งของเรา" },
      { en: "Once an angel of God", th: "แต่เดิมอีซอต เป็นทูตสวรรค์อยู่แล้ว เป็นทูตสวรรค์ที่ทำงานให้พระเจ้า" },
      { en: "Swallows sin", th: "คอยกลืนกินบาป" },
      { en: "Not exactly nice", th: "ถึงรวมๆนามจะไม่ได้นิสัยดีอะไรมากมาย" },
      { en: "Understands life's pain", th: "เข้าใจเรื่องความเจ็บปวดของชีวิต" },
      { en: "Seductive cat — loves for real", th: "ถึงจะดูเปนนางแมวยั่วสวาทแต่น้องก็รักจริงหวังแต่ง" },
      { en: "Fled to London", th: "หนีมาอยู่ลอนดอน" },
      { en: "Took in Pandora", th: "บังเอิญรับเลี้ยงเด็กมาด้วยคนนึง คือ แพนโดร่า" },
      { en: "Meat — raw or cooked", th: "เนื้อ จะสุกหรือจะดิบก็ได้ชอบกินหมด" },
      { en: "Quiet · introverted", th: "เก็บตัวเงียบๆไม่ค่อยพูดค่อยจา" },
      { en: "No sex — it flows", th: "ตาม lore น้องก็ไม่มีเพศไหลได้ตามนั้น" },
      { en: "No human norms", th: "ไม่มีบรรทัดฐานของความเป็นคน" },
      { en: "The most wicked", th: "ตัวร่าน ตัวร้ายที่สุด" },
      { en: "Free to yume", th: "ทุกท่านสามารถนำไปยูเมะได้ตามใจ" }
    ],

    // Archive files. Only facts the creator gave — no file is padded with new lore.
    // `quote: true` styles an entry as a line spoken by Ezoth.
    archive: [
      {
        id: "identity",
        label: "Identity",
        no: "I",
        entries: [
          { en: "Name: Ezoth (อีซอต).", source: "อีซอต" },
          { en: "Ezoth is Satan — in the creator's own setting.", source: "อีซอตคือซาตานในเซ็ตติ้งของเรา" },
          { en: "Originally an angel — one who worked for God.", source: "แต่เดิมอีซอต เป็นทูตสวรรค์อยู่แล้ว เป็นทูตสวรรค์ที่ทำงานให้พระเจ้า" },
          { en: "The original card names them “The Devil”.", source: "THE DEVIL — from the artwork" }
        ]
      },
      {
        id: "origin",
        label: "Origin",
        no: "II",
        entries: [
          { en: "Ezoth was an angel who worked for God.", source: "แต่เดิมอีซอต เป็นทูตสวรรค์อยู่แล้ว เป็นทูตสวรรค์ที่ทำงานให้พระเจ้า" },
          { en: "Then one day God began creating humans, and Ezoth grew rather anxious that they would be devalued.", source: "จนวันนึงพระเจ้าเริ่มสร้างมนุษย์อีชอตเลยค่อนข้างกังวลว่าตัวเองจะถูกลดค่า" },
          { en: "Ezoth fled to the human world. After living there a long while, they seemed to get the hang of it — drifting along among humans, swallowing sin and carousing with them.", source: "หลังจากหนีมาอยู่บนโลกมนุษย์อยู่นานอีช็อตก็เหมือนจะเก็ตความเป็นอยู่เลยไหลๆไปอยู่กับมนุษย์คอยกลืนกินบาปมั่วสุมกับมนุษย์คนอื่นๆ" },
          { en: "Eventually Ezoth fled to London — and there, by chance, took in a child to raise: Pandora.", source: "จนกระทั่งพอเจ้าตัวหนีมาอยู่ลอนดอนเลยบังเอิญรับเลี้ยงเด็กมาด้วยคนนึง คือ แพนโดร่า" }
        ]
      },
      {
        id: "personality",
        label: "Personality",
        no: "III",
        entries: [
          { en: "All told, not a particularly nice one…", source: "ถึงรวมๆนามจะไม่ได้นิสัยดีอะไรมากมาย" },
          { en: "…yet someone who understands the pain of living.", source: "แต่นางเป็นคนนึงเหมือนกันที่เข้าใจเรื่องความเจ็บปวดของชีวิต" },
          { en: "Looks like a teasing, seductive cat — but loves for real, the serious, hoping-to-marry kind~", source: "ถึงจะดูเปนนางแมวยั่วสวาทแต่น้องก็รักจริงหวังแต่งนะเออว่าไม่ด้ายย" },
          { en: "Rather introverted: quiet, and not much of a talker.", source: "น้องค่อนข้างที่จะเป็นคนเก็บตัวเงียบๆไม่ค่อยพูดค่อยจา" },
          { en: "The most wanton — the most wicked of all.", source: "ตัวร่าน ตัวร้ายที่สุด" }
        ]
      },
      {
        id: "nature",
        label: "Nature",
        no: "IV",
        entries: [
          { en: "Has no baseline of being human.", source: "ตัวละครไม่มีบรรทัดฐานของความเป็นคน" },
          { en: "According to the lore, Ezoth has no sex — it flows as it will.", source: "จริงๆตาม lore น้องก็ไม่มีเพศไหลได้ตามนั้น" }
        ]
      },
      {
        id: "food",
        label: "Favourite Food",
        no: "V",
        entries: [
          { en: "Meat — cooked or raw, Ezoth loves it all.", source: "เนื้อ จะสุกหรือจะดิบก็ได้ชอบกินหมด" },
          { en: "Oysters: the only seafood Ezoth really loves, because their texture is unlike any other seafood.", source: "หอยนางรมเป็นอาหารทะเลเพียงชนิดเดียวที่เจ้าตัวชอบมากๆเพราะให้สัมผัสที่แตกต่างจากอาหารทะเลชนิดอื่น" },
          { en: "“That kitten loves raw fish. I don't understand it at all — it tastes so bland. There isn't any blood in it.”", source: "เจ้าลูกแมวนั่นชอบกินปลาดิบๆ ข้าละไม่เห็นจะเข้าใจเลยรสชาติจืดชืดชะมัดไม่เห็นมีเลือดในนั้นเลย", quote: true },
          { en: "Crisp, easy-to-eat vegetables, like cucumber or carrot.", source: "ชอบผักประเภทที่กรอบกินง่ายเช่นแตงกวา หรือแครอท" }
        ]
      },
      {
        id: "facts",
        label: "Facts",
        no: "VI",
        entries: [
          { en: "Ezoth loves sex because it lets them feel a faint kind of love — one God could never give.", source: "การที่อีซอตชอบมีsex มันทำให้เจ้าตัวรู้สึกถึงความรักแบบจางๆแบบที่พระเจ้าให้ไม่ได้" },
          { en: "From another angle: Ezoth likes to possess what already belongs to someone.", source: "ในอีกมุมนึงคือชอบที่จะครอบครองสิ่งที่ทีเจ้าของแล้ว" },
          { en: "Ezoth once had a lover, whose personality was a lot like Pandora's.", source: "อีซอต เคยมีคนรักครั้งนึงนิสัยคล้ายๆแพนโดร่า" },
          { en: "So Ezoth tried to court Pandora — once, even twice. On realising it could go no further, they stopped, and went back to pursuing others with better odds than Pandora.", source: "อีซอตเลยพยายามจะจีบแพนโดร่าอยู่ครั้งนึงถึงสองครั้ง แต่พอรู้ว่าไปต่อไม่ได้เจ้าตัวก็หยุดแล้วหันกลับไปตามตื้อคนอื่นๆที่มีหวังมากกว่าแพนโดร่า" },
          { en: "Ezoth has, many times, slept with their own biological children — because they could not remember those were their own.", source: "เจ้าตัวมีประวัติสมสู่กับลูกแท้ๆของตัวเองหลายครั้งเพราะจำไม่ได้ว่านั่นเป็นลูกของตัวเอง" },
          { en: "Ezoth's children are, as a rule, every one of them strikingly beautiful and handsome.", source: "ซึ่งโดยปกติลูกของอีซอตจะสวยและหล่อมากทุกๆคน" }
        ]
      },
      {
        id: "notes",
        label: "Creator's Notes",
        no: "VII",
        entries: [
          { en: "Everyone is free to yume Ezoth however they like.", source: "เป็นตัวละครที่ทุกท่านสามารถนำไปยูเมะได้ตามใจเลยนะคะ" },
          { en: "More may be shared later in a webtoon.", source: "ไว้เรื่องเพิ่มเติมอาจจะมาปล่อยในwebtoonค่า" }
        ]
      }
    ]
  },

  defaultVariant: "devil",

  variants: [
    {
      id: "devil",
      label: "The Devil",
      note: "Original version",
      hero: {
        src: "assets/images/ezoth/devil/portrait.webp",
        srcSmall: "assets/images/ezoth/devil/portrait-640.webp",
        fallback: "assets/images/ezoth/devil/portrait.jpg",
        width: 848,
        height: 1500,
        alt: "Ezoth — bust portrait: long silver-white hair over one eye, red eye, wide grin, bare muscular chest."
      },
      profileArt: "card",
      gallery: [
        {
          id: "card",
          title: "The Devil",
          caption: "Card artwork — “MINE..” / “Ah.. my little pet”",
          src: "assets/images/ezoth/devil/the-devil-card.webp",
          srcSmall: "assets/images/ezoth/devil/the-devil-card-640.webp",
          fallback: "assets/images/ezoth/devil/the-devil-card.jpg",
          width: 1030,
          height: 1500,
          alt: "Ezoth as The Devil: silver hair, red eye, grinning, open black coat with red-and-gold lining over a bare chest, red sash, on a crimson card frame with the words THE DEVIL."
        },
        {
          id: "portrait",
          title: "Portrait",
          caption: "Bust portrait — silver hair, red eye",
          src: "assets/images/ezoth/devil/portrait.webp",
          srcSmall: "assets/images/ezoth/devil/portrait-640.webp",
          fallback: "assets/images/ezoth/devil/portrait.jpg",
          width: 848,
          height: 1500,
          alt: "Ezoth — bust portrait: long silver-white hair over one eye, red eye, wide grin, bare muscular chest."
        }
      ],
      archive: [],
      theme: {}
    }
    /*
     * Example for a future version (do not enable until the creator releases it):
     * {
     *   id: "fairy",
     *   label: "Fairy",
     *   note: "…",
     *   hero: { src: "assets/images/ezoth/fairy/….webp", width: …, height: …, alt: "…" },
     *   profileArt: "<gallery id>",
     *   gallery: [ { id: "…", title: "…", caption: "…", src: "…", width: …, height: …, alt: "…" } ],
     *   archive: [ { id: "fairy-notes", label: "Fairy Notes", no: "V", entries: [ { en: "…", source: "…" } ] } ],
     *   theme: { "--crimson": "#…", "--rose": "#…" }
     * }
     */
  ]
};
