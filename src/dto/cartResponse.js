class CartResponse {
  constructor() {
    this.cartArray = [];
  }

  addCartResponseItem(wishItem, cartItemInfo) {
    this.cartArray.push({ wishItem, cartItemInfo });
  }

  getCartResponse() {
    return this.cartArray;
  }

  convertToResponse(rows) {
    Object.keys(rows).forEach((value) => {
      const wishItem = new WishItem(
        rows[value].folder_id,
        rows[value].folder_name,
        rows[value].item_id,
        rows[value].item_img,
        rows[value].item_name,
        rows[value].item_price,
        rows[value].item_url,
        rows[value].item_memo,
        rows[value].create_at,
        rows[value].item_notification_type,
        rows[value].item_notification_date,
        rows[value].cart_state
      );
      const cartItemInfo = new CartItemInfo(rows[value].item_count);
      this.addCartResponseItem(wishItem, cartItemInfo);
    });
    return this.getCartResponse();
  }
}

class WishItem {
  constructor(
    folder_id,
    folder_name,
    item_id,
    item_img,
    item_name,
    item_price,
    item_url,
    item_memo,
    create_at,
    item_notification_type,
    item_notification_date,
    cart_state
  ) {
    this.folder_id = folder_id;
    this.folder_name = folder_name;
    this.item_id = item_id;
    this.item_img = item_img;
    this.item_name = item_name;
    this.item_price = item_price;
    this.item_url = item_url;
    this.item_memo = item_memo;
    this.create_at = create_at;
    this.item_notification_type = item_notification_type;
    this.item_notification_date = item_notification_date;
    this.cart_state = cart_state;
  }
}

class CartItemInfo {
  constructor(item_count) {
    this.item_count = item_count;
  }
  getCartItemInfo() {
    return this.item_count;
  }
  setCartItemInfo(item_count) {
    this.item_count = item_count;
  }
}

module.exports = {
  CartResponse,
  WishItem,
  CartItemInfo,
};
