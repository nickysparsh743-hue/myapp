import { ExternalLink, Github, Lock, Cpu } from 'lucide-react'

const PortfolioCard = ({ title, description, technologies, demoLink, githubLink, type }) => {
    const typeIcons = {
        ai: Cpu,
        web: ExternalLink,
        security: Lock,
        data: Cpu,
    }

    const TypeIcon = typeIcons[type] || ExternalLink

    return (
        <div className="group relative">
            {/* Hover Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple rounded-3xl opacity-0 group-hover:opacity-20 blur transition-all duration-500" />

            <div className="relative glass-effect rounded-3xl p-6 border border-white/10 hover:border-neon-green/30 transition-all duration-300">
                {/* Project Type */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <TypeIcon className="w-5 h-5 text-neon-green" />
                        <span className="text-xs font-medium text-neon-green uppercase tracking-wider">
                            {type}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {githubLink && (
                            <a
                                href={githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/5 hover:bg-neon-green/10 transition-colors duration-300"
                                aria-label="GitHub"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                        )}
                        {demoLink && (
                            <a
                                href={demoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/5 hover:bg-neon-green/10 transition-colors duration-300"
                                aria-label="Live Demo"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 gradient-text">{title}</h3>

                {/* Description */}
                <p className="text-gray-400 mb-6">{description}</p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {technologies.map((tech, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 text-xs rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* View Project Button */}
                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-neon-green/10 border border-white/10 hover:border-neon-green/30 transition-all duration-300 group-hover:shadow-lg">
                    <span className="gradient-text font-semibold">View Project Details</span>
                </button>
            </div>
        </div>
    )
}

export default PortfolioCard