// Seed data for the frontend demo. Everything here is replaced by MongoDB later.
//
// IMPORTANT (for the presentation): the stalls below are real places around UST / Sampaloc taken from
// public food-blog and news listings. Google Maps finds each one by name + address, so check that the pin
// lands correctly. Hours and prices are NOT verified: confirm them on-site before the final defense.
// Reviews, posts and users are made-up demo content.

const H = 3600000
const D = 24 * H

// Reddit-style post flairs. A "Review" is a blog post with a star rating, tagged to a stall.
// "Suggested place" replaces the old suggest-a-stall form.
export const CATEGORIES = ['Review', 'Suggested place', 'Question', 'Budget find', 'Hot take']
export const FLAIR_COLORS = {
  'Suggested place': '#f2a93b', Review: '#4fa37c', Question: '#5b8fb9', 'Budget find': '#9bbf4a', 'Hot take': '#dd4f2f',
}

export const GENRES = ['Karinderia', 'Dimsum & siomai', 'Ilocano', 'Bulalo & soup', 'Silog', 'Shakes & sweets', 'Café', 'Street snacks']

export const GENRE_EMOJI = {
  Karinderia: '🍛', 'Dimsum & siomai': '🥟', Ilocano: '🥘', 'Bulalo & soup': '🍲',
  Silog: '🍳', 'Shakes & sweets': '🥤', Café: '☕', 'Street snacks': '🍢',
}

export const MOODS = [
  { id: 'all', label: 'Anything', genres: GENRES },
  { id: 'meal', label: 'A real meal', genres: ['Karinderia', 'Ilocano', 'Silog', 'Bulalo & soup'] },
  { id: 'snack', label: 'Quick bites', genres: ['Dimsum & siomai', 'Street snacks'] },
  { id: 'sip', label: 'Sweet or a sip', genres: ['Shakes & sweets', 'Café'] },
]

const STALLS = [
  {
    id: 'mang-tootz', name: 'Mang Tootz Food Haus', genre: 'Karinderia', tier: 1, area: 'Padre Noval',
    address: '1135 Padre Noval St., Sampaloc, Manila',
    hours: '6 AM to 9 PM, Monday to Saturday',
    desc: 'A long-time karinderia near the UST Noval gate, famous for its Banana Rhum-a: mini turon with a rhum-flavored sauce and powdered sugar.',
    dishes: ['Banana Rhum-a', 'Daily ulam', 'Rice meals'], ownerId: 'u-owner',
  },
  {
    id: 'dimsum-treats', name: 'Dimsum Treats', genre: 'Dimsum & siomai', tier: 1, area: 'Dapitan',
    address: 'Dapitan St., Sampaloc, Manila (several branches in Sampaloc)',
    hours: 'Confirm on site',
    desc: 'The student siomai house. Steamed dimsum with soy sauce and chili on top, the usual after-class stop around Dapitan.',
    dishes: ['Siomai', 'Dimsum', 'Chili oil'], ownerId: null,
  },
  {
    id: 'tinuno', name: 'Tinuno Grill and Cafe', genre: 'Ilocano', tier: 1, area: 'Earnshaw',
    address: 'Earnshaw St., Sampaloc, Manila (near CPAR and UST)',
    hours: 'Confirm on site',
    desc: 'Ilocano-inspired eatery on Earnshaw. Known for its sizzling bagnet sisig and grilled chicken and beef dishes that are easy on the wallet.',
    dishes: ['Bagnet sisig', 'Tinuno chicken', 'Tinuno beef'], ownerId: null,
  },
  {
    id: 'bulaluhan', name: 'Bulaluhan sa España', genre: 'Bulalo & soup', tier: 2, area: 'España',
    address: '2166 España Blvd. cor. Josefina St., Sampaloc, Manila',
    hours: 'Confirm on site',
    desc: 'A sit-down Filipino spot on España Blvd for steaming bowls of bulalo. Best shared with a barkada on a rainy day.',
    dishes: ['Bulalo', 'Filipino soups', 'Rice'], ownerId: null,
  },
  {
    id: 'ate-ricas', name: "Ate Rica's Bacsilog", genre: 'Silog', tier: 1, area: 'Dapitan',
    address: 'Dapitan, Sampaloc, Manila',
    hours: 'Confirm on site',
    desc: 'Affordable silog comfort food that started as a food cart near DLSU and became a campus favorite. Pick one silog or combine two.',
    dishes: ['Bacsilog', 'Tapsilog', 'Silog combos'], ownerId: null,
  },
  {
    id: 'starrs', name: "Starr's Famous Milkshakes", genre: 'Shakes & sweets', tier: 1, area: 'V. Concepcion',
    address: 'Near UST, Sampaloc, Manila',
    hours: 'Confirm on site',
    desc: 'Thick milkshakes and hotdog sandwiches. A cold finish after a long walk down Dapitan.',
    dishes: ['Milkshakes', 'Hotdog sandwiches', 'Chicken sandwich'], ownerId: null,
  },
  {
    id: 'ichill', name: 'IChill Theater Cafe', genre: 'Café', tier: 2, area: 'Padre Noval',
    address: 'Padre Noval St., Sampaloc, Manila',
    hours: 'Confirm on site',
    desc: 'A relaxed cafe on Noval where students unwind after class or catch up on readings.',
    dishes: ['Coffee', 'Snacks', 'Study corner'], ownerId: null,
  },
  {
    id: 'asturias-row', name: 'Asturias Sidewalk Snack Row', genre: 'Street snacks', tier: 1, area: 'Asturias',
    address: 'Asturias St., Sampaloc, Manila (Dapitan side)',
    hours: 'Confirm on site',
    desc: 'Open-air food stops along Asturias with quick snacks and fresh fruit shakes, eaten right on the sidewalk.',
    dishes: ['Fruit shakes', 'Sidewalk snacks', 'Photocopy break'], ownerId: null,
  },
].map((s) => ({ ...s, status: 'published' }))

const USERS = [
  { id: 'u-demo', name: 'Juan D.', email: 'juan@example.com', pw: 'demo1234', role: 'user' },
  { id: 'u-owner', name: 'Tootz Kitchen', email: 'owner@example.com', pw: 'demo1234', role: 'owner' },
  { id: 'u-admin', name: 'FooBu Admin', email: 'admin@example.com', pw: 'admin1234', role: 'admin' },
  { id: 'u-mika', name: 'Mika R.', email: 'mika@example.com', pw: null, role: 'user' },
  { id: 'u-paolo', name: 'Paolo D.', email: 'paolo@example.com', pw: null, role: 'user' },
  { id: 'u-ana', name: 'Ana L.', email: 'ana@example.com', pw: null, role: 'user' },
  { id: 'u-kurt', name: 'Kurt F.', email: 'kurt@example.com', pw: null, role: 'user' },
]

export function buildSeed() {
  const t = Date.now()

  return {
    v: 3,
    session: null,
    users: USERS.map((u) => ({ ...u, joinedAt: t - 40 * D })),
    stalls: STALLS,
    posts: [
      { id: 'p1', userId: 'u-mika', author: 'Mika R.', category: 'Review', stallId: 'mang-tootz', rating: 5,
        ordered: 'Banana Rhum-a, one tray to share', place: '', createdAt: t - 3 * H, votes: { a: 1, b: 1, c: 1 },
        title: 'Banana Rhum-a after class is a whole mood',
        body: 'I walked past Mang Tootz for a whole semester before finally stopping in. The Banana Rhum-a is the reason I keep going back: warm and crispy outside, soft inside, with a sweet rhum-flavored sauce and a snow of powdered sugar.\n\nGet a tray for the barkada and split it on the Noval steps. It is the kind of snack that makes a long day of classes feel a lot shorter.\n\nWould I go back? I already did, twice this week.',
        comments: [{ id: 'c1', userId: 'u-owner', author: 'Tootz Kitchen', body: 'Salamat po! See you again.', createdAt: t - H }] },
    ],
    favorites: { 'u-demo': ['mang-tootz', 'tinuno'] },
    claims: [
      { id: 'cl1', userId: 'u-paolo', author: 'Paolo D.', stallId: 'dimsum-treats', note: 'I help manage the Dapitan branch. Can send a business permit.', createdAt: t - 5 * H, status: 'pending' },
    ],
    reports: [],
    lists: [
      { id: 'l1', title: 'Student budget meals', description: 'Fill the tray without emptying the wallet.', stallIds: ['mang-tootz', 'ate-ricas', 'tinuno', 'dimsum-treats'] },
      { id: 'l2', title: 'Broth and grill', description: 'Hot bowls and smoky plates for rainy days.', stallIds: ['bulaluhan', 'tinuno'] },
      { id: 'l3', title: 'Sweet and a sip', description: 'Shakes, coffee and one very good turon.', stallIds: ['starrs', 'ichill', 'mang-tootz', 'asturias-row'] },
      { id: 'l4', title: 'Walk-up snacks', description: 'Grab it, eat it, keep walking.', stallIds: ['dimsum-treats', 'asturias-row', 'mang-tootz'] },
    ],
  }
}
