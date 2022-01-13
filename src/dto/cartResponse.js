class CartResponse {
  constructor() {
    this.cartResponse = [];
  }

  setCartResponse(wishItem, cartItemInfo) {
    this.cartResponse.push({ wishItem, cartItemInfo });
  }

  getCartResponse() {
    return this.cartResponse;
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
