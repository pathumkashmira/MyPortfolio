import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function Services({ isAdmin, onEdit, onDelete }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- 🌍 CURRENCY STATES ---
  const [currency, setCurrency] = useState('USD'); 
  const [smmCurrency, setSmmCurrency] = useState('USD');

  // --- 🔄 SMM NAVIGATION & CALCULATOR STATE ---
  const [selectedSmmPlatform, setSelectedSmmPlatform] = useState(null);
  
  // 🧮 Calculator States
  const [calcPlatform, setCalcPlatform] = useState('facebook');
  const [calcService, setCalcService] = useState('likes');
  const [calcQty, setCalcQty] = useState(1000);

  const [selectedPackage, setSelectedPackage] = useState(null); 
  const WHATSAPP_NUMBER = "94754752040"; // 🔥 ඔබේ අංකය

  // --- 💻 WEB PORTFOLIO PACKAGES (UNCHANGED) ---
  const packages = [
    {
      name: "Student / CV Portfolio",
      priceUSD: "40",
      priceLKR: "6000",
      type: "Simple & Clean",
      desc: "Perfect for students to showcase their resume online.",
      features: ["One Page Digital CV", "Mobile Responsive", "Contact & Social Links", "Fast Loading", "Source Code Included"],
      popular: false,
      color: "border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    },
    {
      name: "Pro Freelancer Portfolio",
      priceUSD: "100",
      priceLKR: "20,000",
      type: "Modern Design",
      desc: "For designers, developers & freelancers to show work.",
      features: ["3 Pages (Home, Work, Contact)", "Project Gallery", "Modern Animations", "Dark Mode Support", "Admin Panel to Edit"],
      popular: true, 
      color: "border-emerald-500 ring-2 ring-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
    },
    {
      name: "Business / Agency Site",
      priceUSD: "200",
      priceLKR: "50,000",
      type: "Professional", 
      desc: "For small businesses or agencies to display services.",
      features: ["Up to 5 Pages", "Services & Team Section", "Testimonials Slider", "Blog Section", "SEO Optimization"],
      popular: false,
      color: "border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    },
    {
      name: "Custom 3D / Creative",
      priceUSD: "300+",
      priceLKR: "150,000+",
      type: "High-End",
      desc: "Unique, interactive 3D portfolios for maximum impact.",
      features: ["Three.js 3D Models", "Advanced Interactions", "Custom Animations", "Unique Layouts", "Priority Support"],
      popular: false,
      color: "border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    }
  ];

  // --- 🧮 CALCULATOR DATA ---
  const calcData = {
    facebook: {
      name: "Facebook",
      services: {
        likes: { name: "Page Likes", priceUSD: 2.50, priceLKR: 850, timePer1k: 48 }, // time in hours
        followers: { name: "Followers", priceUSD: 2.00, priceLKR: 700, timePer1k: 24 },
        views: { name: "Video Views", priceUSD: 1.50, priceLKR: 500, timePer1k: 12 },
      }
    },
    instagram: {
      name: "Instagram",
      services: {
        followers: { name: "Followers", priceUSD: 1.00, priceLKR: 350, timePer1k: 24 },
        likes: { name: "Likes", priceUSD: 0.50, priceLKR: 150, timePer1k: 2 },
        views: { name: "Reel Views", priceUSD: 0.80, priceLKR: 250, timePer1k: 1 },
      }
    },
    tiktok: {
      name: "TikTok",
      services: {
        views: { name: "Video Views", priceUSD: 0.10, priceLKR: 50, timePer1k: 0.5 },
        followers: { name: "Followers", priceUSD: 2.00, priceLKR: 700, timePer1k: 48 },
        likes: { name: "Likes", priceUSD: 0.80, priceLKR: 280, timePer1k: 12 },
      }
    },
    youtube: {
      name: "YouTube",
      services: {
        subs: { name: "Subscribers", priceUSD: 10.00, priceLKR: 3500, timePer1k: 120 },
        views: { name: "Views", priceUSD: 1.50, priceLKR: 500, timePer1k: 48 },
        hours: { name: "Watch Hours", priceUSD: 20.00, priceLKR: 7000, timePer1k: 168 },
      }
    },
    telegram: {
      name: "Telegram",
      services: {
        members: { name: "Members", priceUSD: 1.50, priceLKR: 500, timePer1k: 24 },
        views: { name: "Post Views", priceUSD: 0.20, priceLKR: 80, timePer1k: 1 },
      }
    },
    spotify: {
      name: "Spotify",
      services: {
        plays: { name: "Plays", priceUSD: 0.50, priceLKR: 150, timePer1k: 48 },
        followers: { name: "Followers", priceUSD: 1.50, priceLKR: 450, timePer1k: 72 },
      }
    }
  };

  // --- 🚀 SMM PLATFORMS & PACKAGES (UPDATED) ---
  const smmPlatforms = [
    {
      id: "facebook",
      name: "Facebook",
      color: "from-blue-600 to-blue-800",
      glowColor: "group-hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]",
      icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>,
      packages: [
        { name: "10K Page Likes", priceUSD: "10.00", priceLKR: "3000", time: "2-48 Hours", desc: "For Facebook Pages", features: ["Real Profiles", "30 Refill", "Start 0-5 Hours", "No Password Needed", "Safe for Monetization"] },
        { name: "10K Profile Followers", priceUSD: "5.00", priceLKR: "1500", time: "1-48 Hours", desc: "For Professional Mode", features: ["Real Profiles", "30D Refill", "Start 0-5 Hours", "No Password Needed", "Boosts Credibility"] },
        { name: "10K Post Likes", priceUSD: "5.00", priceLKR: "1500", time: "1-24 Hours", desc: "Boost any FB Post", features: ["Like Emoji Only", "Fast Delivery", "Organic Look", "No Password Needed", "Works on Photos/Videos"] },
        { name: "100 Custom Comments", priceUSD: "2.00", priceLKR: "600", time: "1-24 Hours", desc: "You provide the text", features: ["Real Accounts", "Engagement Boost", "Custom Text Supported", "No Password Needed", "Positive Vibes"] },
        { name: "5K Live Stream Views", priceUSD: "10.00", priceLKR: "3000", time: "Stay 30 Min", desc: "For Facebook Live streams", features: ["Real Accounts", "Instant start", "Need Link only", "No Password Needed", "Good conditions"] },
        { name: "10K Video Views", priceUSD: "3.00", priceLKR: "900", time: "1-24 Hours", desc: "For FB Reels", features: ["Monetizable Views", "High Retention", "Instant Start", "No Password Needed", "Viral Potential"] },
      ]
    },
    {
      id: "instagram",
      name: "Instagram",
      color: "from-pink-500 to-rose-500",
      glowColor: "group-hover:shadow-[0_0_20px_rgba(236,72,153,0.6)]",
      icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>,
      packages: [
        { name: "10K Followers", priceUSD: "10.00", priceLKR: "3000", time: "1-24 Hours", desc: "Non Guarantee", features: ["Real Looking Profiles", "No Refill", "Speed up to 100K/D", "No Password Needed", "Start Instant"] },
        { name: "10K Likes", priceUSD: "5.00", priceLKR: "1500", time: "1-6 Hours", desc: "For any Post/Reel", features: ["Fast Delivery", "Split Available (Min 100)", "No Password Needed", "Works on Reels/Photos", "Organic Reach"] },
        { name: "20K Reel Views", priceUSD: "0.80", priceLKR: "250", time: "1-12 Hours", desc: "Go Viral Instantly", features: ["High Retention", "Explore Page Reach", "Instant Start", "No Password Needed", "Safe"] },
        { name: "100 Comments", priceUSD: "1.00", priceLKR: "300", time: "12-24 Hours", desc: "Random or Custom(Prices Are change by Type", features: ["Real Users", "English/Mixed", "Engagement Boost", "No Password Needed", "Positive Feedback"] },
      ]
    },
    {
      id: "tiktok",
      name: "TikTok",
      color: "from-stone-900 to-black",
      glowColor: "group-hover:shadow-[0_0_20px_rgba(0,0,0,0.6)]",
      icon: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.58-1.15v10.07c-.01 4.12-3.35 7.48-7.46 7.48-4.15-.01-7.49-3.37-7.48-7.51.03-4.13 3.38-7.49 7.5-7.5.31 0 .63.01.93.04v4.22c-1.87-.29-3.71 1.03-4.01 2.9-.31 1.95 1.02 3.86 2.97 4.17 1.95.31 3.86-1.02 4.17-2.97.02-.13.03-.26.03-.39V.02z" />,
      packages: [
        { name: "10K Views", priceUSD: "0.20", priceLKR: "60", time: "10 Mins - 1 Hour", desc: "Cheapest in the market", features: ["Super Fast", "Viral Potential", "Any Video", "No Password Needed", "Boost Ranking"] },
        { name: "10K Followers", priceUSD: "10.00", priceLKR: "3000", time: "1-24 Hours", desc: "To Go Live", features: ["1K needed for Live", "Steady Delivery", "Non Guarantee", "No Password Needed", "Real Accounts"] },
        { name: "10K Likes", priceUSD: "1.00", priceLKR: "300", time: "1-24 Hours", desc: "Video Likes", features: ["Real Accounts", "Safe Method", "No Password Needed", "Fast Start", "High Quality"] },
        { name: "10K Shares", priceUSD: "1.00", priceLKR: "300", time: "1-6 Hours", desc: "Copy Link Shares", features: ["Algorithm Boost", "Instant", "Safe", "No Password Needed", "Profile Visits"] },
      ]
    },
    {
      id: "youtube",
      name: "YouTube",
      color: "from-red-600 to-red-800",
      glowColor: "group-hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]",
      icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>,
      packages: [
        { name: "1,000 Subscribers", priceUSD: "10.00", priceLKR: "3500", time: "5-10 Days", desc: "Monetization Pack", features: ["Non-Drop", "LifeTime Guarantee", "Slow & Safe Growth", "No Password Needed", "Real Subs"] },
        { name: "4,000 Watch Hours", priceUSD: "20.00", priceLKR: "7000", time: "7-14 Days", desc: "Full Monetization", features: ["15 Min+ Video Needed", "Organic Sources", "Safe", "No Password Needed", "Accepted for Partner Program"] },
        { name: "1,000 Views", priceUSD: "1.50", priceLKR: "500", time: "24-48 Hours", desc: "High Retention", features: ["Real Viewers", "Good for Ranking", "Steady Speed", "No Password Needed", "Lifetime Refill"] },
        { name: "100 Likes", priceUSD: "0.50", priceLKR: "150", time: "6-12 Hours", desc: "Video Likes", features: ["Instant Start", "Non-Drop", "Real Accounts", "No Password Needed", "Engagement Boost"] },
      ]
    },
    {
      id: "telegram",
      name: "Telegram",
      color: "from-sky-500 to-blue-500",
      glowColor: "group-hover:shadow-[0_0_20px_rgba(14,165,233,0.6)]",
      icon: <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>,
      packages: [
        { name: "1,000 Members", priceUSD: "1.50", priceLKR: "500", time: "1-2 Days", desc: "Channel/Group", features: ["Non-Drop", "Silent Members", "Instant Start", "No Password Needed", "Global Users"] },
        { name: "1,000 Post Views", priceUSD: "0.20", priceLKR: "80", time: "1-2 Hours", desc: "Last 5 Posts", features: ["Super Fast", "Good for Credibility", "Auto-Split to Last 5 Posts", "No Password Needed", "Real Impressions"] },
        { name: "500 Group Members", priceUSD: "1.00", priceLKR: "350", time: "1-2 Days", desc: "For Groups", features: ["Safe Adding", "Real Accounts", "Low Drop", "No Password Needed", "Active Profiles"] },
      ]
    },
    {
      id: "spotify",
      name: "Spotify",
      color: "from-green-500 to-green-700",
      glowColor: "group-hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]",
      icon: <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>,
      packages: [
        { name: "1,000 Plays", priceUSD: "0.50", priceLKR: "150", time: "2-4 Days", desc: "Royalty Eligible", features: ["Mixed Countries", "Safe", "Revenue Generated", "No Password Needed", "Organic Pattern"] },
        { name: "1,000 Followers", priceUSD: "1.50", priceLKR: "450", time: "2-3 Days", desc: "Artist/Playlist", features: ["Real Profiles", "Lifetime Guarantee", "Instant Start", "No Password Needed", "Stable"] },
        { name: "1,000 Monthly Listeners", priceUSD: "1.00", priceLKR: "300", time: "30 Days", desc: "Boost Stats", features: ["High Quality", "Organic Look", "30 Days Retention", "No Password Needed", "Profile Visits"] },
      ]
    }
  ];

  // --- Fetch Data (Fiverr) ---
  useEffect(() => {
    try {
      const ref = collection(db, "services");
      const unsubscribe = onSnapshot(ref, (snapshot) => {
        const items = snapshot.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id, 
            ...data,
            finalImage: data.image || data.img || "https://via.placeholder.com/400x200?text=No+Image",
            finalDesc: data.description || data.desc || "No description available.",
            finalTitle: data.title || "Untitled Service",
            finalPrice: data.price || "5",
            finalLink: data.link || data.fiverrLink || "#",
            finalRating: data.rating || "5.0",
            dateAdded: data.dateAdded || null
          };
        });
        
        items.sort((a, b) => {
            const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(0);
            const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(0);
            return dateB - dateA;
        });

        setServices(items);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  }, []);

  // --- 📝 HELPER FUNCTIONS ---
  const handleDirectHire = () => {
      const message = "Hi Pethum! 👋 I want to build a professional portfolio website. Can we discuss?";
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleGetMoreDetails = () => {
      if(!selectedPackage) return;
      const price = currency === 'USD' ? `$${selectedPackage.priceUSD}` : `LKR ${selectedPackage.priceLKR}`;
      const message = `Hi Pethum! 🚀\nI am interested in the "${selectedPackage.name}" portfolio package (${price}).\nPlease share more details and payment info.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
      setSelectedPackage(null); 
  };

  // 🔥 SMM Package Order Handler
  const handleSmmOrder = (pkg, platformName) => {
      const price = smmCurrency === 'USD' ? `$${pkg.priceUSD}` : `Rs. ${pkg.priceLKR}`;
      const message = `Hi Pethum! 🚀\nI want to buy SMM Service:\n\nPlatform: ${platformName}\nService: ${pkg.name}\nTime: ${pkg.time}\nPrice: ${price}\n\nPlease send me details!`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // 🧮 Calculator Logic
  const getCalcPrice = () => {
      const platformData = calcData[calcPlatform];
      if (!platformData) return 0;
      const serviceData = platformData.services[calcService];
      if (!serviceData) return 0;

      const multiplier = calcQty / 1000;
      return smmCurrency === 'USD' 
          ? (serviceData.priceUSD * multiplier).toFixed(2)
          : Math.floor(serviceData.priceLKR * multiplier).toLocaleString();
  };

  const getCalcTime = () => {
      const platformData = calcData[calcPlatform];
      if (!platformData) return "Unknown";
      const serviceData = platformData.services[calcService];
      if (!serviceData) return "Unknown";

      const totalHours = serviceData.timePer1k * (calcQty / 1000);
      if (totalHours < 1) return "< 1 Hour";
      if (totalHours < 24) return `~ ${Math.ceil(totalHours)} Hours`;
      const days = Math.ceil(totalHours / 24);
      return `~ ${days} ${days > 1 ? "Days" : "Day"}`;
  };

  const handleCalcOrder = () => {
      const platformName = calcData[calcPlatform].name;
      const serviceName = calcData[calcPlatform].services[calcService].name;
      const price = smmCurrency === 'USD' ? `$${getCalcPrice()}` : `Rs. ${getCalcPrice()}`;
      const time = getCalcTime();

      const message = `Hi Pethum! 🚀\nI used your calculator:\n\nPlatform: ${platformName}\nService: ${serviceName}\nQuantity: ${calcQty}\nEst. Time: ${time}\nPrice: ${price}\n\nCan I proceed?`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div id="page-services" className="page-section">
      <section className="max-w-7xl mx-auto pt-10 px-4">
        
        {/* HEADER */}
        <div className="text-center mb-10 reveal">
          <div className="flex items-center justify-center gap-2 mb-2">
             <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
             </div>
          </div>
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Services & Solutions</h2>
          <p className="text-stone-500 mt-2">Professional services tailored to your needs.</p>
        </div>

        {/* 1. HERO DIRECT HIRE CARD */}
        <div className="reveal mb-20 relative group max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-stone-9 text-white rounded-3xl p-8 md:p-12 border border-stone-700 shadow-2xl flex flex-col md:flex-row items-center gap-10 overflow-hidden">
                <div className="flex-1 text-center md:text-left z-10">
                    <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-emerald-500/50">Top Rated Service</div>
                    <h3 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">Need a Portfolio? <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Let's Build It.</span></h3>
                    <p className="text-stone-400 text-lg mb-8 leading-relaxed max-w-lg">I specialize in building high-performance, modern portfolio websites for students, freelancers, and professionals.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
                        {["Custom React Design", "Mobile & Desktop Responsive", "Admin Dashboard Included", "Fast Loading Speed", "SEO Friendly Structure", "One-Time Payment"].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div><span className="text-sm font-semibold text-stone-200">{feature}</span></div>
                        ))}
                    </div>
                    <button onClick={handleDirectHire} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto md:mx-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                        Chat on WhatsApp
                    </button>
                </div>
                {/* Tech Stack Animation */}
                <div className="hidden md:flex w-1/3 justify-center items-center relative">
                    {/* Background Glow */}
                    <div className="absolute w-56 h-56 bg-[#64ffda]/10 rounded-full blur-[70px] animate-pulse"></div>
                    
                    {/* Floating Elements Container */}
                    <svg className="w-72 h-72 drop-shadow-[0_0_20px_rgba(100,255,218,0.2)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Layer 1 */}
                        <g className="animate-bounce" style={{animationDuration: '4s'}}>
                            <path d="M20 70 L50 85 L80 70 L50 55 L20 70Z" stroke="#64ffda" strokeWidth="1.5" fill="rgba(10, 25, 47, 0.8)" className="path-draw" style={{animationDelay: '0s'}} />
                            <path d="M20 70 V 80 L50 95 L80 80 V 70" stroke="#64ffda" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="path-draw" style={{animationDelay: '0.5s'}} />
                        </g>
                        {/* Layer 2 */}
                        <g className="animate-bounce" style={{animationDuration: '4s', animationDelay: '0.5s'}}>
                            <path d="M20 50 L50 65 L80 50 L50 35 L20 50Z" stroke="#64ffda" strokeWidth="1.5" fill="rgba(10, 25, 47, 0.8)" className="path-draw" style={{animationDelay: '1s'}} />
                            <path d="M40 50 L45 55 L55 45" stroke="#64ffda" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                        </g>
                        {/* Layer 3 */}
                        <g className="animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
                            <path d="M20 30 L50 45 L80 30 L50 15 L20 30Z" stroke="#64ffda" strokeWidth="2" fill="rgba(100, 255, 218, 0.1)" className="path-draw" style={{animationDelay: '1.5s'}} />
                            <path d="M50 15 L80 30" stroke="#64ffda" strokeWidth="1" strokeOpacity="0.5" />
                        </g>
                        {/* Connecting Dots */}
                        <circle cx="50" cy="95" r="1" fill="#64ffda" className="animate-ping" style={{animationDuration: '3s'}} />
                        <circle cx="20" cy="70" r="1" fill="#64ffda" className="animate-ping" style={{animationDuration: '2.5s', animationDelay: '1s'}} />
                        <circle cx="80" cy="50" r="1" fill="#64ffda" className="animate-ping" style={{animationDuration: '1.5s', animationDelay: '0.5s'}} />
                    </svg>
                </div>
            </div>
        </div>

        {/* 2. PORTFOLIO PACKAGES */}
        <div className="mb-20">
            <h3 className="text-2xl font-bold text-center text-stone-900 dark:text-white mb-6">Website Creation Packages</h3>
            
            {/* Currency Toggle (WEB ONLY) */}
            <div className="flex justify-center mb-10">
                <div className="bg-stone-200 dark:bg-stone-800 p-1 rounded-full flex relative shadow-inner">
                    <button onClick={() => setCurrency('LKR')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all z-10 flex items-center gap-2 ${currency === 'LKR' ? 'text-white' : 'text-stone-500'}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> Sri Lanka (LKR)
                    </button>
                    <button onClick={() => setCurrency('USD')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all z-10 flex items-center gap-2 ${currency === 'USD' ? 'text-white' : 'text-stone-500'}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Worldwide ($)
                    </button>
                    <div className={`absolute top-1 bottom-1 w-[50%] bg-emerald-600 rounded-full transition-transform duration-300 shadow-md ${currency === 'USD' ? 'translate-x-full' : 'translate-x-0'}`}></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {packages.map((pkg, idx) => (
                    <div key={idx} className={`reveal bg-white dark:bg-stone-900 rounded-2xl p-6 border shadow-lg hover:shadow-2xl transition-all relative flex flex-col group ${pkg.color} ${pkg.popular ? 'scale-105 z-10 shadow-emerald-500/10' : ''}`}>
                        {pkg.popular && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Most Popular</div>}
                        <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4 text-emerald-500"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">{pkg.icon}</svg></div>
                        <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">{pkg.type}</div>
                        <h4 className="text-lg font-bold text-stone-900 dark:text-white mb-2">{pkg.name}</h4>
                        <div className="text-2xl font-extrabold text-stone-900 dark:text-white mb-2">{currency === 'USD' ? `$${pkg.priceUSD}` : `Rs. ${pkg.priceLKR}`}</div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 h-8">{pkg.desc}</p>
                        <ul className="space-y-3 mb-8 flex-1">{pkg.features.map((feat, i) => (<li key={i} className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-300"><svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>{feat}</li>))}</ul>
                        <button onClick={() => setSelectedPackage(pkg)} className={`w-full py-2.5 rounded-lg font-bold text-xs transition-colors ${pkg.popular ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white'}`}>Select Plan</button>
                    </div>
                ))}
            </div>
        </div>

        {/* ======================================================= */}
        {/* 🔥 NEW SECTION: SMM PLATFORM & PACKAGES SYSTEM 🔥 */}
        {/* ======================================================= */}
        <div className="mt-24 mb-24 relative reveal">
            
            {/* Distinct Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl -z-10"></div>
            
            <div className="text-center mb-10">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block animate-pulse">
                    🚀 Social Media Panel
                </span>
                <h3 className="text-3xl font-extrabold text-stone-900 dark:text-white">
                    Social Media <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Boosting</span>
                </h3>
                <p className="text-stone-500 mt-2">Select a platform to view available packages.</p>
            </div>

            {/* 🔥 NEW: CUSTOM ORDER CALCULATOR (WITH NEON GLOW) */}
            <div className="max-w-4xl mx-auto bg-stone-50 dark:bg-[#121212] rounded-3xl border border-stone-200 dark:border-stone-800 p-6 md:p-8 mb-16 shadow-xl relative overflow-hidden group hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
                <div className="flex flex-col md:flex-row gap-8 items-end">
                    <div className="flex-1 w-full space-y-4">
                        <h4 className="font-bold text-lg text-stone-900 dark:text-white flex items-center gap-2">
                            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 p-1.5 rounded-lg">
                                {/* Calculator SVG Icon */}
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            </span> 
                            Quick Calculator
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Platform</label>
                                <select 
                                    value={calcPlatform} 
                                    onChange={(e) => { setCalcPlatform(e.target.value); setCalcService(Object.keys(calcData[e.target.value].services)[0]); }}
                                    className="w-full p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm font-bold text-stone-700 dark:text-stone-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                >
                                    {Object.keys(calcData).map(key => <option key={key} value={key}>{calcData[key].name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Service</label>
                                <select 
                                    value={calcService} 
                                    onChange={(e) => setCalcService(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm font-bold text-stone-700 dark:text-stone-300 focus:ring-2 focus:ring-purple-500 outline-none"
                                >
                                    {Object.keys(calcData[calcPlatform].services).map(key => <option key={key} value={key}>{calcData[calcPlatform].services[key].name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Quantity</label>
                            <input 
                                type="number" 
                                min="100" 
                                step="100"
                                value={calcQty} 
                                onChange={(e) => setCalcQty(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm font-bold text-stone-700 dark:text-stone-300 focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-64 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 text-center relative group-hover:border-purple-500 transition-colors">
                        <p className="text-xs text-stone-500 mb-1">Estimated Cost</p>
                        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-1">
                            {smmCurrency === 'USD' ? `$${getCalcPrice()}` : `Rs. ${getCalcPrice()}`}
                        </div>
                        <p className="text-[10px] font-mono text-stone-400 mb-4">{getCalcTime()}</p>
                        <button onClick={handleCalcOrder} className="w-full py-2 bg-stone-900 dark:bg-white text-white dark:text-black rounded-lg font-bold text-xs hover:scale-105 transition-transform">
                            Order Custom Amount
                        </button>
                    </div>
                </div>
            </div>

            {/* SMM Currency Toggle (SEPARATE) */}
            <div className="flex justify-center mb-10">
                <div className="bg-stone-200 dark:bg-stone-800 p-1 rounded-full flex relative shadow-inner">
                    <button onClick={() => setSmmCurrency('LKR')} className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all z-10 flex items-center gap-2 ${smmCurrency === 'LKR' ? 'text-white' : 'text-stone-500'}`}>
                        LKR (Sri Lanka)
                    </button>
                    <button onClick={() => setSmmCurrency('USD')} className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all z-10 flex items-center gap-2 ${smmCurrency === 'USD' ? 'text-white' : 'text-stone-500'}`}>
                        USD (Global)
                    </button>
                    <div className={`absolute top-1 bottom-1 w-[50%] bg-purple-600 rounded-full transition-transform duration-300 shadow-md ${smmCurrency === 'USD' ? 'translate-x-full' : 'translate-x-0'}`}></div>
                </div>
            </div>

            {/* VIEW 1: PLATFORM SELECTION GRID (Shown if no platform selected) */}
            {!selectedSmmPlatform && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-fade-in-up">
                    {smmPlatforms.map((platform) => (
                        <div 
                            key={platform.id}
                            onClick={() => setSelectedSmmPlatform(platform)}
                            className={`cursor-pointer group relative bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center p-6 h-40 hover:ring-2 hover:ring-offset-2 hover:ring-offset-stone-50 dark:hover:ring-offset-[#0c0a09] transition-all duration-300 ${platform.glowColor.replace('shadow', 'ring')}`}
                        >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br ${platform.color} text-white shadow-lg mb-3 group-hover:scale-110 transition-transform`}>
                                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">{platform.icon}</svg>
                            </div>
                            <h4 className="font-bold text-sm text-stone-900 dark:text-white">{platform.name}</h4>
                            <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">View Packages</p>
                        </div>
                    ))}
                </div>
            )}

            {/* VIEW 2: PACKAGES LIST (Shown if platform IS selected) */}
            {selectedSmmPlatform && (
                <div className="animate-fade-in-up">
                    
                    {/* Back Button & Title */}
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => setSelectedSmmPlatform(null)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors text-xs font-bold">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            Back
                        </button>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${selectedSmmPlatform.color} text-white shadow-md`}>
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">{selectedSmmPlatform.icon}</svg>
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 dark:text-white">{selectedSmmPlatform.name} Packages</h3>
                        </div>
                    </div>

                    {/* Packages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedSmmPlatform.packages.map((pkg, i) => (
                            <div key={i} className={`group bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-lg flex flex-col transition-all duration-300 hover:-translate-y-1 ${selectedSmmPlatform.glowColor} hover:border-transparent`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-stone-900 dark:text-white">{pkg.name}</h4>
                                        <p className="text-xs text-stone-500">{pkg.desc}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                            {smmCurrency === 'USD' ? `$${pkg.priceUSD}` : `Rs. ${pkg.priceLKR}`}
                                        </span>
                                    </div>
                                </div>

                                {/* Estimated Time Badge */}
                                <div className="mb-4 inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full w-fit border border-purple-100 dark:border-purple-800">
                                    <svg className="w-3 h-3 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">Est. Time: {pkg.time}</span>
                                </div>

                                {/* Features */}
                                <ul className="space-y-2 mb-6 flex-1 bg-stone-50 dark:bg-stone-800/50 p-3 rounded-lg">
                                    {pkg.features.map((feat, j) => (
                                        <li key={j} className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
                                            <svg className="w-3 h-3 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <button 
                                    onClick={() => handleSmmOrder(pkg, selectedSmmPlatform.name)}
                                    className="w-full py-3 rounded-xl font-bold text-sm text-white bg-stone-900 dark:bg-white dark:text-black hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                                >
                                    <span>Buy Now</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>


        {/* 3. FIVERR GIGS */}
        <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-6 border-l-4 border-indigo-500 pl-3 flex justify-between items-center max-w-6xl mx-auto">
            <span>Marketplace Gigs (Fiverr)</span>
            <span className="text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded text-stone-500">{services.length} Gigs</span>
        </h3>

        {loading && <div className="text-center text-stone-500">Loading Gigs...</div>}
        {!loading && services.length === 0 && <div className="text-center text-stone-500 bg-stone-100 dark:bg-stone-800/50 p-10 rounded-xl">No active gigs found.</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div key={service.id} className="reveal relative group" style={{ transitionDelay: `${index * 100}ms` }}>
              {isAdmin && (
                 <div className="absolute top-2 right-2 z-20 flex gap-1">
                    <button onClick={() => onEdit(service)} className="p-1.5 bg-white rounded text-blue-600 shadow">✏️</button>
                    <button onClick={() => onDelete(service.id)} className="p-1.5 bg-white rounded text-red-600 shadow">🗑️</button>
                 </div>
              )}
              <div className="fiverr-card bg-white dark:bg-stone-900 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 transition-all duration-300 flex flex-col h-full hover:-translate-y-2 hover:shadow-xl">
                  <div className="relative h-48 bg-stone-100 group-inner">
                    <img src={service.finalImage} alt={service.finalTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => e.target.src='https://via.placeholder.com/400x200?text=Service'} />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-stone-800 flex items-center gap-1"><svg className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>{service.finalRating}</div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                        <img src="/profile.png" alt="PK" className="w-8 h-8 rounded-full border border-stone-200" />
                        <div><p className="text-xs font-bold text-stone-700 dark:text-stone-300">Pethum Kashmira</p><p className="text-[10px] text-stone-400">Level 2 Seller</p></div>
                    </div>
                    <h3 className="text-stone-900 dark:text-white font-medium hover:text-emerald-600 cursor-pointer mb-2 transition-colors line-clamp-2">{service.finalTitle}</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mb-4 line-clamp-2">{service.finalDesc}</p>
                    <div className="mt-auto pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                        <div className="text-xs text-stone-400">STARTING AT</div>
                        <div className="text-lg font-bold text-stone-800 dark:text-white">${service.finalPrice}</div>
                    </div>
                    <a href={service.finalLink} target="_blank" rel="noreferrer" className="mt-4 block w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2 group-hover:gap-3">
                        Order on Fiverr <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🔥 PAYMENT MODAL */}
        {selectedPackage && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up" onClick={() => setSelectedPackage(null)}>
                <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative border border-stone-700 p-6" onClick={e => e.stopPropagation()}>
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 dark:text-white">Payment Options</h3>
                        <p className="text-sm text-stone-500">We accept the following methods</p>
                    </div>

                    <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-xl border border-stone-200 dark:border-stone-700 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-stone-500">Plan</span>
                            <span className="font-bold text-stone-800 dark:text-white">{selectedPackage.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-stone-500">Total</span>
                            <span className="text-xl font-extrabold text-emerald-600">
                                {currency === 'USD' ? `$${selectedPackage.priceUSD}` : `Rs. ${selectedPackage.priceLKR}`}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6 overflow-y-auto max-h-60 custom-scrollbar pr-2">
                        {/* 1. BANK TRANSFER */}
                        {currency === 'LKR' && (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-xl">
                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-stone-900 dark:text-white">Bank Transfer</h4>
                                    <p className="text-xs text-stone-500">Local Bank Deposit / Online Transfer</p>
                                </div>
                            </div>
                        )}

                        {/* 2. SKRILL */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center text-xl">
                                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-stone-900 dark:text-white">Skrill</h4>
                                <p className="text-xs text-stone-500">Instant Transfer</p>
                            </div>
                        </div>

                        {/* 3. PAYPAL */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-xl">
                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.946 5.05-4.336 6.795-9.077 6.795h-1.07c-.55 0-1.037.384-1.162.918l-1.704 6.963z"/></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-stone-900 dark:text-white">PayPal</h4>
                                <p className="text-xs text-stone-500">Secure Payment</p>
                            </div>
                        </div>

                        {/* 4. CRYPTO */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center text-xl">
                                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-stone-900 dark:text-white">Crypto / Binance</h4>
                                <p className="text-xs text-stone-500">USDT, BTC, ETH</p>
                            </div>
                        </div>
                    </div>

                    {/* 🔥 CHANGED BUTTON TEXT & ACTION */}
                    <button onClick={handleGetMoreDetails} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                        Get More Details
                    </button>
                    <button onClick={() => setSelectedPackage(null)} className="w-full mt-3 text-sm text-stone-500 hover:text-stone-800 dark:hover:text-white">Cancel</button>
                </div>
            </div>,
            document.body
        )}

      </section>
    </div>
  );
}
