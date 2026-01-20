
export enum SportCategory {
  FOOTBALL = 'Football',
  CRICKET = 'Cricket',
  BASKETBALL = 'Basketball',
  TENNIS = 'Tennis',
  ALL = 'All'
}

export interface NewsPost {
  id: string;
  title: string;
  category: SportCategory;
  content: string;
  imageUrl: string;
  date: string;
  author: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  date: string;
}

export interface MatchScore {
  id: string;
  sport: SportCategory;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  status: 'Live' | 'Finished' | 'Upcoming';
  time: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: SportCategory;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  blocked: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  date: string;
}
