// Domain Entity: Cart
// Pure business logic, no dependencies on frameworks

export interface CartItem {
  id: string; // Unique cart item ID
  menuId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  restaurantId: string;
  restaurantName: string;
}

export interface Restaurant {
  id: string;
  name: string;
  deliveryFee: number;
}

export class Cart {
  constructor(
    public items: CartItem[] = [],
    public restaurantId: string | null = null,
    public restaurantName: string | null = null,
    public deliveryFee: number = 0
  ) {}

  // Business Rules
  get itemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get subtotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  get total(): number {
    return this.subtotal + this.deliveryFee;
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  get cartItems(): CartItem[] {
    return [...this.items]; // Return copy to prevent mutation
  }

  get restaurantInfo(): Restaurant | null {
    if (!this.restaurantId || !this.restaurantName) return null;
    return {
      id: this.restaurantId,
      name: this.restaurantName,
      deliveryFee: this.deliveryFee,
    };
  }

  canAddItem(restaurantId: string): boolean {
    if (this.isEmpty) return true;
    return this.restaurantId === restaurantId;
  }

  findItem(menuId: string): CartItem | undefined {
    return this.items.find((item) => item.menuId === menuId);
  }

  getItemQuantity(menuId: string): number {
    const item = this.findItem(menuId);
    return item ? item.quantity : 0;
  }
}
