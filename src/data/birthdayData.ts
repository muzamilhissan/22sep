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

export interface BirthdayReason {
  id: number;
  title: string;
  description: string;
  emoji: string;
}

export const BIRTHDAY_DATA = {
  name: "Eraj",
  age: 21,
  birthDateString: "22 September",
  targetUnlockDate: "2026-09-22T00:00:00+05:00", // Midnight of 22 Sep, Pakistan time (PKT, UTC+5)
  tagline: "Celebrating 21 years of grace, sunshine, and pure magic ✨🌸",
  
  letter: {
    salutation: "Dearest Eraj,",
    opening: "Happy 21st Birthday! 🎂✨",
    paragraphs: [
      "Today is all about you—a day to celebrate the most radiant, kind-hearted, and lovely soul. Reaching 21 is such a special milestone; it marks a beautiful chapter of blossoming, discovering new horizons, and embracing the wonderful person you have grown to become.",
      "Your warmth, your gentle kindness, and your effortless smile have a way of brightening up even the cloudiest days. You bring a quiet magic into every room you step into, and the world is undeniably a softer, sweeter place because of you.",
      "As you blow out your 21 candles today, my wish for you is that this year treats you with the same tenderness and love that you give so generously to everyone around you. May all your dreams, both whispered and spoken, find their way to coming true.",
      "Here is to 21 years of being uniquely, wonderfully you—and to the endless beautiful chapters yet to be written."
    ],
    closing: "With endless love, warm wishes, and huge hugs,",
    signature: "Always wishing you the happiest moments 💖"
  },

  scratchWish: {
    title: "Scratch to Reveal Eraj's Secret Birthday Wish ✨",
    hint: "Use your mouse or finger to scratch off the pink glitter surface!",
    revealedMessage: "🌸 May your 21st year overflow with unexpected blessings, cozy coffee mornings, genuine laughter, and dreams that unfold into breathtaking reality. You deserve all the stars in the sky, Eraj! Happy 21st Birthday! 💖🎂"
  },

  reasons: [
    { id: 1, emoji: "🌸", title: "Radiant Presence", description: "Your smile brings warmth and gentle sunshine wherever you go." },
    { id: 2, emoji: "✨", title: "Pure Heart", description: "Your genuine kindness and empathy make everyone feel cherished and safe." },
    { id: 3, emoji: "🌷", title: "Quiet Grace", description: "The delicate and graceful way you navigate life's highs and lows." },
    { id: 4, emoji: "💖", title: "Thoughtful Gestures", description: "You notice the little things that most people miss and remember what matters." },
    { id: 5, emoji: "🎀", title: "Aesthetic Soul", description: "Your appreciation for beauty, poetry, flowers, and dreamy aesthetics." },
    { id: 6, emoji: "🍓", title: "Contagious Laughter", description: "The authentic, bubbly joy in your laugh that effortlessly brightens the day." },
    { id: 7, emoji: "🧁", title: "Soft & Strong", description: "A tender heart paired with quiet courage and admirable resilience." },
    { id: 8, emoji: "🌟", title: "Inspiring Ambition", description: "The dedication and passion you put into everything you set your mind to." },
    { id: 9, emoji: "🌿", title: "Calming Aura", description: "Just talking to you feels like a peaceful sanctuary in a busy world." },
    { id: 10, emoji: "💌", title: "Sincere Friend", description: "Unwavering loyalty, listening ears, and a heart you can always count on." },
    { id: 11, emoji: "🌙", title: "Dreamy Vision", description: "The beautiful, creative way you see hope and wonder in everyday moments." },
    { id: 12, emoji: "💐", title: "Natural Charm", description: "An effortless sweetness and elegance that doesn't need to try." },
    { id: 13, emoji: "☕", title: "Comforting Energy", description: "Like a warm cup of cocoa on a rainy morning, your presence is healing." },
    { id: 14, emoji: "🦋", title: "Growth & Bloom", description: "Watching you grow into your power and confidence with every passing year." },
    { id: 15, emoji: "🍯", title: "Golden Humility", description: "Remaining so humble, down to earth, and sweet no matter what you achieve." },
    { id: 16, emoji: "🎉", title: "Celebrating Others", description: "Always the first to cheer for and uplift those you care about." },
    { id: 17, emoji: "🍰", title: "Sweet Innocence", description: "A playful, pure spirit that makes life feel lighter and more fun." },
    { id: 18, emoji: "🕊️", title: "Gentle Patience", description: "The patient understanding and compassion you offer so freely." },
    { id: 19, emoji: "💫", title: "Unforgettable Sparkle", description: "An inner glow that lights up memories long after the day ends." },
    { id: 20, emoji: "🌹", title: "Timeless Elegance", description: "Poise, charm, and kindness woven together seamlessly." },
    { id: 21, emoji: "🎂", title: "Turning 21!", description: "Stepping into your 21st year looking stunning, loved, and destined for brilliance!" }
  ] as BirthdayReason[],

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
