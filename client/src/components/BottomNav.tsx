// import { Home, Brain, MessageCircle, MapPin, Calendar } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { cn } from '@/lib/utils';

// export function BottomNav() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const navItems = [
//     { icon: Home, label: 'Home', path: '/' },
//     { icon: Brain, label: 'AI Behavior', path: '/ai-behavior' },
//     { icon: MessageCircle, label: 'Chat', path: '/chat' },
//     { icon: MapPin, label: 'Locations', path: '/locations' },
//     { icon: Calendar, label: 'Schedule', path: '/schedule' },
//   ];

//   return (
//     <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t z-50">
//       <div className="flex justify-around items-center h-16 max-w-7xl mx-auto px-4">
//         {navItems.map((item) => {
//           const isActive = location.pathname === item.path;
//           return (
//             <button
//               key={item.path}
//               onClick={() => navigate(item.path)}
//               className={cn(
//                 'flex flex-col items-center justify-center flex-1 h-full transition-colors',
//                 isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
//               )}
//             >
//               <item.icon className={cn('h-6 w-6 mb-1', isActive && 'animate-bounce')} />
//               <span className="text-xs font-medium">{item.label}</span>
//             </button>
//           );
//         })}
//       </div>
//     </nav>
//   );
// }

import { Home, Brain, MessageCircle, MapPin, Calendar, PawPrint } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Brain, label: 'AI Behavior', path: '/ai-behavior' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { icon: MapPin, label: 'Locations', path: '/locations' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: PawPrint, label: 'Lost Pets', path: '/lost-pets' }, // new
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t z-50">
      <div className="flex justify-around items-center h-16 max-w-7xl mx-auto px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-6 w-6 mb-1', isActive && 'animate-bounce')} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}