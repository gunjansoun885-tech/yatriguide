export const DESTINATIONS_DETAIL_DATA = {
  mussoorie: {
    id: "mussoorie",
    title: "Mussoorie",
    subtitle: "The Queen of Hills",
    tagline: "Colonial Charm & Panoramic Himalayan Horizons",
    heroImage: "/mussorie.png",
    rating: 4.8,
    reviewsCount: "1,420+",
    category: "Hill Station",
    elevation: "2,005 meters (6,580 ft)",
    bestTime: "March to June & Oct to Feb (Snowfall)",
    idealDuration: "2 - 3 Days",
    nearestAirport: "Jolly Grant Airport, Dehradun (58 km)",
    nearestRailway: "Dehradun Railway Station (34 km)",
    description: "Mussoorie, popularly known as the 'Queen of Hills', is a captivating hill station located at the foothills of the Garhwal Himalayan range in Uttarakhand. Established during the British colonial era, Mussoorie charms travelers with its cool climate, lush green hills, heritage architecture, and magnificent views of the Doon Valley to the south and the snow-capped Shivalik ranges to the north.",
    
    highlights: [
      "Panoramic views of the snow-clad Himalayan peaks (Banderpunch, Srikantha)",
      "Iconic Mall Road promenade featuring colonial era bakeries & handicraft shops",
      "Exciting Gun Hill ropeway cable car rides with 360° valley viewpoints",
      "Historical colonial estates like Sir George Everest's House",
      "Cascading mountain waterfalls including Kempty & Bhatta Falls",
    ],

    famousPlaces: [
      {
        id: "kempty-falls",
        name: "Kempty Falls",
        tag: "Waterfalls & Leisure",
        distance: "15 km from Library Chowk",
        image: "/m1.png",
        description: "Developed in the 1830s by British officer John Mekinnon, Kempty Falls is Mussoorie's most famous natural waterfall. Water tumbles down from 40 feet into a massive clear pool, surrounded by high mountain cliffs. Features cable car rides, swimming pools, and traditional food stalls.",
        timings: "8:00 AM - 5:00 PM",
        entryFee: "Free Entry (Ropeway/Boating charges extra)"
      },
      {
        id: "mall-road",
        name: "Mall Road & Library Bazaar",
        tag: "Shopping & Heritage Walk",
        distance: "Heart of Mussoorie",
        image: "/m2.png",
        description: "The vibrant heartbeat of Mussoorie stretching from Picture Palace to Library Chowk. Flanked by colonial bench seats, historic lamp posts, wooden handicraft markets, famous Garhwali sweet shops, and classic cafes like Cambridge Book Depot.",
        timings: "Open 24 Hours (Shops 10 AM - 9 PM)",
        entryFee: "Free Walkway"
      },
      {
        id: "gun-hill",
        name: "Gun Hill & Ropeway",
        tag: "Viewpoint & Cable Car",
        distance: "400m from Mall Road",
        image: "/m3.png",
        description: "The second-highest peak in Mussoorie standing at 2,024 meters. During colonial rule, a cannon was fired from here daily at noon to help locals set their watches. Accessible by an adventurous 400m cable car ropeway from Jhula Ghar.",
        timings: "10:00 AM - 6:00 PM",
        entryFee: "Ropeway ~ ₹120 Round Trip"
      },
      {
        id: "lal-tibba",
        name: "Lal Tibba Scenic Viewpoint",
        tag: "Highest Peak & Telescope",
        distance: "4.5 km from Landour",
        image: "/m4.png",
        description: "Translating to 'Red Hill', Lal Tibba is the highest point in Mussoorie located in the peaceful Landour cantonment area. Features antique Japanese binocular telescopes mounted on the rooftop cafe to view snow peaks like Kedarnath, Badrinath & Bandarpunch.",
        timings: "6:00 AM - 7:00 PM",
        entryFee: "₹50 (Includes Telescope view)"
      }
    ],

    travelGuide: {
      howToReach: [
        { mode: "By Road", detail: "Well connected via NH-707A. Regular direct buses and taxi cabs operate from Dehradun ISBT (34 km) taking approximately 1 to 1.5 hours." },
        { mode: "By Train", detail: "Nearest railhead is Dehradun Railway Station (34 km), connected with major metros like Delhi, Mumbai, Lucknow & Kolkata." },
        { mode: "By Air", detail: "Nearest airport is Jolly Grant Airport Dehradun (58 km). Pre-paid airport taxis take around 2 hours to reach Mussoorie." }
      ],
      essentialTips: [
        "Obtain mandatory Uttarakhand Yatri / Tourist Pass before driving past checkposts.",
        "Heavy weekend traffic on Mussoorie-Dehradun road; start early morning.",
        "Pack warm woollen layers even during summer evenings as temperatures drop quickly.",
        "Use multi-story parking lots near Library Chowk or Jhula Ghar as Mall Road is pedestrianized."
      ]
    }
  },

  nainital: {
    id: "nainital",
    title: "Nainital",
    subtitle: "The Lake District of India",
    tagline: "Emerald Lakes & Pine-Clad Slopes",
    heroImage: "/nanital.jpg",
    rating: 4.7,
    reviewsCount: "1,180+",
    category: "Lakes & Leisure",
    elevation: "2,084 meters (6,837 ft)",
    bestTime: "March to June & Oct to Jan",
    idealDuration: "2 - 3 Days",
    nearestAirport: "Pantnagar Airport (70 km)",
    nearestRailway: "Kathgodam Railway Station (34 km)",
    description: "Nainital is a picture-postcard hill station nestled in a steep valley around the eye-shaped Naini Lake. Famed for its pleasant climate, colorful rowboats, ancient Naina Devi temple, and panoramic ropeway rides to Snow View Point.",
    highlights: [
      "Scenic wooden boat rides across the emerald Naini Lake",
      "Sacred darshan at Sri Naina Devi Temple on the northern shore",
      "Panoramic views of Nanda Devi peak from Snow View Point ropeway",
      "High altitude zoo containing Himalayan Black Bears & Snow Leopards",
      "Colonial shopping experience along the famous Mall Road"
    ],
    famousPlaces: [
      {
        id: "naini-lake",
        name: "Naini Lake & Boating",
        tag: "Lake & Boating",
        distance: "Town Center",
        image: "/ntl1.png",
        description: "Nainital ka sabse iconic attraction — yeh eye-shaped natural freshwater lake samudra se 2,084 meter ki unchhai par saat harit pahaadiyon ke beech ghira hua hai. Yahan par traditional wooden rowboat rides, yacht sailing, aur colorful paddleboats ka anand le sakte hain. Shaam ko lake ke paani mein pahaadi peaks ka reflection ek yaadgar drishya banata hai. Lake view ke liye Mallital aur Tallital dono side perfect hain.",
        timings: "6:00 AM - 6:00 PM",
        entryFee: "Boating ₹210 - ₹350 per boat"
      },
      {
        id: "snow-view-point",
        name: "Snow View Point",
        tag: "Himalayan Viewpoint",
        distance: "2.5 km from Mallital (Ropeway)",
        image: "/ntl2.png",
        description: "2,270 meters ki unchhai par sthit Snow View Point Nainital ka sabse mashur viewpoint hai jahan se Himalayan peaks — Nanda Devi, Trishul, aur Nanda Kot — ka breathtaking panoramic nazara dikhta hai. Yahan tak pahunchne ke liye Mallital se ropeway cable car ride leni hoti hai jo apne aap mein ek thrilling experience hai. Ek bar upar pahunchne ke baad telescope se snow-capped peaks ko aur paas se dekha ja sakta hai. Saaf mausam mein yeh view zindagi bhar yaad rahta hai.",
        timings: "8:00 AM - 6:00 PM (Ropeway timings)",
        entryFee: "Ropeway ₹175 Round Trip"
      },
      {
        id: "tiffin-top",
        name: "Tiffin Top (Dorothy's Seat)",
        tag: "Sunrise & Photography",
        distance: "4 km from Mallital",
        image: "/ntl3.png",
        description: "2,292 meters ki unchhai par sthit Tiffin Top, jise Dorothy's Seat bhi kehte hain, Nainital ka ek romantic aur scenic vantage point hai. British painter Dorothy Kellet ki yaad mein banana gaya yeh spot photography enthusiasts ke liye ek paradise hai. Yahan se Nainital city ka bird's eye view, Naini Lake ka shimmering reflection, aur surrounding pine forests ka majestic nazara milta hai. Sunrise ke waqt yahan aana ek unforgettable experience hai. Jungle trail trek karke bhi is jagah tak pahuncha ja sakta hai.",
        timings: "Sunrise to Sunset",
        entryFee: "Free (Horse ride ₹300 - ₹500 extra)"
      },
      {
        id: "mall-road",
        name: "Mall Road",
        tag: "Shopping & Evening Walk",
        distance: "Lakeside Promenade",
        image: "/ntl4.png",
        description: "Naini Lake ke kinare basa Mall Road Nainital ki social aur commercial lifeline hai. Yahan par local woollen handicrafts, Kumaoni shawls, wooden artifacts, candles, aur famous Nainital honey ki dukanen milengi. Charming cafes, bakeries, aur restaurants mein pahadi cuisine ka swad liya ja sakta hai. Shaam ko yahan evening walk karna ek alag hi experience hai — lake ke paas colorful lights, pahaadiyon ki taaza hawa, aur vibrant crowd ka mahaul. Families aur couples dono ke liye perfect spot.",
        timings: "Open 24 Hours (Shops 9 AM - 9 PM)",
        entryFee: "Free Entry"
      },
      {
        id: "naina-devi-temple",
        name: "Naina Devi Temple",
        tag: "Famous Shakti Peeth",
        distance: "Northern shore of Naini Lake",
        image: "/ntl5.png",
        description: "Nainital ka sabse puja sthal — Naina Devi Temple ek prasiddha Shakti Peeth hai jahan Mata Sati ki aankhein (Naina) girine ki manyata hai. Naini Lake ke uttar kinare par sthit is mandir mein saalo bhar hazaron shraddhalu darshan ke liye aate hain. Navratri ke dino mein yahan vishesh pooja aur mele ka aayojan hota hai. Mandir parisar mein Mata ki murti ke alawa Bhagwan Ganesha aur Hanuman ji ke bhi mandir hain. Subah ki aarti mein shamil hona ek aatmik anubhav hai.",
        timings: "6:00 AM - 9:00 PM (Aarti 6 AM & 7 PM)",
        entryFee: "Free Entry"
      },
      {
        id: "eco-cave-gardens",
        name: "Eco Cave Gardens",
        tag: "Family & Adventure",
        distance: "1 km from Mallital",
        image: "/ntl6.png",
        description: "Eco Cave Gardens Nainital mein families aur adventure seekers ke liye ek unique attraction hai. Yahan 6 interconnected natural caves hain jinhein vibrant lighting ke saath illuminate kiya gaya hai aur unhe jungle jaanwaron ke naam diye gaye hain — jaise Tiger's Cave, Panther's Cave, Flying Fox's Cave, aur Bat's Cave. Andheri aur narrow cave tunnels mein ghusna ek thrilling underground adventure deta hai. Bacho ke liye musical fountain show aur hanging garden bhi yahan mojud hain. Shaam ko yeh garden aur bhi khubsurat lag ta hai.",
        timings: "9:30 AM - 5:30 PM",
        entryFee: "Adults ₹50 | Children ₹25"
      }
    ],
    travelGuide: {
      howToReach: [
        { mode: "By Road", detail: "34 km from Kathgodam. Well connected by buses and taxis." },
        { mode: "By Train", detail: "Kathgodam (34 km) is the nearest railway station." }
      ],
      essentialTips: [
        "Carry valid Yatri Pass for entry checkposts.",
        "Park vehicles at Sukhatal parking lot to avoid mall road congestion."
      ]
    }
  },

  rishikesh: {
    id: "rishikesh",
    title: "Rishikesh",
    subtitle: "Yoga & Adventure Capital of the World",
    tagline: "Sacred Ganges, Divine Ganga Aarti & White Water Thrills",
    heroImage: "/rishikesh.png",
    rating: 4.9,
    reviewsCount: "2,350+",
    category: "Adventure & Spiritual",
    elevation: "340 meters (1,115 ft)",
    bestTime: "September to May",
    idealDuration: "2 - 4 Days",
    nearestAirport: "Jolly Grant Airport Dehradun (20 km)",
    nearestRailway: "Yog Nagari Rishikesh Railway Station",
    description: "Located where the holy Ganges emerges from the Himalayan gorges into the northern plains, Rishikesh is world-renowned for yoga meditation ashrams, spiritual evening Ganga Aarti at Triveni Ghat, and thrill-seeking white water rafting.",
    highlights: [
      "White water rafting rapids from Shivpuri to Laxman Jhula",
      "World-famous Ganga Aarti ceremony at Triveni Ghat & Parmarth Niketan",
      "Historic Beatles Ashram (Chaurasi Kutia) adorned with graffiti murals",
      "Bungee jumping and zip-lining over green Himalayan valleys"
    ],
    famousPlaces: [
      {
        id: "laxman-jhula",
        name: "Laxman Jhula & Ram Jhula",
        tag: "Iconic Suspension Bridge",
        distance: "Rishikesh Center",
        image: "/lakshman.jpeg",
        description: "Famous iron suspension bridges built over the sacred Ganges, offering breathtaking river vistas, bustling markets, and spiritual ashrams on either bank.",
        timings: "Open 24 Hours",
        entryFee: "Free"
      },
      {
        id: "rafting-shivpuri",
        name: "Shivpuri Rafting Point",
        tag: "White Water Adventure",
        distance: "16 km from Rishikesh",
        image: "/rafting.jpeg",
        description: "The starting point for exhilarating Grade III & IV white water rafting runs down the Ganges through wilderness gorges.",
        timings: "8:00 AM - 3:00 PM",
        entryFee: "Rafting ~ ₹600 - ₹1200"
      },
      {
        id: "triveni-ghat",
        name: "Triveni Ghat & Ganga Aarti",
        tag: "Spiritual & Ganga Aarti",
        distance: "Town Center, Rishikesh",
        image: "/ris2.png",
        description: "Triveni Ghat Rishikesh ka sabse pavitra aur pracheen ghat hai jahan Ganga, Yamuna aur Saraswati nadion ka sangam maana jaata hai. Yahan pratidin shaam ko hone wali Maha Ganga Aarti ek divya aur man ko shant karne wala anubhav hai — hundreds of oil lamps (diyas) Ganges mein bhaye jaate hain aur ghanton ki dhun mein pujari aarti karte hain. Subah ke waqt holy dip (snan) ke liye thousands of pilgrims yahan aate hain. Aarti ke baad floating diyas ko Ganga mein chhodna ek spiritual anubhav hai.",
        timings: "Aarti: 6:00 PM - 7:00 PM daily | Ghat: 5 AM - 8 PM",
        entryFee: "Free Entry"
      },
      {
        id: "beatles-ashram",
        name: "Beatles Ashram (Chaurasi Kutia)",
        tag: "History & Art",
        distance: "3 km from Laxman Jhula",
        image: "/ris3.png",
        description: "1968 mein The Beatles band — John Lennon, Paul McCartney, George Harrison aur Ringo Starr — Maharishi Mahesh Yogi ke is ashram mein transcendental meditation seekhne aaye the. Tabse yeh jagah 'Beatles Ashram' ke naam se duniya bhar mein mashur ho gayi. Aaj yeh ek abandoned sanctuary hai jo dense forest mein ghira hua hai aur ismein stunning psychedelic graffiti art hai. Abandoned meditation huts, a unique beehive-shaped meditation tower, aur haripurna jungle trails is jagah ko ek surreal artistic experience banate hain.",
        timings: "8:00 AM - 5:00 PM",
        entryFee: "Indians ₹150 | Foreigners ₹600"
      },
      {
        id: "neelkanth-mahadev",
        name: "Neelkanth Mahadev Temple",
        tag: "Ancient Shiva Temple",
        distance: "32 km from Rishikesh",
        image: "/ris4.png",
        description: "Samudra manthan ke dauran Bhagwan Shiva ne jo vish piya tha, us dauraan unka gala neela pad gaya tha — usi sthal par sthit hai yeh prasilddh Neelkanth Mahadev Mandir. 1,330 meters ki unchhai par dense jungle ke beech basa yeh mandir Rishikesh ke aas-paas sabse important Shiva shrine hai. Kanwar Yatra ke samay lakhs of devotees Haridwar se paidal chalkar yahan jalabhishek karne aate hain. Temple tak pahunchne ka rasta bhi scenic hai — ghuma hua pahari raasta, waterfalls aur ghane jungle ke saath.",
        timings: "6:00 AM - 8:00 PM",
        entryFee: "Free Entry"
      }
    ],
    travelGuide: {
      howToReach: [
        { mode: "By Road", detail: "230 km from New Delhi via NH-58." },
        { mode: "By Train", detail: "Yog Nagari Rishikesh (YNRK) station." }
      ],
      essentialTips: [
        "Wear modest attire when attending Ganga Aarti.",
        "Book registered rafting operators certified by Uttarakhand Tourism."
      ]
    }
  },

  kedarnath: {
    id: "kedarnath",
    title: "Kedarnath",
    subtitle: "The Sacred Abode of Lord Shiva",
    tagline: "Holy Char Dham Pilgrimage amidst Majestic Peaks",
    heroImage: "/kedar.png",
    rating: 4.95,
    reviewsCount: "3,100+",
    category: "Spiritual Pilgrimage",
    elevation: "3,583 meters (11,755 ft)",
    bestTime: "May to June & Sept to Oct",
    idealDuration: "3 - 5 Days",
    nearestAirport: "Jolly Grant Dehradun (238 km)",
    nearestRailway: "Rishikesh Railway Station (216 km)",
    description: "Kedarnath is one of the 12 Jyotirlingas and a key component of the sacred Char Dham Yatra. Nestled amidst snow-clad peaks of the Himalayas near Mandakini river, the ancient stone temple offers an unmatched spiritual pilgrimage.",
    highlights: [
      "Sacred Darshan at ancient 8th-century Lord Shiva Stone Temple",
      "16 km mountain trek from Gaurikund amidst towering Himalayan peaks",
      "Helicopter shuttle services from Phata, Sirsi, and Guptkashi",
      "Bhairavnath Temple viewpoint overlooking the entire Kedarnath valley"
    ],
    famousPlaces: [
      {
        id: "kedarnath-temple",
        name: "Kedarnath Temple",
        tag: "Jyotirlinga Shrine",
        distance: "16 km Trek from Gaurikund",
        image: "/kedar.png",
        description: "Built of massive grey stone slabs, this ancient temple withstands severe winter snows and stands grandly against the Kedarnath peak backdrop.",
        timings: "5:00 AM - 9:00 PM",
        entryFee: "Free Entry"
      }
    ],
    travelGuide: {
      howToReach: [
        { mode: "By Trek / Helicopter", detail: "Drive to Sonprayag/Gaurikund, then 16 km trek or heli-shuttle." }
      ],
      essentialTips: [
        "Mandatory Yatri Registration Pass required at Sonprayag checkpost.",
        "Medical fitness check recommended due to high altitude (11,755 ft)."
      ]
    }
  },

  auli: {
    id: "auli",
    title: "Auli",
    subtitle: "India's Premier Skiing Destination",
    tagline: "Alpine Bugyals, Cable Cars & Snow-Clad Slopes",
    heroImage: "/auli.png",
    rating: 4.8,
    reviewsCount: "940+",
    category: "Snow Sports",
    elevation: "2,800 meters (9,180 ft)",
    bestTime: "December to March (Skiing) & April to June",
    idealDuration: "2 - 3 Days",
    nearestAirport: "Jolly Grant Dehradun (270 km)",
    nearestRailway: "Rishikesh Railway Station (250 km)",
    description: "Auli is a world-class ski resort destination famous for its extensive oak forest meadows, artificial lake, and 4.4 km long ropeway connecting to Joshimath with uninterrupted views of Nanda Devi peak.",
    highlights: [
      "International ski slopes with professional training courses",
      "Asia's second longest cable car ropeway from Joshimath to Auli",
      "Panoramic views of 7,816m Nanda Devi & Kamet Himalayan peaks"
    ],
    famousPlaces: [
      {
        id: "auli-ropeway",
        name: "Auli Cable Car & Ski Slopes",
        tag: "Ropeway & Skiing",
        distance: "From Joshimath",
        image: "/aul1.png",
        description: "4.4 km scenic cable car journey floating high above pine forest valleys to the snow slopes of Auli.",
        timings: "9:00 AM - 5:00 PM",
        entryFee: "Ropeway ~ ₹1000 Round Trip"
      },
      {
        id: "auli-artificial-lake",
        name: "Auli Artificial Lake",
        tag: "Engineering Marvel & Scenic Spot",
        distance: "Auli Top, near Ski Slopes",
        image: "/auli.png",
        description: "Yeh duniya ki sabse unchhai par bani artificial lakes mein se ek hai — 2,519 meters par sthit yeh manmade jheel Auli ke ski resort ke liye snow-making system ko pani supply karti hai. Garmiyon mein yeh lake ek stunning reflection pool ban jaati hai jismein surrounding Himalayan peaks — Nanda Devi, Dronagiri aur Mana Parbat — ka sundar aks dikhta hai. Auli cable car station ke paas hone ki wajah se yahan se Nanda Devi ka 180-degree panoramic view milta hai jo photographers ke liye ek dream spot hai.",
        timings: "Sunrise to Sunset (Best at Golden Hour)",
        entryFee: "Free (Ropeway charges apply to reach)"
      },
      {
        id: "kwani-bugyal",
        name: "Kwani Bugyal",
        tag: "Alpine Meadow Trek",
        distance: "3 km trek from Auli",
        image: "/kb.png",
        description: "Kwani Bugyal ek breathtaking alpine meadow (bugyal) hai jo Auli se sirf 3 km ki easy-moderate trek par sthit hai. 'Bugyal' Garhwali bhasha mein unchhai wale grasslands ko kehte hain. Yahan pahunchne par ek vast open grassy plateau milta hai jahan sardi mein thick white snow ki chadar bichhi rehti hai aur summer mein wild alpine flowers khilte hain. Nanda Devi, Trishul aur Hathi-Ghodi peaks ka 270-degree view is jagah ko Auli ka sabse pristine aur off-beat trek banata hai. Sunrise aur sunset dono waqt yeh nazara alag hi hota hai.",
        timings: "Best: 6:00 AM - 4:00 PM (Trek)",
        entryFee: "Free (Guide recommended)"
      },
      {
        id: "gurso-bugyal",
        name: "Gurso Bugyal",
        tag: "Scenic Trek & Camping",
        distance: "3 km from Joshimath / Auli",
        image: "/gb.png",
        description: "Gurso Bugyal ek enchanting high-altitude meadow aur trekking destination hai jo Auli ke theek upar 3,056 meters ki unchhai par sthit hai. Yahan tak ka trek dense oak aur conifer forests se hokar jaata hai jo har mahal apni alag khubsurti dikhaata hai — summers mein green carpet aur winters mein pristine white snowfield. Trek ke aakhir mein ek wide open meadow milta hai jahan Nanda Devi, Kamet, Dronagiri aur Neelkanth peaks ka jaw-dropping panorama milta hai. Camping enthusiasts ke liye yeh Auli ka best overnight camping spot hai.",
        timings: "Best: April to November | Trek: 2-3 hours",
        entryFee: "Free (Camping charges if applicable)"
      }
    ],
    travelGuide: {
      howToReach: [
        { mode: "By Road / Ropeway", detail: "Drive to Joshimath via Chamoli, then 4.4 km ropeway or road to Auli." }
      ],
      essentialTips: [
        "Carry heavy winter jackets and waterproof snow boots.",
        "Register pass at checkposts."
      ]
    }
  },

  "jim-corbett": {
    id: "jim-corbett",
    title: "Jim Corbett National Park",
    subtitle: "India's First National Park & Tiger Reserve",
    tagline: "Wild Tigers, River Safaris & Sal Forest Wilderness",
    heroImage: "/jim.webp",
    rating: 4.75,
    reviewsCount: "1,850+",
    category: "Wildlife Safari",
    elevation: "360 meters (1,180 ft)",
    bestTime: "November to June",
    idealDuration: "2 - 3 Days",
    nearestAirport: "Pantnagar Airport (85 km)",
    nearestRailway: "Ramnagar Railway Station (12 km)",
    description: "Jim Corbett National Park in Ramnagar is renowned for housing wild Bengal tigers, wild Asian elephants, leopards, and over 600 species of birds along the Ramganga River valley.",
    highlights: [
      "Jeep and Canter jungle safaris in Dhikala, Bijrani, and Jhirna zones",
      "Riverfront luxury eco-resorts along Kosi river",
      "Corbett Waterfall & Garjiya Devi Temple visit"
    ],
    famousPlaces: [
      {
        id: "dhikala-zone",
        name: "Dhikala & Bijrani Safari Zones",
        tag: "Tiger Safari",
        distance: "Ramnagar",
        image: "/jim1.png",
        description: "The core jungle safari zones offering highest probability of sighting wild Bengal tigers, herds of elephants, and spotted deer.",
        timings: "6:00 AM - 10:00 AM & 2:00 PM - 6:00 PM",
        entryFee: "Safari permit fees apply"
      },
      {
        id: "corbett-waterfall",
        name: "Corbett Waterfall",
        tag: "Nature & Waterfall",
        distance: "25 km from Ramnagar",
        image: "/jim2.png",
        description: "Corbett Waterfall ek hidden gem hai jo dense jungle ke andar sthit hai aur Kalagarh Road par jungle trail se hokar pahuncha ja sakta hai. Yahan se lagbhag 20 feet ki unchhai se pani ek rocky pool mein girta hai jo rainforest ki lush greenery se ghira hua hai. Monsoon ke baad yahan paani ki dhaar sabse tez aur sundar hoti hai. Corbett National Park ke paas hone ki wajah se trek ke dauraan wild animals — deer, langoor, peacocks — aur vibrant birds dekhne ka mauka milta hai. Picnic aur photography ke liye yeh ek perfect off-beat spot hai.",
        timings: "7:00 AM - 5:00 PM",
        entryFee: "₹50 per person"
      },
      {
        id: "garjiya-devi-temple",
        name: "Garjiya Devi Temple",
        tag: "Sacred Temple & River View",
        distance: "12 km from Ramnagar",
        image: "/jim3.png",
        description: "Garjiya Devi Temple Kosi nadi ke beech ek bade rock par bana ek adbhut aur pratishthit mandir hai. Maa Garjiya — jo Goddess Parvati ka ek roop hain — ki yahan pooja ki jaati hai aur Corbett area ke aaspaas ke logon mein yeh ek deeply sacred shrine hai. Nadi ke paani se ghire ek ekant chattan par bane is mandir tak paidal bridge se pahuncha jaata hai. Navratri aur Kartik Purnima ke dauraan yahan vishal mela lagta hai. Temple ke upar se Kosi nadi ka flowing view aur surrounding jungle ka nazara ek unmatched experience hai.",
        timings: "6:00 AM - 8:00 PM",
        entryFee: "Free Entry"
      },
      {
        id: "kosi-river-dhangadhi",
        name: "Kosi River & Dhangadhi Gate",
        tag: "River Safari & Park Entry",
        distance: "Ramnagar Park Boundary",
        image: "/jim4.png",
        description: "Kosi nadi Jim Corbett National Park ki lifeline hai — yeh shallow rocky river park ki northern boundary se beh kar Ramnagar shahar tak aati hai. Nadi ke kinare resort mein rehte hue subah ki safari se pehle elephant, gharial aur river birds dekhna ek thrilling experience hai. Dhangadhi Gate park ka sabse popular aur scenic entry point hai jahan jungle trail shuru hoti hai. Iske paas hi Corbett Museum bhi hai jo Colonel Jim Corbett — legendary hunter turned conservationist — ki life, photographs aur unki famous stories ko preserve karta hai.",
        timings: "Museum: 10:00 AM - 5:00 PM | River: Sunrise to Sunset",
        entryFee: "Museum Free | Safari permit alag se"
      }
    ],
    travelGuide: {
      howToReach: [
        { mode: "By Road", detail: "260 km from Delhi via Hapur bypass to Ramnagar." }
      ],
      essentialTips: [
        "Book jungle safari permits well in advance online.",
        "Obtain Yatri pass for Uttarakhand state entry."
      ]
    }
  }
};
