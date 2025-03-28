import { useState } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import Button from './atoms/Button'
import Text from './atoms/Text'

interface AppBarProps {
    userEmail: string
}

export default function AppBar({ userEmail }: AppBarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        navigate('/signin')
    }

    return (
        <nav className="bg-dark-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and title */}
                    <div className="flex items-center">
                        <Text variant="heading" size="xl">Ascend</Text>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        <Text variant="muted">{userEmail}</Text>
                        <Button
                            variant="destructive"
                            onClick={handleSignOut}
                            className="inline-flex items-center"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <Button
                            variant="ghost"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2"
                        >
                            {isMobileMenuOpen ? (
                                <X className="block h-6 w-6" />
                            ) : (
                                <Menu className="block h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden flex flex-col">
                    <div className="pt-2 pb-3 space-y-1 place-items-center">
                        <div className="px-4 py-2">
                            <Text variant="muted">{userEmail}</Text>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={handleSignOut}
                            className="w-full flex items-center px-4 py-2 max-w-36"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    )
} 