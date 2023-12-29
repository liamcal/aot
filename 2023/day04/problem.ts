export type Address = { address: string; city: string };
export type PresentDeliveryList<T> = { [key in keyof T]: Address };
