import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { supabase } from './supabaseClient';
import {
  BookOpen, Flame, Search, TrendingUp, Sun, Moon, RotateCcw, Sparkles,
  Calendar, Clock, MapPin, Play, Pause, StopCircle, Check, Target,
  Dumbbell, Bed, Layers, Activity, Zap, Coffee, Atom, Binary, Cpu,
  ChevronRight, Edit3, X, Timer, Plus, ArrowUpRight, GraduationCap,
  Command, BarChart3, Award, CheckCircle2, Globe, Quote, ListTodo, Trash2,
  MonitorPlay, Image as ImageIcon, LogOut, User, Lock, Mail
} from 'lucide-react';

/* ============================================================
   DATA & CONFIGURATION
   ============================================================ */
const THEME_KEY = 'njust_theme';
const MAIN_BG_MODE_KEY = 'njust_main_bg_mode';
const FOCUS_BG_MODE_KEY = 'njust_focus_bg_mode';

const SEMESTER_TIMELINE = { currentWeek: 11, totalWeeks: 19 };
const DAILY_ROUTINES = { gymDaysWake: '05:20 AM', gymSession: '06:00 – 07:00 AM', nonGymWake: '06:00 AM', bedtime: '09:30 – 10:00 PM' };

const IMAGE_COLLECTIONS = {
  motivation: [
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1435527173128-983b87201f4d?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1455390582262-044cdead2708?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1511649475669-e288648b2339?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=2000&q=80'
  ],
  abstract: [
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1507908708918-778587c9e563?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1554147090-e1221a04a025?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1558470598-a5dda9640f68?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1508614999368-9260051292e5?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1506259091721-347e791bab0f?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1531685250784-7569952593d2?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1524169358666-79f22534bc6e?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1513817969-3490d0fa9a6a?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?auto=format&fit=crop&w=2000&q=80'
  ],
  nature: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1444464666168-49b626f829e9?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1506744626753-1fa289ee4223?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1441829266145-6d4bfbd38eb4?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1444464666168-49b626f829e9?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80'
  ]
};

const QUOTES = [
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: "It always seems impossible until it's done.", author: 'Nelson Mandela' },
  { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln' },
  { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
  { text: "Don't watch the clock; do what it does. Keep going.", author: 'Sam Levenson' },
  { text: 'Small daily improvements are the key to staggering long-term results.', author: 'Robin Sharma' },
  { text: "You don't have to be great to start, but you have to start to be great.", author: 'Zig Ziglar' },
  { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
  { text: 'Motivation gets you going, but discipline keeps you growing.', author: 'John C. Maxwell' },
  { text: 'Every accomplishment starts with the decision to try.', author: 'John F. Kennedy' },
  { text: 'Do not wait to strike till the iron is hot; but make it hot by striking.', author: 'William B. Sprague' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'You miss 100% of the shots you don’t take.', author: 'Wayne Gretzky' },
  { text: 'Great things are done by a series of small things brought together.', author: 'Vincent van Gogh' },
  { text: 'Study while others are sleeping; work while others are loafing.', author: 'William A. Ward' },
  { text: 'The journey of a thousand miles begins with a single step.', author: 'Lao Tzu' },
  { text: 'Believe you can and you’re halfway there.', author: 'Theodore Roosevelt' },
  { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
  { text: 'Quality is not an act, it is a habit.', author: 'Aristotle' },
  { text: 'Fall seven times, stand up eight.', author: 'Japanese Proverb' },
  { text: 'What we learn with pleasure we never forget.', author: 'Alfred Mercier' },
  { text: 'Strive for progress, not perfection.', author: 'Unknown' },
  { text: 'The future depends on what you do today.', author: 'Mahatma Gandhi' },
  { text: 'Action is the foundational key to all success.', author: 'Pablo Picasso' },
  { text: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' },
  { text: 'If you want to lift yourself up, lift up someone else.', author: 'Booker T. Washington' },
  { text: 'The man who has confidence in himself gains the confidence of others.', author: 'Hasidic Proverb' },
  { text: 'Courage is grace under pressure.', author: 'Ernest Hemingway' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'Our greatest glory is not in never falling, but in rising every time we fall.', author: 'Confucius' },
  { text: 'The only limit to our realization of tomorrow is our doubts of today.', author: 'Franklin D. Roosevelt' },
  { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein' },
  { text: 'Life is 10% what happens to us and 90% how we react to it.', author: 'Charles R. Swindoll' },
  { text: 'The mind is everything. What you think you become.', author: 'Buddha' },
  { text: 'The best way to predict the future is to create it.', author: 'Peter Drucker' },
  { text: 'You are never too old to set another goal or to dream a new dream.', author: 'C.S. Lewis' },
  { text: 'The secret of change is to focus all your energy not on fighting the old, but on building the new.', author: 'Socrates' },
  { text: 'There are no secrets to success. It is the result of preparation, hard work, and learning from failure.', author: 'Colin Powell' },
  { text: 'The two most important days in your life are the day you are born and the day you find out why.', author: 'Mark Twain' },
  { text: 'If you look at what you have in life, you’ll always have more.', author: 'Oprah Winfrey' },
  { text: 'I find that the harder I work, the more luck I seem to have.', author: 'Thomas Jefferson' },
  { text: 'Opportunities don’t happen. You create them.', author: 'Chris Grosser' },
  { text: 'Don’t be afraid to give up the good to go for the great.', author: 'John D. Rockefeller' },
  { text: 'I attribute my success to this: I never gave or took any excuse.', author: 'Florence Nightingale' },
  { text: 'The most difficult thing is the decision to act, the rest is merely tenacity.', author: 'Amelia Earhart' },
  { text: 'Dream big and dare to fail.', author: 'Norman Vaughan' },
  { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
  { text: 'If you really look closely, most overnight successes took a long time.', author: 'Steve Jobs' },
  { text: 'The road to success and the road to failure are almost exactly the same.', author: 'Colin R. Davis' },
  { text: 'Success usually comes to those who are too busy to be looking for it.', author: 'Henry David Thoreau' },
  { text: 'There is no substitute for hard work.', author: 'Thomas Edison' },
  { text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
  { text: 'The pain you feel today will be the strength you feel tomorrow.', author: 'Unknown' },
  { text: 'A river cuts through rock, not because of its power, but because of its persistence.', author: 'James N. Watkins' },
  { text: 'Do something today that your future self will thank you for.', author: 'Sean Patrick Flanery' },
  { text: 'Winners are not people who never fail, but people who never quit.', author: 'Unknown' },
  { text: 'Your limitation—it’s only your imagination.', author: 'Unknown' },
  { text: 'Push yourself, because no one else is going to do it for you.', author: 'Unknown' },
  { text: 'Sometimes later becomes never. Do it now.', author: 'Unknown' },
  { text: 'Great things never come from comfort zones.', author: 'Unknown' },
  { text: 'Dream it. Wish it. Do it.', author: 'Unknown' },
  { text: 'Success doesn’t just find you. You have to go out and get it.', author: 'Unknown' },
  { text: 'The harder you work for something, the greater you’ll feel when you achieve it.', author: 'Unknown' },
  { text: 'Dream bigger. Do bigger.', author: 'Unknown' },
  { text: 'Don’t stop when you’re tired. Stop when you’re done.', author: 'Unknown' },
  { text: 'Wake up with determination. Go to bed with satisfaction.', author: 'George Lorimer' },
  { text: 'Do something today that your future self will thank you for.', author: 'Unknown' },
  { text: 'Little things make big days.', author: 'Unknown' },
  { text: 'It’s going to be hard, but hard does not mean impossible.', author: 'Unknown' },
  { text: 'Don’t wait for opportunity. Create it.', author: 'Unknown' },
  { text: 'Sometimes we’re tested not to show our weaknesses, but to discover our strengths.', author: 'Unknown' },
  { text: 'The key to success is to focus on goals, not obstacles.', author: 'Unknown' },
  { text: 'Dream it. Believe it. Build it.', author: 'Unknown' },
  { text: 'You don’t always get what you wish for; you get what you work for.', author: 'Unknown' },
  { text: 'It’s not about having time. It’s about making time.', author: 'Unknown' },
  { text: 'Develop success from failures. Discouragement and failure are two of the surest stepping stones to success.', author: 'Dale Carnegie' },
  { text: 'If you want to achieve greatness stop asking for permission.', author: 'Unknown' },
  { text: 'Things work out best for those who make the best of how things work out.', author: 'John Wooden' },
  { text: 'To live a creative life, we must lose our fear of being wrong.', author: 'Joseph Chilton Pearce' },
  { text: 'If you are not willing to risk the usual, you will have to settle for the ordinary.', author: 'Jim Rohn' },
  { text: 'Trust because you are willing to accept the risk, not because it’s safe or certain.', author: 'Unknown' },
  { text: 'Take up one idea. Make that one idea your life—think of it, dream of it, live on that idea.', author: 'Swami Vivekananda' },
  { text: 'All our dreams can come true, if we have the courage to pursue them.', author: 'Walt Disney' },
  { text: 'The best revenge is massive success.', author: 'Frank Sinatra' },
  { text: 'People who succeed have momentum. The more they succeed, the more they want to succeed.', author: 'Tony Robbins' },
  { text: "The only place where success comes before work is in the dictionary.", author: 'Vidal Sassoon' },
  { text: "Many of life's failures are people who did not realize how close they were to success when they gave up.", author: 'Thomas Edison' },
  { text: "The successful warrior is the average man, with laser-like focus.", author: 'Bruce Lee' },
  { text: "There are two types of people who will tell you that you cannot make a difference in this world: those who are afraid to try and those who are afraid you will succeed.", author: 'Ray Goforth' },
  { text: "Successful people do what unsuccessful people are not willing to do. Don't wish it were easier; wish you were better.", author: 'Jim Rohn' },
  { text: "I owe my success to having listened respectfully to the very best advice, and then going away and doing the exact opposite.", author: 'G.K. Chesterton' },
  { text: "The only thing standing between you and your goal is the story you keep telling yourself as to why you can't achieve it.", author: 'Jordan Belfort' },
  { text: "The real test is not whether you avoid this failure, because you won't. It's whether you let it harden or shame you into inaction, or whether you learn from it.", author: 'Barack Obama' },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: 'Winston Churchill' },
  { text: "Do not be embarrassed by your failures, learn from them and start again.", author: 'Richard Branson' },
  { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: 'Stephen King' },
  { text: "You have to learn the rules of the game. And then you have to play better than anyone else.", author: 'Albert Einstein' },
  { text: "Success isn't just about what you accomplish in your life; it's about what you inspire others to do.", author: 'Unknown' },
  { text: "I never dreamed about success. I worked for it.", author: 'Estée Lauder' },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: 'Jimmy Johnson' },
  { text: "You are never too old to set another goal or to dream a new dream.", author: 'Malala Yousafzai' },
  { text: "Make your life a masterpiece; imagine no limitations on what you can be, have or do.", author: 'Brian Tracy' }
];
const SUBJECT_EN = { CHN301: 'Advanced Chinese I', PHY102: 'University Physics II', CS201: 'Data Structures', CS205: 'Discrete Mathematics', PE104: 'Dragon Dance (PE)', CS102: 'Java Programming', MATH302: 'Engineering Math', MATH201: 'Linear Algebra', PHY102L: 'Physics Lab II' };

const DEFAULT_COURSES = [
  { code: 'CS201', titleZh: '数据结构', titleEn: 'Data Structures', category: 'software', credits: 4, knowledgeLevel: 3, isHard: true, weeklyTargetHours: 2, preferredTime: 'Evening (20:00 – 21:00)', notes: 'Algorithm practice, tree & graph traversal logic.', targetGrade: 'A', accentColor: '#E76F51', emoji: '🌳', visualLabel: 'Trees & Graphs', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=60' },
  { code: 'CS102', titleZh: 'JAVA程序设计', titleEn: 'Java Programming', category: 'software', credits: 3, knowledgeLevel: 4, isHard: false, weeklyTargetHours: 2, preferredTime: 'Evening (20:00 – 21:00)', notes: 'OOP design patterns, multithreading, collections API.', targetGrade: 'A+', accentColor: '#F4A261', emoji: '☕', visualLabel: 'JVM :: Bytecode', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=60' },
  { code: 'PHY102', titleZh: '大学物理（Ⅱ）', titleEn: 'University Physics II', category: 'math_physics', credits: 4, knowledgeLevel: 2, isHard: true, weeklyTargetHours: 3, preferredTime: 'Evening (19:00 – 20:00)', notes: 'Electromagnetism, Maxwell equations, wave optics.', targetGrade: 'B+', accentColor: '#2A9D8F', emoji: '⚛️', visualLabel: 'Maxwell Field & Waves', image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=900&q=60' },
  { code: 'PHY102L', titleZh: '大学物理实验（Ⅱ）', titleEn: 'Physics Lab II', category: 'math_physics', credits: 1.5, knowledgeLevel: 3, isHard: false, weeklyTargetHours: 1, preferredTime: 'Lab Days / Post-lab reports', notes: 'Experimental error calculations & oscilloscope reports.', targetGrade: 'A', accentColor: '#00BBF9', emoji: '📈', visualLabel: 'Oscilloscope Signal', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=60' },
  { code: 'MATH201', titleZh: '线性代数', titleEn: 'Linear Algebra', category: 'math_physics', credits: 3.5, knowledgeLevel: 3, isHard: true, weeklyTargetHours: 1.5, preferredTime: 'Midday or Evening', notes: 'Eigenvalues, eigenvectors, vector space transformations.', targetGrade: 'A', accentColor: '#9B5DE5', emoji: '🧮', visualLabel: 'det(A − λI) = 0', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=60' },
  { code: 'MATH302', titleZh: '工程数学', titleEn: 'Engineering Math', category: 'math_physics', credits: 4, knowledgeLevel: 2, isHard: true, weeklyTargetHours: 1.5, preferredTime: 'Midday or Evening', notes: 'Fourier transforms, Laplace transform, complex calculus.', targetGrade: 'B+', accentColor: '#F15BB5', emoji: '🌀', visualLabel: 'Fourier & Laplace', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=60' },
  { code: 'CS205', titleZh: '离散数学', titleEn: 'Discrete Mathematics', category: 'math_physics', credits: 3.5, knowledgeLevel: 2, isHard: true, weeklyTargetHours: 1, preferredTime: 'Evening (20:00 – 21:00)', notes: 'Propositional logic, set theory, proof validation.', targetGrade: 'B+', accentColor: '#00BBF9', emoji: '🔌', visualLabel: 'Logic Gates & Proofs', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=60' },
  { code: 'CHN301', titleZh: '汉语进阶（Ⅰ）', titleEn: 'Advanced Chinese I', category: 'lang_pe', credits: 3, knowledgeLevel: 4, isHard: false, weeklyTargetHours: 4, preferredTime: 'Morning (07:00 – 07:50)', notes: 'Daily vocabulary memorization, idiom usage & speech prep.', targetGrade: 'A+', accentColor: '#D62828', emoji: '漢', visualLabel: 'Idioms & Speech', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=900&q=60' },
  { code: 'PE104', titleZh: '舞龙', titleEn: 'Dragon Dance (PE)', category: 'lang_pe', credits: 1, knowledgeLevel: 5, isHard: false, weeklyTargetHours: 1, preferredTime: 'Post Practice Review', notes: 'Team synchronization, pole handling & choreography drills.', targetGrade: 'A+', accentColor: '#FB8500', emoji: '🐉', visualLabel: 'Dragon Dance Routine', image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=900&q=60' },
];

const WEEKLY_TIMETABLE = {
  Monday: [{ start: '08:00', end: '10:25', code: 'CHN301', location: 'IV-C206', weeks: 'W4-6, 8-17' }, { start: '10:40', end: '12:15', code: 'PHY102', location: 'IV-A412', weeks: 'W1-6, 10-19' }, { start: '14:00', end: '15:35', code: 'CS201', location: 'IV-A303', weeks: 'W1-6, 8-14' }, { start: '15:50', end: '18:15', code: 'CS205', location: 'IV-A505', weeks: 'W4-6, 8-18' }],
  Tuesday: [{ start: '08:00', end: '10:25', code: 'PE104', location: '二运篮球场', weeks: 'W4-6, 8-19' }, { start: '10:40', end: '12:15', code: 'CS102', location: 'IV-A107', weeks: 'W1-6, 8-14' }, { start: '15:50', end: '18:15', code: 'MATH302', location: 'III-412', weeks: 'W4-6, 8-17' }],
  Wednesday: [{ start: '08:00', end: '10:25', code: 'MATH201', location: 'IV-A303', weeks: 'W4-6, 8-14' }, { start: '10:40', end: '12:15', code: 'PHY102', location: 'IV-A412', weeks: 'W1-6, 10-19' }, { start: '14:00', end: '18:15', code: 'PHY102L', location: '物理实验中心', weeks: 'Even weeks' }],
  Thursday: [{ start: '10:40', end: '12:15', code: 'CS205', location: 'IV-A505', weeks: 'W4-5, 7-18' }, { start: '14:00', end: '15:35', code: 'CHN301', location: 'IV-C206', weeks: 'W4-5, 7-17' }, { start: '15:50', end: '18:15', code: 'CS102', location: 'IV-A107', weeks: 'W1-5, 7-14' }],
  Friday: [{ start: '08:00', end: '10:25', code: 'MATH302', location: 'III-412', weeks: 'W4-5, 7-17' }, { start: '10:40', end: '12:15', code: 'PHY102', location: 'IV-A410', weeks: 'W10-13 Special' }, { start: '14:00', end: '15:35', code: 'MATH201', location: 'IV-A303', weeks: 'W4-5, 7-14' }, { start: '15:50', end: '18:15', code: 'CS201', location: 'IV-A212', weeks: 'W1-5, 7-14' }],
  Saturday: [], Sunday: []
};

const KNOWLEDGE_LEVELS = [ { level: 1, label: 'Novice', color: '#f43f5e' }, { level: 2, label: 'Beginner', color: '#f97316' }, { level: 3, label: 'Intermediate', color: '#eab308' }, { level: 4, label: 'Advanced', color: '#3b82f6' }, { level: 5, label: 'Mastery', color: '#10b981' } ];
const LEVEL_COLORS = KNOWLEDGE_LEVELS.map(l => l.color);
const COURSE_ICONS = { CS201: Binary, CS102: Coffee, PHY102: Atom, PHY102L: Activity, MATH201: Layers, MATH302: Cpu, CS205: Zap, CHN301: BookOpen, PE104: Sparkles };
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/* ============================================================
   UTILITIES
   ============================================================ */
const hexToRgba = (hex, alpha = 1) => { const h = hex.replace('#', ''); const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h; const n = parseInt(full, 16); return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`; };
const formatTime = (secs) => { const h = Math.floor(secs / 3600); const m = Math.floor((secs % 3600) / 60); const s = secs % 60; return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; };
const todayName = () => DAYS[(new Date().getDay() + 6) % 7];

function TiltCard({ children, className = '', id, extraStyle = {} }) {
  const ref = useRef(null); const [style, setStyle] = useState({});
  const handleMove = (e) => { const el = ref.current; if (!el) return; const r = el.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width; const py = (e.clientY - r.top) / r.height; setStyle({ transform: `perspective(1000px) rotateX(${(0.5 - py) * 5}deg) rotateY(${(px - 0.5) * 5}deg) translateY(-4px)`, '--mx': `${px * 100}%`, '--my': `${py * 100}%` }); };
  const handleLeave = () => setStyle({ transform: '', '--mx': '50%', '--my': '50%' });
  return <div ref={ref} id={id} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ ...style, ...extraStyle }} className={`tilt ${className}`}>{children}</div>;
}

function Ring({ value, size = 76, stroke = 8 }) {
  const r = (size - stroke) / 2; const c = 2 * Math.PI * r;
  return (<svg width={size} height={size} className="-rotate-90"><circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-slate-200 dark:stroke-slate-800" /><circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke="url(#ringGrad)" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (value / 100) * c} style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(.22,1,.36,1)' }} /><defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs></svg>);
}

function AuthScreen({ onGuestLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      if (isLogin) { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; }
      else { const { error } = await supabase.auth.signUp({ email, password }); if (error) throw error; alert('Account created! You can now log in.'); setIsLogin(true); }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e')] bg-cover bg-center opacity-20" />
      <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-xl shadow-2xl">
        <div className="mb-8 text-center"><div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-lg"><GraduationCap className="h-8 w-8" /></div><h2 className="text-2xl font-bold text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h2><p className="text-sm text-slate-400 mt-1">Study Tracker</p></div>
        {error && <div className="mb-4 rounded-lg bg-rose-500/20 p-3 text-xs text-rose-300 border border-rose-500/30">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-xs font-semibold text-slate-300">Email</label><div className="relative mt-1"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-emerald-500" placeholder="you@example.com" /></div></div>
          <div><label className="text-xs font-semibold text-slate-300">Password</label><div className="relative mt-1"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-emerald-500" placeholder="••••••••" /></div></div>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50">{loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}</button>
        </form>
        <div className="mt-6 text-center text-xs text-slate-400">{isLogin ? "Don't have an account? " : "Already have an account? "}<button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="font-semibold text-emerald-400 hover:underline">{isLogin ? 'Sign up' : 'Log in'}</button></div>
        
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <button onClick={onGuestLogin} className="w-full rounded-xl border border-slate-600 bg-slate-800 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-slate-700 hover:text-white">
            Enter as Guest (Read-Only)
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN APP COMPONENT
   ============================================================ */
export default function App() {
  const [session, setSession] = useState(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(THEME_KEY) !== 'light');
  const [tab, setTab] = useState('courses');
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [hardOnly, setHardOnly] = useState(false);
  const [now, setNow] = useState(new Date());
  const [mainBgMode, setMainBgMode] = useState(() => localStorage.getItem(MAIN_BG_MODE_KEY) || 'motivation');
  const [focusBgMode, setFocusBgMode] = useState(() => localStorage.getItem(FOCUS_BG_MODE_KEY) || 'nature');
  const [focusRoom, setFocusRoom] = useState({ isOpen: false, subjectId: null, phase: 'focus', timeLeft: 45 * 60, isRunning: false, durationSetting: 45 });
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');
  const [toast, setToast] = useState(null);
  const [bursts, setBursts] = useState([]);
  const [highlightId, setHighlightId] = useState(null);
  const searchRef = useRef(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setAuthLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session); });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      const fetchCourses = async () => {
        const { data, error } = await supabase.from('courses').select('*').eq('user_id', session.user.id).order('created_at');
        if (error) { console.error(error); return; }
        if (data.length === 0) {
          const coursesToInsert = DEFAULT_COURSES.map(c => ({ ...c, user_id: session.user.id }));
          const { data: insertedData } = await supabase.from('courses').insert(coursesToInsert).select();
          if (insertedData) setCourses(insertedData);
        } else {
          const { data: tasks } = await supabase.from('tasks').select('*').eq('user_id', session.user.id);
          const { data: sessions } = await supabase.from('sessions').select('*').eq('user_id', session.user.id);
          const hydratedCourses = data.map(c => ({ ...c, tasks: tasks?.filter(t => t.course_id === c.id) || [], sessions: sessions?.filter(s => s.course_id === c.id) || [] }));
          setCourses(hydratedCourses);
        }
      };
      fetchCourses();
    } else if (isGuestMode) {
      setCourses(DEFAULT_COURSES.map((c, i) => ({ ...c, id: `guest-${i}`, tasks: [], sessions: [] })));
    }
  }, [session, isGuestMode]);

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light'); }, [darkMode]);
  useEffect(() => { localStorage.setItem(MAIN_BG_MODE_KEY, mainBgMode); }, [mainBgMode]);
  useEffect(() => { localStorage.setItem(FOCUS_BG_MODE_KEY, focusBgMode); }, [focusBgMode]);
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  
  useEffect(() => {
    if (!focusRoom.isRunning) return;
    const id = setInterval(() => {
      setFocusRoom(prev => {
        if (prev.timeLeft <= 1) {
          if (prev.phase === 'focus') { 
            logFocusSession(prev.subjectId, prev.durationSetting); 
            return { ...prev, phase: 'break', timeLeft: 5 * 60, isRunning: false }; 
          } else { 
            return { ...prev, phase: 'focus', timeLeft: prev.durationSetting * 60, isRunning: false }; 
          }
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [focusRoom.isRunning, focusRoom.phase, focusRoom.durationSetting]);

  const notify = useCallback((message, type = 'success') => { setToast({ id: Date.now(), message, type }); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 2600); }, []);
  const fireConfetti = useCallback(() => { const id = Date.now(); setBursts(b => [...b, id]); setTimeout(() => setBursts(b => b.filter(x => x !== id)), 1800); }, []);

  const logFocusSession = async (subjectId, minutes) => {
    if (isGuestMode || !subjectId || minutes <= 0) return;
    const newSession = { course_id: subjectId, user_id: session?.user.id, minutes, session_date: new Date().toISOString().split('T')[0] };
    setCourses(prev => prev.map(c => c.id === subjectId ? { ...c, sessions: [...(c.sessions || []), { ...newSession, id: Date.now() }] } : c));
    if (session) await supabase.from('sessions').insert(newSession);
    notify(`Logged ${minutes}m focus session! 🎉`); fireConfetti();
  };

  const saveEarlyExit = () => {
    if (!focusRoom.subjectId || isGuestMode) return;
    const elapsedMins = Math.floor((focusRoom.durationSetting * 60 - focusRoom.timeLeft) / 60);
    if (elapsedMins > 0 && focusRoom.phase === 'focus') {
      logFocusSession(focusRoom.subjectId, elapsedMins);
    }
    setFocusRoom(prev => ({ ...prev, isOpen: false, isRunning: false }));
  };

  const changeDuration = (mins, phase = 'focus') => {
    setFocusRoom(prev => ({ ...prev, phase, durationSetting: mins, timeLeft: mins * 60, isRunning: false }));
  };

  const toggleHard = async (id) => { if (isGuestMode) return; const course = courses.find(c => c.id === id); setCourses(prev => prev.map(c => c.id === id ? { ...c, isHard: !c.isHard } : c)); if (session) await supabase.from('courses').update({ isHard: !course.isHard }).eq('id', id); };
  const setLevel = async (id, level) => { if (isGuestMode) return; setCourses(prev => prev.map(c => c.id === id ? { ...c, knowledgeLevel: level } : c)); if (session) await supabase.from('courses').update({ knowledgeLevel: level }).eq('id', id); };
  const saveNotes = async (id) => { if (isGuestMode) return; setCourses(prev => prev.map(c => c.id === id ? { ...c, notes: draft } : c)); if (session) await supabase.from('courses').update({ notes: draft }).eq('id', id); setEditingId(null); notify('Notes saved'); };
  const addTask = async (courseId, text) => { if (isGuestMode) return; const newTask = { course_id: courseId, user_id: session?.user.id, text, done: false }; setCourses(prev => prev.map(c => c.id === courseId ? { ...c, tasks: [...(c.tasks || []), { ...newTask, id: Date.now() }] } : c)); if (session) await supabase.from('tasks').insert(newTask); };
  const toggleTask = async (courseId, taskId) => { if (isGuestMode) return; const task = courses.find(c => c.id === courseId)?.tasks.find(t => t.id === taskId); setCourses(prev => prev.map(c => c.id === courseId ? { ...c, tasks: c.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t) } : c)); if (session) await supabase.from('tasks').update({ done: !task.done }).eq('id', taskId); };
  const deleteTask = async (courseId, taskId) => { if (isGuestMode) return; setCourses(prev => prev.map(c => c.id === courseId ? { ...c, tasks: c.tasks.filter(t => t.id !== taskId) } : c)); if (session) await supabase.from('tasks').delete().eq('id', taskId); };

  const stats = useMemo(() => {
    const total = courses.length; const hardCount = courses.filter(c => c.isHard).length;
    const totalTargetHours = courses.reduce((a, c) => a + c.weeklyTargetHours, 0);
    const totalLoggedHours = courses.reduce((acc, c) => acc + ((c.sessions || []).reduce((sum, s) => sum + s.minutes, 0) / 60), 0);
    const overallProgress = Math.round((courses.reduce((a, c) => a + c.knowledgeLevel, 0) / (total * 5 || 1)) * 100);
    return { total, hardCount, totalTargetHours, totalLoggedHours, overallProgress };
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const q = query.toLowerCase().trim();
    return courses.filter(c => (!q || c.titleEn?.toLowerCase().includes(q) || c.code?.toLowerCase().includes(q)) && (category === 'all' || c.category === category) && (!hardOnly || c.isHard));
  }, [courses, category, hardOnly, query]);

  const countdown = useMemo(() => { const diff = new Date('2027-01-10T23:59:59').getTime() - now.getTime(); return diff > 0 ? { d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000) } : { d: 0, h: 0, m: 0 }; }, [now]);
  const quote = useMemo(() => QUOTES[Math.floor(now.getTime() / 600_000) % QUOTES.length], [now]);
  const getTimedImage = (mode) => IMAGE_COLLECTIONS[mode][Math.floor(now.getTime() / 900_000) % IMAGE_COLLECTIONS[mode].length];
  const activeSubject = courses.find(c => c.id === focusRoom.subjectId);
  const courseByCode = useMemo(() => { const map = {}; courses.forEach(c => map[c.code] = c); return map; }, [courses]);

  const goToCourse = (code) => { const target = courseByCode[code]; if (!target) return; setTab('courses'); setHighlightId(target.id); setTimeout(() => document.getElementById(`course-${target.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120); setTimeout(() => setHighlightId(null), 2800); };

  if (authLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Loading...</div>;
  if (!session && !isGuestMode) return <AuthScreen onGuestLogin={() => setIsGuestMode(true)} />;

  return (
    <div className="relative min-h-screen font-sans text-slate-900 transition-colors duration-300 dark:text-slate-100">
      <style>{`@keyframes aurora { 0%, 100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(6%, -8%, 0) scale(1.15); } } @keyframes floaty { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } } @keyframes confetti { 0% { transform: translate3d(0,0,0) rotate(0deg); opacity: 1; } 100% { transform: translate3d(var(--dx,0px), 105vh, 0) rotate(var(--rot,360deg)); opacity: 0; } } @keyframes popIn { from { opacity: 0; transform: translateY(12px) scale(0.985); } to { opacity: 1; transform: none; } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-pop-in { animation: popIn 0.45s cubic-bezier(.22,1,.36,1) both; } .animate-fade-in { animation: fadeIn 0.6s ease both; } .animate-floaty { animation: floaty 6s ease-in-out infinite; } .tilt { transition: transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s ease; transform-style: preserve-3d; }`}</style>

      <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-opacity duration-700 ${focusRoom.isOpen ? 'opacity-0' : 'opacity-100'}`}>
        <img key={getTimedImage(mainBgMode)} src={getTimedImage(mainBgMode)} alt="" className="absolute inset-0 h-full w-full object-cover animate-fade-in" style={{ opacity: darkMode ? 0.25 : 0.40 }} />
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-slate-950/90 via-slate-950/85 to-slate-950' : 'bg-gradient-to-b from-white/70 via-white/80 to-white/95'}`} />
      </div>

      {bursts.map(id => (<div key={id} className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">{Array.from({ length: 30 }).map((_, i) => (<span key={i} className="absolute top-0 block rounded-sm" style={{ left: `${Math.random()*100}%`, width: 6+Math.random()*6, height: (6+Math.random()*6)*1.6, background: ['#10b981','#14b8a6','#06b6d4','#fbbf24','#34d399'][i%5], animation: `confetti ${1.1+Math.random()*0.7}s cubic-bezier(.2,.7,.3,1) ${Math.random()*0.18}s forwards`, '--dx': `${(Math.random()-0.5)*180}px`, '--rot': `${Math.random()*720-360}deg` }} />))}</div>))}
      {toast && (<div className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 animate-slide-up"><div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 px-4 py-2.5 text-sm font-medium shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"><CheckCircle2 className={`h-4 w-4 ${toast.type === 'warn' ? 'text-amber-500' : 'text-emerald-500'}`} /><span>{toast.message}</span></div></div>)}

      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative"><div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 opacity-45 blur-md" /><div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg"><GraduationCap className="h-5 w-5" /></div></div>
            <div><div className="flex items-center gap-2"><h1 className="text-base font-extrabold tracking-tight sm:text-lg">Study Tracker</h1>{isGuestMode ? <span className="hidden rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 sm:inline">Guest Mode</span> : <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 sm:inline">{session?.user.email}</span>}</div><p className="hidden text-[11px] text-slate-500 dark:text-slate-400 sm:block">{now.toLocaleDateString('en-GB')} · Week {SEMESTER_TIMELINE.currentWeek}</p></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-white/70 p-1 dark:border-slate-700 dark:bg-slate-900/60 md:flex"><ImageIcon className="h-3.5 w-3.5 text-slate-400 ml-1" />{['motivation', 'abstract', 'nature'].map(mode => (<button key={mode} onClick={() => setMainBgMode(mode)} className={`rounded-lg px-2 py-1 text-[10px] font-semibold capitalize transition ${mainBgMode === mode ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>{mode}</button>))}</div>
            <div className="hidden items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs dark:border-teal-500/30 dark:bg-teal-500/10 lg:flex"><Timer className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" /><span className="font-mono font-bold text-teal-700 tabular-nums dark:text-teal-300">{countdown.d}d {String(countdown.h).padStart(2, '0')}h</span></div>
            {session ? (<button onClick={() => supabase.auth.signOut()} className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-500 transition hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10" title="Log Out"><LogOut className="h-4 w-4" /></button>) : (<button onClick={() => setIsGuestMode(false)} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">Log In</button>)}
            <button onClick={() => setDarkMode(d => !d)} className="rounded-xl border border-slate-200 bg-white/70 p-2 text-slate-500 transition hover:scale-105 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">{darkMode ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-emerald-600" />}</button>
          </div>
        </div>
      </header>

      <div className="sticky top-16 z-30 border-b border-slate-200/70 bg-white/60 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white/70 p-1 dark:border-slate-800 dark:bg-slate-900/60">
            {[{ id: 'courses', label: 'Subjects', icon: BookOpen }, { id: 'timetable', label: 'Timetable', icon: Calendar }, { id: 'logger', label: 'Study Logger', icon: Target }].map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)} className={`relative flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all sm:px-4 sm:text-sm ${tab === id ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'}`}><Icon className="h-4 w-4" /><span className="hidden sm:inline">{label}</span></button>
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/75 p-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60"><div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-2xl" /><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Overall Mastery</p><TrendingUp className="h-4 w-4 text-emerald-500" /></div><div className="mt-3 flex items-center gap-4"><div className="relative"><Ring value={stats.overallProgress} /><span className="absolute inset-0 grid place-items-center text-sm font-extrabold">{stats.overallProgress}%</span></div><div className="space-y-1 text-[11px] text-slate-500"><p>Avg level <strong className="text-emerald-500">{(courses.reduce((a,c)=>a+c.knowledgeLevel,0)/(courses.length||1)).toFixed(1)}</strong> / 5.0</p><p><strong className="text-slate-700 dark:text-slate-200">{courses.length}</strong> subjects tracked</p></div></div></div>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/75 p-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60"><div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-500/20 blur-2xl" /><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Heavy Hitters</p><Flame className="h-4 w-4 fill-rose-500 text-rose-500" /></div><h3 className="mt-2 text-3xl font-extrabold text-rose-500">{stats.hardCount}<span className="ml-1 text-xs font-medium text-slate-400">/ {courses.length} courses</span></h3></div>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/75 p-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60"><div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-2xl" /><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Self-Study</p><Clock className="h-4 w-4 text-emerald-500" /></div><h3 className="mt-2 text-3xl font-extrabold">{stats.totalLoggedHours.toFixed(1)}<span className="text-sm font-medium text-slate-400">h</span></h3><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700" style={{ width: `${Math.min(100, (stats.totalLoggedHours / (stats.totalTargetHours || 1)) * 100)}%` }} /></div></div>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/75 p-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60"><div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/20 blur-2xl" /><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Daily Anchors</p><Dumbbell className="h-4 w-4 text-amber-500" /></div><div className="mt-2.5 space-y-1.5 text-[11px]"><div className="flex justify-between"><span className="text-slate-500">Wake</span><span className="font-mono font-bold">{DAILY_ROUTINES.gymDaysWake}</span></div><div className="flex justify-between"><span className="text-slate-500">Sleep</span><span className="font-mono font-bold">{DAILY_ROUTINES.bedtime}</span></div></div></div>
        </section>

        {/* SUBJECTS TAB */}
        {tab === 'courses' && (
          <section key="courses" className="mt-8 animate-pop-in space-y-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input ref={searchRef} type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search Subjects..." className="w-full rounded-2xl border border-slate-200 bg-white/80 py-2.5 pl-10 pr-16 text-sm outline-none backdrop-blur transition focus:border-emerald-400 dark:border-slate-800 dark:bg-slate-900/70" /></div>
              <div className="flex flex-wrap items-center gap-2">
                {[{ id: 'all', label: 'All', emoji: '✨' }, { id: 'software', label: 'Software', emoji: '💻' }, { id: 'math_physics', label: 'Math', emoji: '📐' }, { id: 'lang_pe', label: 'Lang', emoji: '🏮' }].map(c => (<button key={c.id} onClick={() => setCategory(c.id)} className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${category === c.id ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white/70 text-slate-500 hover:text-slate-700'}`}><span>{c.emoji}</span> {c.label}</button>))}
                <button onClick={() => setHardOnly(v => !v)} className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${hardOnly ? 'border-rose-300 bg-rose-50 text-rose-600' : 'border-slate-200 bg-white/70 text-slate-500'}`}><Flame className={`h-3.5 w-3.5 ${hardOnly ? 'fill-rose-500' : ''}`} /> Hard only</button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map(course => {
                const levelInfo = KNOWLEDGE_LEVELS[(course.knowledgeLevel || 1) - 1];
                const totalMins = (course.sessions || []).reduce((s, a) => s + a.minutes, 0);
                const loggedHrs = totalMins / 60;
                const pct = Math.min(100, Math.round((loggedHrs / course.weeklyTargetHours) * 100));
                const isEditing = editingId === course.id;
                const Icon = COURSE_ICONS[course.code] || BookOpen;

                return (
                  <TiltCard key={course.id} id={`course-${course.id}`} extraStyle={{ backgroundImage: darkMode ? `linear-gradient(160deg, ${hexToRgba(course.accentColor, 0.30)} 0%, rgba(2,6,23,0.95) 100%)` : `linear-gradient(160deg, ${hexToRgba(course.accentColor, 0.22)} 0%, #fff 100%)` }} className={`group relative overflow-hidden rounded-3xl border shadow-sm backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl ${course.isHard ? 'border-rose-300/70' : 'border-slate-200/80'} ${highlightId === course.id ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}>
                    <div className="relative h-32 w-full overflow-hidden rounded-t-3xl bg-slate-900"><img src={course.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-110" /><div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${hexToRgba(course.accentColor, 0.55)}, rgba(2,6,23,0.85))` }} /><div className="absolute inset-0 flex items-end justify-between p-4"><div className="flex items-center gap-2.5"><div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/25 bg-white/15 text-xl backdrop-blur-md">{course.emoji}</div><div><p className="font-mono text-[10px] uppercase text-white/75">{course.code}</p><p className="text-sm font-semibold text-white">{course.visualLabel}</p></div></div><Icon className="h-7 w-7 text-white/85 animate-floaty" /></div>{course.isHard && <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-rose-200/60 bg-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-50"><Flame className="h-3 w-3 fill-rose-300" /> Heavy</span>}</div>

                    <div className="relative p-5">
                      <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-lg font-bold text-slate-900 dark:text-slate-100">{course.titleZh}</h3><p className="truncate text-xs font-medium text-slate-600 dark:text-slate-400">{course.titleEn}</p></div><button onClick={() => toggleHard(course.id)} disabled={isGuestMode} className={`shrink-0 rounded-xl border p-2 transition disabled:opacity-50 ${course.isHard ? 'border-rose-300 bg-rose-500/20 text-rose-500' : 'border-slate-200 text-slate-400'}`}><Flame className={`h-5 w-5 ${course.isHard ? 'fill-rose-500' : ''}`} /></button></div>

                      <div className="mt-4 border-t border-white/40 pt-3"><div className="flex items-center justify-between text-[11px]"><span className="text-slate-600 dark:text-slate-400">Knowledge level</span><span className="rounded-full px-2.5 py-0.5 font-semibold" style={{ color: levelInfo.color, background: hexToRgba(levelInfo.color, 0.15) }}>Lv {course.knowledgeLevel} · {levelInfo.label}</span></div><div className="mt-2 grid grid-cols-5 gap-1.5">{[1, 2, 3, 4, 5].map(lvl => (<button key={lvl} onClick={() => setLevel(course.id, lvl)} disabled={isGuestMode} className={`h-2.5 rounded-full transition-all duration-300 hover:scale-y-[1.8] disabled:hover:scale-y-100 disabled:opacity-50 ${lvl <= course.knowledgeLevel ? '' : 'bg-slate-200/70 dark:bg-slate-800'}`} style={lvl <= course.knowledgeLevel ? { background: LEVEL_COLORS[course.knowledgeLevel - 1] } : undefined} />))}</div></div>

                      <div className="mt-4 rounded-2xl border border-white/40 bg-white/45 p-3 backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-950/45">
                        <div className="flex items-center justify-between text-[11px]"><span className="text-slate-600 dark:text-slate-400">Target · <strong>{course.weeklyTargetHours}h/wk</strong></span><span className="font-mono font-semibold" style={{ color: course.accentColor }}>{loggedHrs.toFixed(1)}h</span></div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: course.accentColor }} /></div>
                        <button onClick={() => setFocusRoom({ isOpen: true, subjectId: course.id, phase: 'focus', timeLeft: 45*60, isRunning: false, durationSetting: 45 })} disabled={isGuestMode} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-300/70 bg-emerald-50/80 py-2 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"><Play className="h-3.5 w-3.5" /> Open Focus Room</button>
                      </div>

                      <div className="mt-3"><div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400"><span className="flex items-center gap-1"><Edit3 className="h-3 w-3" /> Focus notes</span>{!isEditing && !isGuestMode && <button onClick={() => { setEditingId(course.id); setDraft(course.notes); }} className="font-semibold text-emerald-600">Edit</button>}</div>{isEditing ? (<div className="mt-1.5 space-y-2"><textarea value={draft} onChange={e => setDraft(e.target.value)} rows={2} className="w-full rounded-xl border p-2 text-xs outline-none" /><div className="flex justify-end gap-2"><button onClick={() => setEditingId(null)} className="text-[11px]">Cancel</button><button onClick={() => saveNotes(course.id)} className="text-[11px] text-emerald-600">Save</button></div></div>) : (<p className="mt-1.5 rounded-xl border border-dashed border-white/50 bg-white/35 p-2.5 text-xs italic text-slate-700 dark:border-slate-700/70 dark:bg-slate-950/30 dark:text-slate-300">“{course.notes}”</p>)}</div>

                      <div className="mt-3 rounded-2xl border border-white/40 bg-white/50 p-3 dark:border-slate-800/70 dark:bg-slate-950/40">
                        <div className="flex items-center justify-between text-[11px]"><span className="font-semibold flex items-center gap-1.5"><ListTodo className="h-3.5 w-3.5" /> To-do</span></div>
                        {!isGuestMode && <form onSubmit={e => { e.preventDefault(); const val = e.target.elements.task.value.trim(); if(val){ addTask(course.id, val); e.target.reset(); } }} className="mt-2 flex gap-1.5"><input name="task" placeholder="Add task..." className="flex-1 rounded-lg border border-slate-200 bg-white/80 px-2 py-1 text-[11px] outline-none" /><button type="submit" className="rounded-lg bg-emerald-600 px-2 text-white"><Plus className="h-3 w-3" /></button></form>}
                        {course.tasks?.map(t => (<div key={t.id} className="mt-1 flex items-center gap-2 text-[11px]"><button onClick={() => toggleTask(course.id, t.id)} disabled={isGuestMode} className={`h-3.5 w-3.5 shrink-0 rounded border disabled:opacity-50 ${t.done ? 'bg-emerald-500 border-transparent text-white' : 'border-slate-300'}`}>{t.done && <Check className="h-2.5 w-2.5" />}</button><span className={t.done ? 'line-through text-slate-400' : ''}>{t.text}</span>{!isGuestMode && <button onClick={() => deleteTask(course.id, t.id)} className="ml-auto text-slate-400 hover:text-rose-500"><Trash2 className="h-3 w-3" /></button>}</div>))}
                      </div>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </section>
        )}

        {/* TIMETABLE TAB */}
        {tab === 'timetable' && (
          <section key="timetable" className="mt-8 animate-pop-in space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {DAYS.slice(0, 5).map(day => {
                const slots = WEEKLY_TIMETABLE[day] || [];
                const isToday = todayName() === day;
                return (
                  <div key={day} className={`rounded-3xl border bg-white/70 p-3 backdrop-blur transition dark:bg-slate-900/60 ${isToday ? 'border-emerald-300 ring-2 ring-emerald-500/20' : 'border-slate-200'}`}>
                    <div className="mb-3 flex items-center justify-between px-1"><span className={`text-sm font-bold ${isToday ? 'text-emerald-600' : ''}`}>{day}</span>{isToday && <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white">Today</span>}</div>
                    <div className="space-y-2.5">
                      {slots.length === 0 ? <p className="rounded-xl border border-dashed py-8 text-center text-[11px] text-slate-400">Free day 🌤️</p> : slots.map((slot, i) => {
                        const course = courseByCode[slot.code];
                        const color = course?.accentColor || '#10b981';
                        const englishName = SUBJECT_EN[slot.code] || course?.titleEn || slot.subject;
                        return (
                          <button key={i} onClick={() => goToCourse(slot.code)} className="group relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/60">
                            <span className="absolute inset-y-0 left-0 w-1" style={{ background: color }} />
                            <div className="flex justify-between pl-2 text-[10px] font-mono"><span className="text-slate-500">{slot.start}–{slot.end}</span><span className="rounded bg-slate-100 px-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400">{slot.code}</span></div>
                            <p className="mt-1 truncate pl-2 text-xs font-bold text-slate-800 dark:text-slate-100">{englishName}</p>
                            <div className="mt-1 flex justify-between pl-2 text-[10px]"><span className="text-emerald-600 dark:text-emerald-400"><MapPin className="inline h-3 w-3" /> {slot.location}</span></div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* LOGGER TAB */}
        {tab === 'logger' && (
          <section key="logger" className="mt-8 grid animate-pop-in grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white/75 p-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60">
              <h2 className="flex items-center gap-2 text-lg font-bold"><BarChart3 className="h-5 w-5 text-emerald-500" /> Weekly study allocation</h2>
              <p className="mt-1 text-xs text-slate-500">Progress is automatically calculated from Focus Room sessions.</p>
              <div className="mt-5 space-y-4">
                {courses.map(c => {
                  const logged = (c.sessions || []).reduce((s, a) => s + a.minutes, 0) / 60;
                  const pct = Math.min(100, Math.round((logged / c.weeklyTargetHours) * 100));
                  return (
                    <div key={c.id}>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="flex items-center gap-2 font-semibold"><span className="h-2 w-2 rounded-full" style={{ background: c.accentColor }} />{c.titleEn}</span>
                        <span className="font-mono text-[11px] text-slate-500">{logged.toFixed(1)}h / {c.weeklyTargetHours}h</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: c.accentColor }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* HOURLY QUOTE */}
        <section className="mt-12">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-white/75 p-6 backdrop-blur-xl dark:border-emerald-500/20 dark:bg-slate-900/60">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-400/25 blur-3xl" />
            <Quote className="absolute right-5 top-5 h-12 w-12 text-emerald-200/60 dark:text-emerald-500/20" />
            <div key={quote.text} className="relative animate-fade-in">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400"><Sparkles className="h-3 w-3" /> Daily Spark</p>
              <p className="mt-3 max-w-3xl text-lg font-medium leading-relaxed text-slate-800 dark:text-slate-100">“{quote.text}”</p>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">— {quote.author}</p>
            </div>
          </div>
        </section>
      </main>

      {/* FOCUS ROOM OVERLAY */}
      {focusRoom.isOpen && activeSubject && !isGuestMode && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950 animate-fade-in">
          <img key={getTimedImage(focusBgMode)} src={getTimedImage(focusBgMode)} className="absolute inset-0 h-full w-full object-cover opacity-60 animate-fade-in" />
          <div className="absolute inset-0 bg-slate-950/70" />
          
          {/* Top Bar: Back Button & Mode Switcher */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6">
            <button onClick={saveEarlyExit} className="flex items-center gap-2 rounded-xl bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-black/60">
              <ChevronRight className="h-4 w-4 rotate-180" /> Save & Exit
            </button>
            <div className="flex items-center gap-2 rounded-xl bg-black/40 p-1 backdrop-blur-md">
              <ImageIcon className="h-4 w-4 text-white/70 ml-2" />
              {['motivation', 'abstract', 'nature'].map(mode => (
                <button key={mode} onClick={() => setFocusBgMode(mode)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${focusBgMode === mode ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}>{mode}</button>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{activeSubject.emoji}</span>
              <h2 className="text-3xl text-white font-bold">{activeSubject.titleEn}</h2>
            </div>

            {/* Phase & Duration Switcher */}
            <div className="flex bg-black/40 rounded-full p-1 backdrop-blur-md mb-8">
              <button onClick={() => changeDuration(45, 'focus')} className={`px-6 py-2 rounded-full text-sm font-semibold transition ${focusRoom.phase === 'focus' && focusRoom.durationSetting === 45 ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}>Focus 45m</button>
              <button onClick={() => changeDuration(60, 'focus')} className={`px-6 py-2 rounded-full text-sm font-semibold transition ${focusRoom.phase === 'focus' && focusRoom.durationSetting === 60 ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}>Focus 60m</button>
              <button onClick={() => changeDuration(5, 'break')} className={`px-6 py-2 rounded-full text-sm font-semibold transition ${focusRoom.phase === 'break' ? 'bg-teal-500 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}>Break 5m</button>
            </div>

            <div className="text-[8rem] text-white font-extrabold tabular-nums leading-none">{formatTime(focusRoom.timeLeft)}</div>
            <p className="mt-4 text-white/70 font-medium tracking-widest uppercase text-sm">
              {focusRoom.phase === 'focus' ? 'Deep Work in Progress' : 'Rest & Recharge'}
            </p>
            {/* The Quote in the Focus Room */}
           <div className="mt-8 max-w-lg text-center px-4">
             <p className="text-white/80 italic text-lg font-serif">
               “{quote.text}”
             </p>
             <p className="text-white/50 text-xs mt-2 uppercase tracking-widest">
               — {quote.author}
             </p>
           </div>

            <div className="flex items-center gap-4 mt-12">
              <button onClick={() => setFocusRoom(prev => ({ ...prev, isRunning: !prev.isRunning }))} className="h-20 w-20 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-105 transition shadow-xl">
                {focusRoom.isRunning ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
