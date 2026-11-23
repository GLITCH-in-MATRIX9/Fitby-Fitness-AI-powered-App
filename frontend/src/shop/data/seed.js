import { computeFinal } from '../utils/helpers';

const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=70`;
const IMG = {
  gym: [U('1534438327276-14e5300c3a48'), U('1571019613454-1cb2f99b2d8b')],
  woman: [U('1518310383802-640c2de311b2'), U('1506629082955-511b1aa562c8')],
  man: [U('1517836357463-d25dfeac3438'), U('1581009146145-b5ef050c2e1e')],
  shoes: [U('1542291026-7eec264c27ff'), U('1491553895911-0055eca6402d')],
  kids: [U('1503944583220-79d8926ad5e2')],
  yoga: [U('1601925260368-ae2f83cf8b7f'), U('1506629082955-511b1aa562c8')],
  supp: [U('1593095948071-474c5cc2989d'), U('1579722821273-0f6c7d44362f')],
  bottle: [U('1602143407151-7111542de6e8')],
  watch: [U('1523275335684-37898b6baf30')],
  bag: [U('1553062407-98eeb64c6a62')],
  run: [U('1552674605-db6ffd4facb5')],
};

export const SEED_CATEGORIES = [
  { id: 'women', name: 'Women', description: 'Leggings, bras & training tops', image: IMG.woman[0] },
  { id: 'men', name: 'Men', description: 'Gym tees, shorts & track pants', image: IMG.man[0] },
  { id: 'children', name: 'Children', description: 'Active gear for little athletes', image: IMG.kids[0] },
  { id: 'sportswear', name: 'Sportswear', description: 'Running, training & yoga wear', image: IMG.run[0] },
  { id: 'equipment', name: 'Fitness Equipment', description: 'Dumbbells, bands & mats', image: IMG.gym[0] },
  { id: 'accessories', name: 'Accessories', description: 'Bags, bottles & wearables', image: IMG.bag[0] },
  { id: 'nutrition', name: 'Nutrition & Supplements', description: 'Fuel your performance', image: IMG.supp[0] },
];

const sub = (categoryId, list) => list.map(([id, name]) => ({ id, categoryId, name }));
export const SEED_SUBCATEGORIES = [
  ...sub('women', [['sports-bras', 'Sports Bras'], ['leggings', 'Leggings'], ['workout-tops', 'Workout Tops'], ['womens-shoes', "Women's Shoes"], ['women-accessories', 'Accessories']]),
  ...sub('men', [['gym-tshirts', 'Gym T-shirts'], ['shorts', 'Shorts'], ['track-pants', 'Track Pants'], ['sports-shoes', 'Sports Shoes'], ['men-accessories', 'Accessories']]),
  ...sub('children', [['kids-sportswear', 'Kids Sportswear'], ['kids-shoes', 'Kids Shoes'], ['activewear', 'Activewear'], ['kids-accessories', 'Accessories']]),
  ...sub('sportswear', [['running-wear', 'Running Wear'], ['training-wear', 'Training Wear'], ['yoga-wear', 'Yoga Wear'], ['compression-wear', 'Compression Wear']]),
  ...sub('equipment', [['dumbbells', 'Dumbbells'], ['resistance-bands', 'Resistance Bands'], ['yoga-mats', 'Yoga Mats'], ['gym-accessories', 'Gym Accessories']]),
  ...sub('accessories', [['gym-bags', 'Gym Bags'], ['bottles', 'Bottles & Shakers'], ['wearables', 'Smart Wearables'], ['gloves-straps', 'Gloves & Straps']]),
  ...sub('nutrition', [['protein', 'Protein Products'], ['fitness-nutrition', 'Fitness Nutrition'], ['hydration', 'Hydration']]),
];

export const SEED_TAGS = ['New Arrival', 'Best Seller', 'Trending', 'Premium', 'Women', 'Men', 'Kids', 'Running', 'Yoga', 'Gym', 'Summer Collection', 'Sale'];

const SIZES = { name: 'Size', values: ['S', 'M', 'L', 'XL'] };
const color = (...v) => ({ name: 'Color', values: v });
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();

// id, name, cat, sub, price, discount, brand, images, attributes, stock, rating, sales, ageDays, tags, description
const raw = [
  ['p1', 'Pro Sculpt Sports Bra', 'women', 'sports-bras', 1499, 20, 'FitBy Active', IMG.woman, [SIZES, color('Black', 'Coral', 'Navy')], 40, 4.6, 120, 2, ['New Arrival', 'Trending', 'Women', 'Gym'], 'High-support sports bra with moisture-wicking fabric and a sculpted fit for high-intensity workouts.'],
  ['p2', 'High-Rise Seamless Leggings', 'women', 'leggings', 1999, 15, 'FitBy Active', [...IMG.woman].reverse(), [SIZES, color('Black', 'Olive', 'Wine')], 55, 4.8, 340, 6, ['Best Seller', 'Trending', 'Women', 'Premium'], 'Squat-proof, four-way stretch leggings with a high waist that stays put through every rep.'],
  ['p3', 'AirFlow Workout Tank', 'women', 'workout-tops', 899, 0, 'Stride', IMG.woman, [SIZES, color('White', 'Black', 'Sky Blue')], 70, 4.3, 90, 20, ['Women', 'Summer Collection'], 'Ultra-light breathable tank with a relaxed fit.'],
  ['p4', "CloudRun Women's Trainers", 'women', 'womens-shoes', 3999, 10, 'Stride', IMG.shoes, [{ name: 'Size', values: ['5', '6', '7', '8'] }, color('White', 'Pink')], 25, 4.5, 75, 10, ['Women', 'Running'], 'Cushioned everyday trainers built for running and gym floors.'],
  ['p5', 'Powerfit Gym T-Shirt', 'men', 'gym-tshirts', 799, 15, 'Powerfit', IMG.man, [SIZES, color('Black', 'White', 'Blue'), { name: 'Material', values: ['Cotton', 'Polyester Blend'] }], 120, 4.4, 410, 30, ['Best Seller', 'Men', 'Gym'], 'Classic fit training tee with quick-dry fabric.'],
  ['p6', 'Flex Training Shorts', 'men', 'shorts', 999, 0, 'Powerfit', [...IMG.man].reverse(), [SIZES, color('Black', 'Grey')], 80, 4.2, 150, 15, ['Men', 'Summer Collection'], 'Lightweight shorts with zip pockets and a built-in drawcord.'],
  ['p7', 'Tapered Track Pants', 'men', 'track-pants', 1499, 20, 'Powerfit', IMG.man, [SIZES, color('Charcoal', 'Navy')], 45, 4.3, 110, 25, ['Men', 'Sale'], 'Tapered fit track pants with stretch waistband and ankle zips.'],
  ['p8', 'Velocity Running Shoes', 'men', 'sports-shoes', 4499, 10, 'Stride', IMG.shoes, [{ name: 'Size', values: ['7', '8', '9', '10', '11'] }, color('Red', 'Black')], 30, 4.7, 260, 3, ['New Arrival', 'Running', 'Men', 'Premium'], 'Responsive foam midsole and breathable knit upper for long distances.'],
  ['p9', 'Kids Active Set', 'children', 'kids-sportswear', 1199, 10, 'Little Movers', IMG.kids, [{ name: 'Age', values: ['4-5Y', '6-7Y', '8-9Y'] }, color('Blue', 'Green')], 35, 4.4, 60, 12, ['Kids', 'New Arrival'], 'Soft two-piece active set for playtime and PE class.'],
  ['p10', 'Junior Sprint Sneakers', 'children', 'kids-shoes', 1799, 0, 'Little Movers', IMG.shoes, [{ name: 'Size', values: ['1', '2', '3', '4'] }, color('Black', 'Orange')], 28, 4.1, 45, 40, ['Kids'], 'Lightweight sneakers with a flexible grip sole.'],
  ['p11', 'Mini Move Activewear Tee', 'children', 'activewear', 699, 0, 'Little Movers', IMG.kids, [{ name: 'Age', values: ['4-5Y', '6-7Y', '8-9Y'] }], 60, 4.0, 30, 35, ['Kids', 'Summer Collection'], 'Breathable cotton-blend tee for active kids.'],
  ['p12', 'Marathon Run Jacket', 'sportswear', 'running-wear', 2799, 15, 'Stride', IMG.run, [SIZES, color('Black', 'Neon Orange')], 22, 4.5, 80, 8, ['Running', 'Trending'], 'Windproof, reflective running jacket that packs into its own pocket.'],
  ['p13', 'Studio Flow Yoga Set', 'sportswear', 'yoga-wear', 2499, 10, 'Zenwear', IMG.yoga, [SIZES, color('Sage', 'Lilac', 'Black')], 38, 4.6, 130, 5, ['Yoga', 'Women', 'New Arrival'], 'Soft brushed top and leggings set made for studio flow.'],
  ['p14', 'Compression Tights Pro', 'sportswear', 'compression-wear', 1899, 0, 'Powerfit', IMG.man, [SIZES, color('Black', 'Grey')], 48, 4.4, 95, 28, ['Gym', 'Men'], 'Graduated compression tights to support muscles and speed recovery.'],
  ['p15', 'Hex Rubber Dumbbells', 'equipment', 'dumbbells', 1299, 0, 'IronCore', IMG.gym, [{ name: 'Weight', values: ['2 kg', '5 kg', '10 kg'] }, { name: 'Material', values: ['Rubber', 'Metal'] }, color('Black', 'Red')], 60, 4.7, 520, 18, ['Best Seller', 'Gym'], 'Hex-shaped rubber-coated dumbbells with knurled grip. Sold individually.'],
  ['p16', 'Loop Resistance Band Set', 'equipment', 'resistance-bands', 699, 25, 'IronCore', IMG.gym, [{ name: 'Resistance', values: ['Light', 'Medium', 'Heavy', 'Set of 5'] }], 90, 4.5, 300, 14, ['Best Seller', 'Sale', 'Gym'], 'Natural latex bands for glutes, legs and mobility work.'],
  ['p17', 'Pro Grip Yoga Mat', 'equipment', 'yoga-mats', 1199, 10, 'Zenwear', IMG.yoga, [color('Purple', 'Teal', 'Black'), { name: 'Thickness', values: ['4 mm', '6 mm', '8 mm'] }], 50, 4.6, 210, 9, ['Yoga', 'Trending'], 'Non-slip, cushioned mat with alignment guides.'],
  ['p18', 'Ab Roller Wheel', 'equipment', 'gym-accessories', 599, 0, 'IronCore', IMG.gym, [], 75, 4.2, 70, 45, ['Gym'], 'Dual-wheel ab roller with foam handles and knee mat.'],
  ['p19', 'Trail Gym Duffel', 'accessories', 'gym-bags', 1899, 20, 'Stride', IMG.bag, [color('Black', 'Olive')], 20, 4.4, 85, 22, ['Premium', 'Sale'], 'Water-resistant duffel with a ventilated shoe compartment.'],
  ['p20', 'InsulaSteel Bottle 1L', 'accessories', 'bottles', 899, 0, 'HydraPro', IMG.bottle, [color('Matte Black', 'Orange', 'White')], 100, 4.5, 280, 11, ['Best Seller'], 'Double-wall stainless steel bottle that keeps drinks cold for 24 hours.'],
  ['p21', 'FitBand Tracker 5', 'accessories', 'wearables', 3499, 15, 'PulseOne', IMG.watch, [color('Black', 'Silver')], 18, 4.3, 140, 7, ['New Arrival', 'Premium', 'Trending'], 'Heart-rate, sleep and step tracking with a 14-day battery.'],
  ['p22', 'Whey Protein 1 kg', 'nutrition', 'protein', 2499, 10, 'MuscleFuel', IMG.supp, [{ name: 'Flavour', values: ['Chocolate', 'Vanilla', 'Strawberry'] }, { name: 'Pack', values: ['1 kg', '2 kg'] }], 65, 4.7, 610, 4, ['Best Seller', 'Trending', 'Gym'], '24 g protein per serving with fast-absorbing whey isolate.'],
  ['p23', 'Pre-Workout Energy', 'nutrition', 'fitness-nutrition', 1599, 0, 'MuscleFuel', IMG.supp, [{ name: 'Flavour', values: ['Fruit Punch', 'Lemon Lime'] }], 40, 4.1, 100, 33, ['Gym'], 'Clean energy and focus without the crash.'],
  ['p24', 'Electrolyte Mix (30 sachets)', 'nutrition', 'hydration', 799, 0, 'HydraPro', [...IMG.supp].reverse(), [{ name: 'Flavour', values: ['Orange', 'Lemon', 'Berry'] }], 85, 4.4, 160, 16, ['Summer Collection', 'Running'], 'Replace sodium and potassium lost in sweat.'],
  ['p25', 'Padded Training Gloves', 'accessories', 'gloves-straps', 649, 0, 'IronCore', IMG.gym, [{ name: 'Size', values: ['S', 'M', 'L'] }, color('Black', 'Grey')], 0, 4.0, 55, 50, ['Gym'], 'Palm-padded gloves with wrist support. Currently out of stock.'],
];

export const SEED_PRODUCTS = raw.map(([id, name, categoryId, subcategoryId, price, discount, brand, images, attributes, stock, rating, sales, age, tags, description]) => ({
  id, name, description, categoryId, subcategoryId, tags, price, discount,
  finalPrice: computeFinal(price, discount), brand, images, attributes, stock, rating, sales,
  createdAt: daysAgo(age), availability: stock > 0 ? 'In Stock' : 'Out of Stock',
}));

const mockOrder = (id, days, status, pid, qty, attrs, method, payStatus) => {
  const p = SEED_PRODUCTS.find((x) => x.id === pid);
  const subtotal = p.finalPrice * qty;
  const delivery = subtotal >= 999 ? 0 : 99;
  const at = daysAgo(days);
  return {
    id, createdAt: at, status,
    customer: { name: 'Aarav Sharma', email: 'aarav@example.com', phone: '9876543210', house: '12B', street: 'Green Park Road', city: 'New Delhi', state: 'Delhi', pin: '110016' },
    items: [{ key: `${pid}|seed`, productId: pid, name: p.name, image: p.images[0], price: p.finalPrice, originalPrice: p.price, qty, attrs }],
    subtotal, delivery, discount: (p.price - p.finalPrice) * qty, total: subtotal + delivery,
    payment: { method, status: payStatus },
    history: [{ status: 'Pending', at }, ...(status !== 'Pending' ? [{ status, at: daysAgo(days - 1) }] : [])],
  };
};

export const SEED_ORDERS = [
  mockOrder('FB-SEED-0001', 14, 'Delivered', 'p15', 2, { Weight: '5 kg', Material: 'Rubber', Color: 'Black' }, 'UPI', 'Paid'),
  mockOrder('FB-SEED-0002', 6, 'Shipped', 'p22', 1, { Flavour: 'Chocolate', Pack: '1 kg' }, 'Credit/Debit Card', 'Paid'),
  mockOrder('FB-SEED-0003', 1, 'Pending', 'p2', 1, { Size: 'M', Color: 'Black' }, 'Cash on Delivery', 'Pending'),
];
