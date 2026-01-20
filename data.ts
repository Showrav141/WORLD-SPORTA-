
import { NewsPost, SportCategory, MatchScore, Product, User } from './types';

export const INITIAL_NEWS: NewsPost[] = [
  {
    id: '1',
    title: 'Champions League Final: Road to Wembley 2024',
    category: SportCategory.FOOTBALL,
    content: 'The journey to Wembley has been spectacular. Both teams are preparing for the ultimate showdown in club football. Real Madrid looks to extend their record-breaking run, while Dortmund aims to recreate their 1997 magic. Tactics will be key, as Ancelotti and Terzic prepare their squads for a high-intensity battle in London. Fans from across the globe are descending upon the city, creating an electric atmosphere that only the Champions League can provide.',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    date: '2024-05-20',
    author: 'Admin Alex',
    comments: [
      { id: 'c1', user: 'FootballFan99', text: 'Can\'t wait for the kickoff! Madrid are favorites but don\'t count out the underdogs.', date: '2024-05-21' }
    ]
  },
  {
    id: '2',
    title: 'The Evolution of Modern Cricket: T20 Impact',
    category: SportCategory.CRICKET,
    content: 'The recent tournament has seen some of the highest scores in history. Batsmen are dominating while bowlers struggle to find their rhythm on flat pitches. Innovations like the "ramp shot" and "slower ball bouncer" have become standard requirements for any top-tier professional. We explore how data analytics and sports science are changing the way players train for the shortest format of the game.',
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop',
    date: '2024-05-18',
    author: 'Jane Sporta',
    comments: []
  },
  {
    id: '3',
    title: 'NBA Playoffs: The Rise of the New Guard',
    category: SportCategory.BASKETBALL,
    content: 'A season of surprises continues as lower seeds dominate the opening rounds. The league is seeing a shift in power towards younger, more versatile rosters. Stars like Anthony Edwards and Shai Gilgeous-Alexander are taking over the mantle from the legends of the past decade. Defensive schemes are becoming more complex, requiring players to be elite on both ends of the floor.',
    imageUrl: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop',
    date: '2024-05-22',
    author: 'Mark Hoops',
    comments: []
  },
  {
    id: '4',
    title: 'Tennis: Grand Slam Season Intensity',
    category: SportCategory.TENNIS,
    content: 'As the clay court season reaches its peak, all eyes are on the favorites for the French Open. The physical demand of five-set matches in the heat is testing the limits of even the most conditioned athletes. Recovery technology and mental coaching are now as important as the backhand itself.',
    imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=800&auto=format&fit=crop',
    date: '2024-05-23',
    author: 'Serena V.',
    comments: []
  },
  {
    id: '5',
    title: 'The Science of Sports Nutrition',
    category: SportCategory.ALL,
    content: 'What athletes eat is becoming a precision science. From personalized hydration plans to microscopic nutrient timing, the margin for error is shrinking. We look at how top teams are employing full-time chefs and nutritionists to gain that extra 1% edge.',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop',
    date: '2024-05-24',
    author: 'Dr. Health',
    comments: []
  }
];

export const INITIAL_SCORES: MatchScore[] = [
  { id: 'm1', sport: SportCategory.FOOTBALL, teamA: 'Real Madrid', teamB: 'Man City', scoreA: 2, scoreB: 2, status: 'Live', time: '75\'' },
  { id: 'm2', sport: SportCategory.BASKETBALL, teamA: 'Lakers', teamB: 'Warriors', scoreA: 102, scoreB: 110, status: 'Finished', time: 'FT' },
  { id: 'm3', sport: SportCategory.TENNIS, teamA: 'Alcaraz', teamB: 'Sinner', scoreA: 2, scoreB: 1, status: 'Live', time: 'Set 4' },
  { id: 'm4', sport: SportCategory.CRICKET, teamA: 'India', teamB: 'Australia', scoreA: 245, scoreB: 180, status: 'Upcoming', time: 'Starts in 1h' },
  { id: 'm5', sport: SportCategory.FOOTBALL, teamA: 'Bayern', teamB: 'Arsenal', scoreA: 1, scoreB: 0, status: 'Finished', time: 'FT' }
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Pro Elite Football Boots', price: 129.99, category: SportCategory.FOOTBALL, image: 'https://images.unsplash.com/photo-1511746315387-c4a76990fdce?q=80&w=400&auto=format&fit=crop', description: 'Lightweight and durable professional boots with carbon fiber plating for explosive speed.' },
  { id: 'p2', name: 'Custom Grade Willow Bat', price: 249.99, category: SportCategory.CRICKET, image: 'https://images.unsplash.com/photo-1593341604935-0394e01967a5?q=80&w=400&auto=format&fit=crop', description: 'Grade A English Willow, handcrafted for power hitting and perfect balance.' },
  { id: 'p3', name: 'Official Team Jersey', price: 44.99, category: SportCategory.BASKETBALL, image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=400&auto=format&fit=crop', description: 'Authentic performance wear with moisture-wicking technology and reinforced stitching.' },
  { id: 'p4', name: 'Carbon Pro Tennis Racket', price: 179.99, category: SportCategory.TENNIS, image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=400&auto=format&fit=crop', description: 'Maximum control and spin with our latest graphite composite frame technology.' },
  { id: 'p5', name: 'Training Cones (Set of 20)', price: 19.99, category: SportCategory.ALL, image: 'https://images.unsplash.com/photo-1552667466-07fdd0a4489c?q=80&w=400&auto=format&fit=crop', description: 'High-visibility markers for agility drills and field layout.' },
  { id: 'p6', name: 'All-Weather Basketball', price: 29.99, category: SportCategory.BASKETBALL, image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=400&auto=format&fit=crop', description: 'Superior grip for indoor and outdoor courts, designed for consistent flight.' },
  { id: 'p7', name: 'Cricket Wicket Set', price: 59.99, category: SportCategory.CRICKET, image: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?q=80&w=400&auto=format&fit=crop', description: 'Regulation size heavy-duty wooden stumps with bails.' }
];

export const INITIAL_USERS: User[] = [
  { id: 'u1', username: 'admin', email: 'admin@worldsporta.com', role: 'admin', blocked: false },
  { id: 'u2', username: 'johndoe', email: 'john@example.com', role: 'user', blocked: false },
  { id: 'u3', username: 'sports_fan_24', email: 'fan@gmail.com', role: 'user', blocked: false },
  { id: 'u4', username: 'coach_mike', email: 'mike@academy.com', role: 'user', blocked: true }
];
