import { Link } from "react-router-dom";
import GetStartedButton from "./components/GetStartedButton";
import AutoSlideTestimonials from "./components/AutoSlideTestimonials";
import FAQ from "./components/FAQ";
import { useContext } from "react";
import { AuthContext } from "./components/authContext";
export default function Home() {
  const { token, userInfo } = useContext(AuthContext);

  return (
    <div>
      {/* Hero Section */}
      <header className="header">
        <h1 className="header-title">Welcome to AgroNexus</h1>

        {userInfo != null ? (
          <div
            className="text-xl text-slate-600"
            style={{
              "font-size": "3rem",
              "font-weight": "600",
              color: "rgb(255, 255, 99)",
              "margin-left": "12px",
            }}
          >
            {userInfo.user.name}
          </div>
        ) : (
          <div className="get-started">
            <Link to="/auth">
              <GetStartedButton />
            </Link>
          </div>
        )}
      </header>

      {/* Section 2: Agro Connect */}
      <section className="section agro-connect">
        <div className="section-content">
          <div className="text-left">
            <h2>Agro Connect</h2>
            <p>
              Agro Connect is your gateway to connecting with experts, fellow
              farmers, and customers.
            </p>
          </div>
          <div className="video-right">
            <video controls>
              <source src="/path/to/video1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Section 3: Digital Tools */}
      <section className="section digital-tools">
        <div className="section-content">
          <div className="video-left">
            <video controls>
              <source src="/path/to/video2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="text-right">
            <h2>Digital Tools</h2>
            <p>
              Explore the latest digital tools that can help boost your
              agricultural productivity.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Agro Tools */}
      <section className="section agro-tools">
        <div className="section-content">
          <div className="text-left">
            <h2>Agro Tools</h2>
            <p>
              Find the right tools for your farm. Modernize your farming
              techniques with advanced tools.
            </p>
          </div>
          <div className="video-right">
            <video controls>
              <source src="/path/to/video3.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Section 5: Agri Market */}
      <section className="section agri-market">
        <div className="section-content">
          <div className="video-left">
            <video controls>
              <source src="/path/to/video4.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="text-right">
            <h2>Agri Market</h2>
            <p>
              Discover the best places to sell your produce at competitive
              prices.
            </p>
          </div>
        </div>
      </section>

      {/* Auto-Slide Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <AutoSlideTestimonials />
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <FAQ />
      </section>
    </div>
  );
}
