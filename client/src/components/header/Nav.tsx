import { Github, Mail } from 'lucide-react';

export const Nav = () => {
    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <h1 className="text-xl lg:text-2xl font-semibold text-white google-sans-flex tracking-tight">
                            Urban Jobs <span className="text-blue-200">NYC</span>
                        </h1>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-all google-sans-flex font-medium text-sm"
                        >
                            <Github className="w-4 h-4" />
                            <span className="hidden sm:inline">GitHub</span>
                        </a>
                        <a
                            href="mailto:mohamin.nyc@gmail.com"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg border border-white/30 hover:border-white/50 shadow-md hover:shadow-lg transition-all google-sans-flex font-medium text-sm"
                        >
                            <Mail className="w-4 h-4" />
                            <span className="hidden sm:inline">Contact</span>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};
