export interface Agent {
  name: string;
  commission: string;
}

export interface Hotel {
  category: string;
  subcategory: string;
  chain: string;
  location: string;
  city: string;
  state: string;
  country: string;
  ranking: string;
  agent: Agent;
  rate: number;
  discount: string;
}