export interface Store { id: string, storeName: string, latitude: number, longitude: number, adverts: AdvertImg[], showAdverts: boolean  };
export interface AdvertImg { imageUrl: string }