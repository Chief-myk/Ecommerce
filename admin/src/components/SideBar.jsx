import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Plus, 
  ListOrdered, 
  ListChecks, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  // Navigation items
  const navItems = [
    { path: '/add', label: 'ADD ITEM', icon: Plus },
    { path: '/order', label: 'ORDER ITEM', icon: ListOrdered },
    { path: '/list', label: 'LIST ITEM', icon: ListChecks },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`relative flex z-40 flex-col min-h-screen bg-gradient-to-b from-slate-700 to-slate-900 text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-56'}`}>
      {/* Toggle button */}
      {/* <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 z-10 bg-slate-700 hover:bg-slate-600 rounded-full p-1 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button> */}
      
      {/* Sidebar content */}
      <div className="flex-1 mt-26 overflow-y-auto overflow-x-hidden py-4">
        <div className="px-4 mb-6">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-white">Inventory Manager</h1>
          )}
        </div>
        
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors group ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-600 hover:text-white'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <IconComponent 
                  size={20} 
                  className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} 
                />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                
                {/* Active indicator */}
                {isActive && (
                  <div className="h-full w-1 bg-white absolute right-0 top-0 rounded-l"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Footer with version info */}
      <div className="p-4 border-t border-slate-600">
        {!isCollapsed && (
          <p className="text-xs text-slate-400 text-center">v1.0.0</p>
        )}
      </div>
    </div>
  );
};

export default SideBar;