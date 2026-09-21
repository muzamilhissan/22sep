export interface PhotoItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  caption: string;
  src: string;
  blurDataURL?: string;
  likes: number;
}

export interface JarNote {
  id: number;
  emoji: string;
  text: string;
}

export interface BouquetFlower {
  id: string;
  emoji: string;
  name: string;
  meaning: string;
}

export const BIRTHDAY_DATA = {
  name: "Eraj",
  age: 21,
  birthDateString: "22 September",
  tagline: "The candles are out, but the celebrating isn't over. A few brand-new little surprises, made just for you 🎀",
  
  // Things the bunny says when she taps it
  bunnyLines: [
    "hehe, that tickles! 🎀",
    "boop! 💗",
    "happy birthday week, Eraj!",
    "*happy bunny hops* 🐰",
    "you're my favourite human 🥺",
    "psst… check the jar below ✨",
    "more hugs please!",
    "21 looks cute on you 🌸",
    "I'm made of 100% love",
    "okay one more boop…"
  ],

  bouquetFlowers: [
    { id: "tulip", emoji: "🌷", name: "Pink Tulip", meaning: "for caring, and being cared for" },
    { id: "blossom", emoji: "🌸", name: "Cherry Blossom", meaning: "for new beginnings at 21" },
    { id: "rose", emoji: "🌹", name: "Rose", meaning: "for all the love around you" },
    { id: "sunflower", emoji: "🌻", name: "Sunflower", meaning: "for your sunshine energy" },
    { id: "hibiscus", emoji: "🌺", name: "Hibiscus", meaning: "for your delicate beauty" },
    { id: "daisy", emoji: "🌼", name: "Daisy", meaning: "for your sweet, gentle heart" }
  ] as BouquetFlower[],

  // 21 little folded-star notes for the "Jar of Little Sunshines"
  jarNotes: [
    { id: 1, emoji: "🌸", text: "Open this whenever you forget how loved you are. (Spoiler: very, very loved.)" },
    { id: 2, emoji: "☀️", text: "You're the kind of person who makes ordinary days feel like weekends." },
    { id: 3, emoji: "🍓", text: "A reminder to eat something sweet today. Birthday rules extend all week." },
    { id: 4, emoji: "🧸", text: "Sending you one enormous, squishy, all-the-way-around hug. Consider it delivered." },
    { id: 5, emoji: "🌙", text: "May your nights be cozy, your sleep be deep, and your dreams be the good kind." },
    { id: 6, emoji: "🎀", text: "Your laugh is officially one of the best sounds in the world. Please use it often." },
    { id: 7, emoji: "🌷", text: "Growing isn't always pretty, but look at you — blooming anyway." },
    { id: 8, emoji: "☕", text: "Here's to slow mornings, warm drinks, and nowhere you have to rush to." },
    { id: 9, emoji: "🦋", text: "Be gentle with yourself this year. You're doing so much better than you think." },
    { id: 10, emoji: "💌", text: "If kindness were a currency, you'd be the richest person I know." },
    { id: 11, emoji: "🍰", text: "21 looks ridiculously good on you. Just thought you should know." },
    { id: 12, emoji: "🌈", text: "For every cloudy day this year, may there be at least two rainbows." },
    { id: 13, emoji: "🐣", text: "Tiny reminder: drink water, stretch, and text back the people who adore you." },
    { id: 14, emoji: "✨", text: "You don't need to shine brighter. You just need to keep being you." },
    { id: 15, emoji: "🌻", text: "Wishing you sunflower energy: always facing toward the light." },
    { id: 16, emoji: "🎧", text: "May this year's playlist be full of songs you'll dance to in the kitchen." },
    { id: 17, emoji: "🍯", text: "Life is sweeter with you in it. That's not a compliment, it's a fact." },
    { id: 18, emoji: "🕊️", text: "Wishing you peace in your heart and people who protect it." },
    { id: 19, emoji: "🌟", text: "Every dream you whispered while blowing out those candles? Go get them." },
    { id: 20, emoji: "💐", text: "If I could, I'd send you a bouquet every single day. This note will have to do." },
    { id: 21, emoji: "💖", text: "The last star in the jar, saved for the most important thing: happy birthday, Eraj. Truly." }
  ] as JarNote[],

  photos: [
    {
      id: "photo-1",
      title: "Mountain Blossoms 🌸",
      subtitle: "Fresh Blooms & Open Skies",
      tag: "Eraj in Bloom",
      caption: "Tucking fresh flowers into your hair amidst the quiet grandeur of the mountains. Radiating pure peace and natural grace.",
      src: "/photos/img1.webp",
      blurDataURL: "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAACwAQCdASoQABAABUB8JbACdADg+FwAANTlc4z3mcWC6f4p5e79WrJf/s7c6jQ4xxaaZQwJ6w9+px1dWTQogAAA",
      likes: 21
    },
    {
      id: "photo-2",
      title: "Emerald Elegance ✨",
      subtitle: "Starry Night & Traditional Grace",
      tag: "Timeless Beauty",
      caption: "Stunning in festive emerald green with delicate embroidery and glowing jewels. An unforgettable look of timeless poise.",
      src: "/photos/img2.webp",
      blurDataURL: "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAAAQAgCdASoPABAABUB8JYwC06Dbre/4MXYAAPYPqZ6PrDXMxCMfEj+o42vL0ibew+9JybHCBm1C4OGjgE/0J3P74QNlgT06fPHkAAAA",
      likes: 21
    },
    {
      id: "photo-3",
      title: "Golden Hour Smile 💖",
      subtitle: "Fairy Lights & Warm Moments",
      tag: "Radiant Joy",
      caption: "That soft, warm smile under twinkling fairy lights that effortlessly brightens the entire room. You look so lovely.",
      src: "/photos/img3.webp",
      blurDataURL: "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAQCdASoOABAABUB8JbACdAD7Sh4qaAAA/oINelF3eh5GgkzVF+7Yz9j9SwzKj/mFospuVaXgqKXFN8D2FjKxqaO8LnlTxrf83YGFb2lN/4603jHeAAAA",
      likes: 21
    },
    {
      id: "photo-4",
      title: "Desert Sunset Glow 🏜️",
      subtitle: "Golden Dunes & Sweet Breeze",
      tag: "Adventures",
      caption: "Basking in the golden desert sun, surrounded by wind-swept sand dunes. Carefree, stylish, and full of radiant sunshine.",
      src: "/photos/img4.webp",
      blurDataURL: "data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAACQAQCdASoOABAABUB8JYwCdADWvEAA/pFhfaJ4F1lLz4tTbCm+8YOSJST/ZC6/D8AAAA==",
      likes: 21
    },
    {
      id: "photo-5",
      title: "Hand in Hand Always 🤍",
      subtitle: "Intertwined Fingers & Road Trips",
      tag: "Together",
      caption: "Holding your hand tightly through every drive and every quiet moment. My favorite feeling in the whole world.",
      src: "/photos/img5.webp",
      blurDataURL: "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAQAgCdASoNABAABUB8JZACdAEPPIb9B0NgAP6DcxwMJAppCf5w6Kv8uvnCBMxy/tUXtE/8dW7/iQLhXHrkgjMQ9AOSfaHsO9tYWbtM3wAAAA==",
      likes: 21
    },
    {
      id: "photo-6",
      title: "My Favorite Shoulder to Lean On 🎞️",
      subtitle: "Classic Mirror Moments • 7:49 PM",
      tag: "Us",
      caption: "Resting your head on my shoulder with that sweet, content smile. A timeless memory of comfort, trust, and deep love.",
      src: "/photos/img6.webp",
      blurDataURL: "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAACwAQCdASoNABAABUB8JaQAAjVe3qcAAP5gr9PSGP57Rv95jdPI7cXbzRl5sNOt1Vv8WVhPGXrF0MvFAUEYdeN54AA=",
      likes: 21
    },
    {
      id: "photo-7",
      title: "Little Muzzamil's Special Cameo 👦🏻💙",
      subtitle: "Throwback To The Little Guy Who Adores You",
      tag: "Muzzamil",
      caption: "A little cameo from young Muzzamil in his blue kurta! He had no idea back then that one day he'd be the luckiest person celebrating the most extraordinary girl: Happy 21st Birthday, Eraj! ✨🎂",
      src: "/photos/img7.webp",
      blurDataURL: "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAQAgCdASoMABAABUB8JYgCdAC9xLJm6kwAAPhWBPCBrToodiwA9NhitgLTSr+3StAAU15zL590lgKNQoA0P5Y8RvWVPDNumk7fAeIpn8QAAA==",
      likes: 21
    }
  ] as PhotoItem[]
};
