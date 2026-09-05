export const HeroSection = () => {
    return (
        <div className="hero-container">
            <nav className="hero-nav">
                <a
                    href="https://thesisflow-ai.vercel.app/"
                    className="hero-logo"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ThesisFlow-AI
                </a>
                <button className="hero-nav-button">Get Started</button>
            </nav>

            <div className="hero-content">
                <div className="hero-left">
                    <div className="hero-tagline">Turn Research Chaos Into Clarity With AI</div>
                    <h1 className="hero-title">
                        AI Research Sidekick<br />
                        Built for Big Dreamers,<br />
                        Smarter, Faster, Stress-Free
                    </h1>
                    <button className="hero-cta-button">Get Started</button>
                </div>

                <div className="hero-right">
                    <div className="hero-image-container">
                        <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                            alt="Professional woman with glasses writing in notebook"
                            className="hero-image"
                        />

                        <div className="hero-description">
                            <div className="hero-description-tag">changelog</div>
                            <div className="hero-description-text">
                                We're putting the finishing touches on a tool that automates your research,
                                teaches you as you go, and gives you daily insights that actually help you
                                run your research better.
                            </div>
                        </div>

                        <div className="hero-chat-bubble">
                            💬
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};