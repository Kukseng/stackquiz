"use client";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-screen bg-footer text-white relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto py-12 grid grid-cols-1 md:grid-cols-5 gap-4 text-center md:text-left">
        {/* Organized and Sponsored By */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            ORGANIZED AND SPONSORED BY
          </h3>
          <div className="flex items-center justify-center md:justify-start">
            <Image src="/istad-logo-white.png" width={200} height={150} alt="Logo" />
          </div>
          <p className="text-[16px] text-gray-300 leading-relaxed">
            Institute of Science and Technology Advanced Development
          </p>
        </div>

        {/* About This Site */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            ABOUT THIS SITE
          </h3>
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="logo.png" alt="" />
            </div>
            <div>
              <div className="text-xl font-bold">
                STACK <span className="text-yellow">QUIZZ</span>
              </div>
            </div>
          </div>
          <p className="text-[16px] text-gray-300">Stack Up the Knowledge.</p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            LINKS
          </h3>
          <nav className="space-y-2">
            {["Home", "Explore", "Join Room", "About Us"].map((link) => (
              <a
                key={link}
                href="#"
                className="block text-gray-300 hover:text-white transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        {/* Legal */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            LEGAL
          </h3>
          <nav className="space-y-2">
            {["Privacy Policy", "Terms of service"].map((link) => (
              <a
                key={link}
                href="#"
                className="block text-gray-300 hover:text-white transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        {/* Contacts */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            CONTACTS
          </h3>
          <div className="space-y-2">
            <a
              href="mailto:info.stackquiz@gmail.com"
              className="block text-gray-300 hover:text-white transition-colors duration-200"
            >
              📧 info.stackquiz@gmail.com
            </a>
            <a
              href="tel:+88596458789"
              className="block text-gray-300 hover:text-white transition-colors duration-200"
            >
              📞 (+885) 96 458 789
            </a>
            <a
              href="tel:+88597458789"
              className="block text-gray-300 hover:text-white transition-colors duration-200"
            >
              📞 (+885) 97 458 789
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full border-t border-gray-600 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-center md:justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
          <div className="text-[16px] text-gray-300">
            © 2025 StackQuizz Inc. All rights reserved.
          </div>
          <div className="flex justify-center md:justify-start space-x-2">
            <Image src="/social_media_icon/fb.svg" width={27} height={28} alt="Facebook" />
            <Image src="/social_media_icon/github.svg" width={28} height={30} alt="Github" />
            <Image src="/social_media_icon/twitter.svg" width={34} height={34} alt="Twitter" />
            <Image src="/social_media_icon/ig.svg" width={34} height={34} alt="Instagram" />
            <Image src="/social_media_icon/youtube.svg" width={34} height={34} alt="Youtube" />
          </div>
        </div>
      </div>
    </footer>
  );
}
