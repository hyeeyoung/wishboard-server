const axios = require('axios');
const cheerio = require('cheerio');
const { NotFound } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');

const getHtml = async (url) => {
  try {
    return await axios.get(url);
  } catch (err) {
    throw new NotFound(ErrorMessage.itemParseFail);
  }
};

const parsingForGeneral = async (url) => {
  let itemImg;
  let itemName;
  let itemPrice;
  await getHtml(url).then((html) => {
    if (html.status == 200) {
      const $ = cheerio.load(html.data);
      $('meta').each((_, el) => {
        const tag = $(el).attr('property')?.split(':')[1];
        if (tag) {
          const value = $(el).attr('content');
          switch (tag) {
            case 'title':
              itemName = value;
              break;
            case 'image':
              if (!itemImg) {
                itemImg = value;
              }
              break;
            case 'price':
            case 'Price':
            case 'amount':
              if (!itemPrice) {
                itemPrice = value;
              }
              break;
          }
        }
      });
      // TODO itemPrice를 못가져올 경우, div에서 꺼내오는 방법 연구해보기
      // if (!itemPrice) {
      //   console.log('itemPrice가 비었음!');
      //   $('body').map((i, elem) => {
      //     console.log($(elem).find(`div`).text());
      //     // return $(elem)
      //     //   .find(`.${/.*[pP]rice.*/}`)
      //     //   .text();
      //   });
      // }
    }
  });
  itemPrice = itemPrice ? getPriceWithoutString(itemPrice) : undefined;
  // console.log(`im general`);
  return { item_img: itemImg, item_name: itemName, item_price: itemPrice };
};

/* 무신사, 우신사 */
const parsingForMusinsa = async (url) => {
  let itemImg;
  let itemName;
  let itemPrice;
  let priceValue;
  await getHtml(url).then((html) => {
    if (html.status == 200) {
      const $ = cheerio.load(html.data);
      $('meta').each((_, el) => {
        const ogTag = $(el).attr('property')?.split(/^og:/)[1];
        if (ogTag) {
          const ogValue = $(el).attr('content');
          switch (ogTag) {
            case 'title':
              itemName = ogValue;
              priceValue = ogValue.split(' ');
              break;
            case 'image':
              if (!itemImg) {
                itemImg = ogValue;
              }
              break;
          }
        }
      });
      itemPrice = priceValue[priceValue.length - 4];
    }
  });
  itemPrice = itemPrice ? getPriceWithoutString(itemPrice) : undefined;
  return { item_img: itemImg, item_name: itemName, item_price: itemPrice };
};

/* W Concept */
const parsingForWconcept = async (url) => {
  let itemImg;
  let itemName;
  let itemPrice;
  await getHtml(url).then((html) => {
    if (html.status == 200) {
      const $ = cheerio.load(html.data);
      $('meta').each((_, el) => {
        const egTag = $(el).attr('property')?.split(/^eg:/)[1];
        if (egTag) {
          const egValue = $(el).attr('content');
          switch (egTag) {
            case 'itemName':
              itemName = egValue;
              break;
            case 'itemImage':
              itemImg = 'https:';
              itemImg += egValue;
              break;
            case 'originalPrice':
              itemPrice = egValue;
              break;
          }
        }
      });
    }
  });
  itemPrice = itemPrice ? getPriceWithoutString(itemPrice) : undefined;
  return { item_img: itemImg, item_name: itemName, item_price: itemPrice };
};

/* 네이버 스토어팜, 네이버쇼핑 */
const parsingForNaver = async (url) => {
  let itemImg;
  let itemName;
  let itemPrice;
  await getHtml(url).then((html) => {
    if (html.status == 200) {
      const $ = cheerio.load(html.data);
      $('meta').each((_, el) => {
        const egTag = $(el).attr('property')?.split(/^og:/)[1];
        if (egTag) {
          const egValue = $(el).attr('content');
          switch (egTag) {
            case 'title':
              itemName = egValue;
              priceValue = egValue.split(' ');
              break;
            case 'image':
              if (!itemImg) {
                itemImg = egValue;
              }
              break;
          }
        }
      });
      //* 앞 smartStore, 뒤 toptop
      if (!itemPrice) {
        if (
          String(url).includes('smartstore') ||
          String(url).includes('brand') ||
          String(url).includes('m.shopping')
        ) {
          itemPrice = $('._1LY7DqCnwR').html();
        } else {
          itemPrice = $('._25TFi0HDjm').text();
        }
      }
    }
  });
  itemPrice = itemPrice ? getPriceWithoutString(itemPrice) : undefined;
  return { item_img: itemImg, item_name: itemName, item_price: itemPrice };
};

/* COS */
const parsingForCos = async (url) => {
  let itemImg;
  let itemName;
  let itemPrice;
  await getHtml(url).then((html) => {
    if (html.status == 200) {
      const $ = cheerio.load(html.data);
      itemName = $('title').text();
      itemImg = $('.m-product-image').children('img').eq(0).attr('src');
      itemPrice = $('.m-product-price').children('#priceValue').text();
    }
  });
  itemPrice = itemPrice ? getPriceWithoutString(itemPrice) : undefined;
  return { item_img: itemImg, item_name: itemName, item_price: itemPrice };
};

/* Gmarket web/mobile */
const parsingForGmarket = async (url) => {
  let itemImg;
  let itemName;
  let itemPrice;
  let priceValue;
  await getHtml(url).then((html) => {
    if (html.status == 200) {
      const $ = cheerio.load(html.data);
      itemName = $('title').text();
      /* Gmarket Mobile */
      $('meta').each((_, el) => {
        const ogTag = $(el).attr('property')?.split(/^og:/)[1];
        if (ogTag) {
          const ogValue = $(el).attr('content');
          switch (ogTag) {
            case 'title':
              priceValue = ogValue.split(' ');
              break;
            case 'image':
              if (!itemImg) {
                itemImg = ogValue;
              }
              break;
            case 'description':
              itemPrice = ogValue;
              break;
          }
        }
      });
      /* Gmarket Web */
      if (!String(url).includes('mitem')) {
        itemPrice = priceValue[priceValue.length - 1];
      }
    }
  });
  itemPrice = itemPrice ? getPriceWithoutString(itemPrice) : undefined;
  return { item_img: itemImg, item_name: itemName, item_price: itemPrice };
};

const getPriceWithoutString = (itemPrice) => {
  return String(itemPrice).replace(/[^0-9]/g, '');
};

module.exports = {
  // TODO 네이버로 검색한 쇼핑 목록의 경우 -> general에서 동작하도록 변경 필요
  // site.startsWith('https://search.shopping.naver.com/') ||
  // site.startsWith('https://m.search.shopping.naver.com/') ||
  // site.startsWith('https://msearch.shopping.naver.com/') ||
  onBindParsingType: async function (url) {
    const site = String(url); // startsWith쓰려고 String으로 형변환 url은 Any 데이터 타입이므로
    if (
      site.startsWith('https://store.musinsa.com/') ||
      site.startsWith('https://musinsaapp.page.link/') ||
      site.startsWith('https://www.musinsa.com/')
    ) {
      return await parsingForMusinsa(site);
    }
    if (
      site.startsWith('https://m.wconcept.co.kr/') ||
      site.startsWith('https://www.wconcept.co.kr/')
    ) {
      return await parsingForWconcept(site);
    }
    if (
      site.startsWith('https://m.smartstore.naver.com/') ||
      site.startsWith('https://smartstore.naver.com/') ||
      site.startsWith('https://m.shopping.naver.com/') ||
      site.startsWith('https://m.shopping.naver.com/') ||
      site.startsWith('https://brand.naver.com/') ||
      site.startsWith('https://toptop.naver.com/')
    ) {
      return await parsingForNaver(site);
    }
    if (
      site.startsWith('https://www.cosstores.com/') ||
      site.startsWith('https://www.cos.com/')
    ) {
      return await parsingForCos(site);
    }
    if (
      site.startsWith('http://mitem.gmarket.co.kr/') ||
      site.startsWith('http://item.gmarket.co.kr/')
    ) {
      return await parsingForGmarket(site);
    }
    return await parsingForGeneral(site);
  },
};
