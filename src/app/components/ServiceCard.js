import { LucideIcon } from 'lucide-react'

const ServiceCard = ({ icon: Icon, title, description, features, color = 'green' }) => {
    const colorClasses = {
        green: 'from-neon-green to-emerald-500',
        blue: 'from-neon-blue to-cyan-500',
        purple: 'from-neon-purple to-violet-500',
        pink: 'from-pink-500 to-rose-500',
    }

    return (
        <div className="group relative h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-dark-gray to-dark rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl"
                style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />

            <div className="relative glass-effect rounded-3xl p-6 h-full border border-white/10 hover:border-neon-green/30 transition-all duration-300 group-hover:-translate-y-2">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-2xl mb-6 bg-gradient-to-br ${colorClasses[color]}`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-4 gradient-text">{title}</h3>

                {/* Description */}
                <p className="text-gray-400 mb-6">{description}</p>

                {/* Features */}
                <ul className="space-y-2">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                            {feature}
                        </li>
                    ))}
                </ul>

                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-neon-green to-transparent group-hover:w-3/4 transition-all duration-500" />
            </div>
        </div>
    )
}

export default ServiceCard