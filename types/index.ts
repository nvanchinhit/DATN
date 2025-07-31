export interface Specialization {
  id: number;
  name: string;
  image: string;
  price: number;
}

export interface Doctor {
  id: number;
  name: string;
  img: string | null;
  introduction?: string;
  specialty_name?: string;
  average_rating?: number;
  price?: number;
  consultation_fee?: number;
  certificate_image?: string | null;
  degree_image?: string | null;
} 