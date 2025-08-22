'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Stethoscope,
  Building,
  ClipboardList,
  CalendarClock,
  Users,
  MessageCircle,
  BarChart2,
  X,
  Menu,
  LogOut,
  User as UserIcon,
  Bell,
  Settings,
  Loader2,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Search,
  Home,
  Activity
} from 'lucide-react';

// Interface User
interface User {
  id: number;
  email: string;
  name: string;
  role_id: number;
}

// Cấu trúc menu với badges và descriptions
const adminMenuGroups = [
  {
    group: 'Tổng quan',
    icon: Home,
    items: [
      { 
        label: 'Bảng điều khiển', 
        path: '/admin/dashboard', 
        icon: LayoutDashboard,
        description: 'Tổng quan hệ thống',
        badge: 'Hot'
      },
      { 
        label: 'Doanh thu', 
        path: '/admin/paid-appointments', 
        icon: BarChart2,
        description: 'Thống kê doanh thu',
        badge: '5'
      },
    ]
  },
  {
    group: 'Quản lý',
    icon: Activity,
    items: [
      { 
        label: 'Lịch hẹn', 
        path: '/admin/schedules', 
        icon: CalendarClock,
        description: 'Quản lý lịch hẹn',
        badge: '12'
      },
      { 
        label: 'Bác sĩ', 
        path: '/admin/doctors', 
        icon: Stethoscope,
        description: 'Danh sách bác sĩ'
      },
      { 
        label: 'Phòng khám', 
        path: '/admin/clinics', 
        icon: Building,
        description: 'Quản lý phòng khám'
      },
      { 
        label: 'Chuyên khoa', 
        path: '/admin/specialties', 
        icon: ClipboardList,
        description: 'Danh mục chuyên khoa'
      },
      { 
        label: 'Hồ sơ bệnh án', 
        path: '/admin/medical-records', 
        icon: ClipboardList,
        description: 'Quản lý hồ sơ bệnh án'
      },
      { 
        label: 'Người dùng', 
        path: '/admin/accounts', 
        icon: Users,
        description: 'Quản lý tài khoản'
      },
      { 
        label: 'Tin nhắn', 
        path: '/admin/chat', 
        icon: MessageCircle,
        description: 'Chat hỗ trợ',
        badge: '3'
      },
      { 
        label: 'Thanh toán', 
        path: '/admin/payment', 
        icon: CreditCard,
        description: 'Quản lý thanh toán'
      },
      { 
        label: 'Đánh giá', 
        path: '/admin/ratings', 
        icon: MessageCircle,
        description: 'Quản lý đánh giá người dùng',
        badge: 'New'
      },
    ]
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompactMode, setIsCompactMode] = useState(false);
  
  // State để xác định có được phép render nội dung chính không
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Handle authentication directly
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.role_id === 1) {
            setUser(parsedUser);
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            router.replace('/admin/login');
          }
        } else {
          setIsAuthorized(false);
          router.replace('/admin/login');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthorized(false);
        router.replace('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Handle logout
  const handleLogout = () => {
    setProfileMenuOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthorized(false);
    router.push('/admin/login');
  };

  // Toggle group collapse
  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Filter menu items based on search
  const filteredMenuGroups = adminMenuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  // Kiểm tra các trang không cần layout
  const noLayoutRoutes = ['/admin/login'];
  if (noLayoutRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  const isActive = (path: string) => {
    return pathname === path || (path !== '/admin' && pathname.startsWith(path));
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="px-4 py-4 mb-2 flex items-center justify-between border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <img src="https://i.imgur.com/bUBPKF9.jpeg" alt="Logo" className="w-8 h-8 rounded-lg" />
          </div>
          {!isCompactMode && (
            <div>
              <h1 className="text-white font-bold text-lg">HEAL THFIRST</h1>
              <p className="text-slate-400 text-xs">Admin Panel</p>
            </div>
          )}
        </Link>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsCompactMode(!isCompactMode)} 
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            title={isCompactMode ? "Mở rộng" : "Thu gọn"}
          >
            <ChevronRight size={16} className={`transform transition-transform ${isCompactMode ? 'rotate-180' : ''}`} />
          </button>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {!isCompactMode && (
        <div className="px-4 mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {filteredMenuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.group)}
              className={`w-full flex items-center justify-between px-3 py-2 mb-3 rounded-lg transition-all hover:bg-slate-800/50 ${
                isCompactMode ? 'justify-center' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <group.icon size={18} className="text-slate-400" />
                {!isCompactMode && (
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    {group.group}
                  </h3>
                )}
              </div>
              {!isCompactMode && (
                <ChevronDown 
                  size={14} 
                  className={`text-slate-400 transform transition-transform ${
                    collapsedGroups[group.group] ? '-rotate-90' : ''
                  }`} 
                />
              )}
            </button>

            {/* Group Items */}
            <div className={`space-y-1 ${collapsedGroups[group.group] && !isCompactMode ? 'hidden' : ''}`}>
              {group.items.map((menu) => (
                <Link 
                  key={menu.path} 
                  href={menu.path} 
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
                    isActive(menu.path) 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:shadow-md'
                  } ${isCompactMode ? 'justify-center' : ''}`}
                  title={isCompactMode ? menu.label : ''}
                >
                  <div className="relative flex items-center">
                    <menu.icon size={20} className={`${isActive(menu.path) ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`} />
                    {menu.badge && (
                      <span className={`absolute -top-1 -right-1 min-w-[16px] h-4 px-1 text-xs font-bold rounded-full flex items-center justify-center ${
                        menu.badge === 'Hot' 
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {menu.badge}
                      </span>
                    )}
                  </div>
                  
                  {!isCompactMode && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{menu.label}</span>
                      </div>
                      {menu.description && (
                        <p className={`text-xs mt-0.5 ${
                          isActive(menu.path) ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-400'
                        } transition-colors`}>
                          {menu.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Active indicator */}
                  {isActive(menu.path) && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-full opacity-75"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Status at Bottom */}
      {!isCompactMode && user && (
        <div className="px-4 py-3 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-sm text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex flex-col z-30 transition-all duration-300 ease-in-out shadow-2xl ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${isCompactMode ? 'w-20' : 'w-72'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="lg:hidden p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-800">
                  {adminMenuGroups
                    .flatMap(group => group.items)
                    .find(item => isActive(item.path))?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500">
                  {adminMenuGroups
                    .flatMap(group => group.items)
                    .find(item => isActive(item.path))?.description || 'Quản lý hệ thống'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">3</span>
              </button>

              {/* Profile Menu */}
              <div className="relative">
                {user && (
                  <button 
                    onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} 
                    className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm text-gray-600 hidden sm:inline">
                      Chào, <span className="font-semibold">{user.name}</span>
                    </span>
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>
                )}
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20 animate-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      onClick={() => setProfileMenuOpen(false)} 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <UserIcon size={16} />
                      Hồ sơ cá nhân
                    </Link>
                    <Link 
                      href="/settings" 
                      onClick={() => setProfileMenuOpen(false)} 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings size={16} />
                      Cài đặt
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50">
          {loading || !isAuthorized ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Đang tải...</p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in-0 duration-500">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}