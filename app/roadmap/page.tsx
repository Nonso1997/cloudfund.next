import Link from 'next/link';

export default function RoadmapPage() {
  return (
    <main>
      <section className="section section-dark">
        <div className="container">
          <div className="section-heading light">
            <span>Roadmap</span>
            <h2>Where Cloudfund goes next</h2>
            <p>Follow our roadmap for product launches, dashboard updates, and future growth.</p>
          </div>
          <div className="timeline">
            <div className="timeline-item">
              <strong>Q1</strong>
              <p>Launch user dashboard with deposits, withdrawals, and package management.</p>
            </div>
            <div className="timeline-item">
              <strong>Q2</strong>
              <p>Expand account funding options and add transaction history analytics.</p>
            </div>
            <div className="timeline-item">
              <strong>Q3</strong>
              <p>Release live performance summaries, trading insights, and enhanced reporting.</p>
            </div>
            <div className="timeline-item">
              <strong>Q4</strong>
              <p>Launch premium features, additional trading plans, and mobile dashboard support.</p>
            </div>
          </div>
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
