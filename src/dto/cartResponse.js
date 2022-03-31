/** TODO reafatoring 필요
 * 쿼리 결과 값이 필드 값인 snake_case로 표현하여 다음과 같이 표현  */
class CartItem {
  constructor(wishItem, cartItemInfo) {
    this.wishItem = wishItem;
    this.cartItemInfo = cartItemInfo;
  }

  convertToCartItem(row) {
    this.wishItem = new WishItem(
      row.folder_id,
      row.folder_name,
      row.item_id,
      row.item_img,
      row.item_name,
      row.item_price,
      row.item_url,
      row.item_memo,
      row.create_at,
      row.item_notification_type,
      row.item_notification_date,
      row.cart_state,
    );
    this.cartItemInfo = new CartItemInfo(row.item_count);
    return this;
  }
}

class WishItem {
  constructor(
    folderId,
    folderName,
    itemId,
    itemImg,
    itemName,
    itemPrice,
    itemUrl,
    itemMemo,
    createAt,
    itemNotificationType,
    itemNotificationDate,
    cartState,
  ) {
    this.folder_id = folderId;
    this.folder_name = folderName;
    this.item_id = itemId;
    this.item_img = itemImg;
    this.item_name = itemName;
    this.item_price = itemPrice;
    this.item_url = itemUrl;
    this.item_memo = itemMemo;
    this.create_at = createAt;
    this.item_notification_type = itemNotificationType;
    this.item_notification_date = itemNotificationDate;
    this.cart_state = cartState;
  }
  getWishItem() {
    return this.wishItem;
  }
  setWIshItem(wishItem) {
    this.wishItem = wishItem;
  }
}

class CartItemInfo {
  constructor(itemCount) {
    this.item_count = itemCount;
  }
  getCartItemInfo() {
    return this.item_count;
  }
  setCartItemInfo(itemCount) {
    this.item_count = itemCount;
  }
}

module.exports = {
  CartItem,
  WishItem,
  CartItemInfo,
};
