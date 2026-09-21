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

export interface Coupon {
  id: string;
  emoji: string;
  title: string;
  finePrint: string;
}

export const BIRTHDAY_DATA = {
  name: "Eraj",
  age: 21,
  birthDateString: "22 September",
  tagline: "Round two of the celebrations! Brand-new little surprises, made just for you 🎀",
  
  // Things Mochi the kitten says when she's tapped
  kittenLines: [
    "mew! hi Eraj 🐾",
    "I saved you a cup of tea 🍵",
    "*happy tail swish*",
    "you smell like birthday cake 🧁",
    "pet me pet me pet me",
    "go pop the balloons! 🎈",
    "I'm your official birthday cat now",
    "mrrp? more cuddles?",
    "21 & fabulous 💅",
    "okay I'm napping now… jk tap again"
  ],

  // One word hides inside each balloon
  balloonMessage: ["You", "make", "every", "day", "sweeter,", "Eraj 💗"],

  fortunes: [
    "A year full of soft mornings and loud laughter is heading your way. 🌤️",
    "Someone is thinking about how amazing you are. (It's everyone.) 💭",
    "Your 21st year will surprise you, in the very best ways. ✨",
    "An unexpected good thing will make you squeal this month. 🎀",
    "The universe owes you ice cream. Collect it soon. 🍦",
    "The dreams you whispered to your candles are listening. 🕯️",
    "A new favourite song, a new favourite place, and old favourite people. 🎧",
    "You will glow so much this year that sunglasses become necessary. 😎",
    "Good news travels fast, and it's travelling toward you. 💌",
    "Your kindness will come back to you, doubled and wrapped in a bow. 🎁",
    "Expect at least 21 moments this year where you feel truly happy. 🌸",
    "Luck is on your side. So are snacks. 🍪"
  ],

  // Edit these to things you can actually deliver 😉
  coupons: [
    { id: "ice-cream", emoji: "🍦", title: "One Ice Cream, On Me", finePrint: "Any flavour. Extra sprinkles legally required." },
    { id: "movie", emoji: "🎬", title: "Movie Night, You Pick", finePrint: "No complaining about your choice allowed." },
    { id: "rant", emoji: "🗣️", title: "Unlimited Rant Session", finePrint: "Full listening mode. Zero advice unless requested." },
    { id: "compliments", emoji: "🎙️", title: "Voice Note Full of Compliments", finePrint: "Minimum length: 2 minutes of pure hype." },
    { id: "breakfast", emoji: "🥞", title: "Breakfast Treat", finePrint: "Pancakes, parathas, or whatever your heart desires." },
    { id: "argument", emoji: "🏳️", title: "Win Any Argument Free", finePrint: "One use only. Use it wisely, queen." },
    { id: "playlist", emoji: "🎧", title: "A Playlist Made Just for You", finePrint: "Hand-picked, zero skips guaranteed." },
    { id: "photoshoot", emoji: "📸", title: "Personal Photographer for a Day", finePrint: "As many retakes as you want. No sighing." }
  ] as Coupon[],

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
