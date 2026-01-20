
import React, { useState, useEffect, useMemo } from 'react';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  Link, 
  Navigate, 
  useNavigate,
  useParams
} from 'react-router-dom';
import { 
  Trophy, 
  Newspaper, 
  ShoppingBag, 
  Gamepad2, 
  Settings, 
  LogOut, 
  User as UserIcon, 
  Search,
  Plus,
  Trash2,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Cpu,
  Mail,
  ShieldCheck,
  Zap,
  Star,
  MessageSquare
} from 'lucide-react';

import { SportCategory, NewsPost, MatchScore, Product, CartItem, User, Comment } from './types';
import { INITIAL_NEWS, INITIAL_SCORES, INITIAL_PRODUCTS, INITIAL_USERS } from './data';
import { getAIAnalysis, getNewsSummary } from './services/geminiService';

// --- Components ---

const Layout: React.FC<{ 
  children: React.ReactNode; 
  user: User | null; 
  onLogout: () => void;
  cartCount: number;
}> = ({ children, user, onLogout, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tighter text-blue-400">
              <Trophy size={32} />
              <span>WORLDSPORTA</span>
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-6 items-center">
              <Link to="/" className="text-sm font-bold hover:text-blue-400 transition">Home</Link>
              <Link to="/news" className="text-sm font-bold hover:text-blue-400 transition">News</Link>
              <Link to="/store" className="text-sm font-bold hover:text-blue-400 transition">Store</Link>
              <Link to="/game" className="text-sm font-bold hover:text-blue-400 transition">Game</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="px-3 py-1.5 rounded-lg text-xs font-black bg-blue-600 hover:bg-blue-700 uppercase tracking-widest">Admin</Link>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Link to="/store/cart" className="relative p-2 hover:bg-slate-800 rounded-full transition">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900">
                    {cartCount}
                  </span>
                )}
              </Link>
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <div className="text-xs font-bold text-slate-300">Hi, {user.username}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{user.role}</div>
                  </div>
                  <button onClick={onLogout} className="p-2 hover:bg-red-500/10 rounded-full transition text-slate-400 hover:text-red-500">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-bold transition">Login</Link>
              )}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2"><Menu /></button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">{children}</main>

      <footer className="bg-slate-900 text-slate-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-black text-2xl mb-6 tracking-tighter italic">STAY AHEAD OF THE GAME.</h3>
            <p className="mb-8 max-w-md">Subscribe to the WorldSporta newsletter for weekly deep-dives into tactics, breaking news, and exclusive member discounts on our pro gear.</p>
            <div className="flex gap-2 max-w-sm">
              <input type="email" placeholder="Your email address" className="bg-slate-800 border-none rounded-xl px-4 py-3 w-full text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition shadow-xl"><Mail /></button>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-widest">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/news" className="hover:text-white transition">Latest Updates</Link></li>
              <li><Link to="/store" className="hover:text-white transition">Equipment Shop</Link></li>
              <li><Link to="/game" className="hover:text-white transition">Reflex Game</Link></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-widest">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition">Our Vision</a></li>
              <li><a href="#" className="hover:text-white transition">Partner Program</a></li>
              <li><a href="#" className="hover:text-white transition">Career Portal</a></li>
              <li><a href="#" className="hover:text-white transition">Support Hub</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs font-medium border-t border-slate-800 pt-8 max-w-7xl mx-auto">
          &copy; 2024 WORLDSPORTA GLOBAL LTD. ALL PERFORMANCE DATA IS REAL-TIME.
        </div>
      </footer>
    </div>
  );
};

// --- Pages ---

const NewsDetail = ({ news }: { news: NewsPost[] }) => {
  const { id } = useParams();
  const post = news.find(p => p.id === id);
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post?.comments || []);
  const [newComment, setNewComment] = useState('');

  if (!post) return <div className="p-20 text-center">Article not found</div>;

  const handleSummarize = async () => {
    setLoadingSummary(true);
    const result = await getNewsSummary(post.content);
    setSummary(result);
    setLoadingSummary(false);
  };

  const addComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      user: 'Guest_User',
      text: newComment,
      date: new Date().toISOString().split('T')[0]
    };
    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="relative h-[60vh]">
        <img src={post.imageUrl} className="w-full h-full object-cover" alt={post.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent" />
        <div className="absolute bottom-10 left-0 right-0 max-w-5xl mx-auto px-4 text-white">
          <span className="bg-blue-600 px-3 py-1 rounded-lg text-xs font-bold uppercase mb-4 inline-block">{post.category}</span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">{post.title}</h1>
          <div className="mt-6 flex items-center gap-4 text-sm font-medium text-slate-300">
            <span>By {post.author}</span>
            <span>&bull;</span>
            <span>{post.date}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <p className="text-xl text-slate-700 leading-relaxed mb-8 font-medium">
            {post.content}
          </p>
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-12">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Cpu className="text-blue-500" /> AI Insights Summary
            </h3>
            {summary ? (
              <div className="prose prose-blue whitespace-pre-wrap text-slate-600">{summary}</div>
            ) : (
              <button 
                onClick={handleSummarize}
                disabled={loadingSummary}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-blue-600 transition shadow-lg"
              >
                {loadingSummary ? 'Synthesizing...' : 'Summarize with Gemini AI'}
              </button>
            )}
          </div>

          <section>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <MessageSquare /> Discussions ({comments.length})
            </h3>
            <form onSubmit={addComment} className="mb-10">
              <textarea 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none h-24 mb-4"
                placeholder="Join the conversation..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition">Post Comment</button>
            </form>
            <div className="space-y-6">
              {comments.map(c => (
                <div key={c.id} className="border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                      {c.user[0]}
                    </div>
                    <span className="font-bold text-sm">{c.user}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{c.date}</span>
                  </div>
                  <p className="text-slate-600 text-sm">{c.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <div className="bg-slate-900 text-white p-8 rounded-3xl">
            <h4 className="text-lg font-bold mb-4">Trending Tags</h4>
            <div className="flex flex-wrap gap-2">
              {['MatchAnalysis', 'Transfers', 'Fitness', 'Tactics', 'Draft2024'].map(tag => (
                <span key={tag} className="bg-slate-800 px-3 py-1 rounded-full text-xs hover:bg-blue-600 cursor-pointer transition">#{tag}</span>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
            <Zap className="text-blue-600 mb-4" size={32} />
            <h4 className="text-lg font-bold text-slate-900 mb-2">Why WorldSporta?</h4>
            <p className="text-sm text-slate-600">Get the deepest insights from top-tier professionals and the latest performance gear used by champions.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const Home = ({ scores, news }: { scores: MatchScore[], news: NewsPost[] }) => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="relative h-[70vh] flex items-center justify-center text-white overflow-hidden">
        <img src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover brightness-[0.3]" alt="Sports Hero" />
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-blue-600/30 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-blue-500/30">
            <ShieldCheck size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Global Sports Authority</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none italic uppercase">Empowering Your <br /><span className="text-blue-500">Athletic Spirit.</span></h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-medium">Your definitive hub for real-time analytics, professional-grade news, and the world's finest sports equipment.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/news" className="px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-blue-50 transition shadow-2xl uppercase text-sm tracking-widest">Read Updates</Link>
            <Link to="/store" className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-2xl uppercase text-sm tracking-widest">Shop Gear</Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          {[
            { label: 'Live Insights', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
            { label: 'Pro Analysis', icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Elite Gear', icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-50' },
            { label: 'Global Community', icon: UserIcon, color: 'text-purple-500', bg: 'bg-purple-50' },
          ].map(f => (
            <div key={f.label} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition flex flex-col items-center text-center">
              <div className={`w-16 h-16 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-6`}>
                <f.icon size={32} />
              </div>
              <h3 className="font-bold text-lg">{f.label}</h3>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">LATEST DISPATCHES.</h2>
          <Link to="/news" className="text-blue-600 font-bold flex items-center gap-1 hover:translate-x-1 transition uppercase text-xs tracking-widest">Full Archive <ChevronRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {news.slice(0, 3).map(post => (
            <Link to={`/news/${post.id}`} key={post.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 flex flex-col">
              <div className="aspect-[16/10] overflow-hidden relative">
                <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={post.title} />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-600">{post.category}</div>
              </div>
              <div className="p-8 flex-grow">
                <div className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-[0.2em]">{post.date} &bull; {post.author}</div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition tracking-tighter">{post.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                  READ ARTICLE <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const StorePage = ({ products, addToCart }: { products: Product[], addToCart: (p: Product) => void }) => {
  const [filter, setFilter] = useState(SportCategory.ALL);

  const filtered = products.filter(p => filter === SportCategory.ALL || p.category === filter);

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Pro Performance</div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">WORLDSPORTA STORE.</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.values(SportCategory).map(cat => (
              <button 
                key={cat} 
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map(p => (
            <div key={p.id} className="group bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 flex flex-col">
              <div className="aspect-square bg-slate-50 rounded-[2rem] mb-6 overflow-hidden relative">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={p.name} />
                {p.price > 100 && (
                  <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Star size={10} /> PREMIUM
                  </div>
                )}
                <button 
                  onClick={() => addToCart(p)}
                  className="absolute bottom-4 right-4 bg-slate-900 text-white w-14 h-14 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-2xl hover:bg-blue-600"
                >
                  <Plus size={24} />
                </button>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-2">{p.category}</div>
              <h3 className="font-bold text-slate-900 mb-2 truncate text-lg group-hover:text-blue-600 transition">{p.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-6 leading-relaxed flex-grow">{p.description}</p>
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="text-2xl font-black text-slate-900 tracking-tighter">${p.price}</div>
                <div className="text-[10px] font-bold text-green-600 uppercase">In Stock</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Admin Section ---

const AdminUserPanel = ({ users }: { users: User[] }) => {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black italic tracking-tighter">USER MANAGEMENT.</h2>
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold">{users.length} Total Accounts</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map(u => (
              <tr key={u.id} className="group">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                      {u.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{u.username}</div>
                      <div className="text-[10px] font-black uppercase text-slate-300 tracking-widest">{u.role}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm text-slate-500">{u.email}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.blocked ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                    {u.blocked ? 'Restricted' : 'Verified'}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition"><Settings size={16} /></button>
                    {u.role !== 'admin' && <button className="p-2 text-slate-400 hover:text-red-500 transition"><Trash2 size={16} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main Application Wrapper ---

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [news, setNews] = useState<NewsPost[]>(INITIAL_NEWS);
  const [scores, setScores] = useState<MatchScore[]>(INITIAL_SCORES);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleLogout = () => setUser(null);

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout} cartCount={cart.reduce((a, b) => a + b.quantity, 0)}>
        <Routes>
          <Route path="/" element={<Home scores={scores} news={news} />} />
          <Route path="/news" element={<div className="bg-slate-50 py-20"><NewsPage news={news} user={user} /></div>} />
          <Route path="/news/:id" element={<NewsDetail news={news} />} />
          <Route path="/store" element={<StorePage products={products} addToCart={addToCart} />} />
          <Route path="/game" element={<MiniGame />} />
          <Route path="/login" element={<LoginPage onLogin={setUser} />} />
          <Route path="/admin/*" element={
            user?.role === 'admin' ? (
              <div className="bg-slate-50 min-h-screen py-16">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex items-center gap-6 mb-12">
                    <Link to="/admin" className="px-6 py-3 bg-white rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-200">System Logs</Link>
                    <Link to="/admin/users" className="px-6 py-3 bg-white rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-200">User Control</Link>
                    <Link to="/admin/news" className="px-6 py-3 bg-white rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-200">Editorial</Link>
                  </div>
                  <Routes>
                    <Route index element={<AdminDashboard news={news} users={users} scores={scores} />} />
                    <Route path="users" element={<AdminUserPanel users={users} />} />
                    <Route path="news" element={<div>News Mgmt (Placeholder)</div>} />
                  </Routes>
                </div>
              </div>
            ) : <Navigate to="/login" />
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

// ... Remaining components (LoginPage, MiniGame, AdminDashboard, etc.) from previous context, ideally updated for styling ...
// (Omitting for brevity as they follow similar aesthetic patterns)

// Ensure AdminDashboard is defined
const AdminDashboard = ({ news, users, scores }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Users</div>
      <div className="text-4xl font-black text-slate-900">{users.length}</div>
    </div>
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">News Articles</div>
      <div className="text-4xl font-black text-slate-900">{news.length}</div>
    </div>
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Match Coverage</div>
      <div className="text-4xl font-black text-slate-900">{scores.length}</div>
    </div>
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">System Health</div>
      <div className="text-xl font-black text-green-500 flex items-center gap-2 uppercase tracking-widest">
        <Zap size={16} /> OPTIMAL
      </div>
    </div>
  </div>
);

// (Re-including essential login logic for completeness)
const LoginPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = INITIAL_USERS.find(u => u.username === username);
    if (user) { onLogin(user); navigate('/'); }
    else { alert("Invalid credentials."); }
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 border border-slate-100">
        <div className="text-center mb-10">
          <Trophy className="mx-auto text-blue-600 mb-6" size={64} />
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter italic">ACCESS PORTAL.</h1>
          <p className="text-slate-400 text-sm">Sign in to your WorldSporta command center</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <input className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition shadow-2xl uppercase tracking-widest text-xs">Verify & Login</button>
        </form>
      </div>
    </div>
  );
};

// Re-including NewsPage from original with small design polish
const NewsPage = ({ news, user }: { news: NewsPost[], user: User | null }) => {
  const [filter, setFilter] = useState(SportCategory.ALL);
  const [search, setSearch] = useState('');
  const filteredNews = useMemo(() => news.filter(post => (filter === SportCategory.ALL || post.category === filter) && post.title.toLowerCase().includes(search.toLowerCase())), [news, filter, search]);
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-16">
        <h1 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter italic">BREAKING UPDATES.</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Search archive..." className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.values(SportCategory).map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-blue-600 text-white shadow-xl' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>{cat}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {filteredNews.map(post => (
          <Link to={`/news/${post.id}`} key={post.id} className="group flex flex-col">
            <div className="aspect-video rounded-[2rem] overflow-hidden mb-6 shadow-md group-hover:shadow-2xl transition duration-500">
              <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={post.title} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition tracking-tighter leading-tight mb-4">{post.title}</h2>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">{post.date} &bull; {post.author}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// MiniGame logic maintained with design polish
const MiniGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  useEffect(() => {
    let timer: any;
    if (isPlaying && timeLeft > 0) timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    else if (timeLeft === 0) setIsPlaying(false);
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);
  const startGame = () => { setScore(0); setTimeLeft(15); setIsPlaying(true); moveTarget(); };
  const moveTarget = () => setTargetPos({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
  const handleHit = () => { if (!isPlaying) return; setScore(p => p + 10); moveTarget(); };
  return (
    <div className="py-20 bg-slate-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
        <h1 className="text-5xl font-black mb-4 tracking-tighter italic uppercase">Reflex Strike.</h1>
        <div className="flex gap-8 mb-12">
          <div className="text-center"><div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Score</div><div className="text-4xl font-black">{score}</div></div>
          <div className="text-center"><div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Time</div><div className="text-4xl font-black">{timeLeft}s</div></div>
        </div>
        <div className="relative w-full aspect-video bg-slate-800 rounded-[3rem] overflow-hidden border-4 border-slate-700 shadow-2xl">
          {!isPlaying ? (
            <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center z-20">
              {timeLeft === 0 && <div className="text-2xl font-black mb-8">FINAL SCORE: {score}</div>}
              <button onClick={startGame} className="px-12 py-5 bg-blue-600 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl hover:bg-blue-700 transition">Begin Drill</button>
            </div>
          ) : (
            <button onClick={handleHit} style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }} className="absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-2xl hover:scale-110 active:scale-95 transition-transform">⚽</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
