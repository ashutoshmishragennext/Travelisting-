interface Agent {
  name: string;
  email: string;
  phone: string;
  commission: string;
  specialization: string;
  region: string;
  experience: number;
  rating: number;
}

interface HotelAgentInfo {
  category: string;
  subcategory: string;
  chain: string;
  location: string;
  city: string;
  state: string;
  country: string;
  ranking: number;
  rate: number;
  discount: string;
  agent: Agent;
}

const indiaHotelAgents: HotelAgentInfo[] = [
  {
      category: "Luxury",
      subcategory: "Resort",
      chain: "Taj Hotels",
      location: "Goa",
      city: "Panaji",
      state: "Goa",
      country: "India",
      ranking: 5,
      rate: 12500,
      discount: "10%",
      agent: {
          name: "Priya Sharma",
          email: "priya.sharma@tajhotels.com",
          phone: "+91 9876543210",
          commission: "15%",
          specialization: "Beach Resorts",
          region: "Western India",
          experience: 8,
          rating: 4.7
      }
  },
  {
      category: "Business",
      subcategory: "City Hotel",
      chain: "Marriott",
      location: "Bangalore",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      ranking: 4,
      rate: 8500,
      discount: "15%",
      agent: {
          name: "Rahul Mehta",
          email: "rahul.mehta@marriott.com",
          phone: "+91 8765432109",
          commission: "12%",
          specialization: "Corporate Travel",
          region: "Southern India",
          experience: 6,
          rating: 4.5
      }
  },
  {
      category: "Heritage",
      subcategory: "Palace Hotel",
      chain: "Oberoi Hotels",
      location: "Udaipur",
      city: "Udaipur",
      state: "Rajasthan",
      country: "India",
      ranking: 5,
      rate: 15000,
      discount: "20%",
      agent: {
          name: "Aditya Patel",
          email: "aditya.patel@oberoi.com",
          phone: "+91 7654321098",
          commission: "18%",
          specialization: "Heritage Properties",
          region: "Northern India",
          experience: 10,
          rating: 4.9
      }
  },
  {
      category: "Budget",
      subcategory: "Economy Hotel",
      chain: "OYO Rooms",
      location: "Kolkata",
      city: "Kolkata",
      state: "West Bengal",
      country: "India",
      ranking: 3,
      rate: 3500,
      discount: "25%",
      agent: {
          name: "Sneha Banerjee",
          email: "sneha.banerjee@oyorooms.com",
          phone: "+91 6543210987",
          commission: "10%",
          specialization: "Budget Accommodations",
          region: "Eastern India",
          experience: 4,
          rating: 4.2
      }
  },
  {
      category: "Eco-Tourism",
      subcategory: "Nature Resort",
      chain: "The Machan",
      location: "Lonavala",
      city: "Lonavala",
      state: "Maharashtra",
      country: "India",
      ranking: 4,
      rate: 9000,
      discount: "12%",
      agent: {
          name: "Vikram Joshi",
          email: "vikram.joshi@themachan.com",
          phone: "+91 9543210876",
          commission: "13%",
          specialization: "Eco-friendly Resorts",
          region: "Western India",
          experience: 5,
          rating: 4.6
      }
  },
  {
      category: "Wellness",
      subcategory: "Spa Resort",
      chain: "Ananda in the Himalayas",
      location: "Rishikesh",
      city: "Rishikesh",
      state: "Uttarakhand",
      country: "India",
      ranking: 5,
      rate: 25000,
      discount: "15%",
      agent: {
          name: "Anjali Nair",
          email: "anjali.nair@ananda.com",
          phone: "+91 9012345678",
          commission: "20%",
          specialization: "Wellness Tourism",
          region: "Northern India",
          experience: 7,
          rating: 4.8
      }
  },
  {
      category: "Adventure",
      subcategory: "Jungle Resort",
      chain: "Pugdundee Safaris",
      location: "Bandhavgarh",
      city: "Umaria",
      state: "Madhya Pradesh",
      country: "India",
      ranking: 4,
      rate: 18000,
      discount: "18%",
      agent: {
          name: "Sanjay Kumar",
          email: "sanjay.kumar@pugdundeesafaris.com",
          phone: "+91 8901234567",
          commission: "16%",
          specialization: "Wildlife Tourism",
          region: "Central India",
          experience: 9,
          rating: 4.7
      }
  },
  {
      category: "Boutique",
      subcategory: "Design Hotel",
      chain: "RAAS Hotels",
      location: "Jodhpur",
      city: "Jodhpur",
      state: "Rajasthan",
      country: "India",
      ranking: 5,
      rate: 12000,
      discount: "13%",
      agent: {
          name: "Meera Desai",
          email: "meera.desai@raashotels.com",
          phone: "+91 7890123456",
          commission: "14%",
          specialization: "Boutique Accommodations",
          region: "Northern India",
          experience: 6,
          rating: 4.6
      }
  },
  {
      category: "Beach",
      subcategory: "Beachfront Resort",
      chain: "CGH Earth",
      location: "Kovalam",
      city: "Trivandrum",
      state: "Kerala",
      country: "India",
      ranking: 4,
      rate: 10000,
      discount: "16%",
      agent: {
          name: "Deepak Nambiar",
          email: "deepak.nambiar@cghearth.com",
          phone: "+91 6789012345",
          commission: "12%",
          specialization: "Coastal Resorts",
          region: "Southern India",
          experience: 5,
          rating: 4.4
      }
  },
  {
      category: "Cultural",
      subcategory: "Heritage Homestay",
      chain: "Zostel",
      location: "Varanasi",
      city: "Varanasi",
      state: "Uttar Pradesh",
      country: "India",
      ranking: 3,
      rate: 4500,
      discount: "22%",
      agent: {
          name: "Ravi Shankar",
          email: "ravi.shankar@zostel.com",
          phone: "+91 5678901234",
          commission: "11%",
          specialization: "Backpacker Accommodations",
          region: "Northern India",
          experience: 3,
          rating: 4.1
      }
  }
];

export default indiaHotelAgents;