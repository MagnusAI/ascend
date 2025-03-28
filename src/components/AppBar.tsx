import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Text from './atoms/Text'

interface AppBarProps {
    userEmail: string
}

export default function AppBar({ userEmail }: AppBarProps) {
    const handleSignOut = async () => {
        await supabase.auth.signOut()
    }

    return (
        <nav className="bg-dark-800 border-b border-dark-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/dashboard" className="flex items-center">
                                <Text variant="accent" size="xl">
                                    Ascend
                                </Text>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-300 mr-4">{userEmail}</span>
                        <button
                            onClick={handleSignOut}
                            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
} 