"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Clock, 
  Trophy, 
  Flame, 
  BookOpen, 
  Brain, 
  CheckCircle,
  ArrowLeft,
  Award,
  Zap,
  BarChart3,
  Activity,
  Users,
  Medal,
  Crown,
  Sparkles
} from "lucide-react";
import Link from "next/link";

// Types for stats data
interface UserStats {
  totalStudyTime: number;
  totalLessons: number;
  totalQuizzes: number;
  totalFlashcards: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyGoal: number;
  monthlyProgress: number;
  level: number;
  xp: number;
  xpToNext: number;
  badges: Badge[];
  weeklyActivity: WeeklyActivity[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface WeeklyActivity {
  day: string;
  hours: number;
  lessons: number;
  quizzes: number;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  isCurrentUser?: boolean;
}

function StatsContent({ stats, leaderboard }: { stats: UserStats; leaderboard: LeaderboardUser[] }) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'streaks' | 'badges' | 'leaderboard'>('overview');

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStreakFlameColor = (streak: number) => {
    if (streak >= 30) return 'text-red-500';
    if (streak >= 14) return 'text-orange-500';
    if (streak >= 7) return 'text-yellow-500';
    return 'text-blue-500';
  };

  return (
    <div className="space-y-12">
      {/* Clean Header Design */}
      <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
        <header className="relative overflow-hidden rounded-2xl bg-gradient-fresh p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-300/30 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-300">
              <BarChart3 className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-yellow-100 drop-shadow-sm">Learning Analytics</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Stats & Streaks 📊
            </h1>
            <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
              Track your progress, celebrate achievements, and maintain your learning momentum
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="hover:bg-white/20 text-white border-white/30"
            >
              <Link href="/app">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
        </header>
      </section>

      {/* Level & XP Section */}
      <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-brand to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                <Crown className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 rounded-full px-3 py-1 shadow-lg border-2 border-brand">
                <span className="text-sm font-bold text-brand">{stats.level}</span>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Level {stats.level}</h2>
              <p className="text-slate-600 dark:text-slate-400">Learning Champion</p>
              <div className="flex items-center gap-2 mt-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{stats.xp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Progress to Level {stats.level + 1}</span>
              <span className="text-sm font-bold text-brand">{stats.xpToNext} XP to go</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-brand to-purple-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(stats.xp / (stats.xp + stats.xpToNext)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'streaks', label: 'Streaks', icon: Flame },
            { id: 'badges', label: 'Badges', icon: Award },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as 'overview' | 'streaks' | 'badges' | 'leaderboard')}
              className={`h-16 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-brand to-purple-600 text-white shadow-xl scale-105'
                  : 'bg-white/80 dark:bg-slate-700/80 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:shadow-lg hover:scale-105 hover:border-brand hover:ring-4 hover:ring-brand/20'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <tab.icon className="h-6 w-6" />
                <span className="text-sm">{tab.label}</span>
              </div>
            </Button>
          ))}
        </div>
      </section>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">{stats.totalStudyTime}h</p>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Study Time</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">{stats.totalLessons}</p>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Lessons</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">{stats.totalQuizzes}</p>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Quizzes</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">{stats.averageScore}%</p>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Score</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Activity Chart */}
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-brand" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Weekly Activity</h2>
              </div>
              
              <div className="grid grid-cols-7 gap-4">
                {stats.weeklyActivity.map((day) => (
                  <div key={day.day} className="text-center">
                    <div className="mb-2">
                      <div 
                        className="w-full bg-gradient-to-t from-brand to-purple-600 rounded-lg mx-auto transition-all duration-300 hover:scale-105"
                        style={{ height: `${Math.max(day.hours * 20, 8)}px` }}
                      />
                    </div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{day.day}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">{day.hours}h</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Goals Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-brand" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Weekly Goal</h3>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{stats.weeklyProgress}h / {stats.weeklyGoal}h</span>
                    <span className="text-sm font-bold text-brand">{Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stats.weeklyProgress / stats.weeklyGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-brand" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Monthly Goal</h3>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{stats.monthlyProgress}h / {stats.monthlyGoal}h</span>
                    <span className="text-sm font-bold text-brand">{Math.round((stats.monthlyProgress / stats.monthlyGoal) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stats.monthlyProgress / stats.monthlyGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedTab === 'streaks' && (
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-4 p-8 rounded-3xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800">
                <Flame className={`h-16 w-16 ${getStreakFlameColor(stats.currentStreak)}`} />
                <div>
                  <div className="text-4xl font-bold text-slate-800 dark:text-slate-200">{stats.currentStreak}</div>
                  <div className="text-lg font-medium text-slate-600 dark:text-slate-400">Day Streak</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800">
                <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">{stats.longestStreak}</div>
                <div className="text-lg font-medium text-slate-600 dark:text-slate-400">Longest Streak</div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                <Zap className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">{stats.weeklyActivity.filter(day => day.lessons > 0).length}</div>
                <div className="text-lg font-medium text-slate-600 dark:text-slate-400">Days This Week</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Streak Milestones</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { days: 7, label: "Week Warrior", achieved: stats.currentStreak >= 7 },
                  { days: 14, label: "Fortnight Fighter", achieved: stats.currentStreak >= 14 },
                  { days: 30, label: "Month Master", achieved: stats.currentStreak >= 30 },
                  { days: 100, label: "Century Champion", achieved: stats.currentStreak >= 100 }
                ].map((milestone) => (
                  <div key={milestone.days} className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    milestone.achieved 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                  }`}>
                    <div className="text-center">
                      {milestone.achieved ? (
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      ) : (
                        <div className="h-8 w-8 rounded-full border-2 border-slate-300 dark:border-slate-600 mx-auto mb-2" />
                      )}
                      <div className="font-bold text-slate-800 dark:text-slate-200">{milestone.days} Days</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{milestone.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {selectedTab === 'badges' && (
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Achievement Badges</h2>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {stats.badges.filter(b => b.earned).length} / {stats.badges.length} earned
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                    badge.earned
                      ? 'bg-white dark:bg-slate-800 border-brand shadow-lg'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60'
                  }`}
                >
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                      badge.earned 
                        ? 'bg-gradient-to-br from-brand to-purple-600' 
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}>
                      {badge.earned ? (
                        <Medal className="h-8 w-8 text-white" />
                      ) : (
                        <Medal className="h-8 w-8 text-slate-400" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{badge.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{badge.description}</p>
                      <Badge className={getBadgeRarityColor(badge.rarity)}>
                        {badge.rarity}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {selectedTab === 'leaderboard' && (
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-brand" />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Global Leaderboard</h2>
            </div>
            
            <div className="space-y-4">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    user.isCurrentUser
                      ? 'bg-gradient-to-r from-brand/10 to-purple-600/10 border-2 border-brand'
                      : 'bg-white/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                      user.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      user.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                      user.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                      'bg-gradient-to-br from-slate-400 to-slate-600'
                    }`}>
                      {user.rank <= 3 ? (
                        <Crown className="h-6 w-6" />
                      ) : (
                        user.rank
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold ${user.isCurrentUser ? 'text-brand' : 'text-slate-800 dark:text-slate-200'}`}>
                          {user.name}
                        </h3>
                        {user.isCurrentUser && (
                          <Badge className="bg-brand/20 text-brand border-brand/30">You</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{user.xp.toLocaleString()} XP</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">#{user.rank}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function StatsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'streaks' | 'badges' | 'leaderboard'>('overview');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Fetching stats data...');
        
        // Fetch stats data
        const statsResponse = await fetch('/api/stats');
        console.log('Stats response status:', statsResponse.status);
        
        if (!statsResponse.ok) {
          const errorText = await statsResponse.text();
          console.error('Stats API error:', errorText);
          throw new Error(`Failed to fetch stats: ${statsResponse.status} ${errorText}`);
        }
        const statsData = await statsResponse.json();
        console.log('Stats data received:', statsData);
        setStats(statsData);

        // Fetch leaderboard data
        console.log('Fetching leaderboard data...');
        const leaderboardResponse = await fetch('/api/leaderboard');
        console.log('Leaderboard response status:', leaderboardResponse.status);
        
        if (!leaderboardResponse.ok) {
          const errorText = await leaderboardResponse.text();
          console.error('Leaderboard API error:', errorText);
          throw new Error(`Failed to fetch leaderboard: ${leaderboardResponse.status} ${errorText}`);
        }
        const leaderboardData = await leaderboardResponse.json();
        console.log('Leaderboard data received:', leaderboardData);
        setLeaderboard(leaderboardData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure authentication is properly established
    const timer = setTimeout(fetchData, 100);
    return () => clearTimeout(timer);
  }, []);

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStreakFlameColor = (streak: number) => {
    if (streak >= 30) return 'text-red-500';
    if (streak >= 14) return 'text-orange-500';
    if (streak >= 7) return 'text-yellow-500';
    return 'text-blue-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-[var(--fg)]/70">Loading your stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Failed to Load Stats</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!stats) {
    // Show mock data as fallback for development
    const mockStats: UserStats = {
      totalStudyTime: 0,
      totalLessons: 0,
      totalQuizzes: 0,
      totalFlashcards: 0,
      averageScore: 0,
      currentStreak: 0,
      longestStreak: 0,
      weeklyGoal: 5,
      weeklyProgress: 0,
      monthlyGoal: 20,
      monthlyProgress: 0,
      level: 1,
      xp: 0,
      xpToNext: 100,
      badges: [
        { id: 'first-steps', name: 'First Steps', description: 'Complete your first lesson', earned: false, rarity: 'common' },
        { id: 'quiz-master', name: 'Quiz Master', description: 'Score 90% or higher on 5 quizzes', earned: false, rarity: 'rare' },
        { id: 'streak-warrior', name: 'Streak Warrior', description: 'Maintain a 7-day learning streak', earned: false, rarity: 'epic' },
        { id: 'knowledge-seeker', name: 'Knowledge Seeker', description: 'Complete 50 lessons', earned: false, rarity: 'rare' },
        { id: 'flash-champion', name: 'Flash Champion', description: 'Master 100 flashcards', earned: false, rarity: 'epic' },
        { id: 'perfectionist', name: 'Perfectionist', description: 'Score 100% on a quiz', earned: false, rarity: 'legendary' },
        { id: 'marathon-learner', name: 'Marathon Learner', description: 'Study for 30 days straight', earned: false, rarity: 'legendary' },
        { id: 'speed-demon', name: 'Speed Demon', description: 'Complete 10 lessons in one day', earned: false, rarity: 'epic' }
      ],
      weeklyActivity: [
        { day: "Mon", hours: 0, lessons: 0, quizzes: 0 },
        { day: "Tue", hours: 0, lessons: 0, quizzes: 0 },
        { day: "Wed", hours: 0, lessons: 0, quizzes: 0 },
        { day: "Thu", hours: 0, lessons: 0, quizzes: 0 },
        { day: "Fri", hours: 0, lessons: 0, quizzes: 0 },
        { day: "Sat", hours: 0, lessons: 0, quizzes: 0 },
        { day: "Sun", hours: 0, lessons: 0, quizzes: 0 }
      ]
    };

    const mockLeaderboard: LeaderboardUser[] = [
      { rank: 1, name: "Alex Chen", xp: 4580, avatar: "AC", isCurrentUser: false },
      { rank: 2, name: "Sarah Johnson", xp: 4120, avatar: "SJ", isCurrentUser: false },
      { rank: 3, name: "You", xp: 0, avatar: "ME", isCurrentUser: true },
      { rank: 4, name: "Mike Wilson", xp: 2180, avatar: "MW", isCurrentUser: false },
      { rank: 5, name: "Emma Davis", xp: 1950, avatar: "ED", isCurrentUser: false }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 pt-8">
            {/* Show the stats page with mock data */}
            <StatsContent stats={mockStats} leaderboard={mockLeaderboard} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12 pt-8">
          <StatsContent stats={stats} leaderboard={leaderboard} />
        </div>
      </div>
    </div>
  );
}
