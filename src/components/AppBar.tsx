import { useState } from 'react'
import { Menu, X, LogOut, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import Text from './atoms/Text'

export default function AppBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        navigate('/signin')
    }

    return (
        <nav className="bg-dark-900 border-b border-dark-800 shadow-neon">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and title */}
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/')}
                            className="flex-shrink-0 hover:text-primary-300 transition-colors"
                        >
                            <Text variant="accent" size="xl">
                                Ascend
                            </Text>
                        </button>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <button
                                onClick={() => navigate('/profile')}
                                className="flex  gap-2 p-2 rounded-md text-primary-400 hover:text-primary-300 hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 mr-2"
                            >
                                <User className="h-6 w-6" />
                                Profile
                            </button>
                            <button
                                onClick={handleSignOut}
                                className="flex gap-2 p-2 rounded-md text-primary-400 hover:text-primary-300 hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <LogOut className="h-6 w-6" />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-primary-400 hover:text-primary-300 hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-dark-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <button
                            onClick={() => {
                                navigate('/profile')
                                setIsMenuOpen(false)
                            }}
                            className="w-full flex items-center px-3 py-2 text-primary-400 hover:text-primary-300 hover:bg-dark-800 rounded-md"
                        >
                            <User className="h-5 w-5 mr-2" />
                            Profile
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center px-3 py-2 text-primary-400 hover:text-primary-300 hover:bg-dark-800 rounded-md"
                        >
                            <LogOut className="h-5 w-5 mr-2" />
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
} 