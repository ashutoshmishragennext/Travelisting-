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
    },
    // Previously added entries
    {
        category: "Luxury",
        subcategory: "Resort",
        chain: "Taj Hotels",
        location: "Bekal",
        city: "Kasargod",
        state: "Kerala",
        country: "India",
        ranking: 5,
        rate: 18500,
        discount: "12%",
        agent: {
            name: "Arjun Menon",
            email: "arjun.menon@tajhotels.com",
            phone: "+91 9998887770",
            commission: "16%",
            specialization: "Beachfront Luxury",
            region: "Southern India",
            experience: 7,
            rating: 4.8
        }
    },
    {
        category: "Budget",
        subcategory: "Economy Hotel",
        chain: "OYO Rooms",
        location: "Pune",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        ranking: 3,
        rate: 2800,
        discount: "30%",
        agent: {
            name: "Kavita Singh",
            email: "kavita.singh@oyorooms.com",
            phone: "+91 8889997770",
            commission: "9%",
            specialization: "Urban Budget Stays",
            region: "Western India",
            experience: 3,
            rating: 4.0
        }
    },
    {
        category: "Business",
        subcategory: "City Hotel",
        chain: "Marriott",
        location: "Hyderabad",
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        ranking: 4,
        rate: 9200,
        discount: "14%",
        agent: {
            name: "Suresh Reddy",
            email: "suresh.reddy@marriott.com",
            phone: "+91 7778889990",
            commission: "13%",
            specialization: "Tech Industry Hospitality",
            region: "Southern India",
            experience: 5,
            rating: 4.5
        }
    },
    {
        category: "Heritage",
        subcategory: "Palace Hotel",
        chain: "Taj Hotels",
        location: "Jaipur",
        city: "Jaipur",
        state: "Rajasthan",
        country: "India",
        ranking: 5,
        rate: 22000,
        discount: "18%",
        agent: {
            name: "Divya Rathore",
            email: "divya.rathore@tajhotels.com",
            phone: "+91 6667778880",
            commission: "17%",
            specialization: "Royal Heritage Properties",
            region: "Northern India",
            experience: 9,
            rating: 4.9
        }
    },
    {
        category: "Beach",
        subcategory: "Beachfront Resort",
        chain: "Radisson",
        location: "Mamallapuram",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        ranking: 4,
        rate: 11500,
        discount: "15%",
        agent: {
            name: "Karthik Subramaniam",
            email: "karthik.subramaniam@radisson.com",
            phone: "+91 5556667770",
            commission: "14%",
            specialization: "East Coast Tourism",
            region: "Southern India",
            experience: 6,
            rating: 4.3
        }
    },
    {
        category: "Eco-Tourism",
        subcategory: "Nature Resort",
        chain: "Evolve Back",
        location: "Coorg",
        city: "Madikeri",
        state: "Karnataka",
        country: "India",
        ranking: 5,
        rate: 16000,
        discount: "13%",
        agent: {
            name: "Lakshmi Gowda",
            email: "lakshmi.gowda@evolveback.com",
            phone: "+91 4445556660",
            commission: "15%",
            specialization: "Coffee Plantation Tourism",
            region: "Southern India",
            experience: 7,
            rating: 4.6
        }
    },
    {
        category: "Adventure",
        subcategory: "Mountain Resort",
        chain: "Club Mahindra",
        location: "Manali",
        city: "Manali",
        state: "Himachal Pradesh",
        country: "India",
        ranking: 4,
        rate: 13500,
        discount: "20%",
        agent: {
            name: "Rajesh Thakur",
            email: "rajesh.thakur@clubmahindra.com",
            phone: "+91 3334445550",
            commission: "13%",
            specialization: "Mountain Adventures",
            region: "Northern India",
            experience: 8,
            rating: 4.5
        }
    },
    {
        category: "Wellness",
        subcategory: "Spa Resort",
        chain: "CGH Earth",
        location: "Thekkady",
        city: "Kumily",
        state: "Kerala",
        country: "India",
        ranking: 4,
        rate: 14500,
        discount: "16%",
        agent: {
            name: "Maya Thomas",
            email: "maya.thomas@cghearth.com",
            phone: "+91 2223334440",
            commission: "14%",
            specialization: "Ayurvedic Wellness",
            region: "Southern India",
            experience: 6,
            rating: 4.7
        }
    },
    {
        category: "Boutique",
        subcategory: "Design Hotel",
        chain: "Neemrana Hotels",
        location: "Delhi",
        city: "New Delhi",
        state: "Delhi",
        country: "India",
        ranking: 4,
        rate: 9500,
        discount: "12%",
        agent: {
            name: "Gaurav Malhotra",
            email: "gaurav.malhotra@neemrana.com",
            phone: "+91 1112223330",
            commission: "12%",
            specialization: "Urban Heritage",
            region: "Northern India",
            experience: 5,
            rating: 4.4
        }
    },
    {
        category: "Budget",
        subcategory: "Hostel", 
        chain: "Zostel",
        location: "Agra",
        city: "Agra",
        state: "Uttar Pradesh",
        country: "India",
        ranking: 3,
        rate: 1500,
        discount: "25%",
        agent: {
            name: "Neha Gupta",
            email: "neha.gupta@zostel.com",
            phone: "+91 9990001110",
            commission: "10%",
            specialization: "Tourist Destination Budget Stays",
            region: "Northern India",
            experience: 4,
            rating: 4.2
        }
    },
    // Additional new entries
    {
        category: "Luxury",
        subcategory: "Resort",
        chain: "Oberoi Hotels",
        location: "Shimla",
        city: "Shimla",
        state: "Himachal Pradesh",
        country: "India",
        ranking: 5,
        rate: 23000,
        discount: "15%",
        agent: {
            name: "Alok Chauhan",
            email: "alok.chauhan@oberoi.com",
            phone: "+91 9988776655",
            commission: "18%",
            specialization: "Mountain Luxury",
            region: "Northern India",
            experience: 10,
            rating: 4.9
        }
    },
    {
        category: "Business",
        subcategory: "City Hotel",
        chain: "Taj Hotels",
        location: "Mumbai",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        ranking: 5,
        rate: 14500,
        discount: "12%",
        agent: {
            name: "Sanjay Patil",
            email: "sanjay.patil@tajhotels.com",
            phone: "+91 8877665544",
            commission: "15%",
            specialization: "Business Travelers",
            region: "Western India",
            experience: 9,
            rating: 4.8
        }
    },
    {
        category: "Heritage",
        subcategory: "Palace Hotel",
        chain: "Neemrana Hotels",
        location: "Alwar",
        city: "Alwar",
        state: "Rajasthan",
        country: "India",
        ranking: 4,
        rate: 11000,
        discount: "16%",
        agent: {
            name: "Ishita Sharma",
            email: "ishita.sharma@neemrana.com",
            phone: "+91 7766554433",
            commission: "14%",
            specialization: "Fort Properties",
            region: "Northern India",
            experience: 7,
            rating: 4.6
        }
    },
    {
        category: "Budget",
        subcategory: "Economy Hotel",
        chain: "FabHotels",
        location: "Chennai",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        ranking: 3,
        rate: 2600,
        discount: "28%",
        agent: {
            name: "Vignesh Kumar",
            email: "vignesh.kumar@fabhotels.com",
            phone: "+91 6655443322",
            commission: "9%",
            specialization: "City Center Budget Stays",
            region: "Southern India",
            experience: 4,
            rating: 4.1
        }
    },
    {
        category: "Eco-Tourism",
        subcategory: "Nature Resort",
        chain: "Jungle Lodges",
        location: "Kabini",
        city: "Mysore",
        state: "Karnataka",
        country: "India",
        ranking: 4,
        rate: 9800,
        discount: "14%",
        agent: {
            name: "Prabhu Gowda",
            email: "prabhu.gowda@junglelodges.com",
            phone: "+91 5544332211",
            commission: "12%",
            specialization: "Wildlife Tourism",
            region: "Southern India",
            experience: 8,
            rating: 4.5
        }
    },
    {
        category: "Wellness",
        subcategory: "Ayurveda Resort",
        chain: "Kairali Ayurvedic Group",
        location: "Palakkad",
        city: "Palakkad",
        state: "Kerala",
        country: "India",
        ranking: 4,
        rate: 13000,
        discount: "18%",
        agent: {
            name: "Anita Menon",
            email: "anita.menon@kairali.com",
            phone: "+91 4433221100",
            commission: "16%",
            specialization: "Traditional Ayurveda",
            region: "Southern India",
            experience: 9,
            rating: 4.7
        }
    },
    {
        category: "Adventure",
        subcategory: "Jungle Resort",
        chain: "Pugdundee Safaris",
        location: "Kanha",
        city: "Mandla",
        state: "Madhya Pradesh",
        country: "India",
        ranking: 4,
        rate: 15500,
        discount: "15%",
        agent: {
            name: "Rohit Sharma",
            email: "rohit.sharma@pugdundeesafaris.com",
            phone: "+91 3322110099",
            commission: "14%",
            specialization: "Tiger Safaris",
            region: "Central India",
            experience: 7,
            rating: 4.6
        }
    },
    {
        category: "Boutique",
        subcategory: "Heritage Hotel",
        chain: "RAAS Hotels",
        location: "Amritsar",
        city: "Amritsar",
        state: "Punjab",
        country: "India",
        ranking: 4,
        rate: 10500,
        discount: "12%",
        agent: {
            name: "Gurpreet Singh",
            email: "gurpreet.singh@raashotels.com",
            phone: "+91 2211009988",
            commission: "13%",
            specialization: "Cultural Tourism",
            region: "Northern India",
            experience: 6,
            rating: 4.5
        }
    },
    {
        category: "Beach",
        subcategory: "Beachfront Resort",
        chain: "Taj Hotels",
        location: "Andaman",
        city: "Port Blair",
        state: "Andaman & Nicobar Islands",
        country: "India",
        ranking: 5,
        rate: 19500,
        discount: "14%",
        agent: {
            name: "Nisha Roy",
            email: "nisha.roy@tajhotels.com",
            phone: "+91 1100998877",
            commission: "17%",
            specialization: "Island Tourism",
            region: "Eastern India",
            experience: 8,
            rating: 4.8
        }
    },
    {
        category: "Cultural",
        subcategory: "Heritage Homestay",
        chain: "Zostel",
        location: "Jaisalmer",
        city: "Jaisalmer",
        state: "Rajasthan",
        country: "India",
        ranking: 3,
        rate: 2200,
        discount: "22%",
        agent: {
            name: "Sumit Jain",
            email: "sumit.jain@zostel.com",
            phone: "+91 9988776611",
            commission: "11%",
            specialization: "Desert Tourism",
            region: "Northern India",
            experience: 4,
            rating: 4.3
        }
    },
    {
        category: "Luxury",
        subcategory: "Beach Resort",
        chain: "The Leela",
        location: "South Goa",
        city: "Cavelossim",
        state: "Goa",
        country: "India",
        ranking: 5,
        rate: 21000,
        discount: "15%",
        agent: {
            name: "Monica D'Souza",
            email: "monica.dsouza@theleela.com",
            phone: "+91 8877665522",
            commission: "16%",
            specialization: "Luxury Beach Holidays",
            region: "Western India",
            experience: 7,
            rating: 4.7
        }
    },
    {
        category: "Business",
        subcategory: "Airport Hotel",
        chain: "ITC Hotels",
        location: "Delhi",
        city: "New Delhi",
        state: "Delhi",
        country: "India",
        ranking: 5,
        rate: 12500,
        discount: "10%",
        agent: {
            name: "Vivek Khanna",
            email: "vivek.khanna@itchotels.com",
            phone: "+91 7766554422",
            commission: "14%",
            specialization: "Business Transit",
            region: "Northern India",
            experience: 8,
            rating: 4.6
        }
    },
    {
        category: "Heritage",
        subcategory: "Haveli Hotel",
        chain: "Samode Hotels",
        location: "Mandawa",
        city: "Mandawa",
        state: "Rajasthan",
        country: "India",
        ranking: 4,
        rate: 9800,
        discount: "18%",
        agent: {
            name: "Pradeep Singh",
            email: "pradeep.singh@samodehotels.com",
            phone: "+91 6655443311",
            commission: "13%",
            specialization: "Heritage Experiences",
            region: "Northern India",
            experience: 6,
            rating: 4.5
        }
    },
    {
        category: "Budget",
        subcategory: "Motel",
        chain: "OYO Rooms",
        location: "Varanasi",
        city: "Varanasi",
        state: "Uttar Pradesh",
        country: "India",
        ranking: 3,
        rate: 1800,
        discount: "30%",
        agent: {
            name: "Anand Mishra",
            email: "anand.mishra@oyorooms.com",
            phone: "+91 5544332200",
            commission: "8%",
            specialization: "Pilgrim Stays",
            region: "Northern India",
            experience: 3,
            rating: 4.0
        }
    },
    {
        category: "Eco-Tourism",
        subcategory: "Tree House",
        chain: "Green Woods Resorts",
        location: "Munnar",
        city: "Munnar",
        state: "Kerala",
        country: "India",
        ranking: 4,
        rate: 12000,
        discount: "15%",
        agent: {
            name: "Sreelakshmi Nair",
            email: "sreelakshmi.nair@greenwoods.com",
            phone: "+91 4433221155",
            commission: "14%",
            specialization: "Tea Plantation Tourism",
            region: "Southern India",
            experience: 5,
            rating: 4.4
        }
    }
  ];
  
  export default indiaHotelAgents;