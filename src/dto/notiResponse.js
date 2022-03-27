function generateNotiItem(notiList) {
  return notiList.reduce((notiItems, data) => {
    const token = data.fcm_token;
    const notiData = {
      itemId: data.item_id,
      notiType: data.item_notification_type,
    };
    if (notiItems[token]) {
      notiItems[token].push(notiData);
    } else {
      notiItems[token] = [notiData];
    }
    return notiItems;
  }, []);
}

module.exports = { generateNotiItem };
