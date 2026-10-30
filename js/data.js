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
    descriptionTh: [
      "อีซอตคือซาตานในเซ็ตติ้งของเราถึงรวมๆนามจะไม่ได้นิสัยดีอะไรมากมายแต่นางเป็นคนนึงเหมือนกันที่เข้าใจเรื่องความเจ็บปวดของชีวิต ถึงจะดูเปนนางแมวยั่วสวาทแต่น้องก็รักจริงหวังแต่งนะเออว่าไม่ด้ายย",
      "เป็นตัวละครที่ทุกท่านสามารถนำไปยูเมะได้ตามใจเลยนะคะ เนื่องจากตัวละครไม่มีบรรทัดฐานของความเป็นคนค่ะ",
      "จริงๆตาม lore น้องก็ไม่มีเพศไหลได้ตามนั้นและน้องค่อนข้างที่จะเป็นคนเก็บตัวเงียบๆไม่ค่อยพูดค่อยจาด้วยค่ะไว้เรื่องเพิ่มเติมอาจจะมาปล่อยในwebtoonค่า"
    ],

    // English re-wording of the same three paragraphs.
    descriptionEn: [
      "Ezoth is Satan in this setting. All told, not a particularly nice one — and yet one who understands the pain of living. They may look like a teasing, seductive cat, but make no mistake: they love for real, the serious, hoping-to-marry kind~",
      "Everyone is free to yume Ezoth however they like, because the character has no baseline of being human.",
      "According to the lore, Ezoth has no sex — it flows as it will. They are also rather introverted: quiet, and not much of a talker. More may be shared later in a webtoon."
    ],

    // Short identity tags for the profile. Front = English, back = Thai source.
    tags: [
      { en: "Satan of this setting", th: "อีซอตคือซาตานในเซ็ตติ้งของเรา" },
      { en: "Not exactly nice", th: "ถึงรวมๆนามจะไม่ได้นิสัยดีอะไรมากมาย" },
      { en: "Understands life's pain", th: "เข้าใจเรื่องความเจ็บปวดของชีวิต" },
      { en: "Seductive cat — loves for real", th: "ถึงจะดูเปนนางแมวยั่วสวาทแต่น้องก็รักจริงหวังแต่ง" },
      { en: "Quiet · introverted", th: "เก็บตัวเงียบๆไม่ค่อยพูดค่อยจา" },
      { en: "No sex — it flows", th: "ตาม lore น้องก็ไม่มีเพศไหลได้ตามนั้น" },
      { en: "No human norms", th: "ไม่มีบรรทัดฐานของความเป็นคน" },
      { en: "Free to yume", th: "ทุกท่านสามารถนำไปยูเมะได้ตามใจ" }
    ],

    // Archive files. Only facts the creator gave — no file is padded with new lore.
    archive: [
      {
        id: "identity",
        label: "Identity",
        no: "I",
        entries: [
          { en: "Name: Ezoth (อีซอต).", source: "อีซอต" },
          { en: "Ezoth is Satan — in the creator's own setting.", source: "อีซอตคือซาตานในเซ็ตติ้งของเรา" },
          { en: "The original card names them “The Devil”.", source: "THE DEVIL — from the artwork" }
        ]
      },
      {
        id: "personality",
        label: "Personality",
        no: "II",
        entries: [
          { en: "All told, not a particularly nice one…", source: "ถึงรวมๆนามจะไม่ได้นิสัยดีอะไรมากมาย" },
          { en: "…yet someone who understands the pain of living.", source: "แต่นางเป็นคนนึงเหมือนกันที่เข้าใจเรื่องความเจ็บปวดของชีวิต" },
          { en: "Looks like a teasing, seductive cat — but loves for real, the serious, hoping-to-marry kind~", source: "ถึงจะดูเปนนางแมวยั่วสวาทแต่น้องก็รักจริงหวังแต่งนะเออว่าไม่ด้ายย" },
          { en: "Rather introverted: quiet, and not much of a talker.", source: "น้องค่อนข้างที่จะเป็นคนเก็บตัวเงียบๆไม่ค่อยพูดค่อยจา" }
        ]
      },
      {
        id: "nature",
        label: "Nature",
        no: "III",
        entries: [
          { en: "Has no baseline of being human.", source: "ตัวละครไม่มีบรรทัดฐานของความเป็นคน" },
          { en: "According to the lore, Ezoth has no sex — it flows as it will.", source: "จริงๆตาม lore น้องก็ไม่มีเพศไหลได้ตามนั้น" }
        ]
      },
      {
        id: "notes",
        label: "Creator's Notes",
        no: "IV",
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
