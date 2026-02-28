/**
 * Prompt Builder V2 — Coherent Character-Centric Data
 * Each character is a self-contained unit with default preset + coherent alternatives.
 * 10 Categories × 21 characters (7 male + 7 female + 7 couple/group) = 210 total.
 */

const CATEGORIES = {

// ======================================================================
// 1. SUPERHEROES
// ======================================================================
superheroes: {
  label: 'Superheroes',
  characters: {
    male: [
      { value: 'spiderman', label: 'Spider-Man Rooftop',
        theme_frag: 'The subject is transformed into an iconic web-slinging superhero, crouched heroically on the edge of a skyscraper. He holds the superhero mask casually in one hand, resting it on his knee. His gaze is directed at the camera with a confident, reflective expression.',
        wardrobe_frag: 'High-tech textured red and blue superhero suit with intricate web pattern across the entire surface, subtle metallic sheen and visible micro-texture details. The mask dangles from his right hand.',
        scene_frag: 'Nighttime rooftop setting with heavy rain falling dramatically. Glowing city skyline with vibrant neon bokeh in deep blues, intense reds, and vivid yellows. Wet surfaces reflect city lights.',
        lighting_frag: 'Cinematic cool key light (5600K) highlighting raindrops on skin and wet suit texture. Warm city reflections as secondary fill. 50mm lens, f/2.0, shallow depth of field.',
        alt_scenes: [
          { label: 'Battle aftermath city', frag: 'Destroyed city street aftermath with cracked pavement, overturned vehicles, dust and embers floating. A dramatic sunset breaks through storm clouds.' },
          { label: 'City frozen in time', frag: 'City street at night frozen in time — raindrops suspended mid-air, car headlights casting static beams, pedestrians blurred into ghostly streaks. Only the subject is sharp.' }
        ],
        alt_wardrobes: [
          { label: 'Stealth black suit variant', frag: 'Sleek matte black stealth-ops suit with dark grey web pattern, night-vision red eye lenses on the mask tucked in belt. Tactical and menacing.' },
          { label: 'Battle-damaged classic', frag: 'Classic red and blue suit heavily battle-damaged — torn fabric exposing black underlayer, scratched lenses. Dust, web residue, and minor scorch marks.' }
        ],
        alt_lightings: [
          { label: 'Neon city bokeh warm', frag: 'Neon city bokeh in blues, reds, yellows. Wet surface reflections multiply light. 85mm lens, f/1.8, creamy bokeh.' },
          { label: 'Speed Force lightning', frag: 'Yellow-gold speed lightning as rim light. Motion blur on everything except face. 24mm wide-angle, f/2.8.' }
        ]
      },
      { value: 'batman', label: 'Batman Gotham Knight',
        theme_frag: 'The subject stands as the Dark Knight on a rain-soaked Gotham City rooftop, cape billowing dramatically in the wind. He holds the cowl in one hand at his side, face fully revealed, posture powerful and commanding. Intense brooding expression with direct eye contact.',
        wardrobe_frag: 'Matte black tactical armor suit with sculpted chest plate, angular shoulder pauldrons, gauntlets with fins, flowing black cape with scalloped edges. Utility belt with compartments. Cowl hangs from left hand.',
        scene_frag: 'Dark Gothic cityscape with gargoyles, rain, and distant lightning illuminating art-deco skyscrapers. Steam rises from vents. The Bat-Signal glows faintly in storm clouds above.',
        lighting_frag: 'High-contrast chiaroscuro. Lightning flashes provide rim lighting on cape and armor edges. Deep blacks and cold blue tones. 85mm lens, f/1.8.',
        alt_scenes: [
          { label: 'Underground Batcave', frag: 'Vast underground cave with high-tech computer arrays, suit display cases, massive waterfall. Bats circle overhead. Dark, dramatic, technological.' },
          { label: 'Gothic cathedral rooftop', frag: 'Atop a Gothic cathedral with massive stone gargoyles. Heavy fog below. City lights barely visible through mist. Full moon breaks through clouds.' }
        ],
        alt_wardrobes: [
          { label: 'Armored tank suit', frag: 'Heavy-duty tank-style mech armor in dark gunmetal grey, bulkier plating, glowing blue visor pushed up. Battle-damaged with scorch marks.' },
          { label: 'Classic grey & blue', frag: 'Classic grey bodysuit with blue cape and cowl (held at side), yellow utility belt, iconic chest emblem. Retro comic-book inspired look.' }
        ],
        alt_lightings: [
          { label: 'Bat-Signal spotlight', frag: 'Bat-Signal projector as dramatic backlight creating iconic silhouette. Fog diffusion. 50mm, f/2.0.' },
          { label: 'Blue moonlight noir', frag: 'Cool blue moonlight as sole light. Rain frozen in detail. Film noir aesthetic. 85mm, f/1.4.' }
        ]
      },
      { value: 'superman', label: 'Superman Skybound',
        theme_frag: 'The subject flies powerfully as the Man of Steel through the upper atmosphere towards the viewer. Arms bent, fists clenched, body angled upward conveying intense forward motion. Determined, heroic expression.',
        wardrobe_frag: 'Classic blue and red suit with highly detailed fabric texture. Iconic red and yellow shield emblem on chest. Red cape billows dramatically behind showing intricate folds and extreme speed.',
        scene_frag: 'Upper atmosphere setting. Below, the curved horizon of Earth stretches with scattered white clouds. Above, deep blue-black expanse of space dotted with bright stars.',
        lighting_frag: 'Brilliant warm sun glare from horizon creating strong rim light on subject and cape. Volumetric lighting on suit texture. 50mm, f/2.8.',
        alt_scenes: [
          { label: 'Metropolis skyline', frag: 'Bright sun-drenched metropolitan skyline with gleaming glass skyscrapers. Blue sky, white clouds. Vibrant, hopeful, alive.' },
          { label: 'Fortress of Solitude', frag: 'Vast crystalline ice fortress interior. Towering crystal formations, holographic Kryptonian displays. Cool blue and white atmosphere.' }
        ],
        alt_wardrobes: [
          { label: 'Black recovery suit', frag: 'Black suit with silver S-shield, silver accents. No cape. Sleeker, modern, edgier design. Silver boots and belt.' },
          { label: 'Kingdom Come armor', frag: 'Darker, more armored version: reinforced suit with subtle armor plating under fabric. Muted colors, battle-worn. Short cape.' }
        ],
        alt_lightings: [
          { label: 'Golden sunrise rim', frag: 'Golden sunrise backlighting creating heavenly halo. Warm saturated tones. 85mm, f/2.0.' },
          { label: 'Heat vision glow', frag: 'Red heat-vision energy glow as accent light on face. Cool space blues as fill. 35mm, f/2.0.' }
        ]
      },
      { value: 'thor', label: 'Thor Thunder Strike',
        theme_frag: 'The subject stands as the God of Thunder atop a craggy mountain peak during a massive electrical storm. He raises a heavy war hammer overhead with one arm, channeling lightning from sky through hammer. Intense powerful expression, eyes glowing faint electric blue.',
        wardrobe_frag: 'Ornate silver and blue Asgardian battle armor with layered metal plates, chainmail underlayer, dramatic red cape. Winged helmet rests on nearby rock. Leather bracers with Norse rune engravings.',
        scene_frag: 'Mountain summit during violent thunderstorm. Dark swirling clouds with veins of lightning. Below, vast Nordic landscape of fjords and forests dimly visible. Shattered rocks float from energy.',
        lighting_frag: 'Electric blue lightning as primary light from above. Warm amber from distant fires below. Frozen lightning detail, volumetric effects. 35mm, f/2.0.',
        alt_scenes: [
          { label: 'Bifrost Bridge', frag: 'Standing on the Rainbow Bridge (Bifrost) extending into deep space. Swirling colors of the bridge underfoot. Asgard golden city behind.' },
          { label: 'Ragnarok battlefield', frag: 'Apocalyptic battlefield with fire giants, crumbling architecture, lava cracks in the ground. Apocalyptic red-orange sky. Smoke and ash fill air.' }
        ],
        alt_wardrobes: [
          { label: 'Gladiator arena armor', frag: 'Mismatched gladiator armor: one shoulder pauldron, leather straps, war paint on face. Hair cropped short. No cape. Arena warrior aesthetic.' },
          { label: 'Royal Asgardian robes', frag: 'Formal Asgardian royal attire: golden armor with fur-trimmed crimson cape, ornate crown, ceremonial gauntlets. Regal and commanding.' }
        ],
        alt_lightings: [
          { label: 'Bifrost rainbow', frag: 'Multicolor Bifrost energy as primary light in all rainbow hues. Golden Asgard glow behind. 35mm, f/2.0.' },
          { label: 'Lava and fire', frag: 'Warm orange-red lava as primary light. Dark apocalyptic sky. Ember particles. 24mm wide-angle, f/2.8.' }
        ]
      },
      { value: 'black_panther', label: 'Black Panther Throne',
        theme_frag: 'The subject sits powerfully on an ornate Vibranium throne as the King of Wakanda. One hand rests on armrest, the other holds the ceremonial panther mask at his side. Regal, composed expression with direct eye contact. Posture exudes quiet absolute authority.',
        wardrobe_frag: 'Sleek black Vibranium-weave suit with subtle purple geometric patterns pulsing faintly with energy. Regal Wakandan necklace with silver panther fangs. Panther mask held casually in left hand.',
        scene_frag: 'Futuristic Wakandan throne room with towering Vibranium pillars, holographic displays, massive panther statue behind throne. Purple and silver ambient lighting. Tribal patterns in metallic walls.',
        lighting_frag: 'Regal purple and silver accent lighting from Vibranium tech. Soft key light from above. Rich cinematic tones. 85mm, f/1.4, creamy bokeh.',
        alt_scenes: [
          { label: 'Warrior Falls challenge', frag: 'Massive waterfall arena with tribal spectators on cliff edges. Water crashes below. Sunset sky. Ancient Wakandan ritual setting.' },
          { label: 'Vibranium mines', frag: 'Deep underground Vibranium mines glowing purple and blue. Train tracks, crystal formations. High-tech meets ancient cave.' }
        ],
        alt_wardrobes: [
          { label: 'Ceremonial king robes', frag: 'White and gold ceremonial robes with Wakandan embroidery, heavy beaded necklace, golden sandals. Crown of black panther teeth. Regal elegance.' },
          { label: 'Battle suit activated', frag: 'Full activated Vibranium suit glowing with purple kinetic energy stored from impacts. Mask on head pushed back. Energy pulses across surface.' }
        ],
        alt_lightings: [
          { label: 'Waterfall golden', frag: 'Warm golden sunset through waterfall mist. Natural dramatic lighting. 50mm, f/2.0.' },
          { label: 'Vibranium energy glow', frag: 'Purple Vibranium energy as primary light. Cool blue tech accents. 50mm, f/1.8.' }
        ]
      },
      { value: 'iron_man', label: 'Iron Man Workshop',
        theme_frag: 'The subject stands in a high-tech workshop surrounded by holographic blueprints and robotic arms. Mid-suit-up: iconic red and gold armor partially assembled on body. Chest piece and one arm armored with glowing blue arc reactor. Looks at camera mid-suit-up. Confident, slightly cocky smirk.',
        wardrobe_frag: 'Fitted black undersuit. Red and gold power armor half-assembled: right arm, chest plate and shoulder in place with glowing blue arc reactor at center. Left arm still in undersuit. Robotic arms hover with remaining pieces.',
        scene_frag: 'Sprawling underground tech laboratory. Multiple suit variants displayed in glass cases. Holographic schematics float in air. Sleek concrete and brushed metal surfaces.',
        lighting_frag: 'Cool blue light from arc reactor and holograms mixed with warm overhead workshop lighting. Metallic reflections. 50mm, f/2.0.',
        alt_scenes: [
          { label: 'Stark Tower penthouse', frag: 'Luxury penthouse with floor-to-ceiling windows overlooking Manhattan at night. Holographic displays, modern furniture. Sleek and futuristic.' },
          { label: 'Mid-air above city', frag: 'Hovering mid-air above a city skyline. Jets firing from boots. City lights below, clouds at eye level. Dynamic flying pose.' }
        ],
        alt_wardrobes: [
          { label: 'Full suit helmet off', frag: 'Complete red and gold armor suit fully assembled, every panel gleaming. Helmet held under one arm. Arc reactor glowing bright blue at chest center.' },
          { label: 'Nanotech forming suit', frag: 'Nanotech suit forming in real-time from a chest housing — flowing liquid metal crystallizing into red and gold armor panels spreading across the body.' }
        ],
        alt_lightings: [
          { label: 'Arc reactor spotlight', frag: 'Arc reactor glow as primary blue light source on face. Warm orange from hologram accents. 85mm, f/1.4.' },
          { label: 'Sunset penthouse', frag: 'Warm golden sunset through floor-to-ceiling windows. City lights as bokeh. 50mm, f/2.0.' }
        ]
      },
      { value: 'flash', label: 'Flash Speed Force',
        theme_frag: 'The subject is captured in a dynamic running pose at impossible speed through a city street. Lightning trails crackle behind in yellow and red streaks. Body leans forward with explosive energy. Face fully visible with cowl pulled back. Expression of intense focus and determination.',
        wardrobe_frag: 'Deep crimson friction-resistant suit with gold lightning bolt emblem on chest. Subtle circuit-like patterns along suit. Gold accents on boots and gauntlets. Cowl pulled back revealing full face.',
        scene_frag: 'City street at night frozen in time — raindrops suspended mid-air, car headlights casting static beams, pedestrians blurred into ghostly streaks. Only the subject is sharp and in motion.',
        lighting_frag: 'Speed Force lightning (yellow-gold) as primary light creating dramatic rim lighting. Motion blur on everything except face. 24mm wide-angle, f/2.8.',
        alt_scenes: [
          { label: 'Speed Force dimension', frag: 'Inside the Speed Force — abstract dimension of crackling lightning, floating time debris, swirling yellow-blue energy vortex. Pure kinetic energy.' },
          { label: 'Race track lightning', frag: 'Empty racetrack at night. Lightning trail circles the entire track in a continuous loop. Grandstands empty but lights on.' }
        ],
        alt_wardrobes: [
          { label: 'White lightning suit', frag: 'White speed suit with blue lightning accents. Glowing blue emblem. Sleeker, more futuristic design. Speed energy radiates off surface.' },
          { label: 'Battle-worn crimson', frag: 'Battle-worn version of the suit — scuffed, torn at edges, lightning scars burned into fabric. Evidence of time-travel wear.' }
        ],
        alt_lightings: [
          { label: 'Frozen time ambient', frag: 'Static city lights as frozen ambient glow. Only the Speed Force lightning moves. 35mm, f/2.0.' },
          { label: 'Blue time portal', frag: 'Blue-white time portal energy as primary backlight. Warm yellow speed trails. 24mm, f/2.8.' }
        ]
      }
    ],
    female: [
      { value: 'wonder_woman', label: 'Wonder Woman Olympus',
        theme_frag: 'The subject stands as the Amazonian warrior princess at the gates of Mount Olympus. She holds a glowing golden lasso in one hand and eagle-emblem shield in the other. Stance is powerful and commanding, wind sweeps hair dramatically. Fierce regal expression with direct eye contact.',
        wardrobe_frag: 'Iconic red and gold armored corset with eagle motif, blue leather battle skirt with gold star accents, silver tiara with red star, red knee-high armored boots, silver bracers on both wrists. Golden lasso at hip.',
        scene_frag: 'Gates of Mount Olympus — towering white marble columns, clouds swirling at summit, golden light pouring through gates. Ancient Greek statues line the path. Epic mythological atmosphere.',
        lighting_frag: 'Warm divine golden light from Olympus backlighting the subject, heavenly rim light effect. Dramatic contrast against stormy sky. 50mm, f/2.0.',
        alt_scenes: [
          { label: 'Themyscira beach', frag: 'Paradise island beach with turquoise water, white cliffs, ancient Amazonian architecture. Warrior women training in background. Golden hour.' },
          { label: 'War-torn battlefield', frag: 'WWI-era no-mans-land battlefield. Trenches, barbed wire, explosions in distance. She strides through fearlessly. Rain and mud.' }
        ],
        alt_wardrobes: [
          { label: 'Golden eagle armor', frag: 'Full golden eagle armor — winged helmet, golden breastplate, armored skirt, massive golden wings extending from back. Divine warrior form.' },
          { label: 'Training Amazonian', frag: 'Amazonian training attire — leather wrapped top, flowing skirt, bare arms showing athletic form. Sword on back. Simpler, warrior-ready.' }
        ],
        alt_lightings: [
          { label: 'Beach golden hour', frag: 'Warm tropical golden hour light. Turquoise water reflections. 85mm, f/2.0.' },
          { label: 'Battlefield dramatic', frag: 'Explosions as warm orange backlight. Rain and mud. Desaturated except for her colors. 35mm, f/2.8.' }
        ]
      },
      { value: 'scarlet_witch', label: 'Scarlet Witch Chaos',
        theme_frag: 'The subject levitates slightly above ground, surrounded by swirling tendrils of crimson chaos magic. Hands raised, fingers spread, channeling massive energy. Red hex symbols orbit around her. Hair floats weightlessly upward. Intense emotionally charged expression — power and sorrow.',
        wardrobe_frag: 'Dark red leather corset-style bodice over flowing black dress with high slit. Dramatic scarlet hooded cloak over shoulders. Ornate silver rings on each finger. Dark red boots.',
        scene_frag: 'Shattered reality — background fragments like broken glass revealing alternate dimensions through cracks. Floating debris, destroyed architecture, red energy tendrils fill the void.',
        lighting_frag: 'Red chaos magic as primary illumination casting dramatic shadows. Cool blue moonlight as secondary. Particles frozen in ultra-sharp detail. 85mm, f/1.4.',
        alt_scenes: [
          { label: 'Suburban reality warp', frag: 'A 1950s-style suburban neighborhood that warps and distorts at the edges — colors shifting, walls bending, reality breaking at the seams.' },
          { label: 'Dark throne of chaos', frag: 'Floating throne made of red energy in a void. Crimson lightning and hex symbols orbit. Dark cosmic background with shattered worlds.' }
        ],
        alt_wardrobes: [
          { label: 'Classic red bodysuit', frag: 'Red bodysuit with darkened accents, pointed tiara/headpiece, flowing cape. More classic comic-book inspired silhouette.' },
          { label: 'Darkhold sorceress', frag: 'Black ornate robes with red rune embroidery, third-eye mark on forehead glowing purple. Dark crown. Corrupted, powerful look.' }
        ],
        alt_lightings: [
          { label: 'Reality-warp colors', frag: 'Shifting multicolor light as reality warps — warm amber shifting to cold blue. Vintage TV static effects. 50mm, f/2.0.' },
          { label: 'Darkhold purple', frag: 'Dark purple and red energy as sole light. Deep shadows. Ominous and powerful. 85mm, f/1.4.' }
        ]
      },
      { value: 'storm', label: 'Storm Lightning Queen',
        theme_frag: 'The subject hovers above a raging ocean as the Goddess of Weather. Arms spread wide, commanding a hurricane. Massive bolts of lightning arc from her hands into the churning sea. White hair whips wildly in the storm. Powerful commanding expression, eyes glow brilliant white.',
        wardrobe_frag: 'Sleek black leather bodysuit with silver accents and flowing white cape catching wind dramatically. Silver X-emblem belt. Metallic arm cuffs crackling with electricity. White hair styled by wind.',
        scene_frag: 'Open ocean during supernatural storm. Towering waves crash below. Sky is swirling vortex of dark clouds with subject at the eye. Lightning illuminates everything in brilliant white and electric blue.',
        lighting_frag: 'Lightning as primary light creating stark white highlights against deep shadows. Volumetric rain and mist. 35mm wide-angle, f/2.8, dramatic low-angle.',
        alt_scenes: [
          { label: 'African savanna storm', frag: 'Vast African savanna under a massive gathering thunderstorm. Acacia trees bend in wind. Lightning strikes the plains. She floats above it all.' },
          { label: 'Rooftop tornado', frag: 'City rooftop as a tornado forms around her. Debris spirals upward. She is calm at the center. Neon city lights refract through rain.' }
        ],
        alt_wardrobes: [
          { label: 'Mohawk punk Storm', frag: 'Punk-inspired black leather outfit with silver studs, dramatic white mohawk hairstyle. Leather pants, boots, choker. Edgier, rebellious look.' },
          { label: 'African queen regalia', frag: 'Regal African-inspired outfit: white flowing robes with gold embroidery, golden headdress, ceremonial jewelry. Queenly and divine.' }
        ],
        alt_lightings: [
          { label: 'Savanna golden storm', frag: 'Golden sunset light mixed with lightning flashes. Warm earth tones. 50mm, f/2.0.' },
          { label: 'Neon rain reflections', frag: 'Neon city lights refracted through rain. Lightning as rim light. 35mm, f/2.0.' }
        ]
      },
      { value: 'catwoman', label: 'Catwoman Heist',
        theme_frag: 'The subject crouches cat-like on a museum display case during a daring heist. One hand reaches for a glowing diamond while the other holds a coiled whip. Laser security beams crisscross the dark room. She looks back at camera over shoulder. Sly mischievous expression with confident smirk.',
        wardrobe_frag: 'Sleek form-fitting black tactical catsuit with subtle stitching. Cat-ear headband half-mask sitting on top of head (face exposed). Utility belt, knee-high heeled boots with silver buckles. Silver clawed gloves.',
        scene_frag: 'Darkened museum gallery at night. Glass display cases with Egyptian artifacts and jewels. Red laser beams slice through darkness. Moonlight streams through skylight above.',
        lighting_frag: 'Dramatic low-key lighting. Moonlight from above creates single strong highlight. Red laser beams add color accents. 50mm, f/1.8.',
        alt_scenes: [
          { label: 'Gotham rooftop escape', frag: 'Gothic Gotham rooftop at night, leaping between buildings. City lights below, police sirens in distance. Wind and rain.' },
          { label: 'Luxury vault', frag: 'Massive luxury bank vault interior, golden bars stacked high, safe deposit boxes open. Single alarm light flashing red.' }
        ],
        alt_wardrobes: [
          { label: 'Leather jacket street', frag: 'Casual Selina Kyle look: leather jacket, dark jeans, boots. Goggles pushed on forehead, whip coiled at belt. Street-smart and cool.' },
          { label: 'Formal gala disguise', frag: 'Sleek black evening gown with thigh-high slit for concealed knife. Diamond cat brooch. Hair up. Undercover elegance hiding catsuit beneath.' }
        ],
        alt_lightings: [
          { label: 'Neon Gotham rain', frag: 'Neon city light reflections on wet surfaces. Cool blue moonlight. 85mm, f/1.8.' },
          { label: 'Gold vault warmth', frag: 'Warm golden glow from gold bars. Single cold security light from above. 35mm, f/2.0.' }
        ]
      },
      { value: 'supergirl', label: 'Supergirl Solar Flare',
        theme_frag: 'The subject floats gracefully mid-air above a sun-drenched city, cape flowing behind. She extends one hand toward viewer in inviting heroic gesture. Warm golden sunlight bathes her entirely. City below looks peaceful and vibrant. Confident hopeful expression with bright smile.',
        wardrobe_frag: 'Classic blue bodysuit with iconic red and yellow S-shield on chest. Red skirt, red cape flowing dramatically, red boots. Gold belt. Suit fabric shows realistic texture and light interaction.',
        scene_frag: 'Bright sunlit metropolitan skyline with gleaming glass skyscrapers. Blue sky with white fluffy clouds. City is vibrant and alive. Sense of hope and warmth.',
        lighting_frag: 'Brilliant warm golden-hour sunlight as primary. Strong rim light from behind creating glowing halo effect. Vibrant saturated colors. 85mm, f/2.0.',
        alt_scenes: [
          { label: 'Crystal Fortress interior', frag: 'Kryptonian crystal fortress interior. Towering crystalline pillars, holographic displays in Kryptonian script. Cool blue-white ambiance.' },
          { label: 'Asteroid field rescue', frag: 'Deep space asteroid field. She catches a falling satellite. Earth visible below. Stars and cosmic dust fill the void.' }
        ],
        alt_wardrobes: [
          { label: 'Kryptonian battle armor', frag: 'Silver and blue Kryptonian battle armor with S-shield engraved. Armored shoulders, gauntlets. More warrior-like. Short red cape.' },
          { label: 'Red Son variant', frag: 'White bodysuit with red S-shield, red cape, Russian-inspired aesthetic accents. Alternate universe design.' }
        ],
        alt_lightings: [
          { label: 'Crystal fortress blue', frag: 'Cool blue-white crystal glow. Kryptonian hologram accents in blue. 50mm, f/2.0.' },
          { label: 'Space solar backlight', frag: 'Brilliant solar backlight from nearby star. Cool space blue fill. 35mm, f/2.8.' }
        ]
      },
      { value: 'captain_marvel', label: 'Captain Marvel Cosmic',
        theme_frag: 'The subject blasts through deep space surrounded by cosmic energy. Binary mode activated — entire body radiates golden photon energy, hair transforms into flowing flames of pure light. Fists forward, she punches through an asteroid that shatters. Fierce unstoppable expression with burning determination.',
        wardrobe_frag: 'Blue, red, and gold armored bodysuit with prominent gold star emblem on chest. Subtle Kree technology patterns. Red sash around waist. Suit glows from within with photon energy.',
        scene_frag: 'Deep space with colorful nebula backdrop. Shattered asteroid fragments scatter from impact. Stars and distant galaxies visible. Cosmic dust and energy trails follow trajectory.',
        lighting_frag: 'Golden photon energy emanating from subject as primary light. Cool blue nebula as ambient fill. Debris frozen in sharp detail. 35mm, f/2.0.',
        alt_scenes: [
          { label: 'Kree warship bridge', frag: 'Bridge of a massive Kree warship. Holographic star maps, alien crew. Through viewport: a fleet engagement with energy weapons firing.' },
          { label: 'Crash landing crater', frag: 'Massive impact crater where she just landed. Cracked earth, dust cloud settling, energy ripples outward. Desert landscape around the crater.' }
        ],
        alt_wardrobes: [
          { label: 'Pilot flight suit', frag: 'Green Kree-style flight suit with helmet removed under arm. Military patches. Pre-transformation look. Fighter jet visible behind.' },
          { label: 'Full binary form', frag: 'Entire body transformed into glowing photon energy — suit barely visible beneath golden flame aura. Hair is pure energy. Maximum power.' }
        ],
        alt_lightings: [
          { label: 'Kree bridge tactical', frag: 'Cool blue Kree tech lighting. Warm orange from weapons fire outside. 50mm, f/2.0.' },
          { label: 'Impact crater dust', frag: 'Golden energy glow from subject. Warm desert sunset ambient. Dust particles catching light. 35mm, f/2.8.' }
        ]
      },
      { value: 'black_widow', label: 'Black Widow Operative',
        theme_frag: 'The subject walks confidently toward camera down a smoke-filled corridor after completing a covert mission. Explosions bloom behind her (she does not look back). One hand holds a tactical pistol, the other adjusts an earpiece. Cold calculating expression with piercing eye contact.',
        wardrobe_frag: 'Sleek black tactical bodysuit with Widow hourglass emblem on belt. Dual wrist-mounted electroshock gauntlets with blue glow. Thigh holsters, utility belt, tactical boots.',
        scene_frag: 'Destroyed enemy compound corridor with fires burning, sparks falling from damaged wiring, thick smoke. Debris on floor. Cool walk-away-from-explosion cinematic trope.',
        lighting_frag: 'Warm orange explosion light from behind creating dramatic rim lighting and long shadows forward. Cool blue gauntlet glow. 50mm, f/1.8.',
        alt_scenes: [
          { label: 'Snowy Russian compound', frag: 'Snow-covered Russian military compound at night. Guard towers, barbed wire, falling snow. Footprints lead to the infiltration point.' },
          { label: 'High-rise infiltration', frag: 'Rooftop of a skyscraper at night. Helicopter searchlights sweep below. She crouches near the edge surveying the city. Wind whips hair.' }
        ],
        alt_wardrobes: [
          { label: 'White tactical suit', frag: 'White tactical suit with grey accents. Snow-camouflage variant. Fur-lined collar. White utility belt. Winter operations look.' },
          { label: 'Undercover evening gown', frag: 'Sleek black evening gown with concealed weapons. Earpiece barely visible. Hair styled elegantly. The weapon is sophistication.' }
        ],
        alt_lightings: [
          { label: 'Snowy moonlight', frag: 'Cool blue moonlight on snow. Warm interior glow from compound windows. 50mm, f/2.0.' },
          { label: 'Helicopter searchlight', frag: 'Harsh white searchlight from above. Cool blue city ambient below. 35mm, f/2.0.' }
        ]
      }
    ],
    couple_group: [
      { value: 'avengers', label: 'Avengers Assembled',
        theme_frag: 'The subjects stand side by side in a dramatic V-formation power pose, central figure slightly forward. They look at camera with fierce determination. Wind and debris swirl from recent battle. Each wears a unique superhero suit.',
        wardrobe_frag: 'Each subject in a unique high-tech superhero suit in coordinated reds, blues, golds with personalized armor. One has a shield on back, another tech gauntlets, another a flowing cape.',
        scene_frag: 'Aftermath of epic battle on city street. Destroyed vehicles, cracked pavement, dust and embers floating. Dramatic sunset breaks through storm clouds behind the team.',
        lighting_frag: 'Golden sunset backlight creating powerful rim lighting on each figure. Warm tones mixed with cool battle smoke. 35mm wide-angle, f/4, all subjects sharp.',
        alt_scenes: [
          { label: 'Helicarrier deck', frag: 'Standing on the deck of a massive flying aircraft carrier. Wind blows capes. Clouds at eye level. Blue sky above, city far below.' },
          { label: 'Wakandan plains', frag: 'Vast African plains with a massive army behind them. Wakandan force field shimmers overhead. Golden hour light.' }
        ],
        alt_wardrobes: [
          { label: 'Matching team uniforms', frag: 'Matching dark navy team uniforms with individual color accents and personalized logos. Sleeker, coordinated military look.' },
          { label: 'Quantum realm suits', frag: 'Matching white and red quantum realm suits with individual helmet designs. Futuristic, clean, techy aesthetic.' }
        ],
        alt_lightings: [
          { label: 'Helicarrier bright', frag: 'Bright sky light from above. Wind effects. Clean heroic lighting. 24mm wide-angle, f/4.' },
          { label: 'Wakandan golden', frag: 'Warm African golden-hour light. Force field purple shimmer accent. 35mm, f/4.' }
        ]
      },
      { value: 'dynamic_duo', label: 'Dynamic Duo Night Patrol',
        theme_frag: 'Two subjects stand back-to-back on a Gothic rooftop, surveying the city below. One dressed as dark armored vigilante, the other as sleek agile sidekick. Both maintain intense eye contact with camera. Signal light projects symbol into clouds above.',
        wardrobe_frag: 'Subject 1: Dark matte tactical armor with flowing cape and angular cowl on shoulders (face exposed). Subject 2: Red and black athletic suit with domino mask pushed up, short cape, bo staff on back.',
        scene_frag: 'Gotham-style Gothic rooftop at night. Gargoyles, rain, fog. Bat-Signal illuminates low clouds. Neon city lights glow far below.',
        lighting_frag: 'Cool blue moonlight as ambient. Warm amber from distant city lights. Signal casting dramatic shapes. 50mm, f/2.0.',
        alt_scenes: [
          { label: 'Batcave briefing', frag: 'Underground Batcave with massive computer screens, suit displays, parked vehicle. Standing at the central console planning.' },
          { label: 'Alley ambush', frag: 'Dark Gotham alley. Criminal gang scattered on ground (defeated). Neon signs reflect in puddles. Steam from vents.' }
        ],
        alt_wardrobes: [
          { label: 'Modern tactical gear', frag: 'Both in modern tactical black gear with night-vision goggles pushed up. Less theatrical, more military-ops. Matching utility belts.' },
          { label: 'Classic bright suits', frag: 'Classic comic suits: grey and blue with yellow belt; red, green and yellow with short cape. Bright, retro, comic-book accurate.' }
        ],
        alt_lightings: [
          { label: 'Batcave blue glow', frag: 'Blue computer screen glow as key light. Dark cave ambient. 35mm, f/2.0.' },
          { label: 'Neon alley puddles', frag: 'Neon reflections in wet puddles. Harsh streetlight from above. 50mm, f/2.0.' }
        ]
      },
      { value: 'super_family', label: 'Super Family Portrait',
        theme_frag: 'A heartwarming superhero family portrait. Subjects pose together as if taking a professional family photo, everyone in matching superhero suits. Tone is warm, joyful, slightly humorous. Classic family portrait composition at different heights. Warm genuine smiles.',
        wardrobe_frag: 'All subjects in coordinated red and blue superhero costumes. Each suit has unique personal touch (different emblem, cape, accessory) but clearly same super family. Capes neatly arranged.',
        scene_frag: 'Professional photo studio with white-to-light-blue gradient. Superhero touches: city skyline painted in background, family banner visible, pet dog wearing tiny cape in corner.',
        lighting_frag: 'Bright high-key studio lighting. Warm tones, even exposure across all subjects. 50mm, f/5.6, all sharp.',
        alt_scenes: [
          { label: 'Living room couch', frag: 'Family living room with couch and TV. Normal setting but everyone is in superhero costumes casually watching TV. Humorous contrast.' },
          { label: 'Rooftop sunset', frag: 'City rooftop at golden hour. Family poses heroically against sunset. Wind blows capes. Beautiful and warm.' }
        ],
        alt_wardrobes: [
          { label: 'Incredibles-style matching', frag: 'Matching red bodysuits with black accents and unique masks. Each has a different symbol. "No capes" — short capes only on the kids.' },
          { label: 'Casual with hero elements', frag: 'Casual family clothes but each wearing one hero element: cape over hoodie, mask pushed up on head, gloves, hero-logo tee.' }
        ],
        alt_lightings: [
          { label: 'Warm living room', frag: 'Warm natural indoor light. TV glow as accent. Candid family feel. 35mm, f/2.8.' },
          { label: 'Sunset rim light', frag: 'Golden sunset backlight. Warm rim lighting on each figure. 35mm wide-angle, f/4.' }
        ]
      },
      { value: 'hero_villain', label: 'Heroes vs Villain Standoff',
        theme_frag: 'Epic cinematic standoff. Subjects stand as team of heroes facing off against an implied massive threat (viewers perspective). Battle-ready poses — fists clenched, powers charging, weapons drawn. Fierce determined expressions. Battle-damaged costumes.',
        wardrobe_frag: 'Each in distinct superhero costume: armored tech suit, magical cloak, sleek speedster suit, primary-color spandex. All battle-damaged with torn fabric and scorch marks.',
        scene_frag: 'Destroyed city intersection. Cars overturned, buildings crumbling, fires burning. Heroes stand firm amid chaos. Massive villain shadow looms from foreground.',
        lighting_frag: 'Dramatic underlighting from fires. Cool blue atmospheric haze. Cinematic movie-poster composition. 24mm wide-angle, f/2.8.',
        alt_scenes: [
          { label: 'Alien invasion sky', frag: 'City under alien invasion. Portal in the sky rains alien ships. The heroes look up, ready. Debris falls around them.' },
          { label: 'Final battle arena', frag: 'Desolate alien planet surface. Ruined Titan-like landscape. Purple sky. The final confrontation location.' }
        ],
        alt_wardrobes: [
          { label: 'Time-travel suits', frag: 'Each in a different era version of their costume: one futuristic, one medieval, one noir, one cyberpunk. Time-displaced team.' },
          { label: 'Endgame battered', frag: 'Heavily destroyed versions of classic suits. Missing pieces, exposed skin through tears. Shield cracked. Hammer chipped. Exhausted but standing.' }
        ],
        alt_lightings: [
          { label: 'Portal energy above', frag: 'Blue alien portal energy from above as eerie light. Warm fire below. 24mm wide-angle, f/2.8.' },
          { label: 'Desolate alien dusk', frag: 'Purple-orange alien sunset. Dust and debris catching light. 35mm, f/4.' }
        ]
      },
      { value: 'spiderverse', label: 'Spider-Verse Duo',
        theme_frag: 'Two subjects swing together through a multiverse portal. One in classic red-and-blue, the other in black-and-red variant. Mid-swing, one shoots web upward, the other performs acrobatic flip. Masks off, tucked in belts. Excited grins and fun energetic expressions.',
        wardrobe_frag: 'Subject 1: Classic red and blue web-patterned suit, white web shooters. Subject 2: Black suit with red accents, glitch-effect patterns along edges. Both masks removed.',
        scene_frag: 'Swirling multiverse portal with comic-book visual effects — halftone dots, kirby crackle energy, dimension windows showing alternate cityscapes. Vibrant colors collide.',
        lighting_frag: 'Multicolor dimensional light — pinks, blues, oranges — psychedelic but cinematic. Comic-book panel effects blended with photorealism. 24mm wide-angle.',
        alt_scenes: [
          { label: 'City web-swing race', frag: 'New York City canyon between skyscrapers. Both swinging on web lines racing each other. Sunset light between buildings.' },
          { label: 'Upside-down city', frag: 'Gravity-defying cityscape where buildings go up AND down. Both subjects web-sling in impossible directions. Comic pop-art background.' }
        ],
        alt_wardrobes: [
          { label: 'Into the Spider-Verse style', frag: 'Both suits rendered with visible comic-book dot shading and ink outlines. One with hoodie over suit. Animated-meets-real aesthetic.' },
          { label: 'Iron Spider + Symbiote', frag: 'Subject 1: Red and gold Iron Spider suit with mechanical arms from back. Subject 2: Black symbiote suit with white spider emblem, organic texture.' }
        ],
        alt_lightings: [
          { label: 'Sunset canyon', frag: 'Warm golden sunset between skyscrapers. Web lines catching light. 35mm, f/2.8.' },
          { label: 'Comic pop-art flat', frag: 'Flat bold comic lighting with strong ink shadows. Vivid saturated primary colors. 24mm wide-angle.' }
        ]
      },
      { value: 'hero_selfie', label: 'Heroic Selfie With Villain',
        theme_frag: 'Hilarious candid selfie. Subjects dressed as superheroes take a group selfie with a defeated comic-book villain tied up behind them. One holds the phone (selfie perspective). Villain is cartoonishly restrained, looking exasperated. Heroes are laughing, peace signs, big smiles.',
        wardrobe_frag: 'Each in unique colorful superhero costume — bright reds, blues, greens, golds. Minor battle damage (dust, small tears). Villain in classic green-and-purple outfit.',
        scene_frag: 'City street post-battle. Minor damage but celebratory mood. Citizens cheer in background. Confetti drifts. Bright daylight.',
        lighting_frag: 'Bright daylight, handheld selfie angle with slight wide-angle distortion. Warm vibrant colors. Candid social-media feel.',
        alt_scenes: [
          { label: 'Top of skyscraper', frag: 'Rooftop of skyscraper, city panorama below. Wind blows capes. Blue sky. The ultimate superhero group selfie spot.' },
          { label: 'Inside destroyed lair', frag: 'Inside the villains destroyed lair. Screens smashed, evil plans on whiteboard behind. Heroes pose in front of the chaos triumphantly.' }
        ],
        alt_wardrobes: [
          { label: 'Matching team hoodies', frag: 'Matching team hoodies with hero logos over their suits. Casual post-battle celebratory look. Baseball caps and pizza boxes.' },
          { label: 'Pajama hero variants', frag: 'Superhero pajama onesies — each a different hero pattern. Humorous, cozy, post-victory loungewear. Fluffy slippers.' }
        ],
        alt_lightings: [
          { label: 'Sunset panorama', frag: 'Golden sunset backlighting the group. City skyline glows. 16mm wide-angle selfie.' },
          { label: 'Lair red alert', frag: 'Flashing red alert lights from the lair. Green screen glow from computers. 16mm wide-angle.' }
        ]
      },
      { value: 'league_pose', label: 'League of Legends Pose',
        theme_frag: 'Dramatic stylized team portrait. Subjects stand in semicircle formation on floating platform above clouds. Each strikes unique signature hero pose. Symmetrical epic composition designed like a movie poster. Powerful iconic poses.',
        wardrobe_frag: 'Each in thematically unique outfit: Amazonian warrior, dark knight, Kryptonian, speedster, aquatic king — all premium textured costumes with rich metallic details.',
        scene_frag: 'Celestial watchtower floating above Earth. Curved horizon visible below. Stars and brilliant sunrise illuminate scene. Clouds part below platform.',
        lighting_frag: 'Epic sunrise backlighting with warm golden tones. Each hero lit by unique colored accent matching their theme. 35mm, f/4, all sharp.',
        alt_scenes: [
          { label: 'Hall of Justice', frag: 'Grand marble Hall of Justice interior. Massive statues of each hero line the walls. Central holographic globe. Dramatic vaulted ceiling.' },
          { label: 'Multiverse nexus', frag: 'Floating at the center of the multiverse — portals to different worlds surrounding them. Cosmic energy swirls. Stars and galaxies visible.' }
        ],
        alt_wardrobes: [
          { label: 'Armored war versions', frag: 'Battle-armored versions of each suit. Heavier plating, weapons mounted, tactical upgrades. War-ready formation. Matching insignia.' },
          { label: 'Civilian clothes reveal', frag: 'Each in civilian clothes but mid-transformation: one ripping shirt to reveal emblem, another pulling mask from pocket. Secret identity moment.' }
        ],
        alt_lightings: [
          { label: 'Hall of Justice interior', frag: 'Warm marble interior lighting. Holographic blue accent from globe. Dramatic columns casting shadows. 35mm, f/4.' },
          { label: 'Cosmic multiverse glow', frag: 'Multicolor portal light from all directions. Cosmic energy as ambient. 24mm wide-angle, f/2.8.' }
        ]
      }
    ]
  }
},

// ======================================================================
// 2. HIGH END PHOTOGRAPHY
// ======================================================================
high_end_photography: {
  label: 'High End Photography',
  characters: {
    male: [
      { value: 'gwagon', label: 'Midnight G-Wagon',
        theme_frag: 'A stylish man standing confidently beside a sleek polished black Mercedes-Benz G-Wagon SUV in a city parking lot at night. He holds a large elegant bouquet of pastel tulips and daisies wrapped in brown paper. Direct eye contact.',
        wardrobe_frag: 'Tailored fitted black suit, crisp black button-up shirt, black trousers. Luxury wristwatch and dark designer sunglasses.',
        scene_frag: 'Modern city parking lot at night. Asphalt reflects urban neon lights. Moody nighttime atmosphere with deep shadows and highlights.',
        lighting_frag: 'Dramatic nighttime city lighting from neon signs and streetlamps. Film grain, shallow depth of field. 85mm, f/1.8.',
        alt_scenes: [
          { label: 'Underground garage', frag: 'Dim moody basement garage. Luxury SUVs blurred in background with cinematic bokeh. Concrete pillars, strip lighting.' },
          { label: 'Rainy boulevard', frag: 'Parisian-style boulevard at night in rain. Wet cobblestones reflect neon. The G-Wagon gleams under streetlights.' }
        ],
        alt_wardrobes: [
          { label: 'Urban streetwear', frag: 'Oversized windbreaker, baggy pants, basketball cap. Chunky sneakers. Realistic casual fabric textures.' },
          { label: 'White tuxedo', frag: 'Immaculate white dinner jacket tuxedo, black trousers, bow tie. Pocket square. Statement luxury watch.' }
        ],
        alt_lightings: [
          { label: 'Garage moody', frag: 'Low moody garage lighting. Atmospheric shadows. 35mm, f/2.0.' },
          { label: 'Rain neon reflections', frag: 'Neon reflections in rain puddles. Warm streetlamp key light. 85mm, f/1.4.' }
        ]
      },
      { value: 'tycoon', label: 'The Golden Tycoon',
        theme_frag: 'Highly stylized cinematic movie-poster portrait. Three-quarter chest-up view with confident posture: chin slightly raised, strong jawline visible. Scattered US-dollar bills fall in mid-air around the subject. Intense eye contact through sunglasses.',
        wardrobe_frag: 'Dark tailored suit, white dress shirt, silk tie with warm golden yellow stripes. Black rectangular sunglasses with amber-tinted lenses.',
        scene_frag: 'Centered vertical composition with negative space. Cut-paper money falling around subject. Mostly desaturated grayscale with strong graphic brush strokes.',
        lighting_frag: 'Dramatic studio key light from upper-left with deep soft shadows. Intense directional lighting. 85mm, f/2.0.',
        alt_scenes: [
          { label: 'Penthouse office', frag: 'Corner penthouse office, floor-to-ceiling windows, Manhattan skyline at sunrise. Minimalist mahogany desk, leather chair.' },
          { label: 'Casino high-roller', frag: 'VIP casino table. Stacks of chips, crystal chandelier above. Other players blurred. Green felt table.' }
        ],
        alt_wardrobes: [
          { label: 'Navy three-piece', frag: 'Navy three-piece suit with peak lapels, white French-cuff shirt, gold cufflinks, burgundy silk tie. Polished Oxford shoes.' },
          { label: 'Casual luxury', frag: 'Black cashmere turtleneck, tailored grey trousers, premium watch. Understated but clearly expensive. No tie, no jacket.' }
        ],
        alt_lightings: [
          { label: 'Sunrise office', frag: 'Golden sunrise through windows creating long shadows. Strong rim light on subject. 50mm, f/2.0.' },
          { label: 'Casino chandelier', frag: 'Warm casino chandelier light with crystal bokeh reflections. 85mm, f/1.8.' }
        ]
      },
      { value: 'defender', label: 'Streetwise Defender',
        theme_frag: 'Hyper-realistic low-angle closeup of the subject leaning against a Land Rover Defender. Hands crossed, intense attitude gaze with direct eye contact toward camera.',
        wardrobe_frag: 'Urban streetwear: oversized windbreaker, baggy basketball pants, basketball cap. Chunky sneakers. Realistic fabric textures.',
        scene_frag: 'Dim moody basement garage. Land Rover Defender as primary vehicle, luxury SUVs softly blurred in background with cinematic bokeh.',
        lighting_frag: 'Low-angle with shallow depth of field. Moody atmospheric garage lighting. Professional cinematic color grading. 35mm, f/2.0.',
        alt_scenes: [
          { label: 'Urban rooftop parking', frag: 'Rooftop parking at dusk. City skyline in background. The Defender parked on the edge. Golden hour light.' },
          { label: 'Desert highway', frag: 'Desert highway at sunset. The Defender parked on the roadside. Vast open landscape. Dust in the air.' }
        ],
        alt_wardrobes: [
          { label: 'Desert explorer', frag: 'Linen shirt rolled at sleeves, cargo pants, desert boots. Aviator sunglasses. Rugged but stylish explorer look.' },
          { label: 'All-black minimal', frag: 'All-black: fitted turtleneck, slim jeans, chelsea boots. Matte black watch. Clean, minimal, sharp.' }
        ],
        alt_lightings: [
          { label: 'Golden rooftop dusk', frag: 'Warm golden-hour dusk light. City skyline bokeh. 85mm, f/2.0.' },
          { label: 'Desert sunset', frag: 'Rich desert sunset light in oranges and purples. 50mm, f/2.8.' }
        ]
      },
      { value: 'kashmir', label: 'Kashmir Winter Luxury',
        theme_frag: 'Full-body cinematic portrait. Subject seated on a large snow-covered rock in majestic mountain landscapes. One leg slightly bent, confident yet relaxed posture. Snowflakes fall gently.',
        wardrobe_frag: 'Premium fur-lined puffer jacket, maroon t-shirt underneath, baggy denim jeans, rugged leather trekking boots. Green circular sunglasses, smart watch.',
        scene_frag: 'Majestic snow-laden mountain landscapes. Towering peaks and pine forests under soft winter sky. Snowflakes fall gently throughout.',
        lighting_frag: 'Natural cold daylight highlighting textures of fur, snow, and leather. Cinematic film style. 85mm, f/2.8.',
        alt_scenes: [
          { label: 'Frozen lake cabin', frag: 'Frozen lake with a luxury wooden cabin. Snow-covered pines. Smoke from chimney. Serene winter solitude.' },
          { label: 'Ski resort terrace', frag: 'Luxury ski resort terrace with mountain panorama. Fur throws on chairs, hot drinks steaming. Alpine elegance.' }
        ],
        alt_wardrobes: [
          { label: 'Luxury ski wear', frag: 'High-end ski jacket in navy, matching pants, premium goggles on forehead. Cashmere scarf. After-ski elegance.' },
          { label: 'Shearling coat classic', frag: 'Long shearling coat over cable-knit sweater, dark jeans, leather boots. Warm, rugged, refined winter style.' }
        ],
        alt_lightings: [
          { label: 'Cabin warm glow', frag: 'Warm golden cabin light through windows. Cool blue snow ambient. 50mm, f/2.0.' },
          { label: 'Bright alpine sun', frag: 'Bright clean alpine sunlight on snow. Cool crisp tones. 85mm, f/2.8.' }
        ]
      },
      { value: 'poolside', label: 'Poolside Mogul',
        theme_frag: 'Stylish hyper-realistic night shot of the subject lounging by a luxury poolside. He reclines on a sunbed in relaxed confident pose, looking directly at camera. A cigarette between lips releases wispy smoke.',
        wardrobe_frag: 'Half-open white linen shirt, dark tailored trousers. Necklace and bracelets catching ambient light. Tousled hair with slight glisten suggesting poolside humidity.',
        scene_frag: 'Night by high-end swimming pool. Bottles and glass of amber liquid on side table reflecting pool lights. Shimmering water and luxury poolside architecture under dark sky.',
        lighting_frag: 'Cinematic low-light photography. Soft ambient highlights on jewelry and liquid textures. Volumetric smoke. 50mm, f/1.8.',
        alt_scenes: [
          { label: 'Infinity pool sunset', frag: 'Infinity pool overlooking ocean at sunset. Warm sky gradients. Luxury villa architecture. Tropical plants frame the shot.' },
          { label: 'Indoor spa luxury', frag: 'Premium indoor spa with marble surfaces, warm pool, steam rising. Ambient candles. Opulent and intimate.' }
        ],
        alt_wardrobes: [
          { label: 'Swim trunks + robe', frag: 'Designer swim trunks, luxury terry robe draped over shoulders. Aviator sunglasses perched on head. Gold bracelet. Wet hair slicked back.' },
          { label: 'Linen suit no shoes', frag: 'Cream linen suit with no shirt underneath, rolled trousers, barefoot on pool deck. Champagne flute in hand. Relaxed elegance.' }
        ],
        alt_lightings: [
          { label: 'Sunset infinity', frag: 'Warm golden sunset as backlight. Pool reflects orange and purple sky. 85mm, f/2.0.' },
          { label: 'Spa candlelight', frag: 'Warm candlelight on face. Steam diffusion. Cool blue water reflections. 85mm, f/1.4.' }
        ]
      },
      { value: 'wallstreet', label: 'Wall Street Power',
        theme_frag: 'Subject stands at floor-to-ceiling windows of a corner office on the 80th floor of a Manhattan skyscraper. Holds crystal tumbler of whiskey in one hand, other adjusts cufflink. City sprawls dramatically below. Early morning golden light floods office. Powerful commanding expression.',
        wardrobe_frag: 'Immaculately tailored navy three-piece suit with peak lapels, white French-cuff shirt, gold cufflinks, burgundy silk tie. Polished Oxford shoes. Premium watch.',
        scene_frag: 'Penthouse corner office with floor-to-ceiling windows on two walls. Minimalist mahogany desk, leather chair. Manhattan skyline stretching to horizon at sunrise.',
        lighting_frag: 'Warm golden sunrise through windows creating long shadows across marble floor. Subject backlit with strong rim light. 50mm, f/2.0.',
        alt_scenes: [
          { label: 'Trading floor', frag: 'Busy stock exchange trading floor. Multiple screens with green numbers. Suited traders in background blurred. High energy chaos.' },
          { label: 'Private jet interior', frag: 'Luxury private jet interior. Cream leather seats, polished wood panels. Clouds visible through oval windows. Mid-flight.' }
        ],
        alt_wardrobes: [
          { label: 'Power casual CEO', frag: 'Black cashmere turtleneck, grey tailored trousers, premium sneakers. No tie, no jacket. Silicon Valley meets Wall Street.' },
          { label: 'Pinstripe double-breasted', frag: 'Charcoal pinstripe double-breasted suit, red power tie, white pocket square. Suspenders visible. Old-school power broker.' }
        ],
        alt_lightings: [
          { label: 'Trading floor screens', frag: 'Cool blue-green screen glow. Harsh overhead fluorescent. Hectic energy. 35mm, f/2.8.' },
          { label: 'Jet window light', frag: 'Soft natural light through jet windows. Warm cream interior ambient. 85mm, f/1.8.' }
        ]
      },
      { value: 'monaco', label: 'Monaco Harbour',
        theme_frag: 'Subject leans casually against the railing of a luxury superyacht in Monaco harbour. Holds glass of champagne. Behind him, iconic Monte Carlo cityscape rises up hillside. Warm Mediterranean breeze tousles hair. Relaxed confident smile.',
        wardrobe_frag: 'White linen blazer, light blue open-collar shirt, navy chinos, tan leather loafers without socks. Aviator sunglasses, luxury dive watch.',
        scene_frag: 'Monaco harbour with rows of mega-yachts. Monte Carlo Casino and terraced buildings on hillside. Crystal-clear turquoise water. Mediterranean summer atmosphere.',
        lighting_frag: 'Bright Mediterranean midday sunlight with warm tones. Natural highlights on water and yacht surfaces. 85mm, f/2.8, soft bokeh.',
        alt_scenes: [
          { label: 'Amalfi Coast terrace', frag: 'Cliffside terrace overlooking the Amalfi Coast. Colorful Italian buildings cascade down cliff. Deep blue Mediterranean sea below.' },
          { label: 'Yacht deck at sea', frag: 'Open ocean on a yacht deck. Nothing but blue water and sky to the horizon. White deck, chrome railings catching sun.' }
        ],
        alt_wardrobes: [
          { label: 'Italian summer chic', frag: 'Pastel pink linen shirt, white trousers, espadrilles. Gold chain, rose-tinted sunglasses. Effortlessly Mediterranean.' },
          { label: 'Captain nautical', frag: 'Navy blazer with gold buttons over white polo, white trousers, deck shoes. Captain cap at rakish angle. Classic nautical.' }
        ],
        alt_lightings: [
          { label: 'Amalfi golden hour', frag: 'Golden hour light warming cliff faces. Sea reflects sunset. 85mm, f/2.0.' },
          { label: 'Open sea bright', frag: 'Bright midday sun on open water. Clean highlights. 50mm, f/2.8.' }
        ]
      }
    ],
    female: [
      { value: 'paris', label: 'Parisian Haute Couture',
        theme_frag: 'Subject walks confidently down a Parisian boulevard with Eiffel Tower in soft background. Pigeons scatter in foreground. Hair flows with natural movement. Elegant confident expression with direct eye contact.',
        wardrobe_frag: 'Tailored cream Chanel-style tweed jacket with gold buttons, high-waisted black trousers, pointed stiletto heels. Pearl necklace, gold hoop earrings. Classic red lipstick.',
        scene_frag: 'Wide Parisian boulevard with Haussmann-era buildings. Eiffel Tower in soft focus in distance. Early morning golden light on limestone facades.',
        lighting_frag: 'Golden hour morning light casting long warm shadows. Cinematic depth with soft Eiffel Tower bokeh. 85mm, f/1.8.',
        alt_scenes: [
          { label: 'Champs-Elysees cafe', frag: 'Outdoor Parisian cafe with wicker chairs, marble table. Haussmann buildings and cobblestone street. Autumn leaves drift.' },
          { label: 'Louvre courtyard', frag: 'Louvre pyramid courtyard at dawn. Glass pyramid reflects golden sky. Empty, peaceful, iconic.' }
        ],
        alt_wardrobes: [
          { label: 'Little black dress', frag: 'Classic Audrey Hepburn-inspired little black dress, ballet flats, oversized sunglasses, silk scarf. Timeless Parisian chic.' },
          { label: 'Bohemian Montmartre', frag: 'Flowing floral midi dress, straw hat, basket bag, flat sandals. Artistic, romantic, Left Bank bohemian.' }
        ],
        alt_lightings: [
          { label: 'Cafe afternoon', frag: 'Soft overcast afternoon light. Warm tones. Natural editorial feel. 50mm, f/2.0.' },
          { label: 'Dawn pyramid glow', frag: 'First light reflecting off glass pyramid. Cool sky warming to gold. 35mm, f/2.8.' }
        ]
      },
      { value: 'redcarpet', label: 'Red Carpet Siren',
        theme_frag: 'Subject poses on a red carpet at a premiere event. Camera flashes create starburst effects. She strikes a confident pose with hand on hip, looking over shoulder at camera. Glamorous show-stopping expression. Paparazzi and velvet ropes blur behind.',
        wardrobe_frag: 'Stunning floor-length emerald green sequin gown with dramatic thigh-high slit and plunging neckline. Diamond drop earrings, diamond tennis bracelet. Strappy silver stilettos. Hollywood waves.',
        scene_frag: 'Red carpet event with photographers, flash bursts, velvet ropes, movie premiere backdrop with logos blurred. Excitement and energy.',
        lighting_frag: 'Bright camera flash as key light creating high-fashion look. Warm ambient event lighting. 85mm, f/2.0.',
        alt_scenes: [
          { label: 'Oscar stage podium', frag: 'Awards show stage. She holds a golden statue. Massive audience in stadium seating. Teleprompter glow. Standing ovation.' },
          { label: 'Magazine cover studio', frag: 'Professional fashion photography studio. Seamless white backdrop. Beauty dish overhead. Clean, minimal, editorial.' }
        ],
        alt_wardrobes: [
          { label: 'Black velvet gown', frag: 'Floor-length black velvet gown with dramatic cape sleeves. Ruby necklace. Hair in sleek updo. Old Hollywood glamour.' },
          { label: 'Gold metallic mini', frag: 'Gold metallic mini dress with structured shoulders. Matching gold clutch, gold strappy heels. Statement earrings. Modern glamour.' }
        ],
        alt_lightings: [
          { label: 'Stage spotlight', frag: 'Single warm spotlight from above. Audience in darkness. 85mm, f/2.0.' },
          { label: 'Studio beauty dish', frag: 'Clean studio beauty-dish lighting. Soft even illumination. 85mm, f/2.0.' }
        ]
      },
      { value: 'yacht', label: 'Azure Yacht Goddess',
        theme_frag: 'Ultra-realistic shot of the subject standing on a white boat deck. Smiles warmly with direct eye contact. Pose is confident, one arm raised holding an orange shirt billowing in the wind.',
        wardrobe_frag: 'Light-blue bralette bikini top with subtle embellishments and dark-patterned high-cut bottoms. Sunglasses perched atop head. Dark wavy hair slightly windblown.',
        scene_frag: 'Bright sunlit white luxury boat deck. Background: vast deep blue ocean meeting clear sky. Vibrant high-end nautical atmosphere.',
        lighting_frag: 'Bright natural midday sunlight. Orange shirt creates vibrant contrast against blue sea and white deck. 50mm, f/2.8.',
        alt_scenes: [
          { label: 'Greek island bay', frag: 'Anchored in a Greek island bay. White buildings cascade on hillside. Crystal clear turquoise water. Bright Mediterranean summer.' },
          { label: 'Sunset deck lounge', frag: 'Yacht rear deck at sunset. Champagne on ice, fruit platter. Warm golden light on polished teak. Romantic and luxurious.' }
        ],
        alt_wardrobes: [
          { label: 'White cover-up dress', frag: 'Sheer white cover-up dress over bikini, flowing in sea breeze. Gold anklet, shell necklace. Effortless beach luxury.' },
          { label: 'Nautical chic outfit', frag: 'Navy and white striped off-shoulder top, white linen shorts, gold sandals. Captain hat playfully tilted. Classic nautical.' }
        ],
        alt_lightings: [
          { label: 'Greek bay bright', frag: 'Brilliant Mediterranean sunlight. Turquoise water reflections. 50mm, f/2.8.' },
          { label: 'Sunset warm deck', frag: 'Warm golden sunset on teak deck. Rich amber tones. 85mm, f/2.0.' }
        ]
      },
      { value: 'tokyo', label: 'Neon Tokyo Diva',
        theme_frag: 'Subject stands at a busy Tokyo intersection at night. Neon signs in Japanese reflect off wet pavement. She looks directly at camera completely still while the crowd blurs around her. Bold fierce expression.',
        wardrobe_frag: 'Oversized structured blazer in hot pink over black crop top. Black leather mini skirt, knee-high black boots. Chunky gold chain necklace. Hair sleek and straight.',
        scene_frag: 'Shibuya-style neon-lit intersection at night. Rain-slicked streets reflecting neon in pink, blue, yellow. Motion-blurred pedestrians flow around the sharp subject.',
        lighting_frag: 'Neon light reflections as primary illumination. Long exposure blur on crowd while subject is razor-sharp. 35mm, f/2.0.',
        alt_scenes: [
          { label: 'Akihabara electric town', frag: 'Akihabara electronic district. Massive anime billboards, LED screens, colorful storefronts. Electric energy and color.' },
          { label: 'Tokyo subway platform', frag: 'Empty Tokyo subway platform late at night. Clean tile walls, harsh fluorescent strips. Train approaching in distance creating wind.' }
        ],
        alt_wardrobes: [
          { label: 'Harajuku colorful', frag: 'Harajuku-inspired layered outfit: oversized vintage jacket, plaid skirt, platform boots, multiple accessories. Colorful and bold.' },
          { label: 'Sleek black minimalist', frag: 'All-black Tokyo minimalist: structured coat, turtleneck, leather pants, pointed boots. One red accessory — a silk scarf.' }
        ],
        alt_lightings: [
          { label: 'Akihabara LED glow', frag: 'Multicolor LED screen glow. Warm and cool light mixing. 35mm, f/2.0.' },
          { label: 'Subway fluorescent', frag: 'Harsh white fluorescent strips. Cool, clinical, atmospheric. Train light approaching. 35mm, f/1.8.' }
        ]
      },
      { value: 'desert', label: 'Desert Rose Editorial',
        theme_frag: 'High-fashion editorial shot in dramatic desert landscape. Subject stands on a sand dune with flowing fabric catching the wind. Hair swept by warm breeze. Golden hour creates otherworldly glow. Serene ethereal expression.',
        wardrobe_frag: 'Flowing burnt-orange silk gown with dramatic train trailing across sand. Gold cuff bracelets on both wrists. Minimal strappy gold sandals. Bronzed glowing makeup.',
        scene_frag: 'Sweeping Sahara-like sand dunes under dramatic sunset sky. Rich gradients of orange, pink, purple. Clean horizon lines. Windswept sand catches light.',
        lighting_frag: 'Golden hour side lighting creating long dramatic shadows on dunes. Warm rich tones throughout. 85mm, f/2.0, creamy bokeh.',
        alt_scenes: [
          { label: 'White salt flats', frag: 'Vast white salt flats stretching to infinity. Mirror-like water reflections create surreal doubled landscape. Minimal and ethereal.' },
          { label: 'Red rock canyon', frag: 'Dramatic red sandstone canyon with layered rock formations. Slot canyon with light beams from above. Ancient and powerful.' }
        ],
        alt_wardrobes: [
          { label: 'White ethereal layers', frag: 'Flowing white chiffon layered outfit — sheer panels catching wind. Minimal gold jewelry. Angelic against desert warmth.' },
          { label: 'Red power suit', frag: 'Tailored red blazer and wide-leg trousers. Gold heels. Statement gold earrings. Power and fashion in the wilderness.' }
        ],
        alt_lightings: [
          { label: 'Salt flats mirror', frag: 'Even soft light reflected from white salt. Ethereal glow from all directions. 50mm, f/2.0.' },
          { label: 'Slot canyon beam', frag: 'Single dramatic light beam from above in canyon. Rest in warm shadow. 35mm, f/2.0.' }
        ]
      },
      { value: 'icequeen', label: 'Ice Queen Couture',
        theme_frag: 'Breathtaking fashion portrait set in an ice palace. Subject stands amidst crystalline ice formations refracting light into prismatic rainbows. Commanding ethereal presence. One hand lightly touches an ice column. Regal composed expression.',
        wardrobe_frag: 'Structured silver-white haute couture gown with intricate crystal beadwork mirroring ice. Dramatic feathered shoulder piece in white and pale blue. Diamond tiara. Sheer white opera gloves. Elegant updo.',
        scene_frag: 'Surreal ice palace interior — towering crystal formations, frozen waterfalls, prismatic light refracting through ice. Polished ice floor reflecting subject.',
        lighting_frag: 'Cool blue ambient from ice with warm accent spots creating prismatic effects. Dreamlike shallow depth of field. 85mm, f/1.4.',
        alt_scenes: [
          { label: 'Northern Lights glacier', frag: 'Standing on a glacier under the Northern Lights. Aurora borealis in greens and purples. Ice field stretching to horizon.' },
          { label: 'Frozen throne room', frag: 'Massive frozen throne room with ice throne, frozen chandeliers, frost-covered walls. Everything crystalline and glittering.' }
        ],
        alt_wardrobes: [
          { label: 'Fur queen luxury', frag: 'Floor-length white fur coat over sparkling silver gown. Diamond crown. Crystal-studded boots. Winter queen luxury.' },
          { label: 'Ice armor warrior', frag: 'Crystalline ice-like armor over white bodysuit. Crown of icicles. Frost patterns on skin. Ice weapon in hand. Fantasy warrior queen.' }
        ],
        alt_lightings: [
          { label: 'Aurora borealis', frag: 'Green and purple aurora light from above. Cool blue ice reflection. 35mm, f/2.0.' },
          { label: 'Frozen chandelier', frag: 'Warm light refracting through frozen chandelier crystals. Cool blue ambient. 85mm, f/1.4.' }
        ]
      },
      { value: 'jungle', label: 'Jungle Luxe Goddess',
        theme_frag: 'Subject stands in the heart of a lush tropical jungle waterfall scene. Crystal-clear water cascades behind. She is drenched, hair wet and swept back, looking at camera with raw confidence. Powerful natural expression.',
        wardrobe_frag: 'Gold-embellished bodysuit with intricate leaf and vine patterns. Gold arm cuffs, layered gold necklaces with emerald stones. Bare feet on moss-covered rocks. Natural dewy skin.',
        scene_frag: 'Hidden jungle waterfall paradise. Dense tropical foliage, exotic flowers, mist from waterfall. Sunbeams pierce through canopy creating god-rays.',
        lighting_frag: 'Dappled natural sunlight through jungle canopy. Mist and water droplets catching light. 50mm, f/2.0.',
        alt_scenes: [
          { label: 'Cenote pool', frag: 'Mexican cenote — natural underground pool with roots hanging from cave ceiling. Turquoise water, light beam from opening above.' },
          { label: 'Bamboo forest path', frag: 'Towering bamboo forest with light filtering through green canopy. Misty, serene, otherworldly. Stone path.' }
        ],
        alt_wardrobes: [
          { label: 'Tropical print flowing', frag: 'Flowing tropical print maxi dress with deep neckline. Orchid behind ear. Barefoot. Natural beauty with minimal jewelry.' },
          { label: 'Earth goddess minimal', frag: 'Minimal earth-toned wrap skirt and top. Vine and flower crown. Body art in natural pigments. Connected to nature.' }
        ],
        alt_lightings: [
          { label: 'Cenote light beam', frag: 'Single dramatic light beam from cenote opening above. Turquoise water glow. 35mm, f/2.0.' },
          { label: 'Bamboo diffused', frag: 'Soft green-filtered light through bamboo canopy. Misty diffusion. 85mm, f/1.8.' }
        ]
      }
    ],
    couple_group: [
      { value: 'champagne', label: 'Rooftop Champagne Toast',
        theme_frag: 'Subjects stand on a luxury rooftop terrace at sunset, raising champagne flutes in a celebratory toast. They look at camera with genuine happiness. City skyline glows behind in warm golden tones.',
        wardrobe_frag: 'Elegant evening attire — suits, dresses, or cocktail outfits in coordinated dark and jewel tones. Champagne glasses catch light. Watches, earrings, bracelets.',
        scene_frag: 'High-end rooftop bar with modern furnishings, ambient lighting, unobstructed metropolitan skyline during golden hour. String lights add warmth.',
        lighting_frag: 'Golden hour backlight from setting sun. Warm glow from string lights and candles. 35mm, f/2.8, all faces sharp.',
        alt_scenes: [
          { label: 'Penthouse balcony', frag: 'Luxury penthouse balcony at night. City lights as backdrop. Candles on glass table. Intimate and exclusive.' },
          { label: 'Garden party', frag: 'Upscale garden party with fairy lights, white drapes, flower arrangements. Manicured lawn. Twilight. Elegant outdoor celebration.' }
        ],
        alt_wardrobes: [
          { label: 'Black tie formal', frag: 'Full black tie: tuxedos, floor-length gowns. Diamonds and cufflinks. Ultra-formal elegance.' },
          { label: 'Smart casual summer', frag: 'Smart casual summer: linen shirts, sundresses, blazers. Light colors, natural fabrics. Relaxed but stylish.' }
        ],
        alt_lightings: [
          { label: 'City night ambient', frag: 'Cool city lights as bokeh backdrop. Warm candlelight on faces. 50mm, f/2.0.' },
          { label: 'Fairy light garden', frag: 'Warm fairy lights as primary. Soft twilight ambient. 35mm, f/2.0.' }
        ]
      },
      { value: 'convertible', label: 'Vintage Convertible Ride',
        theme_frag: 'Two subjects cruise in a vintage 1960s Cadillac convertible along a coastal highway. Driver has one hand on wheel, passenger arms raised in wind. Both laughing with genuine joy. Hair blows in wind.',
        wardrobe_frag: 'Classic California style: linen shirts, vintage sunglasses, flowing scarves. Retro aesthetic in light airy fabrics. The car is cherry red with gleaming chrome.',
        scene_frag: 'Pacific Coast Highway with dramatic ocean cliffs and turquoise water. Golden afternoon sunlight. Palm trees line the road ahead.',
        lighting_frag: 'Warm golden sun with lens flare. Wind-blown hair frozen in motion. Vintage film aesthetic with subtle grain. 35mm, f/2.8.',
        alt_scenes: [
          { label: 'Route 66 desert', frag: 'Classic Route 66 desert highway. Open road stretching to infinity. Vintage gas station and motel signs. Americana aesthetic.' },
          { label: 'Italian riviera', frag: 'Winding Italian riviera coastal road. Colorful cliffside villages. Mediterranean blue water. European convertible adventure.' }
        ],
        alt_wardrobes: [
          { label: '1950s retro couple', frag: '1950s aesthetic: he in white tee and leather jacket; she in polka-dot dress and headscarf. Vintage sunglasses. Classic Americana.' },
          { label: 'Modern luxury casual', frag: 'Modern luxury: designer sunglasses, premium polo shirts, tailored shorts. Expensive watches. Contemporary but timeless.' }
        ],
        alt_lightings: [
          { label: 'Desert sunset wide', frag: 'Dramatic desert sunset. Long shadows on highway. Warm amber tones. 35mm, f/2.8.' },
          { label: 'Italian bright midday', frag: 'Bright Mediterranean midday sun. Vivid colors on coastal villages. 35mm, f/4.' }
        ]
      },
      { value: 'skyline', label: 'Midnight Skyline Embrace',
        theme_frag: 'Romantic cinematic close-up of a couple. They lean close, faces inches apart, locked in passionate gaze. One gently cups the others face. City skyline glows through floor-to-ceiling windows behind. Tender intimate expressions.',
        wardrobe_frag: 'Elegant evening attire. Subtle jewelry catches ambient light. Hair styled for formal evening out.',
        scene_frag: 'Opulent high-rise apartment at night. Floor-to-ceiling windows revealing glittering city skyline. Dim candlelight creates intimate warmth inside.',
        lighting_frag: 'Warm candlelight as key light on faces. Cool blue city light as backlight. Extreme shallow depth of field. 85mm, f/1.4.',
        alt_scenes: [
          { label: 'Bridge at midnight', frag: 'On a historic bridge at midnight. River below reflects city lights. Lamppost glow. Romantic European atmosphere.' },
          { label: 'Rain-soaked street', frag: 'Rain-soaked city street at night. Sharing an umbrella. Neon reflections in puddles. Cinematic romance.' }
        ],
        alt_wardrobes: [
          { label: 'Coats and scarves', frag: 'Winter evening: elegant coats, cashmere scarves, leather gloves. Breath visible in cold. Warm, romantic winter night.' },
          { label: 'After-party casual', frag: 'After-party look: he in loosened tie and rolled sleeves; she in his jacket over her dress. Relaxed, intimate, real.' }
        ],
        alt_lightings: [
          { label: 'Bridge lamppost', frag: 'Warm lamppost glow as key. River reflections as fill. 85mm, f/1.4.' },
          { label: 'Neon rain romance', frag: 'Neon signs reflected in rain. Warm street lamp highlights faces. 50mm, f/1.8.' }
        ]
      },
      { value: 'cafe', label: 'Cafe de Flore Date',
        theme_frag: 'Stylish couple seated at outdoor Parisian cafe table sharing a quiet moment. One leans in to whisper while the other laughs. Coffee cups and pastries on marble table. Natural relaxed expressions with warmth and connection.',
        wardrobe_frag: 'Coordinated Parisian chic: tailored coats, scarves, classic accessories. One wears a beret. Both with tasteful sunglasses.',
        scene_frag: 'Classic Parisian sidewalk cafe with wicker chairs, marble tables, green awning. Haussmann buildings and cobblestone streets. Autumn leaves drift.',
        lighting_frag: 'Soft overcast daylight with warm tones. Natural editorial-quality feel. 50mm, f/2.0.',
        alt_scenes: [
          { label: 'Italian piazza', frag: 'Italian piazza cafe with fountain in center. Colorful buildings, cobblestones. Warm Mediterranean afternoon. Espresso and gelato.' },
          { label: 'NYC diner booth', frag: 'Classic NYC diner booth. Neon signs, checkered floor, milkshakes on formica table. Retro Americana charm.' }
        ],
        alt_wardrobes: [
          { label: 'Summer Mediterranean', frag: 'Summer Mediterranean: linen, cotton, straw hats. Light colors. Relaxed, barefoot-ready. Wine glasses on the table.' },
          { label: 'Winter cozy layers', frag: 'Winter cafe: chunky knit sweaters, wool coats, leather boots. Hot chocolate with marshmallows. Cozy and intimate.' }
        ],
        alt_lightings: [
          { label: 'Italian warm sun', frag: 'Warm direct sunlight casting shadows on piazza. Rich Mediterranean colors. 50mm, f/2.0.' },
          { label: 'Diner neon warm', frag: 'Warm neon sign glow mixed with interior diner lighting. Retro feel. 35mm, f/2.0.' }
        ]
      },
      { value: 'vineyard', label: 'Tuscan Vineyard Golden Hour',
        theme_frag: 'Subjects walk through a sun-drenched Tuscan vineyard during golden hour holding wine glasses, laughing together. Rows of grapevines stretch toward distant stone villa. Warm genuine smiles and relaxed joyful energy.',
        wardrobe_frag: 'Elegant relaxed summer attire — linen, cotton, earth tones, whites. Straw hats, delicate jewelry. Bare feet or sandals in grass.',
        scene_frag: 'Rolling Tuscan landscape with green vineyard rows, cypress trees, rustic stone villa on distant hill. Golden hour bathes everything in warm honey light.',
        lighting_frag: 'Rich golden hour backlight creating rim lighting on hair and shoulders. Warm saturated tones. 85mm, f/2.0, dreamy bokeh on vineyard.',
        alt_scenes: [
          { label: 'Rustic cellar tasting', frag: 'Underground wine cellar with barrel rows, stone arches. Candles and wine bottles on oak table. Intimate and warm.' },
          { label: 'Olive grove picnic', frag: 'Ancient olive grove with picnic blanket, cheese, bread, wine. Dappled sunlight through silver-green leaves. Idyllic.' }
        ],
        alt_wardrobes: [
          { label: 'Linen all-white', frag: 'All-white linen outfits. Flowing and relaxed. Sun hats. Gold jewelry catching sunset. Ethereal against green vines.' },
          { label: 'Rustic Italian charm', frag: 'Rustic charm: rolled-sleeve flannels, denim, leather belts, canvas shoes. Wine-stained fingers. Authentic and lived-in.' }
        ],
        alt_lightings: [
          { label: 'Cellar candlelight', frag: 'Warm candlelight in stone cellar. Deep shadows. Rich amber tones on wine and skin. 50mm, f/1.8.' },
          { label: 'Olive grove dappled', frag: 'Soft dappled sunlight through olive branches. Warm, dreamy, pastoral. 85mm, f/2.0.' }
        ]
      },
      { value: 'bonfire', label: 'Beach Bonfire Crew',
        theme_frag: 'A group gathered around a beach bonfire at twilight. Some sit on driftwood logs, others stand. Laughing, talking, holding drinks. Fire crackles between them. Waves visible under dusky sky. Relaxed happy expressions.',
        wardrobe_frag: 'Casual beach-evening style: light jackets, hoodies, rolled-up jeans, blankets over shoulders. Barefoot in the sand.',
        scene_frag: 'Secluded beach at dusk. Roaring bonfire at center. Ocean reflects last sunset in deep purples and oranges. Stars begin to appear overhead.',
        lighting_frag: 'Warm fire as primary light creating flickering highlights on faces. Cool twilight sky as ambient fill. 35mm, f/2.0, all faces lit.',
        alt_scenes: [
          { label: 'Mountain campfire', frag: 'Mountain campsite clearing surrounded by pine trees. Campfire with sparks rising. Tent in background. Star-filled sky above.' },
          { label: 'Lakeside dock sunset', frag: 'Wooden dock on a calm lake at sunset. Feet dangling over water. Mountains reflected in lake. Peaceful golden hour.' }
        ],
        alt_wardrobes: [
          { label: 'Camping adventure', frag: 'Outdoor adventure gear: flannel shirts, hiking boots, beanies, puffer vests. Marshmallow roasting sticks. Rugged and cozy.' },
          { label: 'Beach party colorful', frag: 'Colorful beachwear: Hawaiian shirts, board shorts, sundresses, flower leis. Party atmosphere with tropical drinks.' }
        ],
        alt_lightings: [
          { label: 'Campfire + stars', frag: 'Warm campfire glow on faces. Cool starlight from above. Pine tree silhouettes. 35mm, f/2.0.' },
          { label: 'Lake sunset mirror', frag: 'Golden sunset reflected in calm lake. Warm rim light from behind. 50mm, f/2.0.' }
        ]
      },
      { value: 'fashionweek', label: 'Fashion Week Front Row',
        theme_frag: 'Subjects sit front row at a major fashion show. Model struts runway in blurred background. Camera flashes pop. Subjects are the stars — impeccably dressed, coolly observing, one takes photo on phone. Cool composed celebrity expressions.',
        wardrobe_frag: 'High fashion designer outfits — each in distinct bold look. Statement accessories: oversized sunglasses, designer bags, layered jewelry. Bold fashion-forward makeup.',
        scene_frag: 'Sleek minimalist fashion show venue. White runway with dramatic lighting. Other attendees blurred. Fashion photographers flashes create starburst effects.',
        lighting_frag: 'Bright runway spotlights mixed with camera flashes. Cool white ambient. High-fashion editorial feel. 50mm, f/2.0.',
        alt_scenes: [
          { label: 'Backstage chaos', frag: 'Fashion show backstage. Makeup artists, clothing racks, models preparing. Controlled chaos. Behind-the-scenes energy.' },
          { label: 'After-party VIP', frag: 'Exclusive after-party VIP area. Neon and purple lighting. Velvet seating, champagne towers. Celebrity nightlife.' }
        ],
        alt_wardrobes: [
          { label: 'Avant-garde statement', frag: 'Avant-garde looks: sculptural pieces, unusual silhouettes, metallic fabrics, architectural accessories. Fashion-as-art.' },
          { label: 'Classic designer elegant', frag: 'Classic designer elegance: tailored suits and gowns in black, camel, and ivory. Understated luxury. Less is more.' }
        ],
        alt_lightings: [
          { label: 'Backstage fluorescent', frag: 'Harsh backstage fluorescent and mirror bulbs. Busy energy. 35mm, f/2.8.' },
          { label: 'VIP neon purple', frag: 'Purple and neon party lighting. Warm spotlights on subjects. 50mm, f/1.8.' }
        ]
      }
    ]
  }
},

// ======================================================================
// 3. CINEMA & TV
// ======================================================================
cinema_tv: {
  label: 'Cinema & TV',
  characters: {
    male: [
      { value: 'spy_tuxedo', label: 'Secret Agent Tuxedo',
        theme_frag: 'The subject is the quintessential secret agent entering a high-stakes casino. He adjusts a cufflink while scanning the room with calculated precision. Leaning casually against a surface, relaxed confidence masks deadly training. Cool piercing eye contact.',
        wardrobe_frag: 'Perfectly tailored midnight-blue dinner jacket tuxedo, white wing-collar shirt, black bow tie. Sleek shoulder holster barely visible under jacket. Luxury watch. Polished shoes.',
        scene_frag: 'Upscale Monte Carlo casino. Crystal chandeliers, green felt tables, roulette wheels. Well-dressed patrons blur in background. Rich mahogany and gold finishes.',
        lighting_frag: 'Classic warm casino lighting with crystal chandelier bokeh. Soft spotlight on subject. Film noir influence. 85mm, f/1.4.',
        alt_scenes: [
          { label: 'Rooftop helicopter', frag: 'Atop a skyscraper helipad. Black helicopter behind, rotors spinning. Night city panorama. Wind ruffles hair and jacket.' },
          { label: 'Villain lair escape', frag: 'Industrial villain lair — catwalks, steam pipes, countdown timer on screen. Subject walks calmly toward camera as explosion blooms behind.' }
        ],
        alt_wardrobes: [
          { label: 'Tactical stealth suit', frag: 'All-black tactical suit, web harness, night-vision goggles pushed on forehead. Suppressed pistol in hand. Special ops elegance.' },
          { label: 'Linen resort cover', frag: 'White linen suit, pastel shirt, panama hat. Aviator sunglasses. Tropical cover identity — spying in paradise.' }
        ],
        alt_lightings: [
          { label: 'Helipad night wind', frag: 'Cool blue city light from below. Helicopter spotlight from behind. 35mm, f/2.0.' },
          { label: 'Explosion backlight', frag: 'Warm orange explosion glow from behind. Cool steel-blue industrial ambient. 35mm, f/2.8.' }
        ]
      },
      { value: 'noir_detective', label: 'Film Noir Detective',
        theme_frag: 'The subject sits at a dimly-lit desk in a rain-soaked 1940s detective office. He examines a photograph under a single desk lamp. Venetian blind shadows stripe across face and wall. Cigarette smoke curls from an ashtray. World-weary but sharp detective expression.',
        wardrobe_frag: 'Classic 1940s detective attire: tan trench coat over brown tweed suit vest, loosened tie, rumpled white shirt. Fedora rests on desk. Heavy-soled leather shoes.',
        scene_frag: 'Classic 1940s private detective office. Wooden desk, filing cabinets, rotary phone, whiskey bottle. Rain streaks window. Venetian blinds cast stripe shadows.',
        lighting_frag: 'Classic noir lighting with venetian blind stripe shadows. Warm tungsten desk lamp as key light. Cinematic film grain. 50mm, f/2.0.',
        alt_scenes: [
          { label: 'Rainy alley stakeout', frag: 'Dark 1940s city alley in heavy rain. Brick walls, fire escapes, distant neon. Subject stands under awning watching across street.' },
          { label: 'Smoky jazz club', frag: '1940s jazz club interior. Smoky atmosphere, singer on stage in spotlight, patrons at small tables. Subject sits alone at the bar.' }
        ],
        alt_wardrobes: [
          { label: 'Trench coat street', frag: 'Tan trench coat buttoned up, collar raised, fedora pulled low over eyes. Hands in pockets. Classic noir silhouette in rain.' },
          { label: 'Disheveled late night', frag: 'Shirt sleeves rolled up, tie pulled loose, vest unbuttoned. Suspenders showing. Hair mussed from long night. Whiskey glass in hand.' }
        ],
        alt_lightings: [
          { label: 'Neon rain alley', frag: 'Distant neon sign glow in rain. Single harsh streetlight. Deep shadows. Film grain. 35mm, f/2.0.' },
          { label: 'Jazz club smoky', frag: 'Warm amber stage light through smoke haze. Cool blue background. 85mm, f/1.8.' }
        ]
      },
      { value: 'samurai', label: 'Wandering Samurai',
        theme_frag: 'The subject stands as a lone ronin samurai on a windswept hilltop. Katana drawn, held in both hands in a ready stance. Hair and robes whip in the wind. Rain begins to fall. Expression of fierce determination and honor.',
        wardrobe_frag: 'Traditional dark-indigo kimono and hakama with worn leather armor plates on shoulders and chest. Katana with ornate tsuba guard. Straw sandals. Cloth wrapped around forearms.',
        scene_frag: 'Windswept hilltop overlooking feudal Japanese countryside with rice paddies and distant castle. Cherry blossom trees in full bloom. Dramatic cloudy sky. Petals scatter in wind.',
        lighting_frag: 'Dramatic overcast sky with diffused light. Occasional lightning flash. Desaturated palette with red cherry blossom accent. 50mm, f/2.0.',
        alt_scenes: [
          { label: 'Bamboo forest duel', frag: 'Dense bamboo forest. Shafts of light cut through green canopy. Opponent silhouetted at far end of clearing. Mist at ground level.' },
          { label: 'Burning temple', frag: 'Ancient Japanese temple engulfed in flames behind him. Embers and ash fill the air. He walks away — task complete. Night sky lit by fire.' }
        ],
        alt_wardrobes: [
          { label: 'Straw hat wanderer', frag: 'Simple worn grey robes, straw conical hat (sugegasa) obscuring upper face. Katana at waist. Travel-worn bundle on back. Humble appearance.' },
          { label: 'Shogun war armor', frag: 'Full ornate samurai war armor (yoroi) in red and black lacquer. Horned kabuto helmet under arm. Gold clan crest on chest plate. Battle-ready.' }
        ],
        alt_lightings: [
          { label: 'Bamboo green filter', frag: 'Green-filtered light through bamboo canopy. Mist diffusion. Ethereal calm before battle. 85mm, f/2.0.' },
          { label: 'Temple fire dramatic', frag: 'Warm orange fire glow from behind. Embers as bokeh. Dark silhouette effect. 50mm, f/2.0.' }
        ]
      },
      { value: 'post_apocalypse', label: 'Post-Apocalypse Survivor',
        theme_frag: 'The subject walks through a post-apocalyptic overgrown cityscape carrying a makeshift weapon over one shoulder. A gas mask hangs around his neck. He looks back at camera checking for danger. Expression of fierce intense determination.',
        wardrobe_frag: 'Layered weathered survival gear: torn military jacket over hoodie, cargo pants with duct-tape repairs, heavy boots. Makeshift armor from scavenged materials. Backpack with supplies.',
        scene_frag: 'Abandoned city overgrown with vegetation. Crumbling skyscrapers, rusted vehicles, vines covering everything. Nature reclaiming civilization. Overcast, moody atmosphere.',
        lighting_frag: 'Overcast diffused light through cloud cover. Green tint from overgrowth. Volumetric haze. Desaturated tones. 35mm, f/2.8.',
        alt_scenes: [
          { label: 'Underground bunker', frag: 'Underground survival bunker. Makeshift shelves with canned food, weapons, maps on wall. Single lightbulb swings. Claustrophobic but safe.' },
          { label: 'Desert wasteland', frag: 'Barren desert wasteland with sand-buried highways. Rusted car skeletons half-buried. Harsh sun, dust storms on horizon.' }
        ],
        alt_wardrobes: [
          { label: 'Gas mask tactical', frag: 'Full gas mask on face (transparent visor showing eyes), heavy tactical vest, NBC suit elements. Geiger counter on wrist. Hazmat zone ready.' },
          { label: 'Scavenger merchant', frag: 'Long dusty duster coat over layers. Bandolier of trade goods: watches, batteries, tools. Wide-brimmed hat. Traveling merchant survivor.' }
        ],
        alt_lightings: [
          { label: 'Bunker single bulb', frag: 'Single warm lightbulb as key light. Deep shadows. Claustrophobic atmosphere. 35mm, f/2.0.' },
          { label: 'Desert harsh sun', frag: 'Harsh overhead desert sun. Bleached colors. Heat haze distortion. 50mm, f/2.8.' }
        ]
      },
      { value: 'western', label: 'Spaghetti Western Outlaw',
        theme_frag: 'The subject stands in a dusty frontier town main street at high noon. Classic standoff position: hand hovering over holstered revolver, poncho blown by hot wind. Narrow squinting gaze directly at camera. Iconic extreme close-up composition.',
        wardrobe_frag: 'Weathered brown leather poncho over faded button shirt and vest. Worn cowboy hat, dusty boots with spurs, leather gun belt with silver-buckle holster. Bandana around neck.',
        scene_frag: 'Dusty Old West frontier town. Wooden saloon facades, horse hitching posts, tumbleweed rolling past. Empty main street. Harsh midday sun bleaches everything.',
        lighting_frag: 'Harsh midday overhead sun with deep eye-socket shadows. Bleached desaturated palette with warm amber dust. Extreme close-up, 85mm, f/2.0.',
        alt_scenes: [
          { label: 'Saloon interior', frag: 'Dusty saloon interior. Swinging doors, bar counter, card game interrupted. Patrons frozen mid-action. Piano player stopped. Tension.' },
          { label: 'Canyon horse ride', frag: 'Riding through a dramatic red-rock canyon. Horse at full gallop, dust trailing. Canyon walls tower above. Golden hour.' }
        ],
        alt_wardrobes: [
          { label: 'Black Hat villain', frag: 'All-black outfit: black hat, black duster coat, black leather gloves. Silver revolver visible. The villain archetype. Menacing elegance.' },
          { label: 'Sheriff lawman', frag: 'Clean sheriff outfit: polished badge, crisp shirt, brown leather vest. Well-maintained hat and boots. The law. Righteous posture.' }
        ],
        alt_lightings: [
          { label: 'Saloon warm interior', frag: 'Warm amber interior oil lamp lighting. Dust particles in light beams from windows. 50mm, f/2.0.' },
          { label: 'Canyon golden hour', frag: 'Rich golden hour in canyon. Warm light on red rocks. Long dramatic shadows. 35mm, f/2.8.' }
        ]
      },
      { value: 'pirate', label: 'Pirate Captain Helm',
        theme_frag: 'The subject stands at the helm of a massive pirate galleon during a raging storm. One hand grips the wheel, the other points a cutlass toward the horizon. Coat flies in the gale. Drenched by spray. Wild confident grin of adventure.',
        wardrobe_frag: 'Long dark burgundy captain coat with gold trim and brass buttons over white loose shirt. Leather belt with ornate buckle, tall boots, tricorn hat. Rings on multiple fingers.',
        scene_frag: 'Deck of a wooden pirate ship during violent ocean storm. Massive waves crash against hull, lightning illuminates dark clouds. Sails whip in gale. Crew in background.',
        lighting_frag: 'Dramatic lightning flashes as primary light. Blue-green ocean tones. Lantern on deck creates warm secondary. 35mm, f/2.0.',
        alt_scenes: [
          { label: 'Treasure cave', frag: 'Hidden sea cave filled with gold treasure — coins, goblets, crowns, jewels. Torchlight reflecting off gold. Skull-and-crossbones flag pinned to wall.' },
          { label: 'Tropical island beach', frag: 'Tropical pirate island beach. Ship anchored in bay. Palm trees, treasure map unrolled on barrel. Sunset over paradise cove.' }
        ],
        alt_wardrobes: [
          { label: 'Ghostly undead captain', frag: 'Tattered version of the same coat, spectral blue-green glow through torn fabric. Ghostly pallor. Cursed captain. Eerie undead pirate.' },
          { label: 'Tropical casual pirate', frag: 'Open vest over bare chest, loose cotton pants, bandana, gold earring. Casual island pirate. Cutlass through belt loop. Relaxed but dangerous.' }
        ],
        alt_lightings: [
          { label: 'Treasure cave gold', frag: 'Warm golden torchlight reflecting off treasure. Deep cave shadows. 50mm, f/2.0.' },
          { label: 'Tropical sunset warm', frag: 'Warm tropical sunset. Rich oranges and purples. 50mm, f/2.8.' }
        ]
      },
      { value: 'cyberpunk', label: 'Cyberpunk Hacker',
        theme_frag: 'The subject sits in a dark room surrounded by multiple holographic screens displaying scrolling code. One hand types on floating keyboard, the other holds a neural interface cable. Neon reflections in cybernetic eye implant. Focused, calculating expression.',
        wardrobe_frag: 'Techwear: black cropped tactical jacket with LED piping, dark cargo pants with tech pouches, heavy platform boots. Cybernetic arm implant with visible circuitry. AR visor pushed up on forehead.',
        scene_frag: 'Cramped cyberpunk apartment/workshop. Multiple holographic displays, tangled cables, neon signs outside rain-streaked window. Stack of hardware, energy drink cans, dim chaos.',
        lighting_frag: 'Multiple color neon sources: cyan from screens, magenta from signs, warm amber from soldering iron. 35mm, f/2.0.',
        alt_scenes: [
          { label: 'Night market alley', frag: 'Cyberpunk night market in narrow alley. Neon signs in multiple languages, street food stalls, holographic ads. Crowded, vibrant, dangerous.' },
          { label: 'Corporate tower roof', frag: 'Rooftop of massive corporate megabuilding. Holographic billboards surround. Flying vehicles pass. Rain falls. The city stretches endlessly below.' }
        ],
        alt_wardrobes: [
          { label: 'Street runner combat', frag: 'Armored street runner gear: reinforced jacket, knee guards, combat boots. Glowing data-blade at hip. Neon tattoos visible on neck. Urban mercenary.' },
          { label: 'Corporate infiltrator', frag: 'Sleek corporate suit with hidden tech: data contacts (glowing eyes), nano-weave fabric. Looks executive but packed with hidden tools.' }
        ],
        alt_lightings: [
          { label: 'Night market neon', frag: 'Dense multicolor neon: reds, greens, blues from market signs. Wet reflections. 35mm, f/2.0.' },
          { label: 'Corporate cold blue', frag: 'Cold blue-white holographic billboard light. Rain streaks. Dark atmosphere. 50mm, f/1.8.' }
        ]
      }
    ],
    female: [
      { value: 'femme_fatale', label: 'Femme Fatale Noir',
        theme_frag: 'The subject stands in the doorway of a 1940s nightclub, silhouetted by the smoky interior light. One hand on the door frame, the other holds a cigarette holder. She looks directly at camera with a dangerously alluring gaze. Classic femme fatale presence.',
        wardrobe_frag: 'Curve-hugging black satin dress with dramatic slit. Fur stole draped over one shoulder. Pearl choker, long satin gloves, deep red lipstick. Veronica Lake-style hair wave over one eye.',
        scene_frag: 'Entrance to a smoky 1940s jazz club. Art-deco details, velvet curtains, ambient smoke haze. Jazz musicians visible in background. Noir atmosphere.',
        lighting_frag: 'Classic noir low-key lighting. Single warm spotlight from above creates long shadows. Film grain. 85mm, f/1.8.',
        alt_scenes: [
          { label: 'Penthouse window', frag: 'Penthouse apartment at night. She stands at window overlooking rainy city. Venetian blind shadows on wall. Glass of wine on sill.' },
          { label: 'Train platform goodbye', frag: '1940s train station platform. Steam locomotive behind. Foggy. She waits with a small suitcase. Departure moment. Melancholic.' }
        ],
        alt_wardrobes: [
          { label: 'Red dress danger', frag: 'Bold red satin dress with matching red lipstick and nails. Black heels. The red dress signaling danger and attraction. Iconic.' },
          { label: 'Trench coat mystery', frag: 'Tan trench coat belted at waist over dark dress. Wide-brimmed hat casting shadow over eyes. Mystery and intrigue personified.' }
        ],
        alt_lightings: [
          { label: 'Venetian blind stripes', frag: 'Venetian blind shadow stripes across face and body. Warm amber key light. 85mm, f/1.4.' },
          { label: 'Steam locomotive haze', frag: 'Warm lamp light through steam haze. Platform lights create bokeh. 50mm, f/2.0.' }
        ]
      },
      { value: 'scifi_commander', label: 'Sci-Fi Commander',
        theme_frag: 'The subject stands on the bridge of a massive starship, one hand resting on the command console. Through the viewport, a planet looms large. She surveys the situation with authority. Calm, decisive, commanding expression.',
        wardrobe_frag: 'Sleek dark-navy uniform with silver rank insignia on collar, fitted jacket with metallic piping. Leather boots. Communicator pin on chest. Hair in practical but elegant updo.',
        scene_frag: 'Starship command bridge. Panoramic viewport showing planet and stars. Holographic tactical displays. Crew at stations in background. Advanced technology everywhere.',
        lighting_frag: 'Cool blue ambient from displays and viewport. Warm console key lights on face. Cinematic sci-fi atmosphere. 50mm, f/2.0.',
        alt_scenes: [
          { label: 'Alien planet surface', frag: 'Alien planet surface with unusual colored sky, strange rock formations, two moons visible. She leads an away team. Harsh alien light.' },
          { label: 'Space station window', frag: 'Observation deck of a space station. Massive curved window showing Earth below. Stars visible. Alone, contemplative, floating above the world.' }
        ],
        alt_wardrobes: [
          { label: 'Away team armor', frag: 'Tactical away-team armor over uniform. Helmet under arm, phaser at hip. Dusty and field-worn. Ready for ground combat.' },
          { label: 'Formal dress uniform', frag: 'White formal dress uniform with medals, gold sash, ceremonial sword. Diplomatic event or promotion ceremony look.' }
        ],
        alt_lightings: [
          { label: 'Alien planet dual moons', frag: 'Unusual colored alien light — blue-green ambient. Two moon sources. Harsh and otherworldly. 35mm, f/2.8.' },
          { label: 'Earth-glow station', frag: 'Blue-white Earth-glow through massive window. Stars as backlight. 85mm, f/2.0.' }
        ]
      },
      { value: 'action_heroine', label: 'Action Heroine Getaway',
        theme_frag: 'The subject runs through an industrial zone during a high-speed chase sequence. Mid-stride, hair flying, she looks over her shoulder at pursuing danger. One hand grabs a chain-link fence to vault over. Dynamic frozen-motion composition. Fierce survival instinct expression.',
        wardrobe_frag: 'Practical action outfit: fitted leather jacket, dark tank top, tactical pants, combat boots. Minor battle damage — dust, small cuts. Hair tied back, escaping strands.',
        scene_frag: 'Industrial zone at night — shipping containers, warehouses, chain-link fences. Headlights from pursuing vehicles illuminate dust. Sparks fly from nearby.',
        lighting_frag: 'Harsh directional headlights from behind as dramatic backlight. Cool blue industrial ambient. Frozen motion detail. 35mm, f/2.0.',
        alt_scenes: [
          { label: 'Rooftop parkour', frag: 'Rooftop chase across multiple buildings. Mid-leap between rooftops. City lights far below. Night sky. Adrenaline and height.' },
          { label: 'Market chase', frag: 'Crowded street market chase. Knocking over fruit stands, weaving through crowds. Colorful market stalls blur with motion.' }
        ],
        alt_wardrobes: [
          { label: 'Motorcycle biker', frag: 'Leather motorcycle outfit: armored jacket, riding pants, boots, gloves. Helmet under arm. Motorcycle visible behind. Speed and rebellion.' },
          { label: 'Undercover elegant', frag: 'Torn evening dress from a gala gone wrong. One heel broken (carrying it), running barefoot. Elegant turned action heroine.' }
        ],
        alt_lightings: [
          { label: 'Rooftop city glow', frag: 'City light pollution as ambient glow from below. Cool blue night sky above. 24mm wide-angle, f/2.8.' },
          { label: 'Market colorful chaos', frag: 'Warm market lantern lights in reds and yellows. Motion blur on crowds. 35mm, f/2.0.' }
        ]
      },
      { value: 'queen_medieval', label: 'Medieval Queen Throne',
        theme_frag: 'The subject sits on a massive stone throne in a medieval great hall. She holds a jeweled scepter and gazes directly at camera with unwavering sovereign authority. Fire from the great hearth casts dancing shadows. Regal, powerful, unquestionable expression.',
        wardrobe_frag: 'Rich burgundy and gold medieval gown with wide sleeves, ornate embroidery, jeweled belt. Heavy golden crown with rubies. Fur-trimmed ermine mantle over shoulders. Rings and bracelets.',
        scene_frag: 'Medieval stone great hall. Massive hearth with roaring fire, tapestries on walls, stone columns, torchlight. Throne on raised dais. Banner with royal crest above.',
        lighting_frag: 'Warm firelight and torchlight creating rich chiaroscuro. Gold tones on metal and jewelry. 85mm, f/1.8.',
        alt_scenes: [
          { label: 'Castle battlements', frag: 'Castle battlement walls overlooking kingdom. Rolling green landscape, village in distance. Wind blows banners. She surveys her realm at dawn.' },
          { label: 'War council tent', frag: 'Royal war tent with strategy map on table, armor stands, sword rack. She stands at the map directing the battle. Candlelight.' }
        ],
        alt_wardrobes: [
          { label: 'Battle queen armor', frag: 'Polished silver plate armor over chainmail with royal tabard. Crown integrated into helm held at side. Sword at hip. Warrior queen.' },
          { label: 'Coronation whites', frag: 'White and silver coronation gown with extremely long train. Diamond and pearl tiara. White fur cape. Newly crowned, pristine and divine.' }
        ],
        alt_lightings: [
          { label: 'Dawn battlement', frag: 'Soft cool dawn light from horizon. Wind effects on banner. 50mm, f/2.0.' },
          { label: 'War tent candlelight', frag: 'Warm candlelight from below on face. Map lit by candles. Intimate and strategic. 50mm, f/2.0.' }
        ]
      },
      { value: 'dystopia_rebel', label: 'Dystopia Rebel Leader',
        theme_frag: 'The subject stands defiantly at the front of a rebel force, fist raised. Behind her, a massive crowd fills a ruined city plaza. She stands on rubble above them. Wind whips torn banner she holds. Fierce, passionate, revolutionary expression.',
        wardrobe_frag: 'Practical rebel combat outfit: reinforced jacket with patches and insignia, combat boots, cargo pants. Red armband of the rebellion. Bow slung over back. Hair braided for battle.',
        scene_frag: 'Ruined totalitarian city plaza. Massive crumbling propaganda screens. Rebel crowds with torches and signs. Smoke and ash in air. Dawn breaking over the revolution.',
        lighting_frag: 'Dramatic dawn backlight through smoke and ash. Warm orange-gold rim lighting. Cool blue shadows. 35mm, f/2.8.',
        alt_scenes: [
          { label: 'Underground hideout', frag: 'Underground rebel hideout in old subway station. Maps on walls, radio equipment, weapons cache. Dim lightbulbs string overhead. Planning the uprising.' },
          { label: 'Forest camp', frag: 'Hidden forest rebel camp. Tents, campfires, training areas. Tall trees provide cover. Mist in morning air. Nature as sanctuary.' }
        ],
        alt_wardrobes: [
          { label: 'Captured arena gear', frag: 'Arena survival outfit: sleek bodysuit with district number, minimal tactical gear. Hair styled dramatically. Forced to fight but refusing to break.' },
          { label: 'Formal political rebel', frag: 'Subversive formal outfit: elegant dress with hidden rebel insignia, concealed weapons. Playing the political game at a state event.' }
        ],
        alt_lightings: [
          { label: 'Underground dim', frag: 'Dim lightbulb and radio screen glow. Cool concrete ambient. Intimate and covert. 35mm, f/2.0.' },
          { label: 'Forest morning mist', frag: 'Soft misty morning forest light. Campfire warm glow. Green canopy filter. 50mm, f/2.0.' }
        ]
      },
      { value: 'vampire', label: 'Vampire Countess',
        theme_frag: 'The subject sits on a throne of dark wood in a Gothic castle. A crystal goblet of deep crimson liquid in one hand. She looks at camera with seductive and dangerous expression. Long flowing hair, pale flawless skin, hint of fangs. Aristocratic and lethal.',
        wardrobe_frag: 'Black velvet Victorian gown with deep neckline, red satin lining visible. Blood-red ruby choker. Long black lace gloves. Dark crimson lipstick. Subtle gothic makeup.',
        scene_frag: 'Gothic castle interior. Massive stone fireplace, oil paintings in gilded frames, heavy velvet drapes, candelabras with dripping candles. Moon visible through arched window.',
        lighting_frag: 'Warm candlelight from multiple candelabras. Cool blue moonlight through window. Rich warm-cool contrast. 85mm, f/1.4.',
        alt_scenes: [
          { label: 'Moonlit graveyard', frag: 'Ancient graveyard under full moon. Gothic tombstones, mist rolling across ground, dead trees. She stands among the graves. Supernatural atmosphere.' },
          { label: 'Opera balcony', frag: 'Private box at a grand opera house. Red velvet seats, golden railings. Performance below. She watches from the shadows. Aristocratic night out.' }
        ],
        alt_wardrobes: [
          { label: 'Modern vampire chic', frag: 'Modern take: sleek black pantsuit, blood-red stilettos, dark sunglasses at night. Contemporary vampire hiding in plain sight. Dangerous sophistication.' },
          { label: 'White bridal vampire', frag: 'White Victorian wedding dress stained with crimson. Veil flowing. Roses (red and dead) in hand. The eternal bride. Hauntingly beautiful.' }
        ],
        alt_lightings: [
          { label: 'Full moon graveyard', frag: 'Cool blue-white full moonlight. Mist diffusion. Supernatural glow. 50mm, f/2.0.' },
          { label: 'Opera warm gold', frag: 'Warm golden opera house lighting. Crystal chandelier reflections. 85mm, f/1.8.' }
        ]
      },
      { value: 'cyberpunk_f', label: 'Cyberpunk Street Runner',
        theme_frag: 'The subject walks through a neon-drenched rain-soaked cyberpunk alley. Holographic ads flicker around her. She adjusts a neural interface on her temple while looking at camera with defiant confidence. Neon light reflects off wet skin and cybernetic implants.',
        wardrobe_frag: 'Techwear crop jacket in iridescent fabric, high-waisted tactical pants, platform boots with LED soles. Glowing circuit tattoos visible on arms. Neon-colored hair streaks.',
        scene_frag: 'Narrow cyberpunk alley with dense neon signage, holographic advertisements, steam vents. Puddles reflect all colors. Vendors and shadows in periphery.',
        lighting_frag: 'Dense multicolor neon — pink, cyan, purple — reflecting off wet surfaces. Atmospheric rain and steam. 35mm, f/2.0.',
        alt_scenes: [
          { label: 'Underground club', frag: 'Cyberpunk underground club. Pulsing LED lights, floating holographic DJ, crowd silhouettes. Bass-heavy atmosphere visible in vibrating surfaces.' },
          { label: 'Megabuilding balcony', frag: 'Balcony on 200th floor of a megabuilding. City stretches infinitely below. Flying vehicles pass at eye level. Rain falls upward near the building.' }
        ],
        alt_wardrobes: [
          { label: 'Netrunner bodysuit', frag: 'Sleek black netrunner bodysuit with glowing data lines. Neural interface ports visible on spine and temples. Data gloves. Full tech immersion.' },
          { label: 'Punk rocker rebel', frag: 'Cyberpunk rebellion style: torn band tee, spiked leather jacket, ripped fishnets, heavy boots. Neon mohawk. Anti-corporate punk.' }
        ],
        alt_lightings: [
          { label: 'Club pulsing LED', frag: 'Pulsing purple and blue LED club lights. Strobe freeze effect. 24mm wide-angle, f/2.8.' },
          { label: 'High altitude wind', frag: 'Cold blue city glow from below. Warm apartment light behind. Wind and rain. 50mm, f/1.8.' }
        ]
      }
    ],
    couple_group: [
      { value: 'heist_crew', label: 'Heist Crew Vault',
        theme_frag: 'Subjects stand inside an open bank vault, bags of cash at their feet. They pose confidently with tools of the trade: one cracks knuckles, another adjusts ski mask on forehead. All smirk with the thrill of success. Cool, collected, dangerous.',
        wardrobe_frag: 'Matching black tactical outfits with individual flair: one in leather, another in techwear, another in suit. Ski masks pushed up on foreheads. Gloves, earpieces.',
        scene_frag: 'Massive bank vault interior. Safe deposit boxes line walls. Bags of cash and gold bars. Lasers deactivated. Alarm lights flash red.',
        lighting_frag: 'Cool white vault lighting mixed with red alarm flash. Dramatic cinematic feel. 35mm, f/2.8, all subjects sharp.',
        alt_scenes: [
          { label: 'Getaway rooftop', frag: 'Rooftop getaway — helicopter landing behind them. City lights below. They run toward extraction. Night, wind, urgency.' },
          { label: 'Planning room', frag: 'Warehouse planning room. Blueprint pinned to wall, photos of target, model of building. Dim overhead light. Pre-heist tension.' }
        ],
        alt_wardrobes: [
          { label: 'Disguised as workers', frag: 'Matching maintenance worker uniforms over their real outfits. Hard hats, clipboards. The disguise before the reveal.' },
          { label: 'Post-heist casual', frag: 'Celebrating post-heist in casual clothes at a beach bar. Hawaiian shirts, cocktails, sunglasses. Money bags under the table. Living large.' }
        ],
        alt_lightings: [
          { label: 'Helicopter searchlight', frag: 'Helicopter spotlight from above sweeping. Cool blue night. Dynamic and urgent. 24mm, f/2.8.' },
          { label: 'Dim warehouse plan', frag: 'Single overhead lamp on blueprint table. Deep shadows. Tense preparation mood. 35mm, f/2.0.' }
        ]
      },
      { value: 'zombie_survivors', label: 'Zombie Apocalypse Survivors',
        theme_frag: 'Group of survivors stands back-to-back on a barricaded rooftop, weapons ready. Below, the city is overrun. They are humanity last hope. Each faces a different direction, scanning for threats. Exhausted but determined expressions.',
        wardrobe_frag: 'Mixed improvised survival gear: leather, military surplus, sports armor. Each has unique weapon: bat, crossbow, machete, shotgun. Dirty, bloodied, battle-worn.',
        scene_frag: 'Rooftop of a barricaded building. Makeshift barriers of furniture and barbed wire. Burning city visible in all directions. Smoke columns rise. Dusk.',
        lighting_frag: 'Warm fire glow from burning city below. Cool dusk sky. Dramatic low-angle. 24mm wide-angle, f/2.8.',
        alt_scenes: [
          { label: 'Abandoned mall', frag: 'Inside an abandoned shopping mall. Storefronts dark, escalators stopped. Makeshift camp in food court. Eerie silence. Barricades at entrances.' },
          { label: 'Forest safe zone', frag: 'Forest clearing safe zone. Fence perimeter, guard towers, tents. Survivors training and farming. A new beginning. Hopeful but vigilant.' }
        ],
        alt_wardrobes: [
          { label: 'Hazmat and military', frag: 'Mix of hazmat suits and military gear. Gas masks, NBC equipment. The outbreak is chemical. More clinical, more terrifying.' },
          { label: 'Makeshift armor heroes', frag: 'Improvised armor from sports gear: football pads, hockey masks, bike helmets. Duct-tape reinforcements. Creative and desperate.' }
        ],
        alt_lightings: [
          { label: 'Mall emergency lights', frag: 'Emergency red backup lights in dark mall. Flashlight beams. Eerie abandoned atmosphere. 35mm, f/2.0.' },
          { label: 'Forest morning hope', frag: 'Soft morning light through trees. Misty, peaceful. Campfire smoke. 35mm, f/2.8.' }
        ]
      },
      { value: 'starship_bridge', label: 'Starship Bridge Crew',
        theme_frag: 'Subjects pose as an elite starship crew on the bridge of their vessel. Captain in center chair, pilot and navigator at forward consoles, others at tactical stations. Through the viewport: a planet and stars. Professional confident poses.',
        wardrobe_frag: 'Matching futuristic Starfleet-style uniforms in department colors: gold command, blue science, red operations. Clean, fitted, professional with rank insignia.',
        scene_frag: 'Sleek starship bridge. Panoramic viewport showing space. Holographic displays, smooth panels, ambient lighting. Advanced clean sci-fi aesthetic.',
        lighting_frag: 'Cool blue-white ambient from displays and viewport. Warm console glow on faces. Clean futuristic atmosphere. 35mm, f/4.',
        alt_scenes: [
          { label: 'Transporter room', frag: 'Transporter room mid-beam. Subjects materializing with sparkle effect. Operator at console. Dramatic moment of arrival.' },
          { label: 'Engineering core', frag: 'Engineering section with massive glowing warp core. Blue energy pulses. Crew works on consoles. Industrial sci-fi aesthetic.' }
        ],
        alt_wardrobes: [
          { label: 'Away team tactical', frag: 'Away team field uniforms: armored versions of standard uniforms. Utility belts, phaser holsters. Ready for planet surface. Practical.' },
          { label: 'Dress uniform ceremony', frag: 'Formal dress uniforms: white with gold trim, medals. Ceremonial setting. Graduation or promotion event. Polished and proud.' }
        ],
        alt_lightings: [
          { label: 'Transporter sparkle', frag: 'Blue-white transporter energy glow. Sparkling particle effect as primary light. 35mm, f/2.8.' },
          { label: 'Warp core blue pulse', frag: 'Pulsing blue warp core glow. Industrial warm secondary. 35mm, f/2.8.' }
        ]
      },
      { value: 'medieval_party', label: 'Medieval Feast',
        theme_frag: 'Group seated at a long wooden banquet table in a medieval great hall. Goblets raised in a toast, roast meat and bread on table. Joyful celebration with laughter and camaraderie. Warm firelit atmosphere.',
        wardrobe_frag: 'Various medieval attire: nobles in rich fabrics and furs, warriors in leather and chainmail, scholars in robes. Each with distinct personality through clothing.',
        scene_frag: 'Grand medieval great hall. Long oak table laden with food and drink. Stone walls with tapestries and mounted weapons. Massive fireplace roaring. Torches on walls.',
        lighting_frag: 'Warm golden firelight and torchlight. Rich shadows. Painterly Renaissance quality. 35mm, f/2.8.',
        alt_scenes: [
          { label: 'Tournament field', frag: 'Medieval tournament grounds. Jousting lanes, colorful tents with banners, cheering crowds. Subjects in the royal viewing box. Festive atmosphere.' },
          { label: 'Castle courtyard', frag: 'Castle courtyard celebration. Musicians play, dancers perform, market stalls. Subject group watches from a stone balcony above. Fairy-tale setting.' }
        ],
        alt_wardrobes: [
          { label: 'Full armor knights', frag: 'Full plate armor sets with heraldic tabards over metal. Helmets under arms, swords at sides. Knights of the round table aesthetic.' },
          { label: 'Peasant tavern crew', frag: 'Simple peasant clothes: tunics, aprons, leather. At a tavern table. Ale mugs, dice game. Earthy, humble, fun. Common folk celebrating.' }
        ],
        alt_lightings: [
          { label: 'Tournament daylight', frag: 'Bright daylight with colorful tent reflections. Festive atmosphere. 50mm, f/4.' },
          { label: 'Courtyard lanterns', frag: 'Warm lantern light mixing with twilight. Fairy-tale quality. 35mm, f/2.0.' }
        ]
      },
      { value: 'mafia', label: 'Mafia Family Portrait',
        theme_frag: 'Dark cinematic group portrait. Subjects seated and standing around a dimly lit office desk. Central figure seated behind desk, others flanking. Everyone in power poses. The family business. Serious, intimidating expressions.',
        wardrobe_frag: 'Italian suits in dark colors: black, charcoal, navy. White shirts, silk ties. Some with pinstripes. Gold rings, cufflinks. One wears fur collar coat. Power and wealth.',
        scene_frag: 'Dark wood-paneled office. Leather chairs, crystal decanters on desk, cigar smoke haze. Framed photos on wall. Venetian blinds filter minimal light.',
        lighting_frag: 'Classic Godfather lighting: single overhead practical lamp on desk. Deep shadows everywhere else. Warm amber. 50mm, f/2.0.',
        alt_scenes: [
          { label: 'Italian restaurant back room', frag: 'Back room of Italian restaurant. Red and white checkered tablecloth, wine bottles, pasta dishes. Private meeting in plain sight.' },
          { label: 'Warehouse showdown', frag: 'Empty warehouse. Single hanging bulb. Subjects stand in a line facing camera. Someone is about to be made or unmade. Tension.' }
        ],
        alt_wardrobes: [
          { label: 'Old country vintage', frag: 'Old-country Sicilian style: 1920s suits, flat caps, suspenders. Vintage sepia tone. The original generation. Classic Corleone.' },
          { label: 'Modern crime lords', frag: 'Modern designer suits: slim-fit, fashion-forward. Expensive watches, designer shoes. The new generation. Same power, updated look.' }
        ],
        alt_lightings: [
          { label: 'Restaurant warm ambient', frag: 'Warm Italian restaurant ambiance. Candle on table. Wine-red tones. 50mm, f/2.0.' },
          { label: 'Warehouse single bulb', frag: 'Single harsh bulb from above. Deep hard shadows. Cold concrete ambient. 35mm, f/2.0.' }
        ]
      },
      { value: 'time_travelers', label: 'Time Travelers',
        theme_frag: 'Two subjects step out of a glowing time portal. One looks back at what they are leaving, the other looks forward at where they are arriving. Portal crackles with electricity. Mixed eras visible through the portal. Amazement and determination.',
        wardrobe_frag: 'Anachronistic mix: one in futuristic jumpsuit with tech accessories, the other in Victorian-era clothing. Both with steampunk-inspired time devices on wrists.',
        scene_frag: 'The portal connects two eras: behind is a Victorian street, ahead is a futuristic city. The swirling energy gateway between them. Time debris (clocks, gears, data) orbits the portal.',
        lighting_frag: 'Blue-white portal energy as primary light. Warm Victorian amber on one side, cool futuristic blue on the other. 35mm, f/2.0.',
        alt_scenes: [
          { label: 'Dinosaur era jungle', frag: 'Emerging into a prehistoric jungle. Dinosaurs visible through trees. Lush primeval vegetation. The travelers look stunned. Wrong era.' },
          { label: 'Space station future', frag: 'Arriving on a space station in far future. Sleek white corridors, robots, holographic guides. Everything clean and advanced.' }
        ],
        alt_wardrobes: [
          { label: 'Both futuristic', frag: 'Both in matching futuristic time-agent uniforms. Sleek silver suits with temporal tech embedded. Holographic wrist displays showing timeline.' },
          { label: 'Historical costumes', frag: 'Each wearing clothing from a different historical era they visited: one Egyptian, one Roman, one Wild West. Accumulated souvenirs from time jumps.' }
        ],
        alt_lightings: [
          { label: 'Prehistoric warm', frag: 'Warm golden prehistoric sunlight. Lush green vegetation glow. 35mm, f/2.8.' },
          { label: 'Station clean white', frag: 'Clean white futuristic station lighting. Cool blue accents. 35mm, f/4.' }
        ]
      },
      { value: 'pirate_crew', label: 'Pirate Crew Adventure',
        theme_frag: 'Pirate crew on the deck of their ship, treasure map unrolled between them. Captain points to X on the map. Others crowd around with excitement. Ship rocks on ocean waves. Adventurous, rowdy, excited expressions.',
        wardrobe_frag: 'Various pirate attire: captain in long coat and hat, first mate in striped shirt and bandana, others in vests, sashes, bandanas. Mix of elegant and rugged.',
        scene_frag: 'Pirate ship main deck. Masts and rigging above. Tropical island visible on horizon. Golden sunset. Ship creaks and rocks on gentle seas.',
        lighting_frag: 'Warm golden sunset light from horizon. Rich amber on wood and metal. Adventure movie aesthetic. 35mm, f/2.8.',
        alt_scenes: [
          { label: 'Treasure island dig', frag: 'Beach of a treasure island. Digging a hole. Treasure chest partially unearthed. Palms, parrots, white sand. X marks the spot.' },
          { label: 'Port tavern celebration', frag: 'Rowdy port tavern. Tables overturned from celebration. Rum bottles, cards, gold coins scattered. Music and chaos. The spoils of adventure.' }
        ],
        alt_wardrobes: [
          { label: 'Undercover navy', frag: 'Pirates disguised in stolen Royal Navy uniforms. Ill-fitting, comically mismatched ranks. Trying to look official while clearly failing.' },
          { label: 'Ghostly cursed crew', frag: 'Cursed pirate forms: spectral blue glow through tattered clothing. Skeletal features visible under moonlight. The undead crew sail forever.' }
        ],
        alt_lightings: [
          { label: 'Beach sunny dig', frag: 'Bright tropical sun. Warm white sand reflection. Vivid blues and greens. 35mm, f/4.' },
          { label: 'Tavern lantern chaos', frag: 'Warm oil lantern tavern light. Fire hearth glow. Rowdy atmosphere. 35mm, f/2.0.' }
        ]
      }
    ]
  }
},

// ======================================================================
// 4. 3D ANIMATION & TOON
// ======================================================================
animation_toon: {
  label: '3D Animation & Toon',
  characters: {
    male: [
      { value: 'pixar_hero', label: 'Pixar-Style Hero',
        theme_frag: 'Pixar-quality 3D render of the subject as an animated adventure hero. Stylized proportions: slightly larger head, expressive eyes, athletic build. He stands heroically on a cliff edge, fist on hip, wind in hair. Big confident grin.',
        wardrobe_frag: 'Colorful adventure outfit: fitted blue vest over white tee, brown cargo pants, red hiking boots. Utility belt with gadgets. Fingerless gloves. Hair styled with animated bounce.',
        scene_frag: 'Lush Pixar-style landscape: floating islands connected by rope bridges, vibrant waterfall, luminous flowers. Bright saturated colors. Whimsical and epic.',
        lighting_frag: 'Bright even Pixar studio lighting. Warm sun with soft blue sky fill. Clean shadows. Subsurface scattering on skin. 50mm equivalent.',
        alt_scenes: [
          { label: 'Animated city rooftop', frag: 'Pixar-style cartoon city rooftop. Colorful buildings with exaggerated shapes. Sunset sky in warm pinks and oranges.' },
          { label: 'Underwater kingdom', frag: '3D animated underwater kingdom. Coral castles, bioluminescent fish, bubble columns. Vibrant turquoise and purple.' }
        ],
        alt_wardrobes: [
          { label: 'Space ranger suit', frag: 'Pixar-style space ranger suit: white with green and purple accents. Bubble helmet open. Jetpack on back. Star command badge.' },
          { label: 'Casual hero hoodie', frag: 'Casual animated style: graphic hoodie, jeans, sneakers. Backpack with mysterious glowing artifact peeking out. Everyday hero.' }
        ],
        alt_lightings: [
          { label: 'Sunset rooftop warm', frag: 'Warm sunset pinks and oranges. Soft Pixar shadows. 50mm equivalent.' },
          { label: 'Underwater bioluminescent', frag: 'Bioluminescent blue-green glow. Light rays from surface above. Dreamlike underwater. 35mm equivalent.' }
        ]
      },
      { value: 'anime_warrior', label: 'Anime Warrior Prince',
        theme_frag: 'The subject as a dramatic anime warrior in 2D cel-shaded art style. Dynamic wind-swept pose with massive ornate sword planted in ground. Hair flows dramatically. Speed lines in background suggest power. Determined fierce anime expression.',
        wardrobe_frag: 'Stylized anime armor: elaborate shoulder guards, flowing half-cape, belt with magical emblem. White and blue color scheme with gold accents. Ornate greatsword with glowing runes.',
        scene_frag: 'Anime-style cliff overlooking vast fantasy kingdom. Dramatic cloudy sky with speed-line effects. Cherry blossoms scatter in wind. Crystal castle in far distance.',
        lighting_frag: 'Dramatic anime backlight creating character halo. Bold shadows, vibrant saturated colors. Cel-shaded lighting style.',
        alt_scenes: [
          { label: 'Arena tournament', frag: 'Anime arena tournament. Massive crowd cheering. He faces a shadowy opponent across the ring. Energy aura building.' },
          { label: 'Training dojo', frag: 'Traditional Japanese dojo interior but anime-stylized. Wooden floors, sliding paper doors. Morning light streams in. Training pose.' }
        ],
        alt_wardrobes: [
          { label: 'School uniform hero', frag: 'Japanese school uniform that is secretly enchanted: blazer with hidden armor plates, tie that transforms into weapon. Dual identity.' },
          { label: 'Dark form power-up', frag: 'Dark transformation: black and red armor, glowing red eyes, shadow aura. Evil power mode but still heroic. Anti-hero aesthetic.' }
        ],
        alt_lightings: [
          { label: 'Arena spotlight', frag: 'Bright arena spotlights with crowd darkness. Energy aura glow. Dramatic anime contrast.' },
          { label: 'Dojo morning', frag: 'Soft morning light through paper screens. Warm, peaceful, training montage mood.' }
        ]
      },
      { value: 'toon_villain', label: 'Cartoon Supervillain',
        theme_frag: 'Classic 3D animated supervillain portrait. Exaggerated proportions: tall, angular, dramatically posed. He strokes chin while plotting, one eyebrow raised. Behind him, an absurd doomsday device glows. Evil genius smirk with theatrical flair.',
        wardrobe_frag: 'Over-the-top villain outfit: purple cape with high collar, dark bodysuit with lightning bolt emblem, pointed boots, evil crown tilted rakishly. Control gauntlet on one hand.',
        scene_frag: 'Inside a cartoon villain lair: massive screens showing "PLAN A", bubbling chemicals, minion creatures rushing about, countdown timer. Exaggerated evil technology.',
        lighting_frag: 'Dramatic underlighting in green and purple. Doomsday device glow. Exaggerated cartoon shadows for menace.',
        alt_scenes: [
          { label: 'Volcano island base', frag: 'Cartoon volcano island lair: skull-shaped entrance, shark tank, rocket silo visible. He stands on observation deck overlooking it all.' },
          { label: 'Hero confrontation', frag: 'Face-to-face with the hero in a destroyed city. Both in power poses. Classic good vs evil standoff. City splits between them.' }
        ],
        alt_wardrobes: [
          { label: 'Mad scientist coat', frag: 'White lab coat (stained and singed), wild goggles on forehead, rubber gloves. Pockets full of strange devices. Mad inventor villain.' },
          { label: 'CEO villain suit', frag: 'Sleek black business suit villain. Corporate evil. Cat on lap. Swivel chair. Chrome and glass office. The sophisticated antagonist.' }
        ],
        alt_lightings: [
          { label: 'Volcano lair orange', frag: 'Warm lava orange glow from below. Cool tech blue screens. Cartoon menace atmosphere.' },
          { label: 'Showdown dramatic', frag: 'Split lighting: warm hero side vs cold villain side. Dramatic central clash. Bold cartoon contrast.' }
        ]
      },
      { value: 'claymation', label: 'Claymation Character',
        theme_frag: 'Stop-motion claymation-style render. The subject has visible clay texture, slightly rough surface, exaggerated features. He walks mid-stride through a miniature set, arms swinging. Charming, handcrafted, whimsical expression.',
        wardrobe_frag: 'Hand-sculpted clay clothes: knitted sweater with visible texture, corduroy pants, little boots. All with visible fingerprint marks in the clay. Imperfectly perfect.',
        scene_frag: 'Miniature claymation village: tiny houses, cotton-ball trees, felt grass, paper clouds on sticks. Everything clearly handmade. Stop-motion set charm.',
        lighting_frag: 'Soft warm studio lighting typical of stop-motion. Visible miniature light stands at edges. Handcrafted aesthetic.',
        alt_scenes: [
          { label: 'Clay kitchen', frag: 'Miniature claymation kitchen. Tiny clay pots and pans, felt vegetables, wire utensils. Subject cooking with exaggerated animated gestures.' },
          { label: 'Space clay adventure', frag: 'Claymation space scene: clay rocket, felt stars, cotton-ball nebulas. Subject in clay spacesuit floating. Adorable and creative.' }
        ],
        alt_wardrobes: [
          { label: 'Clay detective', frag: 'Clay trench coat and tiny fedora. Magnifying glass in hand. Wallace & Gromit inspired detective outfit. Endearing and British.' },
          { label: 'Clay superhero', frag: 'Miniature clay superhero suit with tiny cape. Oversized emblem on chest. Heroic pose but adorably small and clay-like.' }
        ],
        alt_lightings: [
          { label: 'Tiny kitchen warm', frag: 'Warm miniature kitchen lighting. Oven glow. Handcrafted cozy atmosphere.' },
          { label: 'Space dark stars', frag: 'Dark space background with warm ship interior light. Cotton stars glow. Whimsical.' }
        ]
      },
      { value: 'disney_prince', label: 'Disney-Style Prince',
        theme_frag: 'Classic Disney 3D animation style. The subject as a charming prince in a magical kingdom. He extends one hand toward the viewer in an invitation. Sparkles and magic dust float around. Warm genuine Disney smile with bright expressive eyes.',
        wardrobe_frag: 'Regal but youthful prince outfit: white military-style jacket with gold epaulettes and braiding, dark pants, polished boots. Red sash across chest. Small golden crown.',
        scene_frag: 'Enchanted Disney castle courtyard. Rose gardens, fountain with magical water, twinkling fairy lights. Castle towers sparkle in background. Twilight sky with first stars.',
        lighting_frag: 'Magical Disney golden-hour glow. Sparkle particle effects. Warm, dreamy, idealized lighting.',
        alt_scenes: [
          { label: 'Enchanted forest', frag: 'Disney enchanted forest. Talking animal friends peek from behind trees. Magical flowers glow. Sunbeams create god-rays through canopy.' },
          { label: 'Ballroom dance', frag: 'Grand Disney ballroom. Crystal chandeliers, marble floors, flowing curtains. He stands at center ready for the dance. Magical atmosphere.' }
        ],
        alt_wardrobes: [
          { label: 'Adventure prince', frag: 'Adventure outfit: leather vest over white shirt, boots, belt with sword. Hair slightly tousled. More rugged, less royal. On a quest.' },
          { label: 'Enchanted frog prince', frag: 'Partially transformed: mostly human but with frog-like green tinge, slightly webbed hands, lily pad crown. Comedic mid-transformation moment.' }
        ],
        alt_lightings: [
          { label: 'Forest magical beams', frag: 'Soft magical sunbeams through forest canopy. Fairy dust particles glow. Warm and enchanting.' },
          { label: 'Ballroom chandelier', frag: 'Crystal chandelier creating prismatic rainbow reflections. Warm golden ballroom glow. Magical sparkles.' }
        ]
      },
      { value: 'comic_pop', label: 'Pop Art Comic Panel',
        theme_frag: 'Bold pop art / Roy Lichtenstein-style comic book render. Ben-Day dots visible. The subject in a dramatic action pose with motion lines. Bold black outlines, limited color palette. Speech bubble floats nearby. Exaggerated heroic comic-book expression.',
        wardrobe_frag: 'Classic comic-book hero outfit rendered in pop-art style: bold primary colors (red, blue, yellow), heavy black outlines, flat color fills with Ben-Day dot shading.',
        scene_frag: 'Pop art comic panel background: bold color blocks, action words (POW! WHAM!), speed lines, halftone dot patterns. Pure graphic novel aesthetic.',
        lighting_frag: 'Flat bold comic lighting with strong ink shadows. Limited color palette. Ben-Day dot effects on all surfaces.',
        alt_scenes: [
          { label: 'Comic city skyline', frag: 'Simplified comic-book city skyline. Bold geometric buildings, bright sky, dramatic clouds. Speech bubble with hero catchphrase.' },
          { label: 'Noir comic alley', frag: 'Dark noir comic panel: rain-streaked alley, harsh black shadows, single streetlight. Film noir meets Lichtenstein.' }
        ],
        alt_wardrobes: [
          { label: 'Retro reporter', frag: 'Classic comic reporter: blue suit, red tie, glasses, press hat with card. Ripping shirt open to reveal hero emblem. Iconic transformation.' },
          { label: 'Pop art casual', frag: 'Casual clothes rendered in pop art: graphic tee, jacket, jeans — all with bold outlines, Ben-Day dots, and flat color fills.' }
        ],
        alt_lightings: [
          { label: 'Noir comic harsh', frag: 'High contrast noir comic lighting. Heavy blacks, stark whites. Minimal color: just red accents.' },
          { label: 'Bright pop daylight', frag: 'Flat bright daylight. Bold shadows. Maximum color saturation. Classic daytime comic panel.' }
        ]
      },
      { value: 'chibi', label: 'Chibi Kawaii Fighter',
        theme_frag: 'Adorable chibi/super-deformed anime style. The subject with exaggerated large head (3-head-tall proportions), huge sparkling eyes, tiny body. Wielding an oversized cartoon sword bigger than himself. Cute determined battle expression. Kawaii aesthetic.',
        wardrobe_frag: 'Chibi-sized fantasy armor: tiny shoulder pads, mini cape, oversized belt with huge buckle. Boots comically large. Everything cute-proportioned. Sword is twice his height.',
        scene_frag: 'Colorful chibi fantasy landscape: candy-colored mushroom forest, sparkly river, cute slime monsters peeking from bushes. Everything rounded and adorable.',
        lighting_frag: 'Bright even anime lighting. Sparkle effects on eyes and weapon. Soft pastel color palette with vivid accents.',
        alt_scenes: [
          { label: 'Chibi classroom', frag: 'Anime school classroom in chibi style. Tiny desk, chalkboard with doodles, cherry blossom outside window. Everyday chibi life.' },
          { label: 'Chibi ramen shop', frag: 'Adorable chibi ramen shop. Steaming bowl bigger than his head. Chopsticks in tiny hands. Happy eating expression.' }
        ],
        alt_wardrobes: [
          { label: 'Chibi mage robes', frag: 'Oversized wizard robes and pointed hat sliding over eyes. Magical staff with glowing orb. Spell book under tiny arm. Cute mage.' },
          { label: 'Chibi casual modern', frag: 'Cute modern outfit: oversized hoodie, tiny sneakers, headphones around neck. Phone in small hands. Modern chibi lifestyle.' }
        ],
        alt_lightings: [
          { label: 'Classroom warm', frag: 'Soft warm classroom light through windows. Cherry blossom pink tint. Peaceful anime lighting.' },
          { label: 'Ramen shop glow', frag: 'Warm ramen shop interior light. Steam glow. Cozy lantern ambiance.' }
        ]
      }
    ],
    female: [
      { value: 'pixar_heroine', label: 'Pixar Adventure Heroine',
        theme_frag: 'Pixar-quality 3D render of the subject as an animated heroine. Stylized proportions with expressive features. She stands at the prow of a flying ship, hair and scarf streaming behind. Looking toward the horizon with wonder and determination.',
        wardrobe_frag: 'Colorful adventurer outfit: fitted green jacket, brown leather corset, tan pants, tall boots. Compass pendant necklace. Goggles pushed up on forehead. Practical but stylish.',
        scene_frag: 'Pixar sky world: flying between floating islands connected by waterfalls. Colorful birds and cloud formations. Bright saturated sunset. Epic animated vista.',
        lighting_frag: 'Bright warm Pixar sunset lighting. Golden rim light on hair. Vivid colors with clean shadows. Subsurface scattering on skin.',
        alt_scenes: [
          { label: 'Enchanted library', frag: 'Massive animated library with floating books, magical ladders, glowing runes. She reaches for a sparkling book. Knowledge and wonder.' },
          { label: 'Underwater grotto', frag: 'Beautiful animated underwater grotto. Bioluminescent coral, treasure chests, fish companions. She swims gracefully. Vibrant aquatic colors.' }
        ],
        alt_wardrobes: [
          { label: 'Princess reimagined', frag: 'Modern Disney princess outfit: practical dress with adventure modifications, boots instead of heels, tool belt. Tiara repurposed as utility headband.' },
          { label: 'Mecha pilot suit', frag: 'Pixar-style mecha pilot suit: white and orange flight suit, oversized helmet under arm. Standing next to giant friendly robot.' }
        ],
        alt_lightings: [
          { label: 'Library magical glow', frag: 'Warm magical book glow. Floating light particles. Enchanted atmosphere. Soft studio lighting.' },
          { label: 'Underwater blue-green', frag: 'Bioluminescent blue-green underwater glow. Light rays from surface. Dreamy aquatic lighting.' }
        ]
      },
      { value: 'anime_princess', label: 'Anime Magical Princess',
        theme_frag: 'Stunning anime art style. The subject as a magical princess mid-transformation. Glowing sigils orbit around her as she rises into the air. Hair lengthens and flows upward with magical energy. Ribbons of light wrap around her forming her outfit. Powerful yet graceful.',
        wardrobe_frag: 'Magical girl outfit forming from light: flowing white and pink dress with crystal details, wings of pure energy emerging from back, star tiara materializing on forehead.',
        scene_frag: 'Anime magical transformation sequence background: starburst of color, geometric magical circles, floating crystals. Night sky with shooting stars.',
        lighting_frag: 'Magical girl transformation glow: warm pink and white energy as primary. Sparkling star effects. Cel-shaded with extra shimmer.',
        alt_scenes: [
          { label: 'Crystal palace garden', frag: 'Anime crystal palace garden. Gem-encrusted flowers, rainbow fountains, fairy companions. Pastel sky. Magical kingdom headquarters.' },
          { label: 'Moonlit battle', frag: 'Anime moonlit battlefield. She faces dark enemy forces with staff raised. Full moon behind her creates dramatic silhouette. Epic scale.' }
        ],
        alt_wardrobes: [
          { label: 'Dark magical queen', frag: 'Elegant dark magical queen version: black and purple gown, dark crystal crown, shadow wings. Same character but corrupted. Beautiful and ominous.' },
          { label: 'Casual schoolgirl', frag: 'Japanese school uniform with subtle magical touches: star hairpin, enchanted phone charm, glowing bracelet hidden under sleeve. Secret identity.' }
        ],
        alt_lightings: [
          { label: 'Crystal garden rainbow', frag: 'Rainbow light refracted through crystals. Soft pastel ambient. Fairy sparkle particles.' },
          { label: 'Moonlit battle dramatic', frag: 'Cool blue full moonlight backlight. Dark enemy glow in reds and purples. Epic anime contrast.' }
        ]
      },
      { value: 'studio_ghibli', label: 'Studio Ghibli Heroine',
        theme_frag: 'Studio Ghibli / Hayao Miyazaki art style. The subject as a spirited young heroine in a pastoral setting. She runs through a flower meadow with arms spread wide, laughing. Wind lifts her hair and dress. A magical creature companion flies beside her. Pure joy and freedom.',
        wardrobe_frag: 'Simple Ghibli-style dress: blue cotton dress with white apron, practical shoes, straw hat ribbon flowing. Bag with provisions over shoulder. Understated, natural, beautiful.',
        scene_frag: 'Ghibli countryside: rolling green hills, wildflower meadows, distant European-style town with red roofs. Giant cumulus clouds in brilliant blue sky. Idyllic and alive.',
        lighting_frag: 'Beautiful Ghibli natural daylight. Soft clouds, warm but not harsh. Wind-swept animation quality. Painterly background with detailed character.',
        alt_scenes: [
          { label: 'Moving castle interior', frag: 'Interior of a magical moving castle: cluttered workshop, magical fire creature in hearth, potions and gadgets. Warm, cozy, enchanted domestic chaos.' },
          { label: 'Spirit bathhouse', frag: 'Grand spirit bathhouse: ornate traditional Japanese architecture but magical. Lanterns, spirits as guests, steaming baths. Mystical and bustling.' }
        ],
        alt_wardrobes: [
          { label: 'Witch apprentice', frag: 'Young witch outfit: dark dress, oversized red bow, broomstick, black cat companion. Flying over a coastal European town. Classic Ghibli witch.' },
          { label: 'Aviator explorer', frag: 'Ghibli aviator outfit: leather jacket, goggles, white scarf, flight pants. Standing next to a fantastical aircraft. Adventure calls.' }
        ],
        alt_lightings: [
          { label: 'Castle hearth warm', frag: 'Warm hearth fire glow in cluttered interior. Soft window light. Cozy Ghibli domestic lighting.' },
          { label: 'Bathhouse lanterns', frag: 'Warm red lantern light mixing with steam. Magical glow from spirit guests. Traditional Japanese atmosphere.' }
        ]
      },
      { value: 'toy_figure', label: 'Designer Toy Figure',
        theme_frag: 'Stylized designer vinyl toy / collectible figure render. The subject as a premium collectible figure: simplified features, smooth glossy surface, slightly oversized head. Displayed on a clean white pedestal. Product photography quality.',
        wardrobe_frag: 'Miniaturized stylized outfit sculpted as part of the figure: trendy streetwear molded in glossy vinyl. Sneakers, cap, mini bag — all sculpted as one piece.',
        scene_frag: 'Clean product display: white backdrop, reflective surface, subtle gradient. Professional toy photography. Box art visible behind showing the character illustration.',
        lighting_frag: 'Professional product photography lighting: soft even illumination, clean highlights on glossy surfaces, no harsh shadows.',
        alt_scenes: [
          { label: 'Collector shelf', frag: 'Display on a collector shelf among other art toys. Soft LED strip lighting. Glass display case. Premium collection aesthetic.' },
          { label: 'Urban vinyl shop', frag: 'Trendy vinyl toy shop interior. Displayed among rare figures. Price tag visible. Street art on walls. Hypebeast culture.' }
        ],
        alt_wardrobes: [
          { label: 'Mecha figure variant', frag: 'Mecha/robot suit variant of the figure. Metallic paint finish, articulated joints visible. Limited edition chrome version.' },
          { label: 'Crystal figure', frag: 'Translucent crystal resin variant. Clear body with visible internal sparkles. Limited see-through edition. Art toy grail.' }
        ],
        alt_lightings: [
          { label: 'LED shelf accent', frag: 'Cool LED strip accent lighting. Clean display case reflections. Collector showcase mood.' },
          { label: 'Shop warm display', frag: 'Warm shop interior with spot lighting on the figure. Street art colors in background.' }
        ]
      },
      { value: 'watercolor_fairy', label: 'Watercolor Fairy Queen',
        theme_frag: 'Delicate watercolor art style render. The subject as a fairy queen in an enchanted garden. She sits on a giant flower petal, legs crossed, reading a tiny scroll. Translucent wings shimmer behind her. Soft, dreamy, ethereal. Serene magical expression.',
        wardrobe_frag: 'Fairy queen gown made of flower petals in watercolor lavender, rose, and soft green. Tiny flower crown with dewdrops. Wings of translucent iridescence. Barefoot with vine anklets.',
        scene_frag: 'Enchanted miniature fairy garden: oversized flowers with dewdrops, mushroom houses, firefly lanterns. Stream with tiny bridge. Everything at fairy scale. Watercolor texture throughout.',
        lighting_frag: 'Soft dreamy watercolor lighting. Warm golden with cool lavender shadows. Visible watercolor paper texture beneath. Dappled light through petals.',
        alt_scenes: [
          { label: 'Moonlit fairy ring', frag: 'Fairy ring of mushrooms at night. Moonlight filters through forest canopy. Fireflies dance. Other tiny fairies celebrate. Magical midnight gathering.' },
          { label: 'Raindrop fairy world', frag: 'Fairy perched inside a crystal raindrop. World visible outside in distorted watercolor. Magical micro-universe. Dreamy and surreal.' }
        ],
        alt_wardrobes: [
          { label: 'Autumn leaf fairy', frag: 'Outfit made of autumn leaves in watercolor reds, oranges, golds. Acorn cap. Dried berry jewelry. Autumnal fairy variant.' },
          { label: 'Winter frost fairy', frag: 'Delicate ice-crystal wings and snowflake dress. Frost patterns on skin. Tiny icicle crown. Winter fairy in cool watercolor blues.' }
        ],
        alt_lightings: [
          { label: 'Moonlit fairy ring', frag: 'Cool blue moonlight with warm firefly accents. Mystical nighttime watercolor palette.' },
          { label: 'Raindrop refraction', frag: 'Soft diffused light through raindrop. Watercolor prismatic effects. Dreamy and intimate.' }
        ]
      },
      { value: 'retro_cartoon', label: 'Retro Cartoon Pin-Up',
        theme_frag: '1940s-50s retro cartoon pin-up art style. The subject in classic Tex Avery / vintage pin-up illustration style. Exaggerated glamour, bold lines, limited color palette. She winks at camera while leaning on a vintage car. Playful classic retro expression.',
        wardrobe_frag: 'Retro 1950s outfit: polka-dot halter dress, red bandana in hair, cherry earrings, white sneakers. Classic Americana pin-up styling with cartoon rendering.',
        scene_frag: 'Retro cartoon diner backdrop: chrome and neon, checkerboard floor, jukebox, milkshakes on counter. 1950s Americana in vintage illustration style.',
        lighting_frag: 'Flat retro illustration lighting with bold graphic shadows. Limited vintage color palette. Slight paper/print texture.',
        alt_scenes: [
          { label: 'Vintage garage', frag: 'Retro garage scene: classic hot rod, tool pinboards, oil cans. She holds a wrench. Pin-up calendar on wall. Americana grease-monkey chic.' },
          { label: 'Tiki bar tropical', frag: 'Vintage tiki bar: bamboo decor, tiki masks, umbrella drinks, flamingo decorations. Retro Hawaiian tropical cartoon style.' }
        ],
        alt_wardrobes: [
          { label: 'Rosie the Riveter', frag: 'Rosie the Riveter outfit: blue work shirt, red bandana, flexed arm. "We Can Do It" energy. Empowering retro illustration.' },
          { label: 'Vintage swimsuit', frag: 'Classic high-waisted vintage swimsuit with retro sunglasses. Beach ball, striped towel. 1950s beach illustration style.' }
        ],
        alt_lightings: [
          { label: 'Garage warm bulb', frag: 'Warm garage work-light glow. Chrome reflections on hot rod. Vintage illustration warm palette.' },
          { label: 'Tiki torch tropical', frag: 'Warm tiki torch lighting. Tropical sunset palette. Retro Hawaiian glow.' }
        ]
      },
      { value: 'voxel_art', label: 'Voxel Art Character',
        theme_frag: 'Voxel art (3D pixel art) style render. The subject as a blocky voxel character in a Minecraft-meets-designer-art aesthetic. Each body part composed of visible cubic voxels. She poses confidently in a voxel landscape. Cute angular expression.',
        wardrobe_frag: 'Voxel outfit: blocky dress in bright pixel colors, cubic accessories. Everything made of small cubes. Hair as stacked colored blocks.',
        scene_frag: 'Voxel world: blocky trees, pixel flowers, cubic buildings in the background. Clean isometric perspective. Bright, colorful, geometric.',
        lighting_frag: 'Clean voxel rendering light. Soft ambient occlusion on block edges. Bright and colorful with subtle block shadows.',
        alt_scenes: [
          { label: 'Voxel space station', frag: 'Voxel space station: cubic modules, pixel stars, blocky astronaut tools. Earth as a voxel sphere visible through window.' },
          { label: 'Voxel dungeon', frag: 'Voxel dungeon interior: cubic stone walls, pixel torches, treasure chest blocks. RPG-game aesthetic.' }
        ],
        alt_wardrobes: [
          { label: 'Voxel armor knight', frag: 'Blocky knight armor in shiny voxels. Cubic sword and shield. Pixel plume on helmet. RPG warrior class.' },
          { label: 'Voxel streetwear', frag: 'Modern streetwear in voxel form: blocky sneakers, pixel cap, cubic hoodie. Urban voxel art.' }
        ],
        alt_lightings: [
          { label: 'Space voxel glow', frag: 'Dark space with Earth glow. Station interior warm lighting. Clean pixel shadows.' },
          { label: 'Dungeon torchlight', frag: 'Warm pixel torch glow in dark dungeon. Block shadows. RPG atmosphere.' }
        ]
      }
    ],
    couple_group: [
      { value: 'pixar_family', label: 'Pixar Family Adventure',
        theme_frag: 'Pixar-quality 3D render of the subjects as an animated family on an adventure. Each with unique stylized proportions and personality visible in their pose. Standing together looking at a glowing treasure map. Warm family energy with excitement.',
        wardrobe_frag: 'Each in unique colorful adventure outfit: matching color accents but different styles reflecting personality. One has a hat, another goggles, another a backpack. Coordinated but individual.',
        scene_frag: 'Pixar adventure launch point: edge of a fantastical jungle with bioluminescent plants. Ancient temple ruins visible through foliage. Map glows pointing the way.',
        lighting_frag: 'Bright warm Pixar studio lighting. Bioluminescent plant glow as accent. Clean expressive shadows. Subsurface skin scattering.',
        alt_scenes: [
          { label: 'Flying house', frag: 'House lifted by thousands of colorful balloons floating over a vast canyon. Family on the porch looking down at clouds. UP-inspired wonder.' },
          { label: 'Space family mission', frag: 'Family in a cartoon spaceship cockpit. Stars outside. Each at a different station. Teamwork and adventure in space.' }
        ],
        alt_wardrobes: [
          { label: 'Superhero family suits', frag: 'Matching family superhero suits: each in same style but different colors. Some with capes, some with masks. The Incredibles energy.' },
          { label: 'Cozy holiday matching', frag: 'Matching holiday sweaters — ugly Christmas sweater style but animated and adorable. Hot cocoa mugs. Cozy animated family portrait.' }
        ],
        alt_lightings: [
          { label: 'Balloon sky light', frag: 'Bright sky light through colorful balloons creating rainbow shadows. Warm and whimsical.' },
          { label: 'Spaceship console glow', frag: 'Cool console glow from multiple screens. Stars through viewport as backlight.' }
        ]
      },
      { value: 'anime_squad', label: 'Anime Battle Squad',
        theme_frag: 'Epic anime group portrait in dramatic cel-shaded style. Subjects as an anime battle squad in V-formation. Each strikes a unique power pose. Wind and energy effects swirl. Dynamic speed lines radiate from center. Fierce determined anime expressions.',
        wardrobe_frag: 'Each in unique anime outfit representing different fighting style: swordsman armor, mage robes, ninja stealth suit, brawler wraps. Coordinated team colors with individual flair.',
        scene_frag: 'Anime epic landscape: massive canyon with floating islands, cherry blossom storm, ancient shrine crumbling. The battleground of destiny.',
        lighting_frag: 'Dramatic anime backlight with individual character aura colors. Bold cel-shaded shadows. Vibrant saturated palette. Speed line effects.',
        alt_scenes: [
          { label: 'School rooftop', frag: 'Anime school rooftop at sunset. The squad sits together casually: on railing, bench, ground. Relaxed between-battles bonding moment.' },
          { label: 'Final boss arena', frag: 'Dark dimension arena. Giant boss silhouette looms behind. Squad charges forward together. Ultimate team attack pose.' }
        ],
        alt_wardrobes: [
          { label: 'School uniform squad', frag: 'All in matching school uniforms but with personality touches: untucked shirt, customized jacket, accessory hints of their powers.' },
          { label: 'Powered-up forms', frag: 'Each in powered-up transformation: glowing auras, evolved outfits, unleashed forms. Maximum power state. Hair flows upward.' }
        ],
        alt_lightings: [
          { label: 'Sunset rooftop warm', frag: 'Warm anime sunset. Orange-pink sky. Soft peaceful lighting. Emotional slice-of-life mood.' },
          { label: 'Boss arena dark energy', frag: 'Dark purple boss energy as ambient. Team aura glow creates warm light. Dramatic contrast.' }
        ]
      },
      { value: 'ghibli_journey', label: 'Ghibli Group Journey',
        theme_frag: 'Studio Ghibli-style group journey. Subjects walk together along a countryside path, each carrying travel items. Magical creature companions accompany them. The mood is warm, hopeful, beginning of an adventure. Smiles and wonder.',
        wardrobe_frag: 'Ghibli-style practical travel clothes: simple dresses, vests, boots, hats. Each with a unique color scheme. Backpacks and satchels. Natural and charming.',
        scene_frag: 'Beautiful Ghibli countryside road: rolling green hills, wildflowers, stone walls, distant European-Japanese town. Blue sky with perfect cumulus clouds. A winding path ahead.',
        lighting_frag: 'Perfect Ghibli natural daylight. Warm sun, soft cloud shadows moving across landscape. Painterly quality. Wind animation on grass and hair.',
        alt_scenes: [
          { label: 'Train through clouds', frag: 'Ghibli magical train running through clouds. Group sits in open-air car. Islands and castles visible through cloud breaks below. Dreamlike travel.' },
          { label: 'Hot spring village', frag: 'Arriving at a Ghibli-style spirit village at night. Paper lanterns, steam from hot springs, friendly spirit creatures greeting them. Warm and mystical.' }
        ],
        alt_wardrobes: [
          { label: 'Aviator crew', frag: 'Ghibli aviator crew: leather jackets, goggles, scarves. Standing in front of a fantastical flying machine. Sky pirates or mail carriers.' },
          { label: 'Forest spirits friends', frag: 'Simple white robes as forest spirit guests. Each with a unique mask and nature element. Spirited Away-inspired ceremony attendees.' }
        ],
        alt_lightings: [
          { label: 'Cloud train ethereal', frag: 'Soft ethereal cloud light from all sides. Golden sunbeams through breaks. Dreamlike and warm.' },
          { label: 'Village lantern night', frag: 'Warm paper lantern glow. Cool blue night sky. Steam diffusion. Mystical Japanese atmosphere.' }
        ]
      },
      { value: 'lego_scene', label: 'LEGO Mini-Figure Scene',
        theme_frag: 'LEGO mini-figure style render. Subjects as LEGO characters with C-shaped claw hands, cylindrical heads, printed face expressions. Standing on a LEGO baseplate. Stiff but charming LEGO poses. Iconic yellow skin and printed smiles.',
        wardrobe_frag: 'Printed LEGO outfits: torso prints showing clothes, solid color legs, hair pieces in standard LEGO styles. Accessories as separate LEGO elements: hats, tools, capes.',
        scene_frag: 'LEGO brick-built scene: buildings and vehicles all made of visible LEGO bricks. Trees are green brick constructions. Ground is flat baseplate with studs visible.',
        lighting_frag: 'Product photography lighting for LEGO sets. Clean, bright, even illumination. Slight tilt-shift miniature effect.',
        alt_scenes: [
          { label: 'LEGO space base', frag: 'LEGO space base: grey baseplate moon surface, brick-built rocket, classic LEGO space logo. Astronaut LEGO crew.' },
          { label: 'LEGO castle siege', frag: 'LEGO medieval castle siege: brick castle, catapults, knight figures. Classic LEGO play scenario brought to life.' }
        ],
        alt_wardrobes: [
          { label: 'LEGO superheroes', frag: 'LEGO superhero mini-figures: printed hero costumes, tiny capes, mask/helmet hair pieces. Each a different hero. LEGO justice league.' },
          { label: 'LEGO pirates', frag: 'LEGO pirate mini-figures: printed pirate torsos, peg leg piece, parrot accessory, captain hat. Classic LEGO pirate crew.' }
        ],
        alt_lightings: [
          { label: 'Space base dramatic', frag: 'Dramatic space lighting: dark background, spotlight on base. Tilt-shift miniature effect.' },
          { label: 'Castle adventure', frag: 'Warm golden lighting suggesting outdoor medieval setting. Clean product lighting on bricks.' }
        ]
      },
      { value: 'comic_splash', label: 'Comic Book Splash Page',
        theme_frag: 'Epic comic book splash page composition. Subjects as a superhero team rendered in detailed comic book art style. Bold ink lines, crosshatching, dramatic perspectives. Full-page action shot with everyone in dynamic poses.',
        wardrobe_frag: 'Classic comic hero costumes with individual designs: each unique color scheme and style, detailed with crosshatching and ink texture. Capes, masks, emblems.',
        scene_frag: 'Comic splash page background: explosive action scene, dramatic cityscape, energy blasts. Title font area at top. Artist signature corner. Full comic page composition.',
        lighting_frag: 'Dynamic comic book lighting: bold highlights and heavy shadows in ink crosshatch style. Color holds and dramatic rim lights.',
        alt_scenes: [
          { label: 'Comic cover pose', frag: 'Classic comic book cover composition: team posed heroically, issue number and title at top, price tag corner. Vintage first-issue energy.' },
          { label: 'Panels montage', frag: 'Multi-panel comic page: each character gets their own panel showing their moment. Connected by action flowing between panels.' }
        ],
        alt_wardrobes: [
          { label: 'Golden age retro', frag: 'Golden Age comic style: simpler costumes, bolder colors, more innocent designs. 1940s-era comic hero aesthetic.' },
          { label: 'Modern gritty reboot', frag: 'Modern gritty comic reboot: armored versions of classic suits, darker colors, tactical elements. 2020s comic aesthetic.' }
        ],
        alt_lightings: [
          { label: 'Golden age flat', frag: 'Flat bold Golden Age coloring. Primary colors dominant. Simple shadows. Nostalgic vintage print quality.' },
          { label: 'Modern gritty rain', frag: 'Dark modern comic lighting: heavy rain, noir influence, minimal color palette with one accent color.' }
        ]
      },
      { value: 'chibi_party', label: 'Chibi Dance Party',
        theme_frag: 'Adorable chibi group scene. Subjects as super-deformed chibi characters at a celebration. Oversized heads, tiny bodies, huge sparkly eyes. Everyone dancing and jumping with joy. Confetti and sparkles everywhere. Maximum kawaii energy.',
        wardrobe_frag: 'Cute party outfits in chibi proportions: tiny party hats, miniature dresses and suits, oversized bow ties. Each in different pastel color. Sparkle accessories.',
        scene_frag: 'Chibi party room: oversized cake, floating balloons, confetti, streamers. Everything cute and rounded. Pastel color palette with sparkle accents.',
        lighting_frag: 'Bright cheerful anime lighting. Sparkle and star effects everywhere. Warm pastel glow. Clean cute shadows.',
        alt_scenes: [
          { label: 'Chibi picnic meadow', frag: 'Adorable chibi picnic in flower meadow. Oversized food items, tiny blanket, butterfly companions. Sunny and cheerful.' },
          { label: 'Chibi sleepover', frag: 'Cute chibi sleepover: pillow fort, tiny sleeping bags, popcorn, stuffed animals. Nightlight stars on ceiling. Cozy kawaii.' }
        ],
        alt_wardrobes: [
          { label: 'Chibi animal onesies', frag: 'Each in a different animal onesie: cat, bear, bunny, panda. Hood ears flopping. Pajama party chibi style.' },
          { label: 'Chibi seasonal costumes', frag: 'Seasonal costumes: one as pumpkin, one as snowflake, one as cherry blossom, one as sunflower. Cute seasonal chibi.' }
        ],
        alt_lightings: [
          { label: 'Meadow sunshine', frag: 'Bright warm sunshine with flower petal shadows. Sparkle effects. Happy chibi lighting.' },
          { label: 'Sleepover nightlight', frag: 'Soft warm nightlight glow. Star projector on ceiling. Cozy dim chibi atmosphere.' }
        ]
      },
      { value: 'mixed_art_styles', label: 'Mixed Art Styles Clash',
        theme_frag: 'Surreal composition: each subject rendered in a DIFFERENT art style coexisting in one image. One in Pixar 3D, another in anime, another in watercolor, another in pop art. They interact across art-style boundaries. Playful and meta.',
        wardrobe_frag: 'Each outfit matches their art style: Pixar character in colorful 3D, anime character in cel-shaded costume, watercolor character in soft flowing dress, pop art character in bold primary colors.',
        scene_frag: 'Split-reality scene: each section rendered in the corresponding art style. Boundaries between styles are fluid and playful — Pixar trees become anime cherry blossoms become watercolor flowers.',
        lighting_frag: 'Each section lit according to its art style: Pixar has studio lighting, anime has cel-shaded, watercolor has soft diffused, pop art has flat bold.',
        alt_scenes: [
          { label: 'Art museum alive', frag: 'Art museum where the characters step OUT of their paintings/screens. Gallery frames around each. Art styles clash in 3D museum space.' },
          { label: 'Animation studio', frag: 'Behind-the-scenes animation studio. Characters from different styles hang out together: Pixar figure sits with anime character at a desk. Meta and fun.' }
        ],
        alt_wardrobes: [
          { label: 'All wearing same outfit', frag: 'Same outfit (simple white shirt, jeans) but rendered in each art style. Showing how one design looks across Pixar, anime, comic, watercolor.' },
          { label: 'Style-swapped costumes', frag: 'Each wears a costume from another art style: Pixar character in anime outfit, anime character in comic suit. Playful style swap.' }
        ],
        alt_lightings: [
          { label: 'Museum gallery', frag: 'Clean museum gallery lighting with individual spot lights on each art-style section.' },
          { label: 'Studio workspace', frag: 'Warm creative studio lighting. Desk lamps, monitor glow, messy but inspiring workspace atmosphere.' }
        ]
      }
    ]
  }
},

// ======================================================================
// 5. SPORTS & ACTION
// ======================================================================
sports_action: {
  label: 'Sports & Action',
  characters: {
    male: [
      { value: 'boxing_champ', label: 'Boxing Champion Ring',
        theme_frag: 'The subject stands center ring as a boxing champion. Arms raised in victory, gloves held high. Sweat glistens on every surface. Roaring crowd in darkness behind. Corner team celebrates. Fierce triumphant expression of hard-won glory.',
        wardrobe_frag: 'Red boxing trunks with gold waistband and name embroidered. Championship belt draped over one shoulder. Red gloves, hand wraps visible at wrists. Mouthguard partially visible.',
        scene_frag: 'Boxing ring under arena spotlights. Ropes, canvas floor, corner posts. Crowd of thousands visible as dark mass with phone flashlights. Confetti falling from above.',
        lighting_frag: 'Harsh overhead ring spotlights creating dramatic top-down lighting. Sweat and water droplets frozen in light. 85mm, f/2.0.',
        alt_scenes: [
          { label: 'Training gym gritty', frag: 'Old-school boxing gym: heavy bags, speed bags, worn canvas ring. Brick walls, motivational posters. Early morning solo training.' },
          { label: 'Weigh-in staredown', frag: 'Pre-fight weigh-in stage. Opponent face-to-face (blurred). Cameras flashing. Referee between them. Intense psychological warfare.' }
        ],
        alt_wardrobes: [
          { label: 'Training gear sweaty', frag: 'Grey hoodie with hood up (face visible), training wraps on hands, sweatpants. Jumping rope over shoulders. Pre-fight focus.' },
          { label: 'Robe entrance walk', frag: 'Elaborate gold and red boxing robe with hood up, name on back. Walking toward ring with entourage. Entrance moment of glory.' }
        ],
        alt_lightings: [
          { label: 'Gym morning light', frag: 'Early morning light through dusty gym windows. Warm, gritty, motivational. 35mm, f/2.0.' },
          { label: 'Weigh-in camera flash', frag: 'Multiple camera flashes creating starburst effect. Stage spotlight overhead. 50mm, f/2.8.' }
        ]
      },
      { value: 'soccer_goal', label: 'Soccer Goal Celebration',
        theme_frag: 'The subject has just scored the winning goal. Mid-celebration: sliding on knees across wet grass, arms spread wide, head thrown back in pure ecstasy. Stadium erupts around him. Rain adds drama to every frame.',
        wardrobe_frag: 'Professional football kit: dark jersey with number 10, white shorts, long socks, cleats. Jersey pulled up slightly revealing undershirt. Grass stains on knees.',
        scene_frag: 'Packed stadium at night in rain. Floodlights create dramatic beams through rain. Crowd as wall of noise and movement behind. Grass is vivid green under lights.',
        lighting_frag: 'Multiple stadium floodlights from above. Rain and water spray frozen in dramatic detail. Cool green pitch light. 200mm, f/2.8 telephoto compression.',
        alt_scenes: [
          { label: 'Empty training pitch', frag: 'Empty training pitch at dawn. Morning mist. He practices free kicks alone. Dozens of balls around the goal. Dedication.' },
          { label: 'Trophy presentation', frag: 'Podium with golden trophy. Confetti rains. He lifts the cup overhead. Teammates spray champagne. Stadium celebrating.' }
        ],
        alt_wardrobes: [
          { label: 'Retro classic kit', frag: 'Retro 1970s football kit: simple solid-color jersey, short shorts, old-style boots. Classic Pelé/Maradona era aesthetic.' },
          { label: 'Training casual', frag: 'Training gear: branded tracksuit jacket over training shirt, football at feet. Casual but focused pre-match warm-up look.' }
        ],
        alt_lightings: [
          { label: 'Dawn mist training', frag: 'Soft misty dawn light on empty pitch. Cool, ethereal, solitary. 85mm, f/2.0.' },
          { label: 'Trophy confetti gold', frag: 'Golden confetti reflecting warm spotlight. Champagne spray catching light. 50mm, f/2.8.' }
        ]
      },
      { value: 'surfer', label: 'Big Wave Surfer',
        theme_frag: 'The subject rides inside the barrel of a massive ocean wave. Low crouch on surfboard, hand trailing in the water wall beside him. The curl of the wave forms a perfect tube around him. Salt spray and sunlight pierce through the wave. Focused zen-like expression.',
        wardrobe_frag: 'Fitted black wetsuit top (unzipped showing chest) and board shorts. Surf wax residue on hands. Salt-crusted hair slicked back by wave. Zinc sunscreen on nose.',
        scene_frag: 'Inside a massive barrel wave. Turquoise water curls overhead forming a perfect tube. Sunlight refracts through the wave creating prismatic effects. White foam trails behind.',
        lighting_frag: 'Sunlight filtering through translucent wave creating ethereal turquoise glow. Water droplets as frozen diamonds. 16mm wide-angle, f/2.8.',
        alt_scenes: [
          { label: 'Beach sunset walk', frag: 'Walking up the beach at sunset carrying surfboard under arm. Wet footprints in sand. Warm golden light. Post-session peace.' },
          { label: 'Cliff dive spot', frag: 'Standing on a rocky cliff above pristine ocean. Surfboard under arm, waves breaking below. Dramatic height and decision moment.' }
        ],
        alt_wardrobes: [
          { label: 'Vintage longboard style', frag: 'Retro surf style: colorful board shorts, no shirt, wooden longboard. 1960s surf culture aesthetic. Relaxed and cool.' },
          { label: 'Competition rash guard', frag: 'Competition rash guard with number and sponsor logos. Competition jersey. Serious competitive look. Focus before heat.' }
        ],
        alt_lightings: [
          { label: 'Sunset silhouette beach', frag: 'Warm golden sunset silhouette from behind. Warm sand glow. 85mm, f/2.0.' },
          { label: 'Cliff dramatic overcast', frag: 'Dramatic overcast with rays breaking through. Moody ocean below. 35mm, f/2.8.' }
        ]
      },
      { value: 'basketball', label: 'Basketball Slam Dunk',
        theme_frag: 'The subject is frozen mid-air during an incredible slam dunk. Body fully extended, one hand gripping the ball above the rim. Defenders below look up helplessly. Arena explodes with energy. Pure athletic dominance expression.',
        wardrobe_frag: 'Professional basketball uniform: dark jersey with name and number, matching shorts, high-top sneakers. Sweatband on wrist. Jersey slightly lifted from the jump.',
        scene_frag: 'Professional basketball arena at full capacity. Court with polished hardwood floor. Scoreboard visible. Flash photography from courtside. Parquet floor gleams.',
        lighting_frag: 'Harsh arena overhead lighting freezing the action. Flash photography from courtside. Sweat droplets frozen mid-air. 200mm, f/2.8.',
        alt_scenes: [
          { label: 'Street court sunset', frag: 'Urban outdoor basketball court at golden hour. Chain-net hoop, cracked pavement, graffiti walls. He shoots alone. Street basketball authenticity.' },
          { label: 'Locker room pre-game', frag: 'Team locker room before the big game. Sitting on bench, headphones on, eyes closed. Sneakers on floor. Mental preparation moment.' }
        ],
        alt_wardrobes: [
          { label: 'Street basketball casual', frag: 'Street ball look: oversized tee or tank, baggy shorts, premium sneakers. Headband. Basketball under arm. Urban court swagger.' },
          { label: 'Retro 80s uniform', frag: 'Retro short-shorts basketball uniform. Classic high-top sneakers. Headband and wristbands. Old-school NBA golden era style.' }
        ],
        alt_lightings: [
          { label: 'Street court golden', frag: 'Warm golden sunset on urban court. Long shadows. 35mm, f/2.0.' },
          { label: 'Locker room mood', frag: 'Dim locker room with overhead fluorescent. Focused intimate mood. 50mm, f/1.8.' }
        ]
      },
      { value: 'f1_driver', label: 'F1 Racing Driver',
        theme_frag: 'The subject stands next to his Formula 1 car on the starting grid. He holds his helmet at his side, visor up. Car gleams behind him, pitwall visible in background. He stares down the track ahead. Cool calculated focus with hint of competitive fire.',
        wardrobe_frag: 'Full F1 racing suit in team colors: fitted fireproof suit with sponsor logos, racing boots, gloves tucked in belt. Helmet in hand with custom design. HANS device visible at collar.',
        scene_frag: 'F1 starting grid. Polished car in livery behind. Pit crew working. Grandstands packed. Start lights visible overhead. Asphalt radiates heat.',
        lighting_frag: 'Bright overhead track lighting or sunlight. Reflections on car bodywork. Clean motorsport photography. 85mm, f/2.8.',
        alt_scenes: [
          { label: 'Podium champagne', frag: 'F1 podium celebration. National anthem moment transitioning to champagne spray. Trophy held high. Confetti falls. Pure motorsport glory.' },
          { label: 'Rain race cockpit', frag: 'Inside cockpit during a rain race. Spray from tires, low visibility. Red taillights ahead in mist. Intense concentration.' }
        ],
        alt_wardrobes: [
          { label: 'Vintage racing suit', frag: 'Vintage 1960s-70s racing suit: simpler design, leather helmet with goggles, minimal sponsor logos. Classic Formula racing elegance.' },
          { label: 'Team polo paddock', frag: 'Team branded polo shirt and trousers. Sunglasses, smart-casual paddock attire. Walking through paddock before race. Relaxed but focused.' }
        ],
        alt_lightings: [
          { label: 'Podium confetti glow', frag: 'Warm victory podium lighting. Confetti and champagne spray catching light. 50mm, f/2.8.' },
          { label: 'Rain race moody', frag: 'Moody overcast rain race lighting. Spray and mist diffusing everything. Red taillights. 35mm, f/2.0.' }
        ]
      },
      { value: 'mma_fighter', label: 'MMA Cage Fighter',
        theme_frag: 'The subject stands in an MMA octagon, illuminated by a single overhead spotlight. Hands wrapped, stance ready. Body shows the marks of training — defined muscles, focused intensity. Stares directly at camera through the cage. Lethal calm expression.',
        wardrobe_frag: 'MMA fight shorts with personal brand. Hand wraps, ankle wraps. Mouthguard visible. Shirtless showing athletic physique. Tattoos visible if applicable.',
        scene_frag: 'UFC-style octagon cage. Single overhead spot. Crowd in darkness beyond chain-link fence. Referee shadow visible. Canvas floor with octagon logo.',
        lighting_frag: 'Single harsh overhead spotlight creating dramatic top-down shadows on musculature. Dark everywhere else. 85mm, f/2.0.',
        alt_scenes: [
          { label: 'Beach training', frag: 'Beach at sunrise. He trains martial arts forms on wet sand. Waves as backdrop. Peaceful warrior morning ritual. Solo focus.' },
          { label: 'Dojo respect', frag: 'Traditional martial arts dojo. He bows respectfully. Wooden training weapons on wall. Discipline and honor atmosphere.' }
        ],
        alt_wardrobes: [
          { label: 'Gi traditional', frag: 'Traditional martial arts gi (white or black). Belt tied properly. Bare feet. Traditional arts respect. Disciplined warrior.' },
          { label: 'Walk-out gear', frag: 'Walk-out hoodie and team gear. Hood up, headphones visible. Walking toward the cage. Pre-fight tunnel walk intensity.' }
        ],
        alt_lightings: [
          { label: 'Beach sunrise', frag: 'Warm golden sunrise on beach. Cool ocean blue. Peaceful warrior lighting. 50mm, f/2.0.' },
          { label: 'Dojo warm wood', frag: 'Warm natural light on wooden dojo floors. Soft and respectful. 50mm, f/2.8.' }
        ]
      },
      { value: 'motocross', label: 'Motocross Air Jump',
        theme_frag: 'The subject is frozen mid-air on a motocross bike during a massive jump. Both wheels off the ground, dirt trail behind. He looks through the visor toward landing. Body position perfect — standing on pegs, elbows out. Raw adrenaline focus.',
        wardrobe_frag: 'Full motocross gear: branded jersey and pants, chest protector visible, tall boots, gloves. Helmet with custom paint and goggle marks. Mud splatter on everything.',
        scene_frag: 'Outdoor motocross track with massive tabletop jump. Dust cloud from takeoff. Blue sky above, trees and spectators behind barriers. Dirt track winding below.',
        lighting_frag: 'Bright outdoor sunlight freezing the action. Dust particles golden in backlight. 200mm telephoto, f/2.8.',
        alt_scenes: [
          { label: 'Desert dune ride', frag: 'Desert dunes at sunset. He rides across the ridge of a massive sand dune. Sand spray creates a golden rooster tail. Epic landscape.' },
          { label: 'Forest trail ride', frag: 'Dense forest single-track trail. He navigates between trees at speed. Green blur of foliage. Roots and rocks on trail.' }
        ],
        alt_wardrobes: [
          { label: 'Retro flat tracker', frag: 'Vintage flat-track gear: leather jacket, open-face helmet, goggles, denim. Old-school motorcycle aesthetic. Classic cool.' },
          { label: 'Urban street rider', frag: 'Urban motorcycle gear: leather jacket, dark jeans, street boots, half-helmet. City rider on a sport bike at night.' }
        ],
        alt_lightings: [
          { label: 'Desert sunset golden', frag: 'Rich desert sunset backlighting sand spray. Warm amber and purple tones. 200mm, f/2.8.' },
          { label: 'Forest dappled green', frag: 'Dappled green forest light. Fast motion blur on periphery. 35mm, f/2.0.' }
        ]
      }
    ],
    female: [
      { value: 'gymnast', label: 'Gymnast Perfect 10',
        theme_frag: 'The subject is captured mid-routine on balance beam, performing a breathtaking leap with perfect form. Body arched in a split-jump, arms in clean lines, toes pointed. Hair flows with the motion. Scoreboard shows perfect 10. Grace and power fusion expression.',
        wardrobe_frag: 'Competition leotard in deep purple with crystal embellishments catching light. Hair in tight competition bun with sparkle clips. Competition number on hip.',
        scene_frag: 'Olympic-style gymnastics arena. Balance beam with chalked surface. Judges table visible. Packed arena with national flags. Spotlights on the apparatus.',
        lighting_frag: 'Bright arena competition lighting freezing perfect form. Crystals on leotard create sparkle. 200mm, f/2.8 telephoto.',
        alt_scenes: [
          { label: 'Training gym dawn', frag: 'Quiet training gym at early morning. She practices alone on beam. Chalk dust in morning light. Mirrors reflect form. Dedication.' },
          { label: 'Medal ceremony', frag: 'Olympic medal ceremony podium. National anthem plays. Gold medal around neck. Flowers in hand. Tears of achievement. Flag rises.' }
        ],
        alt_wardrobes: [
          { label: 'Training leotard', frag: 'Simple training leotard in solid color, warm-up shorts over it. Chalk on hands. Hair in practical ponytail. Training-ready.' },
          { label: 'Team warm-up jacket', frag: 'National team warm-up jacket and pants over leotard. Country flag on chest. Walking with team. Pre-competition unity.' }
        ],
        alt_lightings: [
          { label: 'Morning gym chalk', frag: 'Soft morning light through gym windows. Chalk dust particles floating. 85mm, f/2.0.' },
          { label: 'Medal ceremony spotlight', frag: 'Warm spotlight from above on podium. Dark arena behind. Emotional highlight. 85mm, f/2.0.' }
        ]
      },
      { value: 'tennis', label: 'Tennis Power Serve',
        theme_frag: 'The subject is frozen at the apex of a powerful tennis serve. Ball tossed high, racket at maximum backswing, body fully extended on toes. Athletic grace captured in frozen motion. Clay dust rises from feet. Intense competitive focus.',
        wardrobe_frag: 'Professional tennis outfit: fitted athletic dress in white with color accents, tennis shoes, wristband, visor. Racket mid-swing. Hair in athletic ponytail flying with motion.',
        scene_frag: 'Grand Slam clay court. Red clay surface, white lines, umpire chair. Packed stands with tennis atmosphere. Ball in mid-air above.',
        lighting_frag: 'Bright overhead sunlight with warm clay court reflection. Clay dust frozen in light. 200mm, f/2.8.',
        alt_scenes: [
          { label: 'Hard court night match', frag: 'Hard court under stadium lights at night. Blue court surface. Night match atmosphere with dramatic artificial lighting. Grand Slam energy.' },
          { label: 'Practice wall sunrise', frag: 'Hitting against a practice wall at sunrise. Alone on empty court. Morning mist. Repetition and discipline. Ball machine nearby.' }
        ],
        alt_wardrobes: [
          { label: 'Classic all-white', frag: 'Traditional Wimbledon all-white outfit: white dress, white shoes, white headband. Classic elegance of the sport.' },
          { label: 'Warm-up outfit', frag: 'Branded warm-up jacket and leggings. Walking onto court with bag and multiple rackets. Pre-match entrance. Confident stride.' }
        ],
        alt_lightings: [
          { label: 'Night match stadium', frag: 'Bright stadium floodlights at night. Cool blue court reflections. Dramatic sports photography. 200mm, f/2.8.' },
          { label: 'Sunrise practice', frag: 'Soft golden sunrise on empty court. Long shadows. Peaceful focus. 85mm, f/2.0.' }
        ]
      },
      { value: 'skateboarder', label: 'Skateboarder Trick',
        theme_frag: 'The subject is captured mid-trick on a skateboard — kickflip above a set of concrete stairs. Board spinning beneath her feet, hair flying, arms out for balance. Urban backdrop with graffiti. Pure street style confidence and rebellious joy.',
        wardrobe_frag: 'Street skate style: oversized vintage band tee, baggy cargo pants, chunky skate shoes. Beanie, wristbands. Knee pads barely visible under pants.',
        scene_frag: 'Urban skate spot: concrete stairs with metal rail, graffiti walls, chain-link fences. Crew of friends filming with phones. Late afternoon city light.',
        lighting_frag: 'Warm afternoon urban light. Golden hour hitting graffiti walls. Board and figure frozen sharp against motion-blurred background. 24mm, f/2.8.',
        alt_scenes: [
          { label: 'Empty pool bowl', frag: 'Classic empty swimming pool used as a skate bowl. She carves the edge. Suburban backyard setting. Old-school skate culture.' },
          { label: 'Skatepark sunset', frag: 'Purpose-built skatepark at sunset. Halfpipes, rails, ledges. Other skaters as silhouettes. Orange sky backdrop.' }
        ],
        alt_wardrobes: [
          { label: 'Competition gear', frag: 'Competition outfit: team jersey, branded helmet with stickers, knee and elbow pads. Sponsored board. Professional skater look.' },
          { label: '90s retro skate', frag: 'Retro 90s skate style: neon windbreaker, high-waisted jeans, Vans. Walkman and headphones. Vintage skate nostalgia.' }
        ],
        alt_lightings: [
          { label: 'Pool afternoon harsh', frag: 'Harsh afternoon sun in empty pool. Hard shadows on concrete. Raw skate aesthetic. 16mm fisheye.' },
          { label: 'Skatepark sunset glow', frag: 'Rich sunset orange glow. Silhouette skaters as backdrop. 50mm, f/2.0.' }
        ]
      },
      { value: 'dancer', label: 'Ballet Dancer En Pointe',
        theme_frag: 'The subject performs a breathtaking en pointe arabesque in a grand performance hall. One leg extended behind, arms in graceful port de bras. Tutu creates perfect circular silhouette. Spotlight creates her world. Serene transcendent expression of pure art.',
        wardrobe_frag: 'Classical white tutu with delicate crystal details. Pink satin pointe shoes with satin ribbons up ankles. Hair in classic ballet bun with crystal pins. Stage makeup.',
        scene_frag: 'Grand opera house stage. Single spotlight. Orchestra pit visible below. Ornate gilded balconies in darkness. Empty vast stage with only the dancer.',
        lighting_frag: 'Single dramatic spotlight from above creating pool of light on stage. Everything else in darkness. Theatrical elegance. 85mm, f/1.8.',
        alt_scenes: [
          { label: 'Rainy street dance', frag: 'Empty city street at night in the rain. She dances in pointe shoes on wet asphalt. Streetlamp as spotlight. Puddles reflect her form. Raw artistic freedom.' },
          { label: 'Studio mirror practice', frag: 'Ballet studio with barre and full-wall mirror. Morning light through tall windows. She practices alone. Wooden floor, piano in corner. Dedication.' }
        ],
        alt_wardrobes: [
          { label: 'Contemporary modern', frag: 'Contemporary dance outfit: flowing earth-toned wrap skirt, simple leotard, bare feet. Hair down and free. Modern dance expression.' },
          { label: 'Swan Lake black swan', frag: 'Black swan costume: dramatic black tutu with feather details, dark crown, intense dark eye makeup. The seductive dark counterpart.' }
        ],
        alt_lightings: [
          { label: 'Rainy streetlamp', frag: 'Single warm streetlamp creating pool of light in rain. Reflections in puddles. 50mm, f/1.8.' },
          { label: 'Studio morning natural', frag: 'Soft natural morning light through tall windows. Warm on wooden floor. 85mm, f/2.0.' }
        ]
      },
      { value: 'climbing', label: 'Rock Climber Summit',
        theme_frag: 'The subject reaches the summit of a dramatic rock face, pulling herself over the final edge. One hand grips rock, the other reaches for the top. Muscles defined with effort. Chalk on hands. Below: massive drop and beautiful landscape. Triumphant relief expression.',
        wardrobe_frag: 'Technical climbing outfit: fitted tank top, climbing pants, approach shoes (on harness). Chalk bag at hip, harness with quickdraws. Chalk-covered hands. Hair tied back.',
        scene_frag: 'Dramatic cliff face summit. Vast mountain landscape below stretching to horizon. Sunset sky in warm oranges and purples. Clouds below the summit.',
        lighting_frag: 'Warm sunset sidelight highlighting muscle definition and chalk texture. Dramatic depth below. 35mm, f/2.8.',
        alt_scenes: [
          { label: 'Indoor gym bouldering', frag: 'Modern climbing gym interior. Colorful holds on overhanging wall. She hangs from a difficult problem. Other climbers spot below. Chalk dust.' },
          { label: 'Ice wall climbing', frag: 'Frozen waterfall ice climbing. Ice axes planted in blue-white ice wall. Frost on gear. Breath visible. Extreme alpine environment.' }
        ],
        alt_wardrobes: [
          { label: 'Alpine full gear', frag: 'Full alpine climbing gear: insulated jacket, crampons, ice axes, helmet, rope coiled over shoulder. Expedition-ready for extreme conditions.' },
          { label: 'Bouldering casual', frag: 'Casual bouldering outfit: sports bra and leggings, climbing shoes, chalk bag. Hair in messy bun. Relaxed gym session look.' }
        ],
        alt_lightings: [
          { label: 'Gym artificial', frag: 'Bright modern gym lighting. Colorful holds creating color palette. Clean indoor sport aesthetic. 35mm, f/2.0.' },
          { label: 'Ice blue alpine', frag: 'Cold blue alpine light. Ice reflections. Harsh winter sun. Breath visible as steam. 50mm, f/2.8.' }
        ]
      },
      { value: 'equestrian', label: 'Equestrian Champion',
        theme_frag: 'The subject on horseback clearing a massive jump at a show jumping competition. Horse and rider in perfect sync mid-air. Her posture is textbook: heels down, eyes forward, hands following the horse neck. Arena gasps. Composed athletic concentration.',
        wardrobe_frag: 'Traditional show jumping attire: navy competition jacket, white breeches, tall black riding boots, white gloves. Velvet helmet. Hair in neat net bun under helmet. Number pinned to jacket.',
        scene_frag: 'Grand prix show jumping arena. Massive decorated jump with poles and flowers. Sand arena, white fencing. Packed grandstands. Sponsor banners.',
        lighting_frag: 'Bright outdoor competition lighting. Frozen mid-jump detail. Horse and rider both sharp. 200mm, f/2.8 telephoto.',
        alt_scenes: [
          { label: 'Country trail ride', frag: 'Countryside trail ride at golden hour. Open fields, stone walls, autumn trees. Horse walks calmly. Peaceful riding in nature.' },
          { label: 'Stable morning care', frag: 'Beautiful stable interior at morning. She grooms the horse gently. Hay, tack on walls, warm light through barn door. Bond between horse and rider.' }
        ],
        alt_wardrobes: [
          { label: 'Casual riding', frag: 'Casual riding outfit: polo shirt, beige jodhpurs, paddock boots with half chaps. Helmet. Relaxed training day look.' },
          { label: 'Cross-country endurance', frag: 'Cross-country eventing gear: body protector vest, air vest, race colors. Mud on boots and horse. Endurance and bravery.' }
        ],
        alt_lightings: [
          { label: 'Country golden hour', frag: 'Warm golden countryside light. Long shadows on fields. 85mm, f/2.0.' },
          { label: 'Stable barn door', frag: 'Warm natural light through stable door. Dust and hay particles. 50mm, f/2.0.' }
        ]
      },
      { value: 'martial_arts', label: 'Martial Arts Flying Kick',
        theme_frag: 'The subject executes a perfect flying kick in a traditional dojo. Body horizontal in air, kicking leg fully extended. Hair and uniform flow with movement. Boards shatter on impact. Expression of complete focused power and discipline.',
        wardrobe_frag: 'Traditional black martial arts uniform (dobok/gi) with black belt. Bare feet. Uniform snaps with the kick. Clean pressed, competition ready.',
        scene_frag: 'Traditional martial arts dojo: wooden floor, calligraphy scrolls on walls, weapons display. Sunlight streams through paper screen doors. Boards shattering from the kick.',
        lighting_frag: 'Dramatic sidelight through paper screens. Board fragments frozen in detail. Warm dojo wood tones. 35mm, f/2.0.',
        alt_scenes: [
          { label: 'Mountain temple training', frag: 'Ancient mountain temple courtyard. Stone steps, incense, bonsai trees. Morning mist. She trains forms among centuries of tradition.' },
          { label: 'Competition ring spotlight', frag: 'Martial arts competition ring. Single spotlight. She performs kata for judges. Crowd in darkness watches. Precision and art.' }
        ],
        alt_wardrobes: [
          { label: 'Wushu silk uniform', frag: 'Traditional Chinese wushu silk uniform in red with gold dragon embroidery. Flowing sleeves. Wushu broadsword in hand. Theatrical and athletic.' },
          { label: 'Modern MMA fighter', frag: 'Modern female MMA gear: sports bra, fight shorts, wraps, mouthguard. Octagon fence behind. Contemporary combat sports.' }
        ],
        alt_lightings: [
          { label: 'Temple morning mist', frag: 'Soft misty morning light at mountain temple. Cool blue with warm golden accents. 50mm, f/2.0.' },
          { label: 'Competition spotlight', frag: 'Single bright spotlight on competitor. Dark arena around. Dramatic performance lighting. 85mm, f/2.0.' }
        ]
      }
    ],
    couple_group: [
      { value: 'relay_team', label: 'Track Relay Team',
        theme_frag: 'Subjects as a relay team at the moment of the final baton pass. Lead runner reaches back while anchor runner lunges forward. Frozen at the instant of the exchange. Stadium roars. Every muscle and tendon visible. Explosive teamwork.',
        wardrobe_frag: 'Matching team track uniforms in national colors. Sprint spikes, race bibs with numbers. Minimal but high-tech athletic gear. Sweat glistens.',
        scene_frag: 'Olympic-style track stadium. Red track surface, white lane lines. Packed stadium. Electronic timing board visible. Exchange zone marked.',
        lighting_frag: 'Bright stadium floodlights freezing the baton pass. Every detail sharp. 200mm, f/2.8 telephoto.',
        alt_scenes: [
          { label: 'Finish line celebration', frag: 'Crossing the finish line together as a team. Arms around each other. Clock shows new record. Flags waving. Tears and celebration.' },
          { label: 'Warm-up track morning', frag: 'Early morning warm-up on empty track. Team jogs together. Morning mist on field. Quiet preparation and team bonding.' }
        ],
        alt_wardrobes: [
          { label: 'Warm-up national team', frag: 'National team warm-up suits. Walking together through athlete tunnel toward the track. Flag patches on shoulders. Pre-race unity.' },
          { label: 'Podium ceremony suits', frag: 'On the medal podium in matching medal ceremony suits. Medals around necks. National flag draped over shoulders. Singing anthem.' }
        ],
        alt_lightings: [
          { label: 'Finish line flash', frag: 'Multiple camera flashes at finish line. Confetti golden. Emotional warm lighting. 200mm, f/2.8.' },
          { label: 'Morning track mist', frag: 'Soft misty morning light on track. Cool, quiet, focused. 50mm, f/2.8.' }
        ]
      },
      { value: 'dance_duo', label: 'Dance Partners Lift',
        theme_frag: 'Two subjects in a dramatic dance partnership lift. He holds her above his head in a perfect lift, she arches gracefully. Both in perfect form — the trust and artistry of elite dance partnership. Emotional connection visible between them.',
        wardrobe_frag: 'Competition ballroom/ice dance costumes: he in fitted black with embellishments, she in flowing crystal-studded dress that catches light during the lift. Matching color accents.',
        scene_frag: 'Grand performance stage with single spotlight. Vast dark theater beyond. Smoke machine haze at floor level. The moment suspended in time.',
        lighting_frag: 'Single warm spotlight from above. Crystals on costume creating sparkle. Smoke diffusion at floor. 85mm, f/1.8.',
        alt_scenes: [
          { label: 'Outdoor sunset dance', frag: 'Dancing on a clifftop at sunset. Ocean below. Wind catches her dress. No audience — dancing for themselves. Freedom and passion.' },
          { label: 'Ballroom grand hall', frag: 'Ornate ballroom with chandeliers, gilded mirrors, marble floor. They dance alone in the center. Classical elegance and romance.' }
        ],
        alt_wardrobes: [
          { label: 'Tango red and black', frag: 'Tango outfits: he in all black with red shirt, she in slit red dress and heels. Passionate, intense, Argentine tango fire.' },
          { label: 'Contemporary minimal', frag: 'Contemporary dance: both in simple flowing neutral-colored outfits. Bare feet. Focus on movement and connection, not costume.' }
        ],
        alt_lightings: [
          { label: 'Sunset clifftop', frag: 'Golden sunset rim lighting. Ocean blue below. 50mm, f/2.0.' },
          { label: 'Chandelier ballroom', frag: 'Warm crystal chandelier light. Floor reflections. Classical golden atmosphere. 50mm, f/2.0.' }
        ]
      },
      { value: 'team_huddle', label: 'Team Victory Huddle',
        theme_frag: 'Subjects form a tight team huddle circle, arms over each others shoulders, heads together. Shot from low angle looking up into their determined faces. They break the huddle with a team shout. Unity, determination, brotherhood/sisterhood. Fire in every eye.',
        wardrobe_frag: 'Matching team jerseys with individual numbers and names. Grass stains, sweat, game wear. Shared team colors bind them. Captain armband on one.',
        scene_frag: 'Stadium pitch at twilight. Floodlights create dramatic beams. The huddle is center pitch. Scoreboard shows tight score. Everything rides on this moment.',
        lighting_frag: 'Dramatic low-angle stadium floodlights creating halos behind each head. Warm twilight ambient. 16mm fisheye from center of huddle.',
        alt_scenes: [
          { label: 'Locker room speech', frag: 'Team locker room. Everyone seated, captain stands and speaks. Whiteboard with plays behind. Pre-game intensity. Silence before the storm.' },
          { label: 'Championship confetti', frag: 'On-field championship celebration. Team lifts trophy together. Confetti cannon fires. Families rush the field. Pure joy chaos.' }
        ],
        alt_wardrobes: [
          { label: 'Practice gear casual', frag: 'Training bibs over practice kit. Relaxed training session but intense focus. Water bottles, cones on field. Building something together.' },
          { label: 'Suited award ceremony', frag: 'Team in matching suits at award ceremony. Seated together at long table. Trophy in center. Formal team portrait. Clean-up nicely.' }
        ],
        alt_lightings: [
          { label: 'Locker room intimate', frag: 'Warm locker room overhead light. Intimate, focused, team-only moment. 24mm wide-angle, f/2.0.' },
          { label: 'Confetti golden shower', frag: 'Bright golden confetti catching stadium lights. Warm celebration atmosphere. 35mm, f/2.8.' }
        ]
      },
      { value: 'adventure_race', label: 'Adventure Race Team',
        theme_frag: 'Subjects mid-race in an extreme obstacle course. One climbs a cargo net, another crawls under barbed wire, another carries a log. Mud everywhere. They encourage each other. Exhausted but pushing through. Gritty teamwork and mutual motivation.',
        wardrobe_frag: 'Matching team race shirts (soaked and muddied beyond recognition), athletic shorts, trail shoes caked in mud. Race bibs barely visible. Headbands, war paint.',
        scene_frag: 'Outdoor extreme obstacle course: mud pits, cargo nets, fire obstacles, water crossings. Spectators cheer from behind barriers. Natural terrain — hills, woods, mud.',
        lighting_frag: 'Overcast natural light with mud splash freeze-frame. Gritty, real, documentary-style. 35mm, f/2.8.',
        alt_scenes: [
          { label: 'Finish line mud celebration', frag: 'Crossing the finish line together covered head-to-toe in mud. Arms raised, hugging, laughing. Medal volunteer waits. Pure accomplishment.' },
          { label: 'Mountain summit team', frag: 'Team at a mountain summit. Sweaty, exhausted, elated. Holding team flag. Breathtaking panoramic view behind them.' }
        ],
        alt_wardrobes: [
          { label: 'Clean start line', frag: 'At the start line before the race: clean matching team shirts, fresh faces, nervous energy. The "before" version.' },
          { label: 'Viking run costumes', frag: 'Fun run costumes: Viking helmets, tutus, capes — worn over running gear. Covered in mud. Serious athleticism with ridiculous outfits.' }
        ],
        alt_lightings: [
          { label: 'Finish line bright', frag: 'Bright finish line arch lighting. Mud glistening. Celebration energy. 50mm, f/2.8.' },
          { label: 'Summit golden sunrise', frag: 'Golden sunrise at mountain summit. Warm light on sweaty faces. 35mm, f/2.8.' }
        ]
      },
      { value: 'yoga_group', label: 'Sunrise Yoga Circle',
        theme_frag: 'Subjects in a synchronized yoga pose on a scenic platform at sunrise. Various skill levels — each in their own version of the same pose. Peaceful harmony. Mountain landscape behind. Serene meditative expressions with eyes closed.',
        wardrobe_frag: 'Coordinated yoga attire in earth tones and pastels: leggings, tank tops, barefoot. Some with headbands. Yoga mats in complementary colors. Natural, organic fabrics.',
        scene_frag: 'Elevated wooden yoga platform overlooking mountain valley at sunrise. Morning mist in valley below. Orange-pink sky. Pine trees frame the scene.',
        lighting_frag: 'Warm golden sunrise from horizon creating rim light on each figure. Mist diffusion. Peaceful atmosphere. 35mm, f/4, all sharp.',
        alt_scenes: [
          { label: 'Beach wave edge', frag: 'Yoga on the beach at waters edge. Waves gently reach their mats. Sunset reflected in wet sand. Barefoot on warm sand.' },
          { label: 'Studio candlelight', frag: 'Indoor yoga studio with candles and plants. Warm ambient light. Polished wood floor. Incense smoke wisps. Intimate and peaceful.' }
        ],
        alt_wardrobes: [
          { label: 'White flowing', frag: 'All in matching white flowing yoga clothes. Minimalist and pure. Spiritual gathering aesthetic.' },
          { label: 'Colorful festival', frag: 'Colorful yoga festival outfits: tie-dye, patterns, accessories. Festival headbands, bracelets. Joyful yoga festival energy.' }
        ],
        alt_lightings: [
          { label: 'Beach sunset warm', frag: 'Warm beach sunset. Water reflections. Peaceful golden tones. 35mm, f/4.' },
          { label: 'Candle studio intimate', frag: 'Warm candlelight only. Soft shadows. Intimate peaceful glow. 50mm, f/2.0.' }
        ]
      },
      { value: 'surf_crew', label: 'Surf Crew Lineup',
        theme_frag: 'Group of surfer friends standing in knee-deep water holding surfboards vertically. Sunset behind creates epic silhouette. Boards of various sizes and colors. Everyone dripping wet, laughing, arms around each other. Post-session happiness and friendship.',
        wardrobe_frag: 'Mix of wetsuits (some pulled to waist), board shorts, rash guards. Wet hair in various states. Zinc sunscreen still visible. Casual surf culture style.',
        scene_frag: 'Beach at golden hour. Waist-deep in calm shorebreak water. Waves roll in behind. Palm-lined beach visible. Classic surf break setting.',
        lighting_frag: 'Golden sunset backlight creating silhouettes with rim lighting. Water sparkles. 35mm, f/2.8.',
        alt_scenes: [
          { label: 'Van life beach camp', frag: 'Beach parking lot with surf vans. Boards on roof racks. Group sits on tailgate. Campfire starting. Post-surf van-life culture.' },
          { label: 'Tropical reef lineup', frag: 'Sitting on surfboards in a lineup waiting for waves. Tropical reef water — crystal clear turquoise. Perfect day.' }
        ],
        alt_wardrobes: [
          { label: 'Retro 70s surf', frag: 'Retro 70s surf aesthetic: short board shorts, colorful rash guards, vintage boards. Long hair, mustaches, surf culture golden era.' },
          { label: 'Competition jerseys', frag: 'Competition rash guard jerseys with numbers. Serious competitive surf lineup. Tournament energy before the heat starts.' }
        ],
        alt_lightings: [
          { label: 'Van campfire night', frag: 'Warm campfire on faces. Cool twilight sky. Cozy surf-culture atmosphere. 35mm, f/2.0.' },
          { label: 'Tropical bright midday', frag: 'Bright tropical midday sun. Crystal water reflections. Vivid colors. 35mm, f/4.' }
        ]
      },
      { value: 'rock_climb_team', label: 'Climbing Team Summit',
        theme_frag: 'Subjects reach a mountain summit together, roped in as a team. They plant a flag at the peak. 360-degree panoramic view of mountain ranges below. Exhausted, elated, united. Arms around each other. The culmination of an epic climb.',
        wardrobe_frag: 'Alpine climbing gear: insulated jackets, harnesses, helmets, crampons. Rope connects them. Sunglasses, glacier goggles. Frost on beards and eyelashes.',
        scene_frag: 'Mountain summit above the clouds. Snow and rock peak. 360-degree panorama of mountain ranges. Blue sky above, cloud sea below. Flag snaps in wind.',
        lighting_frag: 'Brilliant high-altitude sunlight. Clean harsh light on snow. Blue sky as fill. 24mm wide-angle, f/4, all sharp.',
        alt_scenes: [
          { label: 'Base camp tent city', frag: 'Mountaineering base camp: colorful tents on glacier. Prayer flags strung between poles. Massive mountain face rising behind. Pre-summit anticipation.' },
          { label: 'Crevasse crossing', frag: 'Crossing a deep glacier crevasse on an aluminum ladder. Rope attached. Blue ice walls below. Terrifying and exhilarating team moment.' }
        ],
        alt_wardrobes: [
          { label: 'Base camp casual', frag: 'Base camp relaxed gear: down jackets, thermal pants, camp shoes. Sitting in mess tent. Sharing meal. Maps spread out. Planning day.' },
          { label: 'Full expedition load', frag: 'Full expedition load: massive backpacks, oxygen bottles strapped on, multiple layers. The heaviest, hardest version. Summit push gear.' }
        ],
        alt_lightings: [
          { label: 'Base camp warm tent', frag: 'Warm tent interior light. Cold blue glacier exterior through door. 35mm, f/2.0.' },
          { label: 'Crevasse ice blue', frag: 'Blue-white light reflecting off glacier ice. Deep blue crevasse below. Harsh and cold. 24mm, f/2.8.' }
        ]
      }
    ]
  }
},

// ======================================================================
// 6. MUSIC & PERFORMANCE
// ======================================================================
music_performance: {
  label: 'Music & Performance',
  characters: {
    male: [
      { value: 'rockstar', label: 'Rock Star Stadium',
        theme_frag: 'The subject stands at the front of a massive stadium stage, guitar in hand, playing a power chord. Pyrotechnics blast behind. Crowd of thousands with phones and lighters. He leans into the microphone with raw energy. Passionate rock-god expression.',
        wardrobe_frag: 'Rock star outfit: leather jacket (open) over band tee, tight black jeans, leather boots with chains. Silver rings and bracelets. Guitar strap with studs.',
        scene_frag: 'Massive outdoor stadium stage. Giant LED screens showing close-up. Pyrotechnic flames shoot up behind. Sea of fans with lights stretching into darkness.',
        lighting_frag: 'Stage pyrotechnics as dramatic backlight. Cool blue stage wash. Single warm spot on face. 50mm, f/2.0.',
        alt_scenes: [
          { label: 'Intimate club gig', frag: 'Small dark rock club. Low ceiling, packed crowd inches from stage. Sweat drips from ceiling. Raw, loud, intimate. Real rock and roll.' },
          { label: 'Recording studio', frag: 'Professional recording studio. He plays guitar in the live room. Headphones on. Through the glass: producer at mixing desk. Creative process.' }
        ],
        alt_wardrobes: [
          { label: 'Classic rock 70s', frag: 'Classic 70s rock: open velvet shirt, tight flared pants, platform boots. Long hair. Hendrix-meets-Bowie theatrical glamour.' },
          { label: 'Punk raw', frag: 'Punk aesthetic: torn band shirt, safety pins, combat boots, spiked bracelet. Mohawk or messy. DIY rebellion energy.' }
        ],
        alt_lightings: [
          { label: 'Club red sweaty', frag: 'Red stage light in sweaty club. Bodies pressed close. Intimate and intense. 35mm, f/2.0.' },
          { label: 'Studio warm booth', frag: 'Warm studio lighting through glass. Headphone glow. Professional creative mood. 85mm, f/1.8.' }
        ]
      },
      { value: 'rapper', label: 'Rapper Music Video',
        theme_frag: 'The subject in a cinematic rap music video setup. He stands under a single spotlight, microphone in hand, rapping with intensity. Fog machines create atmosphere. Entourage blurred behind. Chain and watch catch light. Confident commanding expression.',
        wardrobe_frag: 'Designer streetwear: oversized designer hoodie or jacket, premium sneakers, multiple gold chains, diamond-encrusted watch. Designer sunglasses. Drip aesthetic.',
        scene_frag: 'Music video set with dramatic fog, colored LED panels, luxury cars in background. Single spotlight creates subject focus. Purple and gold color scheme.',
        lighting_frag: 'Dramatic single spotlight with colored fog (purple, gold). LED panels as accent. Jewelry catching every light source. 50mm, f/1.8.',
        alt_scenes: [
          { label: 'Penthouse flex', frag: 'Luxury penthouse with city views. Champagne, designer furniture, LED ambient. He raps on the balcony. Lifestyle and excess.' },
          { label: 'Street corner authentic', frag: 'Real street corner where it all started. Bodega, fire hydrant, basketball court behind. Authentic origins. Keeping it real.' }
        ],
        alt_wardrobes: [
          { label: 'All-white designer', frag: 'Head-to-toe white: white fur coat, white jeans, white sneakers, platinum jewelry. Clean, flex, powerful statement.' },
          { label: 'Street authentic', frag: 'Simple street clothes: plain white tee, jeans, clean sneakers. Single chain. No designer logos. Authenticity over flex.' }
        ],
        alt_lightings: [
          { label: 'Penthouse night city', frag: 'Cool city light through windows. Warm interior ambient. Luxury nighttime mood. 35mm, f/2.0.' },
          { label: 'Street golden hour', frag: 'Warm golden-hour street light. Real, authentic, documentary feel. 50mm, f/2.0.' }
        ]
      },
      { value: 'dj', label: 'DJ Festival Mainstage',
        theme_frag: 'The subject behind the decks at a massive music festival mainstage. Hands on mixer, headphones on one ear. Behind: massive LED wall displaying visuals. Below: ocean of dancing fans. He points to the crowd hyping them. Euphoric energy expression.',
        wardrobe_frag: 'Festival DJ style: branded bomber jacket, designer tee, sneakers. LED wristband. Signature headphones around neck. Casual-cool DJ aesthetic.',
        scene_frag: 'Massive festival main stage. Giant LED wall with kaleidoscopic visuals. CO2 cannons, laser beams, confetti. Crowd of 50,000+ with hands raised.',
        lighting_frag: 'Spectacular festival lighting: lasers in multiple colors, LED wall as massive backlight. Confetti catching beams. 24mm wide-angle, f/2.8.',
        alt_scenes: [
          { label: 'Underground club booth', frag: 'Dark underground club. DJ booth surrounded by dancing crowd. Minimal lighting — just strobes and a single red light. Raw techno energy.' },
          { label: 'Sunset beach party', frag: 'Beach DJ set at sunset. Portable decks on wooden platform. Dancers on sand. Ocean and sunset as backdrop. Ibiza energy.' }
        ],
        alt_wardrobes: [
          { label: 'All-black techno', frag: 'All-black minimal: black tee, black jeans, black sneakers. No branding. Underground techno aesthetic. Music speaks.' },
          { label: 'Festival flamboyant', frag: 'Flamboyant festival outfit: sequin jacket, colorful pants, LED shoes. Face gems, body paint. Maximum festival energy.' }
        ],
        alt_lightings: [
          { label: 'Underground strobe', frag: 'Harsh strobe freeze-frame in dark club. Red accent light. Minimal. 35mm, f/2.0.' },
          { label: 'Beach sunset warm', frag: 'Warm sunset through palm trees. Tiki torch accents. 35mm, f/2.8.' }
        ]
      },
      { value: 'jazz', label: 'Jazz Musician Smoky Club',
        theme_frag: 'The subject plays saxophone in a smoky jazz club. Eyes closed, body swaying with the music. Single spotlight picks him out. Smoke curls around the instrument bell. Other musicians in soft focus behind. Lost in the music expression.',
        wardrobe_frag: 'Classic jazz cool: slim-fit dark suit, unbuttoned collar white shirt (no tie), polished shoes. Subtle pocket square. The instrument is the main accessory.',
        scene_frag: 'Intimate jazz club. Small stage, close tables, dim lighting. Exposed brick walls, vintage posters. Audience listening intently. Smoke haze atmospheric.',
        lighting_frag: 'Single warm spotlight through smoke haze. Rich amber tones. Intimate, smoky, atmospheric. 85mm, f/1.4.',
        alt_scenes: [
          { label: 'Street corner blues', frag: 'Playing on a street corner at night. Open instrument case with tips. City lights and passing pedestrians. Real street music authenticity.' },
          { label: 'Recording session vintage', frag: 'Vintage recording studio. Ribbon microphone, wood panels, analog equipment. Blue Note Records aesthetic. Classic jazz recording session.' }
        ],
        alt_wardrobes: [
          { label: 'Hipster modern jazz', frag: 'Modern jazz: turtleneck, glasses, beret, fitted pants. Contemporary cool. Coffee shop jazz session. Intellectual musician.' },
          { label: 'Zoot suit retro', frag: 'Classic zoot suit: oversized jacket, wide-leg pants, chain, fedora tilted. 1940s Harlem Renaissance jazz style.' }
        ],
        alt_lightings: [
          { label: 'Street neon night', frag: 'Neon sign glow from nearby shops. Cool night ambient. 50mm, f/2.0.' },
          { label: 'Vintage studio warm', frag: 'Warm wood panel studio reflections. Single ribbon mic spotlight. Analog warmth. 85mm, f/1.8.' }
        ]
      },
      { value: 'orchestra', label: 'Orchestra Conductor',
        theme_frag: 'The subject conducts a full symphony orchestra with dramatic authority. Baton raised at the climax of the piece. Every musician follows his gesture. His back to the audience, turned to camera over his shoulder. Intense passionate commanding expression.',
        wardrobe_frag: 'Formal black tailcoat, white wing-collar shirt, white bow tie. Hair slightly disheveled from the passion of conducting. Baton in right hand, left hand sculpts the air.',
        scene_frag: 'Grand concert hall stage. Full orchestra of 80+ musicians visible. Ornate ceiling, crystal chandeliers in house lights dimmed. Packed audience in formal attire.',
        lighting_frag: 'Warm stage lighting from above. Orchestra in soft fill. House lights dimmed. Dramatic classical concert atmosphere. 85mm, f/2.0.',
        alt_scenes: [
          { label: 'Outdoor amphitheater', frag: 'Ancient stone amphitheater under stars. Orchestra on stage, stars above. Magical open-air classical concert. Fireflies.' },
          { label: 'Rehearsal empty hall', frag: 'Empty concert hall during rehearsal. No audience. He stops the orchestra, gives notes. Working the craft. Intimate creative moment.' }
        ],
        alt_wardrobes: [
          { label: 'Casual rehearsal', frag: 'Casual rehearsal attire: black turtleneck, dark trousers. Rolled sleeves. More relaxed, more intimate. The working conductor.' },
          { label: 'Vintage maestro', frag: 'Vintage maestro: frock coat, ascot, dramatic cape draped over one shoulder. Theatrical old-world conductor grandeur.' }
        ],
        alt_lightings: [
          { label: 'Starlight amphitheater', frag: 'Cool starlight mixed with warm stage light. Ancient stone ambient. 35mm, f/2.0.' },
          { label: 'Rehearsal work lights', frag: 'Bright rehearsal work lights. No drama — just craft. Clean, practical. 50mm, f/2.8.' }
        ]
      },
      { value: 'country_singer', label: 'Country Star Stage',
        theme_frag: 'The subject performs on a honky-tonk stage with an acoustic guitar, singing into a vintage microphone. Boot on a monitor wedge, leaning into the performance. String lights and rustic wood behind. The crowd claps along. Soulful authentic storytelling expression.',
        wardrobe_frag: 'Modern country: fitted denim shirt with pearl snaps, dark jeans, cowboy boots, leather belt with silver buckle. Cowboy hat. Acoustic guitar with strap.',
        scene_frag: 'Authentic honky-tonk venue: wooden stage, neon beer signs, string lights. Intimate crowd with cowboy hats. Dance floor with couples two-stepping.',
        lighting_frag: 'Warm string lights and neon beer signs creating honky-tonk atmosphere. Single warm spotlight on performer. 50mm, f/2.0.',
        alt_scenes: [
          { label: 'Campfire acoustic', frag: 'Campfire in the countryside. He plays guitar on a log. Stars above, open fields. Friends listen. Simple, authentic, country soul.' },
          { label: 'Stadium country tour', frag: 'Massive country music stadium concert. Giant screen, pyrotechnics, mainstream country production. Sold-out arena tour moment.' }
        ],
        alt_wardrobes: [
          { label: 'Classic Outlaw', frag: 'Outlaw country style: all-black (man-in-black tribute), silver jewelry, long hair. Rebel country aesthetic. Johnny Cash energy.' },
          { label: 'Modern Nashville', frag: 'Modern Nashville: fitted blazer over graphic tee, designer jeans, clean boots. Contemporary country meets city style.' }
        ],
        alt_lightings: [
          { label: 'Campfire warm glow', frag: 'Warm campfire as only light. Stars above. Intimate and authentic. 50mm, f/2.0.' },
          { label: 'Stadium production', frag: 'Full stadium lighting production: spots, washes, confetti. Professional concert scale. 35mm, f/2.8.' }
        ]
      },
      { value: 'pianist', label: 'Grand Piano Virtuoso',
        theme_frag: 'The subject at a grand piano on a vast dark stage. Only the piano and pianist lit. Fingers blur over keys in a passionate passage. Eyes closed, body sways with the music. Completely lost in the performance. Raw emotional transcendence.',
        wardrobe_frag: 'Classic concert pianist attire: black suit jacket (no tails), white shirt open at collar. Hair dramatic. Sleeves show wrists and watch during playing.',
        scene_frag: 'Vast dark concert stage. Only the Steinway grand piano and pianist in a pool of warm light. Polished piano surface reflects his image. Audience invisible in darkness.',
        lighting_frag: 'Single warm spotlight on pianist and piano. Piano surface as reflector. Complete darkness beyond. Intimate and dramatic. 85mm, f/1.4.',
        alt_scenes: [
          { label: 'Abandoned cathedral', frag: 'An old piano in an abandoned cathedral. Sunlight streams through broken stained glass. Pigeons and dust. Hauntingly beautiful setting.' },
          { label: 'Rooftop piano sunset', frag: 'Grand piano on a city rooftop at sunset. City skyline behind. Wind ruffles sheet music. Magical impossible setting.' }
        ],
        alt_wardrobes: [
          { label: 'Casual genius', frag: 'Casual approach: simple black tee, jeans. Barefoot on pedals. Hair messy. Prodigy-level talent with zero pretension.' },
          { label: 'Full concert tails', frag: 'Full concert tailcoat, white bow tie, patent leather shoes. Traditional classical concert pianist formal attire. The full tradition.' }
        ],
        alt_lightings: [
          { label: 'Cathedral stained glass', frag: 'Colorful stained glass light beams. Dust particles floating. Sacred and beautiful. 35mm, f/2.0.' },
          { label: 'Rooftop sunset', frag: 'Warm golden sunset backlighting. City lights beginning below. 50mm, f/2.0.' }
        ]
      }
    ],
    female: [
      { value: 'pop_diva', label: 'Pop Diva Arena',
        theme_frag: 'The subject performs center stage at a massive pop concert. She hits the high note with microphone raised, other arm reaching to the crowd. Dancers in formation behind. LED stage beneath feet glows. Wind machine blows hair dramatically. Powerful star expression.',
        wardrobe_frag: 'Show-stopping pop performance outfit: crystal-encrusted bodysuit with dramatic shoulder pieces, thigh-high metallic boots. Statement earrings. Wireless mic headset. Hair styled to flow.',
        scene_frag: 'Massive pop arena concert stage. LED floor, moving set pieces, video walls. Dancers in formation. Crowd with coordinated light sticks. Full production spectacle.',
        lighting_frag: 'Full concert production lighting: multiple colored spots, LED floor glow, laser fans. Dramatic and spectacular. 50mm, f/2.0.',
        alt_scenes: [
          { label: 'Music video mansion', frag: 'Luxury mansion music video set. Grand staircase, marble floors, gold accents. She descends the stairs with dancers following. Cinematic production.' },
          { label: 'Intimate acoustic', frag: 'Stripped-down acoustic performance on a small stage with just a guitar and stool. Single spotlight. Raw vocal power. Vulnerability and strength.' }
        ],
        alt_wardrobes: [
          { label: 'Glamorous gown', frag: 'Dramatic floor-length gown with long train. Diamonds everywhere. Hair swept up. Ballad performance look — pure vocal moment.' },
          { label: 'Streetwear pop', frag: 'Urban pop look: oversized crop hoodie, sneakers, bucket hat, chunky jewelry. Dance-ready street style. Authentic yet trendy.' }
        ],
        alt_lightings: [
          { label: 'Mansion cinematic', frag: 'Cinematic warm mansion interior lighting. Crystal chandelier bokeh. Movie-quality production. 50mm, f/2.0.' },
          { label: 'Acoustic single spot', frag: 'Single warm spotlight on stool and performer. Dark intimate venue. 85mm, f/1.4.' }
        ]
      },
      { value: 'violinist', label: 'Electric Violinist',
        theme_frag: 'The subject plays an electric violin on a futuristic stage. Body moves with the music, violin glowing with LED strings. Hair whips as she throws herself into the performance. Light show synchronized to her playing. Passionate transcendent expression.',
        wardrobe_frag: 'Futuristic performance outfit: sleek black bodysuit with LED accents, thigh-high boots, dramatic flowing cape. Electric violin with glowing elements. Hair styled with metallic accents.',
        scene_frag: 'Futuristic concert stage with holographic projections responding to the music. Geometric light structures, lasers, atmospheric fog. Part classical, part electronic music event.',
        lighting_frag: 'Laser and holographic light show synchronized to music. LED instrument glow. Dramatic colored spots. 50mm, f/2.0.',
        alt_scenes: [
          { label: 'Ancient ruins concert', frag: 'Playing in ancient Roman ruins at night. Stone columns, moonlight, candles lining the ruins. Classical meets timeless setting. Magical juxtaposition.' },
          { label: 'Rooftop dawn solo', frag: 'Playing solo on a rooftop at dawn. First light breaks over city. Only the violin and the sunrise. Solitary and beautiful.' }
        ],
        alt_wardrobes: [
          { label: 'Classical elegant', frag: 'Elegant classical: flowing black gown, diamond earrings, traditional wooden violin. Classical concert elegance. Timeless and refined.' },
          { label: 'Punk rock violinist', frag: 'Punk rock style: torn band tee, leather skirt, combat boots. Playing electric violin like a guitar. Rock rebellion meets classical skill.' }
        ],
        alt_lightings: [
          { label: 'Ruins moonlight candle', frag: 'Cool blue moonlight mixed with warm candlelight on ancient stone. 85mm, f/1.8.' },
          { label: 'Dawn first light', frag: 'Soft cool dawn transitioning to warm sunrise on face. City below in blue hour. 50mm, f/2.0.' }
        ]
      },
      { value: 'opera_singer', label: 'Opera Soprano Stage',
        theme_frag: 'The subject performs the aria climax on a grand opera stage. Arms raised, face tilted upward, delivering the impossibly powerful note. Orchestra in pit below. Grand set behind with dramatic staging. Standing ovation about to erupt. Transcendent vocal power expression.',
        wardrobe_frag: 'Opera performance gown: dramatic Baroque-inspired costume in deep burgundy and gold. Elaborate headpiece, opera gloves. The costume tells the character story.',
        scene_frag: 'Grand opera house stage with elaborate painted backdrop, massive props. Orchestra pit with conductor. Multiple levels of gilded balconies with rapt audience.',
        lighting_frag: 'Warm dramatic opera stage lighting. Multiple colored gels. Follow-spot on the soprano. 85mm, f/2.0.',
        alt_scenes: [
          { label: 'Lakeside amphitheater', frag: 'Floating stage on a lake. Alps in background. Open-air opera performance. Stars above, water reflecting stage lights. Bregenz-style spectacle.' },
          { label: 'Backstage preparation', frag: 'Backstage dressing room. Mirrors with bulb lights. She applies stage makeup. Costumes hanging. Flowers from admirers. Pre-performance ritual.' }
        ],
        alt_wardrobes: [
          { label: 'Modern opera minimal', frag: 'Modern opera production: minimalist black dress, dramatic red shoes. Contemporary staging strip away tradition for raw emotional power.' },
          { label: 'Full Valkyrie armor', frag: 'Full operatic Valkyrie costume: winged helmet, armor, spear. Dramatic Norse warrior diva. Full Wagner spectacle.' }
        ],
        alt_lightings: [
          { label: 'Lake reflection night', frag: 'Stage light reflecting off lake water. Stars and mountain silhouette. 35mm, f/2.0.' },
          { label: 'Dressing room bulbs', frag: 'Warm dressing room mirror bulbs creating even face light. Intimate preparation mood. 85mm, f/1.8.' }
        ]
      },
      { value: 'flamenco', label: 'Flamenco Dancer Fire',
        theme_frag: 'The subject dances flamenco with fierce passion. Mid-turn, skirt fans out in a perfect circle. Arms in classic flamenco position overhead. Feet stamp on wooden floor creating dust. Guitarist visible behind. Fire in her eyes, absolute passionate power.',
        wardrobe_frag: 'Traditional flamenco dress: fitted bodice in red and black, dramatic ruffled skirt (bata de cola), hair in tight bun with red rose. Large gold hoop earrings. Castanets on fingers.',
        scene_frag: 'Intimate flamenco tablao in Seville. Small wooden stage, audience at close tables. Guitarist and singer accompany. Brick arches, candlelight. Raw authentic flamenco venue.',
        lighting_frag: 'Warm candlelight and single overhead spot. Skirt motion frozen. Dramatic contrast. Intimate Spanish atmosphere. 85mm, f/1.8.',
        alt_scenes: [
          { label: 'Plaza street performance', frag: 'Seville plaza at night. She dances on cobblestones. Tourists and locals circle and clap. Guitar player on a bench. Spontaneous street art.' },
          { label: 'Modern stage fusion', frag: 'Modern theater stage. Flamenco meets contemporary: minimal set, dramatic lighting design. Solo performance. Art form elevated.' }
        ],
        alt_wardrobes: [
          { label: 'Modern flamenco fusion', frag: 'Contemporary flamenco: black fitted outfit, flowing sheer overskirt, bare feet instead of shoes. Modern dancer interpretation of traditional form.' },
          { label: 'Rehearsal casual', frag: 'Practice clothes: fitted top, long practice skirt, character shoes. Hair loose. In the studio working the choreography. Sweat and passion.' }
        ],
        alt_lightings: [
          { label: 'Plaza lamppost night', frag: 'Warm lamp post light on cobblestones. Surrounding darkness. Natural street flamenco atmosphere. 50mm, f/2.0.' },
          { label: 'Modern stage dramatic', frag: 'Dramatic modern stage lighting design. Stark contrasts. Single color washes. 35mm, f/2.0.' }
        ]
      },
      { value: 'singer_songwriter', label: 'Singer-Songwriter Cafe',
        theme_frag: 'The subject performs in an intimate cafe setting. Seated on a stool with acoustic guitar, singing with eyes closed into a vintage microphone. Small audience captivated. Raw, emotional, authentic. Vulnerable and powerful.',
        wardrobe_frag: 'Effortless bohemian style: oversized vintage cardigan, worn jeans, boots. Simple jewelry — thin chain, small earrings. Hair natural and flowing. Authentic, real.',
        scene_frag: 'Small intimate cafe/bar. Exposed brick, bookshelf backdrop, warm Edison bulb string lights. Tiny stage just inches from the audience. Coffee and wine on nearby tables.',
        lighting_frag: 'Warm Edison bulb string lights as main illumination. Soft, intimate, golden. 85mm, f/1.4.',
        alt_scenes: [
          { label: 'Bedroom recording', frag: 'Bedroom home studio. Laptop, small interface, headphones, microphone. Fairy lights, posters on walls. Where the songs are born. Authentic and personal.' },
          { label: 'Campfire acoustic', frag: 'Playing around a campfire for friends. Forest clearing, stars above. Faces lit by fire. Simple, intimate, unforgettable performance.' }
        ],
        alt_wardrobes: [
          { label: 'Festival stage boho', frag: 'Festival stage outfit: crochet top, denim shorts, flower crown, fringe boots. Bohemian festival queen. Singing to thousands with folk roots.' },
          { label: 'All-black Nashville', frag: 'Nashville songwriter black: black blazer, black top, dark jeans, boots. Serious songwriting craft. Less bohemian, more literary.' }
        ],
        alt_lightings: [
          { label: 'Bedroom fairy lights', frag: 'Warm fairy lights and laptop screen glow. Intimate personal space. 50mm, f/1.8.' },
          { label: 'Campfire warmth', frag: 'Warm fire glow on faces. Cool night sky above. 35mm, f/2.0.' }
        ]
      },
      { value: 'edm_producer', label: 'EDM Producer/DJ',
        theme_frag: 'The subject behind a massive DJ setup at a beach festival. Sunset behind the stage creates incredible backdrop. She raises one hand to the crowd while the other drops the bass. Crowd erupts. Confetti and CO2 cannons fire. Euphoric commanding expression.',
        wardrobe_frag: 'Festival EDM style: iridescent crop top, high-waisted shorts, platform sneakers with LED soles. Body glitter, glow stick bracelets, statement sunglasses.',
        scene_frag: 'Beach music festival at sunset. Main stage on the sand. Ocean behind. Crowd of thousands in festival gear. Massive LED wall with visuals. Sunset sky blazes.',
        lighting_frag: 'Dramatic sunset backlight mixed with festival stage production lighting. Warm sky, cool stage lights. 35mm, f/2.8.',
        alt_scenes: [
          { label: 'Studio producer mode', frag: 'Professional music production studio. Multiple screens, synthesizers, drum machines. She produces a track with headphones on. Creative technical space.' },
          { label: 'Warehouse rave', frag: 'Underground warehouse rave. Bare concrete, industrial setting. Minimal setup — just decks and speakers. Strobe lights. Raw underground energy.' }
        ],
        alt_wardrobes: [
          { label: 'Studio casual tech', frag: 'Studio casual: oversized tee, joggers, headphones around neck. Minimal makeup. Creative working mode. Focused producer.' },
          { label: 'Rave underground', frag: 'Underground rave look: all-black with reflective accents, utility harness, combat boots. Glow sticks. Techno warrior aesthetic.' }
        ],
        alt_lightings: [
          { label: 'Studio screen glow', frag: 'Cool monitor glow from multiple screens. Warm ambient from studio lights. 50mm, f/2.0.' },
          { label: 'Warehouse strobe', frag: 'Strobe freeze-frame in dark warehouse. Minimal colored light. Raw and intense. 24mm, f/2.8.' }
        ]
      },
      { value: 'harpist', label: 'Ethereal Harpist',
        theme_frag: 'The subject plays a golden concert harp in an enchanting setting. Fingers dance across strings creating visible golden light trails. She is bathed in warm ethereal glow. Hair cascades over one shoulder. Eyes half-closed in musical meditation. Otherworldly serene beauty.',
        wardrobe_frag: 'Flowing Grecian-inspired ivory gown with gold thread accents. Bare shoulders, minimal gold jewelry. Hair in loose waves with small flowers woven in. Angelic appearance.',
        scene_frag: 'Ethereal garden at golden hour. The harp surrounded by blooming flowers, fireflies, and soft mist. A stone gazebo frames the scene. Magical realism atmosphere.',
        lighting_frag: 'Warm golden hour with magical light trails from harp strings. Soft mist diffusion. Firefly accents. Dreamlike. 85mm, f/1.4.',
        alt_scenes: [
          { label: 'Cathedral interior', frag: 'Grand cathedral interior. Light through stained glass windows bathes harpist in color. Stone pillars, soaring arches. Sacred music space.' },
          { label: 'Underwater fantasy', frag: 'Surreal underwater scene: she plays the harp submerged, hair and gown floating. Air bubbles rise. Light rays from surface. Dreamlike fantasy.' }
        ],
        alt_wardrobes: [
          { label: 'Modern concert black', frag: 'Sleek black concert gown, statement earrings, hair up. Modern concert harpist professional elegance. The harp shines gold against black.' },
          { label: 'Forest sprite gown', frag: 'Nature-inspired gown of green and gold, leaf and vine motifs. Hair with ivy. Playing a wooden Celtic harp. Forest spirit aesthetic.' }
        ],
        alt_lightings: [
          { label: 'Cathedral stained glass', frag: 'Colorful stained glass light patches on floor and harp. Cool stone ambient. Sacred atmosphere. 50mm, f/2.0.' },
          { label: 'Underwater blue rays', frag: 'Blue-green underwater light. Rays from surface above. Bubbles catching light. 35mm, f/2.0.' }
        ]
      }
    ],
    couple_group: [
      { value: 'band_promo', label: 'Rock Band Promo Shot',
        theme_frag: 'Classic rock band promotional photo. Subjects stand in formation — lead singer front and center, guitarist and bassist flanking, drummer slightly behind. Each strikes signature pose with their instrument. Attitude and chemistry visible. Cool, iconic, album-cover-worthy.',
        wardrobe_frag: 'Coordinated rock aesthetic: each in their own style but cohesive as a band. Leather, denim, band tees, boots. Mix of dark colors with individual personality pieces.',
        scene_frag: 'Gritty alley or industrial backdrop for band photo. Brick walls with band poster, fire escape, dramatic lighting. Classic promotional photo location.',
        lighting_frag: 'Dramatic editorial lighting: strong key light from one side, deep shadows opposite. Rock photography aesthetic. 35mm, f/2.8.',
        alt_scenes: [
          { label: 'Backstage green room', frag: 'Backstage green room before a show. Instruments on stands, drinks, setlist on wall. Band hangs out casually. Pre-show anticipation.' },
          { label: 'Record store', frag: 'Inside a record store. Band poses among vinyl racks. Their own album visible on display. Music culture homage.' }
        ],
        alt_wardrobes: [
          { label: 'Matching stage suits', frag: 'Matching suits in different colors: Beatles-inspired coordinated look. Each member in a different color but same cut. Retro-cool.' },
          { label: 'Grunge 90s', frag: 'Full 90s grunge: flannel shirts, torn jeans, combat boots, messy hair. Seattle aesthetic. Raw and anti-fashion.' }
        ],
        alt_lightings: [
          { label: 'Green room warm casual', frag: 'Warm backstage overhead lighting. Casual, intimate, real. 35mm, f/2.0.' },
          { label: 'Record store fluorescent', frag: 'Fluorescent store lighting. Vinyl sleeves as colorful backdrop. 50mm, f/2.8.' }
        ]
      },
      { value: 'choir', label: 'Gospel Choir Harmony',
        theme_frag: 'A gospel choir in full voice. Subjects in formation, mouths open in powerful harmony. Director leads with expressive hands. The music is visible in their bodies — swaying, clapping, feeling every note. Joy and spiritual power radiate.',
        wardrobe_frag: 'Matching choir robes in deep purple or burgundy with gold stoles. Director in contrasting robe. Each person adds personal touches: earrings, brooches, hairstyles.',
        scene_frag: 'Beautiful church interior with stained glass windows, wooden pews, warm light. The choir fills the altar area. Congregation below, moved to tears.',
        lighting_frag: 'Warm stained glass light mixing with interior candle warmth. Spiritual, glowing, emotional. 35mm, f/2.8.',
        alt_scenes: [
          { label: 'Concert hall performance', frag: 'Grand concert hall stage. Choir in risers. Orchestra accompanies. Formal secular performance of sacred music. Cultural event.' },
          { label: 'Street corner soul', frag: 'Singing on a street corner in Harlem or New Orleans. Passersby stop to listen. Raw, unpolished, authentic. The music stops traffic.' }
        ],
        alt_wardrobes: [
          { label: 'Concert formal', frag: 'Formal concert attire: women in black gowns, men in tuxedos. Choral music at its most formal and polished. Professional excellence.' },
          { label: 'Casual gospel joyful', frag: 'Sunday best but joyful: colorful dresses, suits, hats. Personality shines through coordinated formality. Real community worship.' }
        ],
        alt_lightings: [
          { label: 'Concert hall professional', frag: 'Clean concert hall stage lighting. Even illumination for risers. Professional. 35mm, f/4.' },
          { label: 'Street corner natural', frag: 'Natural street light. Urban surroundings. Raw, real, authentic. 50mm, f/2.0.' }
        ]
      },
      { value: 'orchestra_ensemble', label: 'String Quartet Intimate',
        theme_frag: 'An intimate string quartet performance. Four subjects with violin, violin, viola, and cello in perfect sync. Playing with eyes on each other — the musical conversation visible. Small audience watches breathlessly. Refined collaborative artistry.',
        wardrobe_frag: 'Matching formal black concert attire with individual style: tailored suits, elegant dresses. Clean and professional. Instruments are the visual stars.',
        scene_frag: 'Intimate chamber music venue: small recital hall, warm wood stage, close audience. Salon-like atmosphere. Flowers and candelabras. Classic music setting.',
        lighting_frag: 'Warm candlelight and soft stage lighting creating intimate atmosphere. Wood reflects warmth. 85mm, f/1.8.',
        alt_scenes: [
          { label: 'Museum gallery', frag: 'Playing in a museum gallery surrounded by masterpiece paintings. Art responding to art. Audience sits among the paintings. Cultural confluence.' },
          { label: 'Outdoor garden concert', frag: 'Garden concert among roses and hedges. Audience on white chairs. Sunset sky visible. Elegant outdoor classical music event.' }
        ],
        alt_wardrobes: [
          { label: 'Casual rehearsal', frag: 'Rehearsal casual: jeans, comfortable tops, sneakers. Music stands with marked-up scores. Working through passages. Creative process.' },
          { label: 'Period costumes', frag: 'Period-accurate costumes from the era of the music: Baroque wigs, Mozart-era finery. Full historical immersion performance.' }
        ],
        alt_lightings: [
          { label: 'Museum gallery spots', frag: 'Museum gallery spotlights on paintings. Warm ambient on musicians. Cultural atmosphere. 50mm, f/2.0.' },
          { label: 'Garden sunset natural', frag: 'Warm garden sunset with natural daylight. Romantic outdoor classical atmosphere. 85mm, f/2.0.' }
        ]
      },
      { value: 'dance_troupe', label: 'Dance Troupe Formation',
        theme_frag: 'A dance troupe in perfect synchronized formation. Mid-move, every body at the same angle, every arm in the same position. The precision is breathtaking. One lead dancer breaks from formation adding a unique flourish. Power and unity with individual expression.',
        wardrobe_frag: 'Matching team performance costumes: sleek black with individual accent colors. Dance sneakers. Hair in matching styles. Professional dance crew aesthetic.',
        scene_frag: 'Urban dance stage. Street-style performance area with industrial backdrop. LED lights, smoke. Competition energy. Judges panel visible.',
        lighting_frag: 'Dynamic stage lighting with individual spots and dramatic washes. Floor haze. Competition performance atmosphere. 35mm, f/2.8.',
        alt_scenes: [
          { label: 'Music video warehouse', frag: 'Music video set in an empty warehouse. Production cameras visible. Director calls action. The dance is the video centerpiece.' },
          { label: 'Street performance circle', frag: 'Street performance in a park. Crowd forms a circle. Boombox on the ground. Informal, raw, impressive. Real street dance culture.' }
        ],
        alt_wardrobes: [
          { label: 'Music video glam', frag: 'Music video glam: each in a unique designer outfit coordinated in the same color family. Jewelry, heels mixed with sneakers. Video star energy.' },
          { label: 'Street casual', frag: 'Street dance casual: baggy pants, snapbacks, oversized tees, fresh sneakers. Hip-hop culture authentic. Comfortable to move in.' }
        ],
        alt_lightings: [
          { label: 'Video set production', frag: 'Music video production lighting: professional film lights, colored gels. Cinematic quality. 35mm, f/2.8.' },
          { label: 'Street natural daylight', frag: 'Natural outdoor daylight in a park. Trees and crowd as backdrop. Documentary feel. 50mm, f/2.8.' }
        ]
      },
      { value: 'mariachi', label: 'Mariachi Band Performance',
        theme_frag: 'Full mariachi band in passionate performance. Subjects play guitars, violins, trumpets in coordinated formation. Traditional outfits gleam under lights. They serenade with full hearts. Energy, tradition, musical celebration visible in every face.',
        wardrobe_frag: 'Traditional mariachi trajes de charro: embroidered black suits with silver ornamentation, wide-brimmed sombreros, moños (bow ties). Each instrument shines.',
        scene_frag: 'Mexican plaza at night with colonial architecture. String lights across the square. Families at cafe tables. Illuminated church in background. Festive atmosphere.',
        lighting_frag: 'Warm plaza string lights and church illumination. Festive warm tones. Silver embroidery catches light. 35mm, f/2.0.',
        alt_scenes: [
          { label: 'Wedding reception', frag: 'Grand wedding reception. Band plays as couple dances. Guests cheer. Flower arrangements, candles, celebration. Joyful occasion music.' },
          { label: 'Recording studio session', frag: 'Recording studio. Band records together in live room around microphones. Producer behind glass. Capturing the live energy of tradition.' }
        ],
        alt_wardrobes: [
          { label: 'White celebration trajes', frag: 'White mariachi trajes with gold embroidery for special celebrations. Matching white sombreros. Festive and elegant.' },
          { label: 'Modern fusion look', frag: 'Modern mariachi fusion: traditional embroidered jackets over contemporary clothes. Sneakers with trajes. Tradition meets modernity.' }
        ],
        alt_lightings: [
          { label: 'Wedding candlelight', frag: 'Warm wedding candlelight and fairy lights. Romantic and celebratory. 50mm, f/2.0.' },
          { label: 'Studio professional', frag: 'Clean studio lighting. Professional recording environment. 35mm, f/2.8.' }
        ]
      },
      { value: 'drum_circle', label: 'Drum Circle Gathering',
        theme_frag: 'Subjects gathered in a drum circle on a beach at sunset. Various hand drums — djembe, bongos, congas. Some play, some dance around the circle. Rhythmic energy visible in body movements. Connected, primal, joyful. Music as community.',
        wardrobe_frag: 'Eclectic bohemian festival style: each in unique colorful outfit. Flowing fabrics, tie-dye, ethnic prints. Some shirtless with body paint. Beads, feathers, natural materials.',
        scene_frag: 'Beach at sunset. Circle of drummers in the sand. Ocean waves as rhythm section. Palm trees silhouetted. Fire beginning to glow at center. Warm communal energy.',
        lighting_frag: 'Warm sunset and growing bonfire as dual light sources. Golden hour on faces, fire glow on hands and drums. 35mm, f/2.0.',
        alt_scenes: [
          { label: 'Forest clearing ritual', frag: 'Ancient forest clearing. Drums around a central fire. Tall trees form a natural cathedral. Mystical and primal. Smoke rises to stars.' },
          { label: 'Urban park gathering', frag: 'City park gathering. Diverse group with drums on grass. Skyscrapers in background. Urban community music. All ages, all backgrounds.' }
        ],
        alt_wardrobes: [
          { label: 'African traditional', frag: 'Traditional West African attire: colorful agbada, kente cloth, head wraps. Traditional djembe drums. Cultural roots celebration.' },
          { label: 'Urban casual diverse', frag: 'Diverse casual urban clothing. T-shirts, jeans, sundresses. Every background represented. Music crosses all boundaries.' }
        ],
        alt_lightings: [
          { label: 'Forest fire ritual', frag: 'Central fire as primary warm light. Cool moonlight through trees. Mystical atmosphere. 35mm, f/2.0.' },
          { label: 'Park afternoon bright', frag: 'Bright afternoon sun in park. Trees casting dappled shadows. Natural, warm, inclusive. 50mm, f/2.8.' }
        ]
      },
      { value: 'jazz_ensemble', label: 'Jazz Ensemble Jam',
        theme_frag: 'A jazz ensemble in the zone. Piano, bass, drums, saxophone, trumpet — each locked in a musical conversation. The saxophonist takes a solo while others comp. Eye contact and head nods communicate. Pure musical telepathy and improvisation.',
        wardrobe_frag: 'Jazz musician cool: dark suits, open collars, some with hats. Each with personal style — one in turtleneck, one with suspenders. The instruments complete the look.',
        scene_frag: 'Jazz club stage. Warm lighting, exposed brick, small cocktail tables with candles. Audience of jazz aficionados listening intently. Intimate, sophisticated atmosphere.',
        lighting_frag: 'Warm stage lighting through smoke. Each musician in their own pool of light. Rich amber tones. 50mm, f/1.8.',
        alt_scenes: [
          { label: 'New Orleans street', frag: 'New Orleans French Quarter street. Second-line parade energy. The ensemble plays on the sidewalk. Iron balconies above. Passersby dance along.' },
          { label: 'Festival outdoor stage', frag: 'Jazz festival outdoor stage at night. Large audience in lawn chairs. City skyline behind. Cool evening air. Major jazz festival energy.' }
        ],
        alt_wardrobes: [
          { label: 'All-white summer jazz', frag: 'All-white jazz outfits for summer festival: white suits, white dresses, white hats. Clean, fresh, summer jazz elegance.' },
          { label: 'Vintage 1930s', frag: 'Vintage 1930s-40s attire: wide-brimmed hats, suspenders, high-waisted trousers. Classic jazz golden era style. Sepia-toned aesthetic.' }
        ],
        alt_lightings: [
          { label: 'NOLA street warm', frag: 'Warm New Orleans street lighting. Gas lamps, neon signs. Festive warm atmosphere. 35mm, f/2.0.' },
          { label: 'Festival stage cool', frag: 'Cool blue festival stage lighting. Warm spots on soloists. Night sky. 35mm, f/2.8.' }
        ]
      }
    ]
  }
},

// ======================================================================
// CATEGORIES 7-10: PLACEHOLDER — will be populated
// ======================================================================
_placeholder_3: null
};
