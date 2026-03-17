export interface Categories {
  id: string;
  name: string;
  userId: string;
  isDefault?: boolean;
  ownerUserId?: string | null;
}
