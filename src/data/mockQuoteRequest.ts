// src/data/mockQuoteRequests.ts

export interface QuoteRequest {
    id: string;
    email: string;
    service: string;
    locationFrom: string;
    locationTo: string;
    goodsType: string;
    weight: string;
    date: string;
  }
  
  export const mockQuoteRequests: QuoteRequest[] = [
    { id: '478228', email: 'b.koliki@gmail.com', service: 'Air Freight', locationFrom: 'United Kingdom', locationTo: 'Nigeria', goodsType: 'General', weight: '350kg', date: '13/02/2025' },
    { id: '478229', email: 'a.bello@example.com', service: 'Sea Freight', locationFrom: 'China', locationTo: 'USA', goodsType: 'Electronics', weight: '1200kg', date: '12/02/2025' },
    { id: '478230', email: 'emeka.n@example.com', service: 'Air Freight', locationFrom: 'Nigeria', locationTo: 'Germany', goodsType: 'Documents', weight: '5kg', date: '11/02/2025' },
    { id: '478231', email: 'fatima.g@example.com', service: 'Warehousing', locationFrom: 'Lagos', locationTo: 'Lagos', goodsType: 'Textiles', weight: '500kg', date: '10/02/2025' },
    { id: '478232', email: 't.adebayo@example.com', service: 'Sea Freight', locationFrom: 'USA', locationTo: 'Nigeria', goodsType: 'Vehicle', weight: '1500kg', date: '09/02/2025' },
    { id: '478233', email: 'chi.okoro@example.com', service: 'Air Freight', locationFrom: 'UK', locationTo: 'Ghana', goodsType: 'Cosmetics', weight: '150kg', date: '08/02/2025' },
    { id: '478234', email: 'm.ibrahim@example.com', service: 'Air Freight', locationFrom: 'Dubai', locationTo: 'Nigeria', goodsType: 'Luxury Goods', weight: '50kg', date: '07/02/2025' },
    { id: '478235', email: 'y.alade@example.com', service: 'Sea Freight', locationFrom: 'Brazil', locationTo: 'Spain', goodsType: 'Coffee Beans', weight: '2500kg', date: '06/02/2025' },
    { id: '478236', email: 's.arinze@example.com', service: 'Customs Brokerage', locationFrom: 'Canada', locationTo: 'Canada', goodsType: 'Machinery', weight: '800kg', date: '05/02/2025' },
    { id: '478237', email: 'b.koliki@gmail.com', service: 'Air Freight', locationFrom: 'Nigeria', locationTo: 'South Africa', goodsType: 'Medical Supplies', weight: '200kg', date: '04/02/2025' },
  ];