import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, History, Lightbulb, LineChart } from 'lucide-react'; // Added LineChart icon

export default function BottomNavigationBar() {
    const navItems = [
        { path: '/', icon: Activity, label: 'Dashboard' },
        { path: '/history', icon: History, label: 'Histórico' },
        { path: '/statistics', icon: LineChart, label: 'Estatísticas' }, // New Statistics tab
        { path: '/tips', icon: Lightbulb, label: 'Dicas' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-lg z-50">
            <div className="max-w-md mx-auto flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors duration-200 ${
                                isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
                                <span>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}