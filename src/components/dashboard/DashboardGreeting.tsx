import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, Sun, Moon, CloudSun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface GreetingProps {
  role: 'alumni' | 'member';
}

const getGreetingDetails = (hour: number) => {
  if (hour >= 5 && hour < 12) {
    return {
      text: 'Good morning',
      icon: Sun,
      subtitle: 'Start your day inspired. Check your mentorship connections and network activities.'
    };
  }
  if (hour >= 12 && hour < 17) {
    return {
      text: 'Good afternoon',
      icon: CloudSun,
      subtitle: "Hope your day is productive. Here's what's happening in your alumni network."
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      text: 'Good evening',
      icon: Moon,
      subtitle: 'Catch up on session requests, upcoming appointments, and community updates.'
    };
  }
  return {
    text: 'Good night',
    icon: Moon,
    subtitle: 'Working late? Review your pending requests or prepare for upcoming sessions.'
  };
};

export const DashboardGreeting: React.FC<GreetingProps> = ({ role }) => {
  const { user } = useAuth();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const hour = now.getHours();
  const greetingInfo = getGreetingDetails(hour);
  const GreetingIcon = greetingInfo.icon;
  const name = user?.name ? user.name.split(' ')[0] : 'Member';

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(now);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(now).replace(/\u202f/g, ' ');

  return (
    <div className="bg-gradient-to-r from-[#1F3027] via-[#24382C] to-[#1F3027] border border-[#2E4336] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#B7FF72]/15 text-[#B7FF72] border border-[#B7FF72]/30">
            <Sparkles className="w-3 h-3" />
            {role === 'alumni' ? 'Alumni Mentor' : 'Community Member'}
          </span>
          <span className="text-xs text-[#9DB0A2] flex items-center gap-1 bg-[#142018] px-2.5 py-0.5 rounded-full border border-[#2E4336]">
            <Calendar className="w-3 h-3 text-[#B7FF72]" />
            {formattedDate}
          </span>
          <span className="text-xs text-[#9DB0A2] flex items-center gap-1 bg-[#142018] px-2.5 py-0.5 rounded-full border border-[#2E4336]">
            <Clock className="w-3 h-3 text-[#B7FF72]" />
            {formattedTime}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#EEF3E8] tracking-tight flex items-center gap-2.5">
          <GreetingIcon className="w-6 h-6 text-[#B7FF72] shrink-0" />
          <span>
            {greetingInfo.text}, <span className="text-[#B7FF72]">{name}</span>!
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-[#9DB0A2] max-w-xl">
          {greetingInfo.subtitle}
        </p>
      </div>
    </div>
  );
};
