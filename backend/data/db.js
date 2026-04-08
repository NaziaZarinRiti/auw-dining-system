// data/db.js - In-memory database (replace with MongoDB/PostgreSQL for production)
const bcrypt = require('bcryptjs');

// ─── MEAL MENU DATA ────────────────────────────────────────────────────────────
const weeklyMenu = {
  Monday: {
    breakfast: {
      veg: ['Paratha with Aloo Sabzi', 'Fruit Salad', 'Milk Tea', 'Boiled Eggs'],
      nonveg: ['Paratha with Aloo Sabzi', 'Scrambled Eggs', 'Milk Tea', 'Chicken Sausage'],
      allergens: ['gluten', 'dairy', 'eggs']
    },
    lunch: {
      veg: ['Vegetable Biryani', 'Dal Tadka', 'Raita', 'Salad', 'Roti'],
      nonveg: ['Chicken Biryani', 'Dal Tadka', 'Raita', 'Salad', 'Roti'],
      allergens: ['gluten', 'dairy', 'nuts']
    },
    dinner: {
      veg: ['Paneer Butter Masala', 'Jeera Rice', 'Naan', 'Mixed Veg', 'Kheer'],
      nonveg: ['Mutton Curry', 'Jeera Rice', 'Naan', 'Mixed Veg', 'Kheer'],
      allergens: ['gluten', 'dairy', 'nuts']
    }
  },
  Tuesday: {
    breakfast: {
      veg: ['Idli Sambhar', 'Coconut Chutney', 'Banana', 'Coffee'],
      nonveg: ['Idli Sambhar', 'Coconut Chutney', 'Omelette', 'Coffee'],
      allergens: ['gluten', 'dairy']
    },
    lunch: {
      veg: ['Chole Bhature', 'Onion Salad', 'Lassi', 'Pickle'],
      nonveg: ['Chicken Curry', 'Steamed Rice', 'Roti', 'Salad', 'Lassi'],
      allergens: ['gluten', 'dairy']
    },
    dinner: {
      veg: ['Palak Paneer', 'Tawa Roti', 'Steamed Rice', 'Dahi', 'Gulab Jamun'],
      nonveg: ['Fish Curry', 'Steamed Rice', 'Tawa Roti', 'Dahi', 'Gulab Jamun'],
      allergens: ['gluten', 'dairy', 'fish']
    }
  },
  Wednesday: {
    breakfast: {
      veg: ['Poha', 'Jalebi', 'Milk Tea', 'Seasonal Fruit'],
      nonveg: ['Poha', 'Boiled Eggs', 'Milk Tea', 'Seasonal Fruit'],
      allergens: ['gluten', 'dairy', 'eggs']
    },
    lunch: {
      veg: ['Mixed Veg Pulao', 'Kadai Paneer', 'Roti', 'Salad', 'Pickle'],
      nonveg: ['Prawn Masala', 'Steamed Rice', 'Roti', 'Salad', 'Pickle'],
      allergens: ['gluten', 'shellfish']
    },
    dinner: {
      veg: ['Dal Makhani', 'Butter Naan', 'Jeera Rice', 'Halwa'],
      nonveg: ['Chicken Tikka', 'Dal Makhani', 'Butter Naan', 'Jeera Rice', 'Halwa'],
      allergens: ['gluten', 'dairy', 'nuts']
    }
  },
  Thursday: {
    breakfast: {
      veg: ['Upma', 'Coconut Chutney', 'Boiled Egg', 'Orange Juice'],
      nonveg: ['Upma', 'Chicken Keema', 'Boiled Egg', 'Orange Juice'],
      allergens: ['gluten', 'eggs']
    },
    lunch: {
      veg: ['Rajma Chawal', 'Kachumber Salad', 'Papad', 'Dahi'],
      nonveg: ['Egg Curry', 'Steamed Rice', 'Roti', 'Kachumber Salad', 'Papad'],
      allergens: ['gluten', 'dairy', 'eggs']
    },
    dinner: {
      veg: ['Aloo Gobi', 'Steamed Rice', 'Poori', 'Dal Soup', 'Rasgulla'],
      nonveg: ['Chicken Roast', 'Steamed Rice', 'Poori', 'Dal Soup', 'Rasgulla'],
      allergens: ['gluten', 'dairy']
    }
  },
  Friday: {
    breakfast: {
      veg: ['Dosa', 'Sambhar', 'Tomato Chutney', 'Fruit Juice'],
      nonveg: ['Dosa', 'Sambhar', 'Egg Bhurji', 'Fruit Juice'],
      allergens: ['gluten', 'eggs']
    },
    lunch: {
      veg: ['Veg Dum Biryani', 'Salan', 'Raita', 'Salad', 'Shahi Tukda'],
      nonveg: ['Beef Biryani', 'Salan', 'Raita', 'Salad', 'Shahi Tukda'],
      allergens: ['gluten', 'dairy', 'nuts']
    },
    dinner: {
      veg: ['Paneer Do Pyaza', 'Laccha Paratha', 'Dal Fry', 'Rice', 'Ice Cream'],
      nonveg: ['Mutton Rezala', 'Laccha Paratha', 'Dal Fry', 'Rice', 'Ice Cream'],
      allergens: ['gluten', 'dairy', 'nuts']
    }
  },
  Saturday: {
    breakfast: {
      veg: ['Puri Sabzi', 'Halwa', 'Chai', 'Banana'],
      nonveg: ['Puri Sabzi', 'Halwa', 'Omelette', 'Chai'],
      allergens: ['gluten', 'dairy', 'eggs']
    },
    lunch: {
      veg: ['Veg Hakka Noodles', 'Manchurian', 'Spring Rolls', 'Fried Rice'],
      nonveg: ['Chicken Noodles', 'Chicken Manchurian', 'Spring Rolls', 'Fried Rice'],
      allergens: ['gluten', 'soy', 'eggs']
    },
    dinner: {
      veg: ['Veg Khichdi', 'Papad', 'Pickle', 'Curd', 'Payesh'],
      nonveg: ['Hilsa Fish Curry', 'Steamed Rice', 'Papad', 'Curd', 'Payesh'],
      allergens: ['dairy', 'fish']
    }
  },
  Sunday: {
    breakfast: {
      veg: ['Aloo Paratha', 'Curd', 'Pickle', 'Chai', 'Seasonal Fruit'],
      nonveg: ['Aloo Paratha', 'Curd', 'Boiled Eggs', 'Chai'],
      allergens: ['gluten', 'dairy', 'eggs']
    },
    lunch: {
      veg: ['Special Veg Thali', 'Dal', 'Sabzi', 'Roti', 'Rice', 'Kheer', 'Pickle'],
      nonveg: ['Special Chicken Thali', 'Dal', 'Chicken Curry', 'Roti', 'Rice', 'Kheer'],
      allergens: ['gluten', 'dairy', 'nuts']
    },
    dinner: {
      veg: ['Pasta Arabiata', 'Garlic Bread', 'Veg Soup', 'Brownie'],
      nonveg: ['Chicken Pasta', 'Garlic Bread', 'Chicken Soup', 'Brownie'],
      allergens: ['gluten', 'dairy', 'eggs']
    }
  }
};

// ─── PRICING ───────────────────────────────────────────────────────────────────
const pricing = {
  breakfast: { dayscholar: 50, faculty: 60, residential: 0 },
  lunch:     { dayscholar: 80, faculty: 100, residential: 0 },
  dinner:    { dayscholar: 80, faculty: 100, residential: 0 }
};

// ─── USERS ─────────────────────────────────────────────────────────────────────
const users = [
  {
    id: '220018',
    password: bcrypt.hashSync('auw2024', 10),
    name: 'Ayasha Rahman',
    userType: 'dayscholar',
    academicYear: '3rd Year',
    email: 'ayasha.rahman@auw.edu.bd',
    foodPreference: 'veg',
    allergies: ['nuts', 'dairy'],
    department: 'Computer Science'
  },
  {
    id: '220045',
    password: bcrypt.hashSync('auw2024', 10),
    name: 'Nadia Islam',
    userType: 'residential',
    academicYear: '2nd Year',
    email: 'nadia.islam@auw.edu.bd',
    foodPreference: 'nonveg',
    allergies: ['shellfish'],
    department: 'Economics'
  },
  {
    id: '210033',
    password: bcrypt.hashSync('auw2024', 10),
    name: 'Fatima Al-Zahra',
    userType: 'residential',
    academicYear: '4th Year',
    email: 'fatima.alzahra@auw.edu.bd',
    foodPreference: 'veg',
    allergies: [],
    department: 'Public Health'
  },
  {
    id: 'FAC001',
    password: bcrypt.hashSync('auw2024', 10),
    name: 'Dr. Priya Sharma',
    userType: 'faculty',
    academicYear: 'Faculty',
    email: 'p.sharma@auw.edu.bd',
    foodPreference: 'veg',
    allergies: ['gluten'],
    department: 'Mathematics'
  },
  {
    id: 'FAC002',
    password: bcrypt.hashSync('auw2024', 10),
    name: 'Dr. Amina Begum',
    userType: 'faculty',
    academicYear: 'Faculty',
    email: 'a.begum@auw.edu.bd',
    foodPreference: 'nonveg',
    allergies: [],
    department: 'Biology'
  },
  {
    id: '230010',
    password: bcrypt.hashSync('auw2024', 10),
    name: 'Sumaiya Akter',
    userType: 'dayscholar',
    academicYear: '1st Year',
    email: 'sumaiya.akter@auw.edu.bd',
    foodPreference: 'nonveg',
    allergies: ['eggs'],
    department: 'Environmental Science'
  }
];

// ─── IN-MEMORY STORES ──────────────────────────────────────────────────────────
const tokens = [];       // dining tokens
const payments = [];     // payment records
const feedbacks = [];    // feedback records
const notifications = []; // menu notifications

module.exports = { weeklyMenu, pricing, users, tokens, payments, feedbacks, notifications };
