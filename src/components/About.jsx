import robotImg from '../assets/robot_stack.png';
import { SplineScene } from './ui/splite';

const About = () => {
    const cards = [
        {
            id: '01',
            title: 'Real-time Analysis',
            desc: 'Get instant feedback on your writing grammar, tone, and style as you type.',
        },
        {
            id: '02',
            title: 'Secure & Private',
            desc: 'Your content is encrypted and processed locally. We value your data privacy.',
        },
        {
            id: '03',
            title: 'Multi-Language',
            desc: 'Support for over 30+ languages with native-level nuance and context awareness.',
        },
        {
            id: '04',
            title: 'Cloud Sync',
            desc: 'Access your documents from any device, anywhere, with seamless synchronization.',
        }
    ];

    return (
        <section id="about" className="why-choose-section">
            <div className="container">
                <h2 className="section-title">
                    Why <br /> Choose <span className="highlight">S.T.A?</span>
                </h2>

                <div className="why-choose-grid">
                    {/* Left Column */}
                    <div className="cards-column left">
                        <div className="feature-card glass-card">
                            <div className="card-number">01</div>
                            <h3>{cards[0].title}</h3>
                        </div>
                        <div className="feature-card glass-card">
                            <div className="card-number">03</div>
                            <h3>{cards[2].title}</h3>
                        </div>
                    </div>

                    {/* Center Image */}
                    <div className="center-image-container">
                        <SplineScene
                            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                            className="floating-robot w-full h-full"
                        />
                        {/* Glow effect behind robot */}
                        <div className="robot-glow"></div>
                    </div>

                    {/* Right Column */}
                    <div className="cards-column right">
                        <div className="feature-card glass-card">
                            <div className="card-number">02</div>
                            <h3>{cards[1].title}</h3>
                        </div>
                        <div className="feature-card glass-card">
                            <div className="card-number">04</div>
                            <h3>{cards[3].title}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
