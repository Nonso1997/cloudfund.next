import Link from 'next/link';
import Image from 'next/image';
import PlansCarousel from '../components/PlansCarousel';
import SubscribeForm from '../components/SubscribeForm';
import exchangeFeature from '../images/feature-exchange.svg';
import fundingFeature from '../images/feature-funding.svg';
import investFeature from '../images/feature-invest.svg';
import walletFeature from '../images/feature-wallet.svg';

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-content">
          <span className="eyebrow">Cloudfund Trading</span>
          <h1>Trade smarter with a modern investment company that offers top quality services</h1>
          <p>Launch your trading journey today, invest and earn profits, see live portfolio insights and account controls.</p>
          <div className="hero-actions">
            <Link href="/register" className="button">
              Start Trading
            </Link>
            <Link href="/login" className="button button-secondary">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="section section-light">
        <div className="container">
          <div className="section-heading">
            <span>Trusted since 2020</span>
            <h2>Six years of impeccable service</h2>
            <p>Cloudfund Inc empowers traders with a smooth user dashboard, automated package selection, and account controls.</p>
          </div>
          <div className="grid grid-3">
            <div className="feature-card">
              <h3>Worldwide access</h3>
              <p>Trade from anywhere with a fully responsive dashboard that works on desktop and mobile.</p>
            </div>
            <div className="feature-card">
              <h3>Secure accounts</h3>
              <p>Encrypted passwords, session JWT cookies, and a modern frontend built for Vercel.</p>
            </div>
            <div className="feature-card">
              <h3>Fast support</h3>
              <p>Built-in contact guidance, investment plans, and a dashboard designed for fast account management.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section section-dark">
        <div className="container">
          <div className="features-heading">
            <h2>Our Features</h2>
          </div>
          <div className="feature-timeline">
            <article className="timeline-feature">
              <div className="timeline-slot timeline-copy">
                <h3>Ease Funding</h3>
                <p>Get your account funded with ease.</p>
                <Link href="/register" className="mini-button">Get Started</Link>
              </div>
              <span className="timeline-dot" aria-hidden="true" />
              <div className="timeline-slot timeline-art">
                <div className="device device-desktop">
                  <div className="device-screen">
                    <Image src={fundingFeature} alt="Funding illustration" />
                  </div>
                </div>
              </div>
            </article>

            <article className="timeline-feature">
              <div className="timeline-slot timeline-art">
                <div className="device device-laptop">
                  <div className="device-screen">
                    <Image src={exchangeFeature} alt="Exchange illustration" />
                  </div>
                </div>
              </div>
              <span className="timeline-dot" aria-hidden="true" />
              <div className="timeline-slot timeline-copy">
                <h3>Exchange Money</h3>
                <p>Exchange between all popular currencies with a couple of clicks. Instant send from one currency to another.</p>
                <Link href="/register" className="mini-button">Get Started</Link>
              </div>
            </article>

            <article className="timeline-feature">
              <div className="timeline-slot timeline-copy">
                <h3>Investment</h3>
                <p>Purchase a plan and watch your investment grow.</p>
                <Link href="/register" className="mini-button">Get Started</Link>
              </div>
              <span className="timeline-dot" aria-hidden="true" />
              <div className="timeline-slot timeline-art">
                <div className="device device-tablet">
                  <div className="device-screen">
                    <Image src={investFeature} alt="Investment illustration" />
                  </div>
                </div>
              </div>
            </article>

            <article className="timeline-feature">
              <div className="timeline-slot timeline-art">
                <div className="device device-phone">
                  <div className="device-screen">
                    <Image src={walletFeature} alt="Wallet illustration" />
                  </div>
                </div>
              </div>
              <span className="timeline-dot" aria-hidden="true" />
              <div className="timeline-slot timeline-copy">
                <h3>Online Wallet</h3>
                <p>Keep your money, exchange your money, invest your money, pay services and make purchases.</p>
                <Link href="/register" className="mini-button">Get Started</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="walk-section">
        <div className="container">
          <div className="walk-heading">
            <h2>Let&apos;s Take You For a Walk</h2>
            <div className="scroll-cue">
              <span>Scroll Down</span>
              <i aria-hidden="true">⌄</i>
            </div>
          </div>

          <div className="walk-path">
            <article className="walk-step walk-step-right">
              <span className="walk-node">☁</span>
              <div>
                <h3>01. Registration On The Platform</h3>
                <p>Get started simply by filling one and two inputs.</p>
              </div>
            </article>

            <article className="walk-step walk-step-left">
              <span className="walk-node">✉</span>
              <div>
                <h3>02. Passing Verification</h3>
                <p>Verify your email.</p>
              </div>
            </article>

            <article className="walk-step walk-step-right">
              <span className="walk-node">↗</span>
              <div>
                <h3>03. Create Your First Funding</h3>
                <p>Make secure deposit into your account.</p>
              </div>
            </article>

            <article className="walk-step walk-step-left walk-step-muted">
              <span className="walk-node">▥</span>
              <div>
                <h3>04. Purchase a Plan</h3>
                <p>Pick from our variety of flexible plans to start trading/investing.</p>
              </div>
            </article>

            <article className="walk-step walk-step-right walk-step-muted">
              <span className="walk-node">♟</span>
              <div>
                <h3>05. Go live</h3>
                <p>Watch your investment go live.</p>
              </div>
            </article>

            <article className="walk-step walk-step-left walk-step-muted">
              <span className="walk-node">☁</span>
              <div>
                <h3>06. Receiving Funds</h3>
                <p>Get credited after trading time elapses.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="plans" className="plans-section">
        <div className="container">
          <div className="plans-heading">
            <h2>Our Plans</h2>
          </div>
          <PlansCarousel>
            <article className="investment-plan">
              <h3>Test Plan</h3>
              <p className="plan-rate">5%</p>
              <ul>
                <li>Min. Possible deposit: $100.00</li>
                <li>Max. Possible deposit: $999.00</li>
                <li>325 days Profit Cycle</li>
                <li>24/7 Customer Service</li>
              </ul>
              <Link href="/register" className="buy-button">Buy Now</Link>
            </article>

            <article className="investment-plan">
              <h3>Standard Plan</h3>
              <p className="plan-rate">8%</p>
              <ul>
                <li>Min. Possible deposit: $1,000.00</li>
                <li>Max. Possible deposit: $2,999.00</li>
                <li>245 days Profit Cycle</li>
                <li>24/7 Customer Service</li>
              </ul>
              <Link href="/register" className="buy-button">Buy Now</Link>
            </article>

            <article className="investment-plan">
              <h3>Gold Plan</h3>
              <p className="plan-rate">10%</p>
              <ul>
                <li>Min. Possible deposit: $3,000.00</li>
                <li>Max. Possible deposit: $4,999.00</li>
                <li>21 days Profit Cycle</li>
                <li>24/7 Customer Service</li>
              </ul>
              <Link href="/register" className="buy-button">Buy Now</Link>
            </article>

            <article className="investment-plan">
              <h3>Premium Plan</h3>
              <p className="plan-rate">12%</p>
              <ul>
                <li>Min. Possible deposit: $5,000.00</li>
                <li>Max. Possible deposit: $9,999.00</li>
                <li>30 days Profit Cycle</li>
                <li>24/7 Customer Service</li>
              </ul>
              <Link href="/register" className="buy-button">Buy Now</Link>
            </article>

            <article className="investment-plan">
              <h3>Super Plan</h3>
              <p className="plan-rate">15%</p>
              <ul>
                <li>Min. Possible deposit: $10,000.00</li>
                <li>Max. Possible deposit: $199,999,999,999.00</li>
                <li>419 days Profit Cycle</li>
                <li>24/7 Customer Service</li>
              </ul>
              <Link href="/register" className="buy-button">Buy Now</Link>
            </article>
          </PlansCarousel>
        </div>
      </section>

      <section className="subscribe-section">
        <div className="container subscribe-inner">
          <h2>Subscribe to us!</h2>
          <div className="social-links" aria-label="Social links">
            <Link href="#" aria-label="Facebook">f</Link>
            <Link href="#" aria-label="Twitter">♥</Link>
            <Link href="#" aria-label="Telegram">⌁</Link>
            <Link href="#" aria-label="Bitcoin">₿</Link>
            <Link href="#" aria-label="Email">✉</Link>
          </div>
          <SubscribeForm />
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Cloudfund Inc. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
