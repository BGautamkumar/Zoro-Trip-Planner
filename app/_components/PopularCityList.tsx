import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function PopularCityList() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} priority={index === 0} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Curated Adventures for Modern Explorers
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const NewYorkContent = () => {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Times Square Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/newyork/nyc-times-square.jpg"
            alt="Times Square"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Times Square Energy
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Experience the electrifying heart of New York City where neon lights illuminate
            the bustling streets and Broadway theaters come alive. Times Square pulses with
            endless energy, offering a sensory overload of entertainment, shopping, and the
            iconic urban buzz that defines the city that never sleeps.
          </p>
        </div>
      </div>

      {/* Central Park Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/newyork/nyc-central-park.jpg.jpg"
            alt="Central Park"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Urban Oasis - Central Park
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Discover New York's magnificent green sanctuary spanning 843 acres of rolling
            meadows, serene lakes, and winding pathways. From horse-drawn carriage rides to
            peaceful picnics by the Bethesda Fountain, Central Park offers a refreshing escape
            from the urban jungle while remaining the city's beloved backyard.
          </p>
        </div>
      </div>

      {/* NYC Nightlife Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/newyork/nyc-nightlife.jpg"
            alt="NYC Nightlife"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Legendary NYC Nightlife
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            As darkness falls, New York transforms into a dazzling playground of endless
            possibilities. From rooftop bars with skyline views to underground jazz clubs in
            Greenwich Village, experience the legendary nightlife that has inspired countless
            stories and defined urban entertainment for generations.
          </p>
        </div>
      </div>
    </div>
  );
};

const TokyoContent = () => {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Cherry Blossom Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/tokyo/tokyo-cherry-blossom.jpg"
            alt="Cherry Blossoms"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Cherry Blossom Paradise
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Witness nature's most spectacular display as Tokyo transforms into a sea of
            delicate pink petals during sakura season. From hanami parties in Ueno Park to
            serene walks along the Meguro River, experience the magical atmosphere that
            captures the ephemeral beauty cherished in Japanese culture.
          </p>
        </div>
      </div>

      {/* Shibuya Night Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/tokyo/tokyo-shibuya-night.jpg"
            alt="Shibuya Night"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Shibuya Electric Dreams
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Dive into the neon-lit wonderland of Shibuya, where futuristic technology
            meets urban energy. Experience the world's busiest crossing, explore cutting-edge
            fashion districts, and immerse yourself in the vibrant nightlife that defines
            modern Tokyo's pop culture revolution.
          </p>
        </div>
      </div>

      {/* Mount Fuji Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/tokyo/tokyo-mount-fuji.jpg"
            alt="Mount Fuji"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Sacred Mount Fuji
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Behold Japan's sacred peak and cultural icon, Mount Fuji, whose perfect
            cone has inspired artists and pilgrims for centuries. Whether viewed from
            Tokyo's skyline on clear days or experienced up close during climbing season,
            this majestic mountain represents the eternal spirit of Japan.
          </p>
        </div>
      </div>
    </div>
  );
};

const RomeContent = () => {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Colosseum Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/rome/rome-colosseum.jpg"
            alt="Colosseum"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Legendary Colosseum
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Step into the awe-inspiring amphitheater where gladiators once battled and
            emperors ruled the Roman Empire. This architectural masterpiece stands as
            a testament to Rome's engineering genius and brutal history, offering visitors
            a journey through two millennia of human civilization.
          </p>
        </div>
      </div>

      {/* Roman Forum Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/rome/rome-roman-forum.jpg"
            alt="Roman Forum"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Ancient Roman Forum
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Walk through the heart of ancient Rome where temples, basilicas, and public
            spaces once formed the center of Western civilization. Explore the ruins
            that whisper stories of senators, poets, and emperors who shaped the foundations
            of modern law, government, and culture.
          </p>
        </div>
      </div>

      {/* Rome City View Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/rome/rome-city-view.jpg"
            alt="Rome City View"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Eternal City Panorama
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Gaze upon the breathtaking panorama where ancient ruins blend seamlessly with
            Renaissance palaces and Baroque fountains. Rome's timeless skyline tells the
            story of centuries layered upon centuries, creating an urban tapestry where every
            corner reveals another masterpiece of human achievement.
          </p>
        </div>
      </div>
    </div>
  );
};

const DubaiContent = () => {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Burj Khalifa Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/dubai/dubai-burj-kalifa.jpg"
            alt="Burj Khalifa"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Burj Khalifa - Touching the Sky
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Ascend the world's tallest building and witness Dubai from the clouds.
            Standing at 828 meters, this architectural marvel offers breathtaking panoramic
            views of the city, desert, and ocean. Experience the future of urban design
            where engineering excellence meets artistic vision in the heart of the desert.
          </p>
        </div>
      </div>

      {/* Desert Safari Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/dubai/dubai-desert-safari.jpg"
            alt="Desert Safari"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Golden Desert Safari
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Escape the city and experience the mystical Arabian Desert where golden
            dunes stretch endlessly under the sun. Enjoy thrilling dune bashing, camel
            rides, and traditional Bedouin camps under starlit skies, connecting with
            the ancient nomadic heritage that still thrives in modern Dubai.
          </p>
        </div>
      </div>

      {/* Dubai Skyline Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/dubai/dubai-skyline.jpg"
            alt="Dubai Skyline"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Futuristic Skyline
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Marvel at the extraordinary skyline where architectural dreams become reality.
            From the iconic sail-shaped Burj Al Arab to the man-made Palm Jumeirah, Dubai's
            futuristic landscape represents humanity's ambition to build the impossible
            in the middle of the Arabian Gulf.
          </p>
        </div>
      </div>
    </div>
  );
};

const IndiaContent = () => {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Beach Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/india/india-beach.jpg"
            alt="India Beach"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Tropical Paradise Beaches
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Discover India's stunning coastline where golden sands meet crystal waters
            of the Arabian Sea and Bay of Bengal. From the vibrant beaches of Goa to the
            serene backwaters of Kerala, experience tropical bliss combined with rich
            coastal culture and delicious seaside cuisine.
          </p>
        </div>
      </div>

      {/* Wildlife Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/india/indian-wildlife.jpg"
            alt="Indian Wildlife"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Exotic Wildlife Sanctuaries
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Venture into India's incredible wilderness where majestic tigers roam free
            and elephants migrate ancient paths. From Ranthambore's royal predators to
            Kaziranga's one-horned rhinos, experience biodiversity that has inspired
            conservationists and wildlife enthusiasts from around the globe.
          </p>
        </div>
      </div>

      {/* Opera House Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/india/india-operahouse.jpg"
            alt="Opera House"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Architectural Marvels
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Explore India's magnificent architectural heritage spanning millennia, from
            ancient temples carved into rock to colonial-era grandeur. Witness the fusion
            of diverse cultural influences in structures that tell the story of one of
            the world's oldest continuous civilizations.
          </p>
        </div>
      </div>
    </div>
  );
};

const ParisContent = () => {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section - Paris Street */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/paris-street.jpg"
            alt="Paris Street"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Romantic Streets & Timeless Culture
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Walk through the enchanting streets of Paris where every corner tells a story.
            From charming sidewalk cafés to historic Haussmann buildings, experience the
            city's unparalleled romantic atmosphere and rich cultural heritage that has
            captivated visitors for centuries.
          </p>
        </div>
      </div>

      {/* Louvre Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/louvre.jpg"
            alt="Louvre Museum"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-6">
            World-Class Art & History
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Step inside the legendary Louvre Museum, home to thousands of masterpieces
            spanning millennia. Marvel at the Mona Lisa's enigmatic smile, explore ancient
            Egyptian artifacts, and discover works by the world's greatest artists in this
            unparalleled cultural treasure.
          </p>
        </div>
      </div>

      {/* Eiffel Tower Section */}
      <div className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/images/eiffel-blackwhite.jpg"
            alt="Eiffel Tower"
            className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
            Iconic Eiffel Tower
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed lg:leading-relaxed max-w-4xl">
            Standing as the ultimate symbol of Paris, the Eiffel Tower offers breathtaking
            panoramic views of the City of Light. Whether witnessed during the day's golden
            hours or illuminated against the night sky, this iron lattice masterpiece remains
            an unforgettable testament to human ingenuity and romance.
          </p>
        </div>
      </div>
    </div>
  );
};



const data = [
  {
    category: "Paris, France",
    title: "Explore the City of Lights - Eiffel Tower, Louvre & more",
    src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2600&auto=format&fit=crop",
    content: <ParisContent />,
  },
  {
    category: "New York, USA",
    title: "Experience NYC – Times Square, Central Park, Broadway",
    src: "https://plus.unsplash.com/premium_photo-1661954654458-c673671d4a08?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wVWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <NewYorkContent />,
  },
  {
    category: "Tokyo, Japan",
    title: "Discover Tokyo – Shibuya, Cherry Blossoms, Temples",
    src: "https://images.unsplash.com/photo-1522547902298-51566e4fb383?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlIHx8fGVufDB8fHx8fA%3D%3D",
    content: <TokyoContent />,
  },

  {
    category: "Rome, Italy",
    title: "Walk through History – Colosseum, Vatican, Roman Forum",
    src: "https://plus.unsplash.com/premium_photo-1675975678457-d70708bf77c8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <RomeContent />,
  },
  {
    category: "Dubai, UAE",
    title: "Luxury and Innovation – Burj Khalifa, Desert Safari",
    src: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DubaiContent />,
  },
  {
    category: "India",
    title: "Harbour Views – Opera House, Bondi Beach & Wildlife",
    src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <IndiaContent />,
  },
];
