import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Award, 
  Quote, 
  TrendingUp, 
  HelpCircle, 
  BookOpen, 
  Briefcase, 
  Info,
  Clock,
  ArrowRight,
  TrendingDown,
  ChevronRight,
  User,
  Heart,
  Share2,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CelebrityProfile, NewsNotification } from './types';
import SocialFeed from './components/SocialFeed';
import NotificationCenter from './components/NotificationCenter';

// Pre-baked high-fidelity profiles for flawless offline/ready experience
const PREBAKED_PROFILES: Record<string, CelebrityProfile> = {
  'albert einstein': {
    name: 'Albert Einstein',
    shortDescription: 'Theoretical physicist widely acknowledged to be one of the greatest and most influential physicists of all time.',
    category: 'Physicist & Visionary',
    biography: {
      birthDate: 'March 14, 1879',
      birthPlace: 'Ulm, Kingdom of Württemberg, German Empire',
      earlyLife: 'Albert Einstein was born in Ulm, Germany, into a family of secular Ashkenazi Jews. He showed early strengths in mathematics and physics, often teaching himself advanced geometry. He struggled with rote learning methods in school, which led him to drop out of high school in Munich, later finishing his secondary education in Switzerland.',
      careerTrajectory: 'Developing his groundbreaking work while working as a patent examiner at the Swiss Patent Office, Einstein published four revolutionary papers in his "Annus Mirabilis" (Miracle Year) of 1905. These introduced the photon theory of light, explained Brownian motion, established special relativity, and derived the mass-energy equivalence equation E=mc².',
      personalLife: 'Einstein was married twice, first to fellow student Mileva Marić (with whom he had three children), and later to his cousin Elsa Löwenthal. He was a passionate amateur violinist and often used music as a creative aid to untangle complex mathematical barriers.',
      impactAndLegacy: 'Beyond establishing the general theory of relativity—the foundation of modern cosmology—Einstein was a lifelong advocate for peace, nuclear disarmament, and global cooperation. His name became globally synonymous with genius, reshaping humanity\'s understanding of space, time, gravity, and the universe.'
    },
    keyPersonalTraits: ['Visionary', 'Non-conformist5', 'Curious', 'Humanitarian'],
    careerHighlights: [
      {
        year: '1905',
        title: 'The Miracle Year (Annus Mirabilis)',
        description: 'Published four legendary papers establishing photoelectric effect, Brownian motion, special relativity, and E=mc² in Annalen der Physik.',
        impact: 'Fundamentally transformed the landscape of classical physics and paved the way for quantum mechanics.'
      },
      {
        year: '1915',
        title: 'General Theory of Relativity Completed',
        description: 'Presented his new theory of gravity, describing it as a dynamic curvature of spacetime caused by mass and energy.',
        impact: 'Replaced Newtonian gravity and predicted gravitational lensing, black holes, and cosmological expansion.'
      },
      {
        year: '1921',
        title: 'Awarded the Nobel Prize in Physics',
        description: 'Officially received the Nobel Prize for his services to Theoretical Physics, and especially for his discovery of the law of the photoelectric effect.',
        impact: 'Solidified quantum theory and elevated him to the position of an international public icon.'
      }
    ],
    awardsAndRecognition: [
      { award: 'Nobel Prize in Physics', year: '1921', category: 'Theoretical Physics' },
      { award: 'Copley Medal', year: '1925', category: 'Royal Society of London' },
      { award: 'Max Planck Medal', year: '1929', category: 'German Physical Society' },
      { award: 'Franklin Medal', year: '1935', category: 'Franklin Institute' }
    ],
    socialMediaUpdates: [
      {
        id: 'ae-1',
        platform: 'twitter',
        username: '@albert_einstein',
        timestamp: '2 hours ago',
        content: 'Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution. ✨🔭 #KeepCurious #Physics',
        likes: 124000,
        sharesCount: 42000,
        repliesCount: 8900
      },
      {
        id: 'ae-2',
        platform: 'instagram',
        username: '@albert.einstein.official',
        timestamp: '1 day ago',
        content: 'Taking a small break from equations to enjoy a beautiful warm afternoon with my violin. Music is the language of the soul, and in many ways, it mirrors the secret rhythms of the cosmic background. 🎻🌅🌌',
        likes: 312000,
        sharesCount: 15400,
        repliesCount: 4100,
        hasImage: true
      },
      {
        id: 'ae-3',
        platform: 'linkedin',
        username: 'Albert Einstein',
        timestamp: '3 days ago',
        content: 'It is a supreme art of the teacher to awaken joy in creative expression and knowledge. During my years lecturing across universities, I have always observed that curiosity is a delicate weed which, aside from stimulation, stands mainly in need of freedom. Let us give our students the autonomy to dare and discover.',
        likes: 95000,
        sharesCount: 18000,
        repliesCount: 2200
      }
    ],
    newsAlerts: [
      {
        id: 'ae-news-1',
        title: 'New astronomical observations confirm Einstein\'s gravitational wave predictions in distant binary star system',
        source: 'Astrophysical Journal',
        timeAgo: 'Just Now',
        summary: 'Deep-space interferometers detected a micro-warp in spacetime matching Albert Einstein\'s original field equations from 1915 with 99.99% accuracy.',
        category: 'breaking',
        importance: 'high'
      },
      {
        id: 'ae-news-2',
        title: 'Rare hand-annotated relativity manuscript acquired for national archive',
        source: 'The Guardian',
        timeAgo: '4 hours ago',
        summary: 'A pristine original 1912 draft outlining early equations of general relativity was preserved and digitized for global open access.',
        category: 'achievement',
        importance: 'medium'
      },
      {
        id: 'ae-news-3',
        title: 'Global Physics Symposium celebrates Einstein Legacy with annual grants',
        source: 'Nature Science',
        timeAgo: '1 day ago',
        summary: 'A new international fellowship was announced targeting visionary research into dark energy and deep cosmic scale integration.',
        category: 'announcement',
        importance: 'low'
      }
    ],
    quotes: [
      "The important thing is not to stop questioning. Curiosity has its own reason for existing.",
      "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
      "I have no special talent. I am only passionately curious."
    ],
    trivia: [
      "Einstein was offered the presidency of Israel in 1952 but politely declined, stating he lacked the natural aptitude and experience to deal properly with people.",
      "The pathologist who performed Einstein's autopsy stole his brain and kept it in a jar for several decades, hoping to uncover the physical secret to his immense IQ.",
      "He loved sailing, although he was famously terrible at it and frequently capsized his boat, requiring local rescues."
    ],
    searchSuggestions: ['Marie Curie', 'Isaac Newton', 'Stephen Hawking', 'Nikola Tesla']
  },
  'taylor swift': {
    name: 'Taylor Swift',
    shortDescription: 'One of the most prominent singer-songwriters and cultural icons of the 21st century, celebrated for her storytelling and narrative songwriting.',
    category: 'Singer-Songwriter & Cultural Icon',
    biography: {
      birthDate: 'December 13, 1889',
      birthPlace: 'West Reading, Pennsylvania, USA',
      earlyLife: 'Taylor Swift spent her earliest years on a Christmas tree farm before pursuing a career in country music in Nashville, Tennessee. She began playing guitar at age 12 and signed a music publishing deal at age 14, cementing her life commitment to composing authentic stories from youthful experiences.',
      careerTrajectory: 'Her self-titled debut in 2006 launched her country music stardom. She gracefully expanded into pop and synth-pop with her landmark albums "Red" and "1989", later proving her diverse acoustic versatility during the pandemic with the alternative indie-folk sisters "folklore" and "evermore". She achieved unprecedented historic heights with her Career-spanning Eras Tour.',
      personalLife: 'Swift is an advocate for artists rights, having famously re-recorded her first six studio albums to gain full ownership of her master catalog. She maintains a tight bond with her global community of fans through easter eggs, acoustic sessions, and personal notes.',
      impactAndLegacy: 'With record-breaking chart entries, numerous Album of the Year Grammys, and immense cultural influence, Swift revolutionized the business of modern music. She redefined streaming music economics, touring metrics, and elevated lyric songwriting to a subject of serious literary analysis.'
    },
    keyPersonalTraits: ['Creative Storyteller', 'Determined', 'Empathetic', 'Business-savvy'],
    careerHighlights: [
      {
        year: '2008',
        title: 'Release of breakthrough album "Fearless"',
        description: 'Her second studio album stayed at No. 1 on Billboard for 11 weeks and became the most awarded country album in history.',
        impact: 'Won her first Album of the Year Grammy, making her the youngest solo artist to win the category at the time.'
      },
      {
        year: '2014',
        title: 'Official Transition to Pop with "1989"',
        description: 'Released a complete synth-pop album featuring global chart-toppers like "Shake It Off" and "Blank Space".',
        impact: 'Slept away any genre constraints, certifying her status as a global pop titan and dominating pop charts worldwide.'
      },
      {
        year: '2023-2024',
        title: 'The Eras Tour & Billion-Dollar Milestone',
        description: 'Embarked on a historical stadium tour celebrating all eras of her career, boosting local economies globally and producing a hit film.',
        impact: 'Became the highest-grossing music tour in human history and she was named Time Person of the Year for 2023.'
      }
    ],
    awardsAndRecognition: [
      { award: '4x Grammy Album of the Year', year: '2010/2016/2021/2024', category: 'Fearless, 1989, folklore, Midnights' },
      { award: 'Time Person of the Year', year: '2023', category: 'Cultural & Economic Impact' },
      { award: 'IFPI Global Recording Artist of the Year', year: '2023', category: 'Worldwide Chart Performance' }
    ],
    socialMediaUpdates: [
      {
        id: 'ts-1',
        platform: 'instagram',
        username: '@taylorswift',
        timestamp: '3 hours ago',
        content: 'Writing on a cozy rainy morning is my absolute safe haven. These acoustic guitar chords represent a new chapter that I cannot wait to share with all of you. See you soon in the stadiums! 🌧️✍️🎸💛',
        likes: 4210000,
        sharesCount: 180000,
        repliesCount: 65100,
        hasImage: true
      },
      {
        id: 'ts-2',
        platform: 'twitter',
        username: '@taylorswift13',
        timestamp: '5 hours ago',
        content: 'To everyone bringing their friendship bracelets, singing at the top of their lungs, and dancing in the rain—this tour has been the adventure of my life. Thank you from the bottom of my heart. 🫶✨ #TheErasTour',
        likes: 850000,
        sharesCount: 210000,
        repliesCount: 39000
      },
      {
        id: 'ts-3',
        platform: 'tiktok',
        username: '@taylorswift',
        timestamp: '2 days ago',
        content: 'Quick behind the scenes look at the acoustic set prep! Trying to decide which surprise songs to mashup next, leave your wild theories in the comments. 🧐🎤🎹',
        likes: 2900000,
        sharesCount: 88000,
        repliesCount: 42000,
        hasImage: true
      }
    ],
    newsAlerts: [
      {
        id: 'ts-news-1',
        title: 'Taylor Swift extends record-breaking global charts run with new release milestones',
        source: 'Billboard',
        timeAgo: 'Just Now',
        summary: 'All top ten hotspots of the hot 100 single charts have been simultaneously occupied by her latest acoustic vault selections.',
        category: 'breaking',
        importance: 'high'
      },
      {
        id: 'ts-news-2',
        title: 'Musicology Department announces upcoming Swift literary theory conference',
        source: 'Rolling Stone',
        timeAgo: '6 hours ago',
        summary: 'Undergraduate and doctoral candidates gather to debate high-poetic narratives, folklore symbolism, and the legacy of self-expression.',
        category: 'trending',
        importance: 'medium'
      },
      {
        id: 'ts-news-3',
        title: 'Historic charity donation announced for local food banks along tour route',
        source: 'Associated Press',
        timeAgo: '1 day ago',
        summary: 'Representative coalitions for community pantries report massive funding offsets from Swift\'s silent structural campaign contributions.',
        category: 'achievement',
        importance: 'low'
      }
    ],
    quotes: [
      "People are going to judge you anyway, so you might as well do what you want.",
      "The scary thing about unique paths is you do not know where they lead, but you follow your courage anyway.",
      "In life, you have to write your own happy endings, even if you write them through songs."
    ],
    trivia: [
      "Taylor was named after singer-songwriter James Taylor, and she grew up working on a Christmas tree farm her father leased.",
      "She has a massive obsession with cats, housing several famous ones named after her favorite television characters (Meredith Grey, Olivia Benson, and Benjamin Button).",
      "She has written or co-written every single song in her discography, including an entire studio album ('Speak Now') written completely solo at age 20."
    ],
    searchSuggestions: ['Beyonce', 'Selena Gomez', 'Ariana Grande', 'Billie Eilish']
  },
  'steve jobs': {
    name: 'Steve Jobs',
    shortDescription: 'Industrial designer, investor, and media proprietor who co-founded Apple Inc. and revolutionized personal computing and mobile technology.',
    category: 'Tech Innovator & Marketer',
    biography: {
      birthDate: 'February 24, 1955',
      birthPlace: 'San Francisco, California, USA',
      earlyLife: 'Steve Jobs was adopted in infancy by Paul and Clara Jobs, who promised he would attend college. Growing up in Silicon Valley, he took a keen interest in electrical tinkering. He briefly attended Reed College before dropping out, choosing instead to audit creative classes like calligraphy, which later shaped the artistic typography of Apple products.',
      careerTrajectory: 'In 1976, Jobs co-founded Apple Computer with Steve Wozniak. After initial success with the Apple II, he spearheaded the Macintosh project in 1984. Ousted from Apple in 1985, he founded NeXT and purchased Pixar, elevating it into a blockbusting film powerhouse. He returned to Apple in 1997 as CEO, resurrecting the company with the iMac, iPod, iPhone, and iPad.',
      personalLife: 'Jobs was married to Laurene Powell, and they had three children together. He lived a highly minimalist lifestyle, was a spiritual vegetarian, and was famous for his classic uniform: a black mock turtleneck, blue jeans, and wire-frame glasses.',
      impactAndLegacy: 'Jobs was renowned for his "Reality Distortion Field," which pushed engineers to achieve the impossible. His emphasis on elegant minimalism, intuitive user experience, and seamless hardware-software integration completely transformed seven different industries: computing, music, phones, animated film, tablets, publishing, and digital retail.'
    },
    keyPersonalTraits: ['Obsessively Detail-oriented', 'Charismatic Presenter', 'Aesthetic Purist', 'Demanding Visionary'],
    careerHighlights: [
      {
        year: '1984',
        title: 'Launch of the Legendary Macintosh',
        description: 'Unveiled the first mass-market personal computer featuring an intuitive graphical user interface and computer mouse.',
        impact: 'Democratized computing technology for everyday creators and set Apple\'s design-first standard.'
      },
      {
        year: '2001',
        title: 'iPod & Digital Music Revolution',
        description: 'Presented a pocket-sized device storing 1,000 songs, alongside the iTunes ecosystem.',
        impact: 'Rescued the music industry from piracy and established Apple as a dominant player in consumer entertainment.'
      },
      {
        year: '2007',
        title: 'The Unveiling of the Original iPhone',
        description: 'Introduced a revolutionary widescreen iPod, a paradigm-shifting telephone, and a breakthrough internet communicator, all integrated into one device.',
        impact: 'Began the modern smartphone era, completely transforming how humanity communicates, works, and navigates daily life.'
      }
    ],
    awardsAndRecognition: [
      { award: 'National Medal of Technology', year: '1985', category: 'Development of Personal Computers' },
      { award: 'Grammy Trustees Award', year: '2012', category: 'Posthumous Tech Honor' },
      { award: 'Disney Legend', year: '2013', category: 'Pixar Animation Legacy' }
    ],
    socialMediaUpdates: [
      {
        id: 'sj-1',
        platform: 'linkedin',
        username: 'Steve Jobs',
        timestamp: '1 hour ago',
        content: 'Design is not just what it looks like and feels like. Design is how it works. When you\'re a carpenter making a beautiful chest of drawers, you don\'t use a piece of cheap plywood for the back, even though it faces the wall and nobody will ever see it. You know it\'s there, so you use a beautiful piece of wood anyway. 🛠️📱🖥️',
        likes: 180000,
        sharesCount: 34000,
        repliesCount: 5200
      },
      {
        id: 'sj-2',
        platform: 'twitter',
        username: '@steve_jobs',
        timestamp: '6 hours ago',
        content: 'Your time is limited, so don\'t waste it living someone else\'s life. Don\'t be trapped by dogma — which is living with the results of other people\'s thinking. Stay hungry, stay foolish. 🍎💡',
        likes: 290000,
        sharesCount: 110000,
        repliesCount: 12000
      }
    ],
    newsAlerts: [
      {
        id: 'sj-news-1',
        title: 'Apple Design Center exhibits Steve Jobs\' early CAD workstation drafts, demonstrating early typographic focus',
        source: 'Wired',
        timeAgo: '2 hours ago',
        summary: 'Previously unreleased blueprints reveal Jobs spent months perfecting pixel-perfect margins on the scroll bar corners and vector fonts.',
        category: 'announcement',
        importance: 'medium'
      },
      {
        id: 'sj-news-2',
        title: 'Biographical documentary tracing Jobs\' spiritual trips in India selected for Sundance',
        source: 'The Hollywood Reporter',
        timeAgo: '8 hours ago',
        summary: 'Archival letters, diaries, and rare interviews examine how alternative philosophy influenced his product layout aesthetics.',
        category: 'trending',
        importance: 'low'
      }
    ],
    quotes: [
      "Stay hungry, stay foolish.",
      "The people who are crazy enough to think they can change the world are the ones who do.",
      "Remembering that you are going to die is the best way I know to avoid the trap of thinking you have something to lose. You are already naked."
    ],
    trivia: [
      "Steve Jobs ordered that the internal circuitry of Cupertino products be arranged beautifully, even though customer shells could not be opened, stating that true craftsmen require perfection in unseen corners.",
      "He was a fruitarian for long periods, believing that eating only fruits eliminated the need for deodorant because it prevented toxins from building up.",
      "Jobs bought Pixar from George Lucas in 1986 for $10 million, later selling it to Disney in 2006 for $7.4 billion, which made him Disney's largest individual shareholder."
    ],
    searchSuggestions: ['Bill Gates', 'Elon Musk', 'Jeff Bezos', 'Mark Zuckerberg']
  }
};

const SUGGESTIONS = [
  'Albert Einstein',
  'Taylor Swift',
  'Steve Jobs',
  'Marie Curie',
  'Nikola Tesla',
  'Elon Musk',
  'Billie Eilish'
];

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<CelebrityProfile | null>(PREBAKED_PROFILES['albert einstein']);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bio' | 'highlights' | 'social'>('bio');
  const [notifications, setNotifications] = useState<NewsNotification[]>([]);

  // Search logic calling back-end proxy with Gemini integration
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setErrorStatus(null);
    setActiveTab('bio');

    const cleanQuery = searchQuery.trim().toLowerCase();

    // Check if we have prebaked profile to bypass actual API latency
    if (PREBAKED_PROFILES[cleanQuery]) {
      // Small simulated delay for realistic feel
      setTimeout(() => {
        setProfile(PREBAKED_PROFILES[cleanQuery]);
        setLoading(false);
      }, 700);
      return;
    }

    try {
      const response = await fetch('/api/celebrity/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error || 'The search request failed.');
      }

      const decoded: CelebrityProfile = await response.json();
      setProfile(decoded);
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || 'Unable to load celebrity details. Please verify your GEMINI_API_KEY.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="min-h-screen bg-[#070b13] bg-gradient-to-b from-[#0b0f19] to-[#05070c] text-slate-100 flex flex-col selection:bg-violet-700/50 selection:text-white" id="main-root-container">
      
      {/* Decorative Grid Mesh Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Subtle light bar decoration */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500" />

      {/* Top Header Controls bar */}
      <nav className="border-b border-slate-900/80 backdrop-blur-md bg-slate-950/40 sticky top-0 z-30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 p-0.5 shadow-md shadow-violet-950/30">
              <div className="w-full h-full bg-[#070b13] rounded-[6px] flex items-center justify-center font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 text-base">
                C
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-slate-100 text-sm tracking-tight leading-none">Celebrity Search</span>
              <span className="text-[10px] font-mono text-violet-400 tracking-wider">A-Z CHRONICLE ENGINE</span>
            </div>
          </div>

          {/* Dynamic Small Ticker - Live notification stream counter */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-900/60 border border-slate-950/40 rounded-full text-xs font-mono text-slate-400 max-w-sm overflow-hidden">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="truncate">
              {profile ? `Real-time News Monitor: Active for ${profile.name}` : "Awaiting search selection..."}
            </span>
          </div>

          {/* Interactive Live Alerts Icon Widget */}
          <NotificationCenter 
            currentProfile={profile} 
            notifications={notifications} 
            setNotifications={setNotifications} 
          />
        </div>
      </nav>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 relative flex flex-col gap-8 md:gap-12">
        
        {/* Visual Hero Intro & Centered Search Interface */}
        <section className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full pt-4 md:pt-8 gap-5" id="hero-search-section">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/30 border border-violet-850 text-violet-300 text-xs font-medium font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            Empowered by Gemini 3.5 AI Engine
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
            Discover Global Icons <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400">
              From A to Z Details
            </span>
          </h1>

          <p className="text-xs md:text-sm text-slate-400 font-light leading-relaxed">
            Search for any historical scholar, athlete, tech pioneer, or modern artist to access exhaustive biographic traits, interactive key milestones, and real-time social streams.
          </p>

          {/* Form Action */}
          <form onSubmit={handleFormSubmit} className="w-full mt-2 relative" id="search-bar-form">
            <div className="relative group/search">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl blur opacity-25 group-hover/search:opacity-40 transition-all duration-300" />
              
              <div className="relative flex items-center bg-slate-950 border border-slate-850 hover:border-violet-600/80 rounded-xl overflow-hidden transition-all duration-200">
                <Search className="w-5 h-5 text-slate-500 ml-4 shrink-0 transition-colors group-hover/search:text-violet-400" />
                <input
                  type="text"
                  placeholder="e.g., Albert Einstein, Taylor Swift, Steve Jobs..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent border-0 ring-0 outline-none text-slate-200 placeholder-slate-500 text-sm px-4 py-3.5"
                  id="celebrity-search-input"
                />
                
                {query.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="text-xs font-mono text-slate-500 hover:text-slate-300 px-2 cursor-pointer transition-colors"
                  >
                    CLEAR
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="bg-violet-700 hover:bg-violet-600 active:bg-violet-850 disabled:bg-slate-900 disabled:text-slate-600 text-white font-medium text-xs tracking-wider uppercase px-6 py-3.5 transition-all cursor-pointer border-l border-slate-850 shrink-0"
                  id="btn-search-trigger"
                >
                  {loading ? 'Analyzing...' : 'Explore'}
                </button>
              </div>
            </div>
          </form>

          {/* Hot Suggestions pill blocks */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1" id="search-suggestions-block">
            <span className="text-slate-500 text-[11px] font-mono mr-1">Trending:</span>
            {SUGGESTIONS.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item);
                  handleSearch(item);
                }}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-950/80 hover:bg-slate-900 border border-slate-900 hover:border-violet-900/60 text-slate-400 hover:text-slate-100 rounded-md transition-all cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* Loading Progress State */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-20 text-center gap-4 max-w-md mx-auto"
              id="search-loading-container"
            >
              {/* Outer pulsing glow */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-t-violet-500 border-l-cyan-400 border-r-transparent border-b-transparent animate-spin" />
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-violet-500/10 blur-xl animate-pulse" />
              </div>
              <div className="flex flex-col mt-2">
                <p className="text-sm font-semibold tracking-wide text-slate-200">Synthesizing Celebrity Profile...</p>
                <p className="text-xs text-slate-500 font-mono mt-1">Calling Gemini to harvest biography, career milestones, and social metrics.</p>
              </div>
            </motion.div>
          )}

          {/* Error Message Indicator block */}
          {!loading && errorStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-950/20 border border-red-900/50 p-6 rounded-xl max-w-xl mx-auto flex flex-col gap-3 text-center"
              id="search-error-block"
            >
              <div className="w-10 h-10 rounded-full bg-red-900/20 text-red-400 flex items-center justify-center mx-auto">
                <Info className="w-5 h-5" />
              </div>
              <p className="text-sm text-red-200 font-medium">{errorStatus}</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                We couldn't generate a dynamic profile. Please check if your <code className="bg-slate-950 px-1.5 py-0.5 rounded text-violet-400 font-mono">GEMINI_API_KEY</code> environment variable is set up inside AI Studio secrets.
              </p>
              <div className="flex justify-center gap-3 mt-2">
                <button
                  onClick={() => {
                    const fallbackName = 'Albert Einstein';
                    setQuery(fallbackName);
                    handleSearch(fallbackName);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-350 cursor-pointer px-4 py-2 rounded-lg transition-all font-medium"
                >
                  Load Albert Einstein (Offline Mode)
                </button>
                <button
                  onClick={() => {
                    const fallbackName = 'Taylor Swift';
                    setQuery(fallbackName);
                    handleSearch(fallbackName);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-350 cursor-pointer px-4 py-2 rounded-lg transition-all font-medium"
                >
                  Load Taylor Swift (Offline Mode)
                </button>
              </div>
            </motion.div>
          )}

          {/* Primary View Profile Blocks */}
          {!loading && !errorStatus && profile && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-8 md:gap-10"
              id="profile-dashboard-grid"
            >
              
              {/* Dynamic Celebrity Identity Panel Card */}
              <div className="relative bg-slate-950/30 border border-slate-900 p-6 md:p-8 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                
                {/* Visual glow backdrop spots */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-violet-950 border border-violet-800/80 text-violet-300 text-xs font-mono font-medium tracking-wide uppercase px-3 py-1 rounded-full">
                      {profile.category}
                    </span>
                    <span className="text-slate-600 font-mono text-xs">•</span>
                    <span className="text-slate-400 font-mono text-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {profile.biography.birthPlace.split(',')[0]}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight">
                    {profile.name}
                  </h2>

                  <p className="text-sm text-slate-350 leading-relaxed max-w-3xl font-light">
                    {profile.shortDescription}
                  </p>

                  {/* Character/trait badges */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {profile.keyPersonalTraits.map((trait) => (
                      <span key={trait} className="bg-slate-900 border border-slate-850 text-slate-400 text-[11px] px-2.5 py-0.5 rounded-md font-medium tracking-wide hover:border-slate-800 transition-all">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Left Mini Overview stat card */}
                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl shrink-0 w-full md:w-auto md:min-w-[240px] flex flex-col gap-3.5 relative">
                  <div className="text-[11px] font-mono text-slate-500 tracking-wider border-b border-slate-900 pb-2">CHRONICLE CARD</div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Established</span>
                      <span className="text-slate-300 font-medium">{profile.biography.birthDate}</span>
                    </div>
                    <div className="flex justify-between items-start text-xs gap-3">
                      <span className="text-slate-500 flex items-center gap-1 shrink-0"><MapPin className="w-3.5 h-3.5" /> Origins</span>
                      <span className="text-slate-300 font-medium text-right line-clamp-2">{profile.biography.birthPlace}</span>
                    </div>
                  </div>

                  <div className="bg-violet-950/30 border border-violet-900/40 p-2.5 rounded-lg text-center flex items-center justify-between gap-2.5">
                    <span className="text-[10px] font-mono text-violet-400 uppercase">Live News Feed</span>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-900/60 text-[9px] font-mono px-1.5 py-0.5 rounded animate-pulse font-bold">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Tab selection */}
              <div className="flex border-b border-slate-950/80 gap-6">
                {[
                  { key: 'bio', label: 'Biography A-Z', icon: <BookOpen className="w-4 h-4" /> },
                  { key: 'highlights', label: 'Highlights & Honors', icon: <Briefcase className="w-4 h-4" /> },
                  { key: 'social', label: `Social Stream (${profile.socialMediaUpdates.length})`, icon: <TrendingUp className="w-4 h-4" /> }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2 pb-3.5 font-display text-sm font-semibold relative transition-all cursor-pointer ${
                      activeTab === tab.key
                        ? 'text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}

                    {activeTab === tab.key && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Active Tab Screen Contents */}
              <div className="min-h-[400px]" id="tab-dashboard-viewport">
                <AnimatePresence mode="wait" hmr={false}>
                  
                  {/* TAB 1: BIOGRAPHY A-Z */}
                  {activeTab === 'bio' && (
                    <motion.div
                      key="tab-bio"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                      {/* Left: Complete Chronology blocks */}
                      <div className="lg:col-span-2 flex flex-col gap-6">
                        
                        {/* Elegant Early Life card */}
                        <div className="bg-slate-950/20 border border-slate-900 rounded-xl p-6 flex flex-col gap-3 relative hover:border-slate-850 transition-all">
                          <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest">CHAPTER A:</span>
                          <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                            Early Years & Education
                          </h3>
                          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
                            {profile.biography.earlyLife}
                          </p>
                        </div>

                        {/* Elegant Career Rise card */}
                        <div className="bg-slate-950/20 border border-slate-900 rounded-xl p-6 flex flex-col gap-3 relative hover:border-slate-850 transition-all">
                          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">CHAPTER B:</span>
                          <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                            Rise to Prominence & Career Trajectory
                          </h3>
                          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
                            {profile.biography.careerTrajectory}
                          </p>
                        </div>

                        {/* Personal Life & Interests */}
                        <div className="bg-slate-950/20 border border-slate-900 rounded-xl p-6 flex flex-col gap-3 relative hover:border-slate-850 transition-all">
                          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">CHAPTER C:</span>
                          <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                            Behind the Scenes (Personal Life)
                          </h3>
                          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
                            {profile.biography.personalLife}
                          </p>
                        </div>

                        {/* Future Impact & Enduring Legacy */}
                        <div className="bg-gradient-to-r from-violet-950/15 to-[#0b0f19]/30 border border-violet-950/60 rounded-xl p-6 flex flex-col gap-3 relative">
                          <div className="absolute top-4 right-4 text-violet-500 opacity-20">
                            <Sparkles className="w-8 h-8" />
                          </div>
                          <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest">THE LEGACY:</span>
                          <h3 className="text-lg font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-200">
                            Enduring Historical Impact
                          </h3>
                          <p className="text-xs md:text-sm text-slate-305 leading-relaxed font-light">
                            {profile.biography.impactAndLegacy}
                          </p>
                        </div>

                      </div>

                      {/* Right Side Column: Quotes, Trivia & Related list */}
                      <div className="flex flex-col gap-6">
                        
                        {/* Quotes Bento Panel */}
                        <div className="bg-slate-950/30 border border-slate-900/60 p-6 rounded-xl flex flex-col gap-4">
                          <h4 className="text-xs font-mono text-slate-500 tracking-wider uppercase flex items-center gap-2 border-b border-slate-900 pb-3">
                            <Quote className="w-4 h-4 text-violet-400" />
                            Inspirational Quotes
                          </h4>

                          <div className="flex flex-col gap-4">
                            {profile.quotes.map((quote, idx) => (
                              <div key={idx} className="flex flex-col gap-1.5 relative pl-4 border-l-2 border-violet-600/60">
                                <p className="text-xs italic text-slate-305 leading-relaxed font-light">
                                  "{quote}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Trivia Bento Panel */}
                        <div className="bg-slate-950/30 border border-slate-900/60 p-6 rounded-xl flex flex-col gap-4">
                          <h4 className="text-xs font-mono text-slate-500 tracking-wider uppercase flex items-center gap-2 border-b border-slate-900 pb-3">
                            <HelpCircle className="w-4 h-4 text-cyan-400" />
                            Captivating Trivia
                          </h4>

                          <div className="flex flex-col gap-4">
                            {profile.trivia.map((fact, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 text-xs">
                                <span className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center text-[10px] col-span-1 shrink-0 text-cyan-400 font-mono border border-slate-855">
                                  {idx + 1}
                                </span>
                                <p className="text-slate-300 leading-relaxed font-light">
                                  {fact}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Related explore contemporaries */}
                        <div className="bg-slate-950/30 border border-slate-900/60 p-5 rounded-xl flex flex-col gap-3">
                          <h4 className="text-xs font-mono text-slate-500 tracking-wider uppercase">
                            Explore Contemporaries
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Compare their biography with other famous entities:
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            {profile.searchSuggestions.map((item) => (
                              <button
                                key={item}
                                onClick={() => {
                                  setQuery(item);
                                  handleSearch(item);
                                }}
                                className="text-left px-3 py-2 bg-slate-900/40 hover:bg-slate-900 border border-slate-900 text-xs text-slate-400 hover:text-slate-200 rounded transition-colors truncate cursor-pointer"
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: MILESTONES & HONORS TIMELINE */}
                  {activeTab === 'highlights' && (
                    <motion.div
                      key="tab-highlights"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                      {/* Left: Timeline column */}
                      <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="relative border-l border-slate-800 pl-6 flex flex-col gap-8 ml-3 py-2">
                          
                          {profile.careerHighlights.map((hl, index) => (
                            <div key={index} className="relative group/timeline">
                              {/* Indicator Dot */}
                              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#070b13] border-2 border-violet-500 group-hover/timeline:scale-125 transition-transform flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              </div>

                              <div className="bg-slate-950/20 border border-slate-900 rounded-xl p-5 hover:border-slate-800 transition-all flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono text-violet-400 font-bold bg-violet-950/60 px-2 py-0.5 rounded border border-violet-900/60">
                                    {hl.year}
                                  </span>
                                  <h4 className="text-sm font-semibold text-slate-100 font-display">
                                    {hl.title}
                                  </h4>
                                </div>

                                <p className="text-xs text-slate-350 leading-relaxed mt-1 font-light">
                                  {hl.description}
                                </p>

                                <div className="mt-2 text-xs flex gap-2 items-start bg-slate-950/60 border border-slate-900/85 p-2.5 rounded-lg text-slate-400">
                                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                  <p className="leading-normal font-light">
                                    <strong className="text-violet-400 font-semibold font-mono text-[10px] uppercase block">IMPACT SUMMARY</strong>
                                    {hl.impact}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}

                        </div>
                      </div>

                      {/* Right: Awards and Recognitions box layout */}
                      <div className="flex flex-col gap-6">
                        
                        <div className="bg-slate-950/30 border border-slate-900/60 p-6 rounded-xl flex flex-col gap-5">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                            <h4 className="text-xs font-mono text-slate-400 tracking-wider uppercase flex items-center gap-2">
                              <Award className="w-4 h-4 text-amber-400" />
                              Decorated Honors
                            </h4>
                            <span className="bg-slate-900 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-800">
                              {profile.awardsAndRecognition.length} Total
                            </span>
                          </div>

                          <div className="flex flex-col gap-3">
                            {profile.awardsAndRecognition.map((award, index) => (
                              <div key={index} className="bg-slate-900/30 hover:bg-slate-900/65 border border-slate-900 p-3.5 rounded-lg flex justify-between items-start gap-4 transition-all hover:border-slate-850">
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs font-semibold text-white tracking-tight">{award.award}</span>
                                  <span className="text-[10px] font-mono text-slate-500">{award.category}</span>
                                </div>
                                <span className="bg-slate-950 text-amber-400 border border-amber-900/40 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold self-start shrink-0">
                                  {award.year}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Trivia Mini Quiz Widget */}
                        <div className="bg-[#0b101c] border border-violet-950/40 text-slate-300 p-6 rounded-xl relative overflow-hidden flex flex-col gap-3">
                          <span className="text-[10px] font-mono text-violet-400">ENGAGEMENT WIDGET</span>
                          <h4 className="text-sm font-semibold text-white tracking-tight">Trivia Discovery Quiz</h4>
                          <p className="text-xs text-slate-400 font-light leading-relaxed">
                            Test your familiarity of {profile.name} with classmates or friends by studying the custom trivia summaries compiled in their bio tab.
                          </p>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: SOCIAL MEDIA INTEGRATED STREAM */}
                  {activeTab === 'social' && (
                    <motion.div
                      key="tab-social"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <SocialFeed profile={profile} />
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Decorative clean footer */}
      <footer className="border-t border-slate-950 bg-slate-950/40 py-6 mt-auto text-center text-xs text-slate-600 font-mono flex flex-col md:flex-row items-center justify-between px-6 max-w-7xl w-full mx-auto gap-4">
        <span>&copy; {new Date().getFullYear()} CELEBRITY SEARCH ENGINE. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-4">
          <span className="text-violet-500/80">API Status: Ready</span>
          <span>•</span>
          <span className="text-[10px]">CRAFTED WITH PRECISION DIALECTICS</span>
        </div>
      </footer>

    </div>
  );
}
