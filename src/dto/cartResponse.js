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
        rows[value].cart_item_id
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
    cartItemId
  ) {
    this.folderId = folderId;
    this.folderName = folderName;
    this.itemId = itemId;
    this.itemImg = itemImg;
    this.itemName = itemName;
    this.itemPrice = itemPrice;
    this.itemUrl = itemUrl;
    this.itemMemo = itemMemo;
    this.createAt = createAt;
    this.itemNotificationType = itemNotificationType;
    this.itemNotificationDate = itemNotificationDate;
    this.cartItemId = cartItemId;
  }
}

class CartItemInfo {
  constructor(itemCount) {
    this.itemCount = itemCount;
  }
  getCartItemInfo() {
    return this.itemCount;
  }
  setCartItemInfo(itemCount) {
    this.itemCount = itemCount;
  }
}

module.exports = {
  CartResponse,
  WishItem,
  CartItemInfo,
};
