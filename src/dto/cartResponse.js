/** TODO reafatoring 필요
 * 쿼리 결과 값이 필드 값인 snake_case로 표현하여 다음과 같이 표현  */
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
        rows[value].cart_state,
      );
      const cartItemInfo = new CartItemInfo(rows[value].item_count);
      this.addCartResponseItem(wishItem, cartItemInfo);
    });
    return this.getCartResponse();
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
  CartResponse,
  WishItem,
  CartItemInfo,
};
