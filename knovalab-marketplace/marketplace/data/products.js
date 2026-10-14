/* ===== KNOVALAB CATALOGUE — edit products, prices and IMAGE URLS here only =====
   images: replace the ph(...) placeholder with real URLs, e.g. images:["https://.../a.jpg","https://.../b.jpg"]
   Prices are indicative Beloong supplier reference prices (USD), not final selling prices. */
const ph=t=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#141414"/><rect x="170" y="130" width="460" height="290" rx="10" fill="#070707" stroke="#2a2a2a" stroke-width="10"/><text x="400" y="285" fill="#ff6a00" font-family="Arial" font-size="26" text-anchor="middle">${t}</text><text x="400" y="325" fill="#777" font-family="Arial" font-size="18" text-anchor="middle">Placeholder image</text></svg>`);
const FALLBACK_IMAGE=ph('Image unavailable');
const v=(a)=>a.map(([label,price])=>({label,price}));
const PRODUCTS=[
{id:"wall-display",slug:"wall-mounted-display",name:"Wall-Mounted Advertising Player",cat:"Wall-Mounted Displays",supplier:"Beloong",
 desc:"Commercial wall-mounted digital signage display for retail, offices and hospitality.",images:[ph('Wall-mounted display'),ph('Wall-mounted — side view')],
 variants:v([['10.1"',140],['13.3"',160],['15.6"',140],['18.5"',135],['21.5"',145],['23.6"',160],['23.8"',155],['27"',175],['32"',195],['43"',250],['50"',305],['55"',345]])},
{id:"elevator-display",slug:"elevator-display",name:"Elevator Advertising Player",cat:"Elevator Displays",supplier:"Beloong",
 desc:"Slim advertising screens for elevator interiors, including dual-screen combinations.",images:[ph('Elevator display'),ph('Elevator — dual screen')],
 variants:v([['18.5"',145],['21.5"',153],['18.5" + 10.1" dual',185],['21.5" + 11.6" dual',210],['23.6"',170],['27"',187],['32"',210]])},
{id:"floor-display",slug:"floor-standing-display",name:"Indoor Floor-Standing Advertising Player",cat:"Floor-Standing Displays",supplier:"Beloong",
 desc:"Freestanding indoor advertising display for lobbies, malls and showrooms.",images:[ph('Floor-standing display')],
 variants:v([['32"',315],['43"',410],['49"',380]])},
{id:"touch-inquiry",slug:"touch-inquiry-all-in-one",name:"Touch Inquiry All-in-One",cat:"Touchscreen Kiosks",supplier:"Beloong",
 desc:"Interactive touchscreen all-in-one for information and visitor inquiry points.",images:[ph('Touch inquiry kiosk')],
 variants:v([['32"',295],['43"',355],['50"',410]])},
{id:"touch-movable",slug:"capacitive-touch-movable-player",name:"Capacitive Touch Movable Advertising Player",cat:"Touchscreen Kiosks",supplier:"Beloong",
 desc:"Movable capacitive touch advertising player for flexible placement.",images:[ph('Movable touch player')],
 variants:v([['27"',417]])},
{id:"shelf-kiosk",slug:"capacitive-touch-shelf-order-kiosk",name:"Capacitive Touch Shelf-Order Kiosk",cat:"Shelf-Order Kiosks",supplier:"Beloong",
 desc:"Capacitive touch terminal for shelf-side ordering and product lookup.",images:[ph('Shelf-order kiosk')],
 variants:v([['21.5"',315],['23.8"',328],['27"',390]])},
{id:"video-wall",slug:"lcd-video-wall-3-5mm",name:"LCD Video Wall — 3.5 mm Bezel",cat:"LCD Video Walls",supplier:"Beloong",
 desc:"Narrow-bezel LCD panels for seamless multi-screen video walls.",images:[ph('LCD video wall')],
 variants:v([['46"',277],['49"',285],['55"',321]])}
];
const CATEGORIES=["Wall-Mounted Displays","Elevator Displays","Floor-Standing Displays","Touchscreen Kiosks","Shelf-Order Kiosks","LCD Video Walls"];
const PRICE_NOTE="Indicative supplier reference price; final quotation depends on configuration, shipping, taxes and availability.";
