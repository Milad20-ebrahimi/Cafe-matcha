export type CartOwner =
  | {
      type: "user";
      userId: string;
    }
  | {
      type: "guest";
      guestId: string;
    };
    