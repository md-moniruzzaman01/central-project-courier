export type ICourierFilterRequest = {
  searchTerm?: string;
};

export type ICourierInputEvent ={
  senderId: number;
  recipientId: number;
  hawb: string;
  referenceCode?: string;
  thirdParty?: string;
  totalWeight: number;
  totalDeclaredValue: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  boxes: any[];
}