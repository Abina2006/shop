/**
 * Helper to get accurate visual icons, gradient themes, and reliable images for products.
 * Guarantees that soaps never show watches, laptops never show shoes, etc.
 * Supports all 20 shopwiseAI product categories.
 */

export function getProductVisual(product = {}) {
  const name = (product.name || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const category = (product.category || '').toLowerCase();

  // 1. Mobiles & Tablets
  if ((new RegExp('\\bmobile\\b', 'i')).test(category) || (new RegExp('\\btablet\\b', 'i')).test(category) || (new RegExp('\\biphone\\b', 'i')).test(name) || (new RegExp('\\bgalaxy s\\b', 'i')).test(name) || (new RegExp('\\boneplus\\b', 'i')).test(name) || (new RegExp('\\bipad\\b', 'i')).test(name) || (new RegExp('\\bpixel\\b', 'i')).test(name)) {
    return {
      emoji: '📱',
      tag: product.brand || 'Mobiles & Tablets',
      badgeColor: 'from-blue-600 to-indigo-800',
      bgGradient: 'from-blue-950/80 via-slate-900 to-slate-950',
      textColor: 'text-blue-300',
      desc: 'High Performance 5G Smartphone & Tablet',
      fallbackImg: null
    };
  }

  // 2. Laptops & Computers
  if ((new RegExp('\\blaptop\\b', 'i')).test(category) || (new RegExp('\\bcomputer\\b', 'i')).test(category) || (new RegExp('\\bmacbook\\b', 'i')).test(name) || (new RegExp('\\bpavilion\\b', 'i')).test(name) || (new RegExp('\\bthinkpad\\b', 'i')).test(name) || (new RegExp('\\bzephyrus\\b', 'i')).test(name)) {
    return {
      emoji: '💻',
      tag: product.brand || 'Laptops & Computers',
      badgeColor: 'from-cyan-600 to-blue-800',
      bgGradient: 'from-cyan-950/80 via-slate-900 to-slate-950',
      textColor: 'text-cyan-300',
      desc: 'Next-Gen Display Laptop & Computing Workstation',
      fallbackImg: null
    };
  }

  // 3. Electronics & Accessories
  if ((new RegExp('\\belectronics\\b', 'i')).test(category) || (new RegExp('\\baudio\\b', 'i')).test(category) || (new RegExp('\\bearbuds\\b', 'i')).test(name) || (new RegExp('\\bheadphone\\b', 'i')).test(name) || (new RegExp('\\bpower bank\\b', 'i')).test(name) || (new RegExp('\\bapple watch\\b', 'i')).test(name) || (new RegExp('\\banker\\b', 'i')).test(name)) {
    return {
      emoji: '🎧',
      tag: product.brand || 'Electronics & Accessories',
      badgeColor: 'from-purple-600 to-indigo-800',
      bgGradient: 'from-purple-950/80 via-slate-900 to-slate-950',
      textColor: 'text-purple-300',
      desc: 'Premium Audio & Smart Electronic Gadgets',
      fallbackImg: null
    };
  }

  // 4. Fashion & Clothing
  if ((new RegExp('\\bfashion\\b', 'i')).test(category) || (new RegExp('\\bclothing\\b', 'i')).test(category) || (new RegExp('\\bjean\\b', 'i')).test(name) || (new RegExp('\\bhoodie\\b', 'i')).test(name) || (new RegExp('\\bkurta\\b', 'i')).test(name) || (new RegExp('\\bblazer\\b', 'i')).test(name)) {
    return {
      emoji: '👕',
      tag: product.brand || 'Fashion & Clothing',
      badgeColor: 'from-sky-600 to-indigo-800',
      bgGradient: 'from-sky-950/80 via-slate-900 to-slate-950',
      textColor: 'text-sky-300',
      desc: 'Trendy & Premium Quality Apparel',
      fallbackImg: null
    };
  }

  // 5. Shoes & Footwear
  if ((new RegExp('\\bshoe\\b', 'i')).test(category) || (new RegExp('\\bfootwear\\b', 'i')).test(category) || (new RegExp('\\bsneaker\\b', 'i')).test(name) || (new RegExp('\\brunning\\b', 'i')).test(name) || (new RegExp('\\bcrocs\\b', 'i')).test(name) || (new RegExp('\\bultraboost\\b', 'i')).test(name)) {
    return {
      emoji: '👟',
      tag: product.brand || 'Shoes & Footwear',
      badgeColor: 'from-rose-600 to-red-800',
      bgGradient: 'from-rose-950/80 via-slate-900 to-slate-950',
      textColor: 'text-rose-300',
      desc: 'Comfort & High Performance Footwear',
      fallbackImg: null
    };
  }

  // 6. Beauty & Personal Care
  if ((new RegExp('\\bbeauty\\b', 'i')).test(category) || (new RegExp('\\bpersonal care\\b', 'i')).test(category) || (new RegExp('\\bshampoo\\b', 'i')).test(name) || (new RegExp('\\bperfume\\b', 'i')).test(name) || (new RegExp('\\bdove\\b', 'i')).test(name) || (new RegExp('\\blipstick\\b', 'i')).test(name)) {
    return {
      emoji: '💄',
      tag: product.brand || 'Beauty & Personal Care',
      badgeColor: 'from-pink-600 to-rose-800',
      bgGradient: 'from-pink-950/80 via-slate-900 to-slate-950',
      textColor: 'text-pink-300',
      desc: 'Skincare, Haircare & Beauty Essentials',
      fallbackImg: null
    };
  }

  // 7. Home & Kitchen
  if ((new RegExp('\\bhome\\b', 'i')).test(category) || (new RegExp('\\bkitchen\\b', 'i')).test(category) || (new RegExp('\\bair fryer\\b', 'i')).test(name) || (new RegExp('\\bmixer\\b', 'i')).test(name) || (new RegExp('\\bvacuum\\b', 'i')).test(name) || (new RegExp('\\bpressure cooker\\b', 'i')).test(name)) {
    return {
      emoji: '🏠',
      tag: product.brand || 'Home & Kitchen',
      badgeColor: 'from-amber-600 to-orange-800',
      bgGradient: 'from-amber-950/80 via-slate-900 to-slate-950',
      textColor: 'text-amber-300',
      desc: 'Smart Home & Everyday Kitchen Appliances',
      fallbackImg: null
    };
  }

  // 8. Furniture
  if ((new RegExp('\\bfurniture\\b', 'i')).test(category) || (new RegExp('\\bsofa\\b', 'i')).test(name) || (new RegExp('\\bchair\\b', 'i')).test(name) || (new RegExp('\\bdesk\\b', 'i')).test(name) || (new RegExp('\\bcabinet\\b', 'i')).test(name) || (new RegExp('\\btable\\b', 'i')).test(name)) {
    return {
      emoji: '🪑',
      tag: product.brand || 'Furniture',
      badgeColor: 'from-amber-700 to-yellow-900',
      bgGradient: 'from-stone-950/80 via-slate-900 to-slate-950',
      textColor: 'text-amber-200',
      desc: 'Ergonomic & Modern Home Furniture',
      fallbackImg: null
    };
  }

  // 9. Toys & Baby Products
  if ((new RegExp('\\btoy\\b', 'i')).test(category) || (new RegExp('\\bbaby\\b', 'i')).test(category) || (new RegExp('\\blego\\b', 'i')).test(name) || (new RegExp('\\bstroller\\b', 'i')).test(name) || (new RegExp('\\bhot wheels\\b', 'i')).test(name) || (new RegExp('\\bfisher-price\\b', 'i')).test(name)) {
    return {
      emoji: '🧸',
      tag: product.brand || 'Toys & Baby Products',
      badgeColor: 'from-yellow-500 to-amber-700',
      bgGradient: 'from-yellow-950/80 via-slate-900 to-slate-950',
      textColor: 'text-yellow-300',
      desc: 'Fun Toys, Games & Essential Baby Care',
      fallbackImg: null
    };
  }

  // 10. Books & Stationery
  if ((new RegExp('\\bbook\\b', 'i')).test(category) || (new RegExp('\\bstationery\\b', 'i')).test(category) || (new RegExp('\\batomic habits\\b', 'i')).test(name) || (new RegExp('\\bpen\\b', 'i')).test(name) || (new RegExp('\\bnotebook\\b', 'i')).test(name) || (new RegExp('\\bcalculator\\b', 'i')).test(name)) {
    return {
      emoji: '📚',
      tag: product.brand || 'Books & Stationery',
      badgeColor: 'from-teal-600 to-emerald-800',
      bgGradient: 'from-teal-950/80 via-slate-900 to-slate-950',
      textColor: 'text-teal-300',
      desc: 'Bestselling Books & Office Supplies',
      fallbackImg: null
    };
  }

  // 11. Sports & Fitness
  if ((new RegExp('\\bsports\\b', 'i')).test(category) || (new RegExp('\\bfitness\\b', 'i')).test(category) || (new RegExp('\\bdumbbell\\b', 'i')).test(name) || (new RegExp('\\bracket\\b', 'i')).test(name) || (new RegExp('\\byoga mat\\b', 'i')).test(name) || (new RegExp('\\bfootball\\b', 'i')).test(name)) {
    return {
      emoji: '🏋️',
      tag: product.brand || 'Sports & Fitness',
      badgeColor: 'from-emerald-600 to-teal-800',
      bgGradient: 'from-emerald-950/80 via-slate-900 to-slate-950',
      textColor: 'text-emerald-300',
      desc: 'Workout Gear & Sports Equipment',
      fallbackImg: null
    };
  }

  // 12. Grocery & Daily Essentials
  if ((new RegExp('\\bgrocery\\b', 'i')).test(category) || (new RegExp('\\bdaily\\b', 'i')).test(category) || (new RegExp('\\boil\\b', 'i')).test(name) || (new RegExp('\\btea\\b', 'i')).test(name) || (new RegExp('\\brice\\b', 'i')).test(name) || (new RegExp('\\bchocolate\\b', 'i')).test(name)) {
    return {
      emoji: '🛒',
      tag: product.brand || 'Grocery & Daily Essentials',
      badgeColor: 'from-lime-600 to-green-800',
      bgGradient: 'from-lime-950/80 via-slate-900 to-slate-950',
      textColor: 'text-lime-300',
      desc: 'Fresh Groceries & Pantry Essentials',
      fallbackImg: null
    };
  }

  // 13. Jewellery & Accessories
  if ((new RegExp('\\bjewellery\\b', 'i')).test(category) || (new RegExp('\\baccessories\\b', 'i')).test(category) || (new RegExp('\\bnecklace\\b', 'i')).test(name) || (new RegExp('\\bring\\b', 'i')).test(name) || (new RegExp('\\bsunglasses\\b', 'i')).test(name) || (new RegExp('\\bfossil\\b', 'i')).test(name)) {
    return {
      emoji: '💍',
      tag: product.brand || 'Jewellery & Accessories',
      badgeColor: 'from-violet-600 to-fuchsia-800',
      bgGradient: 'from-violet-950/80 via-slate-900 to-slate-950',
      textColor: 'text-violet-300',
      desc: 'Fine Silver Jewellery & Fashion Accessories',
      fallbackImg: null
    };
  }

  // 14. Automotive
  if ((new RegExp('\\bautomotive\\b', 'i')).test(category) || (new RegExp('\\bcar\\b', 'i')).test(name) || (new RegExp('\\bcompressor\\b', 'i')).test(name) || (new RegExp('\\bdash cam\\b', 'i')).test(name) || (new RegExp('\\bpolish\\b', 'i')).test(name)) {
    return {
      emoji: '🚗',
      tag: product.brand || 'Automotive',
      badgeColor: 'from-blue-700 to-slate-900',
      bgGradient: 'from-blue-950/80 via-slate-900 to-slate-950',
      textColor: 'text-blue-300',
      desc: 'Car Accessories & Vehicle Care Tools',
      fallbackImg: null
    };
  }

  // 15. Pet Supplies
  if ((new RegExp('\\bpet\\b', 'i')).test(category) || (new RegExp('\\bdog\\b', 'i')).test(name) || (new RegExp('\\bcat\\b', 'i')).test(name) || (new RegExp('\\broyal canin\\b', 'i')).test(name) || (new RegExp('\\bwhiskas\\b', 'i')).test(name)) {
    return {
      emoji: '🐶',
      tag: product.brand || 'Pet Supplies',
      badgeColor: 'from-orange-500 to-amber-700',
      bgGradient: 'from-orange-950/80 via-slate-900 to-slate-950',
      textColor: 'text-orange-300',
      desc: 'Nutritional Food & Premium Pet Products',
      fallbackImg: null
    };
  }

  // 16. Tools & Home Improvement
  if ((new RegExp('\\btools\\b', 'i')).test(category) || (new RegExp('\\bhome improvement\\b', 'i')).test(category) || (new RegExp('\\bdrill\\b', 'i')).test(name) || (new RegExp('\\btool set\\b', 'i')).test(name) || (new RegExp('\\bspanner\\b', 'i')).test(name) || (new RegExp('\\bsurge protector\\b', 'i')).test(name)) {
    return {
      emoji: '🔧',
      tag: product.brand || 'Tools & Home Improvement',
      badgeColor: 'from-slate-600 to-zinc-800',
      bgGradient: 'from-slate-900 via-slate-900 to-slate-950',
      textColor: 'text-zinc-300',
      desc: 'Hardware Tools & Electrical Equipment',
      fallbackImg: null
    };
  }

  // 17. Gaming
  if ((new RegExp('\\bgaming\\b', 'i')).test(category) || (new RegExp('\\bplaystation\\b', 'i')).test(name) || (new RegExp('\\bnintendo\\b', 'i')).test(name) || (new RegExp('\\bmouse\\b', 'i')).test(name) || (new RegExp('\\bdualsense\\b', 'i')).test(name) || (new RegExp('\\bps5\\b', 'i')).test(name)) {
    return {
      emoji: '🎮',
      tag: product.brand || 'Gaming',
      badgeColor: 'from-indigo-600 to-purple-800',
      bgGradient: 'from-indigo-950/80 via-slate-900 to-slate-950',
      textColor: 'text-indigo-300',
      desc: 'Gaming Consoles, Peripherals & Controllers',
      fallbackImg: null
    };
  }

  // 18. TV & Appliances
  if ((new RegExp('\\btv\\b', 'i')).test(category) || (new RegExp('\\bappliances\\b', 'i')).test(category) || (new RegExp('\\btelevision\\b', 'i')).test(name) || (new RegExp('\\brefrigerator\\b', 'i')).test(name) || (new RegExp('\\bwashing machine\\b', 'i')).test(name) || (new RegExp('\\bac\\b', 'i')).test(name)) {
    return {
      emoji: '📺',
      tag: product.brand || 'TV & Appliances',
      badgeColor: 'from-sky-700 to-indigo-900',
      bgGradient: 'from-sky-950/80 via-slate-900 to-slate-950',
      textColor: 'text-sky-300',
      desc: '4K Smart TVs & Heavy Home Appliances',
      fallbackImg: null
    };
  }

  // 19. Travel & Luggage
  if ((new RegExp('\\btravel\\b', 'i')).test(category) || (new RegExp('\\bluggage\\b', 'i')).test(category) || (new RegExp('\\btrolley\\b', 'i')).test(name) || (new RegExp('\\bsuitcase\\b', 'i')).test(name) || (new RegExp('\\bbackpack\\b', 'i')).test(name) || (new RegExp('\\btourister\\b', 'i')).test(name)) {
    return {
      emoji: '🧳',
      tag: product.brand || 'Travel & Luggage',
      badgeColor: 'from-cyan-700 to-teal-900',
      bgGradient: 'from-cyan-950/80 via-slate-900 to-slate-950',
      textColor: 'text-cyan-300',
      desc: 'Durable Travel Bags & Suitcases',
      fallbackImg: null
    };
  }

  // 20. Gifts & Others
  if ((new RegExp('\\bgift\\b', 'i')).test(category) || (new RegExp('\\bchocolate\\b', 'i')).test(name) || (new RegExp('\\becho dot\\b', 'i')).test(name) || (new RegExp('\\bphoto frame\\b', 'i')).test(name) || (new RegExp('\\btoothbrush\\b', 'i')).test(name)) {
    return {
      emoji: '🎁',
      tag: product.brand || 'Gifts & Others',
      badgeColor: 'from-pink-600 to-purple-800',
      bgGradient: 'from-pink-950/80 via-slate-900 to-slate-950',
      textColor: 'text-pink-300',
      desc: 'Thoughtful Gifts & Lifestyle Novelties',
      fallbackImg: null
    };
  }

  // Default
  return {
    emoji: '📦',
    tag: product.brand || 'Product',
    badgeColor: 'from-slate-700 to-slate-900',
    bgGradient: 'from-slate-900 via-slate-900 to-slate-950',
    textColor: 'text-slate-300',
    desc: 'Verified E-Commerce Deal',
    fallbackImg: null
  };
}

export function getReliableProductImage(product = {}) {
  if (product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.trim()) {
    return product.imageUrl;
  }
  return null;
}

