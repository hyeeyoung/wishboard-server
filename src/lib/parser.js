const axios = require('axios');
const cheerio = require('cheerio');
const { WishItem } = require('../dto/cartResponse');
const { NotFound } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');

const getHtml = async (url) => {
  try {
    return await axios.get(url);
  } catch (err) {
    throw new NotFound(ErrorMessage.itemParseFail);
  }
};

// ! 각 케이스별로 로그를 찍어보고 () 완전히 묶기
const onBindParsingType = async (url) => {
  const site = String(url); // startsWith쓰려고 String으로 형변환 url은 Any 데이터 타입이므로
  if (
    site.startsWith('https://store.musinsa.com/') ||
    site.startsWith('https://musinsaapp.page.link/') ||
    site.startsWith('https://www.musinsa.com/')
  ) {
    return await parsingForMusinsa(site);
  }
  if (site.startsWith('https://m.wconcept.co.kr/')) {
    return await parsingForWconcept(site);
  }
  if (
    site.startsWith('https://m.smartstore.naver.com/') ||
    site.startsWith('https://smartstore.naver.com/') ||
    site.startsWith('https://search.shopping.naver.com/') ||
    site.startsWith('https://brand.naver.com/')
  ) {
    return await parsingForNaver(site);
  }
  if (site.startsWith('https://www.cosstores.com/')) {
    return await parsingForCos(site);
  }
  return await parsingForGeneral(site);
};

const parsingForGeneral = async (url) => {
  const wishItem = new WishItem();
  await getHtml(url).then((html) => {
    if (html.status == 200) {
      const $ = cheerio.load(html.data);
      $('meta').each((_, el) => {
        const ogTag = $(el).attr('property')?.split(/:/)[1];
        if (ogTag) {
          const ogValue = $(el).attr('content');
          switch (ogTag) {
            case 'title':
              wishItem.item_name = ogValue;
              break;
            case 'image':
              if (!wishItem.item_img) {
                wishItem.item_img = ogValue;
              }
              break;
            case 'price':
            case 'Price':
              if (!wishItem.item_price) {
                wishItem.item_price = ogValue;
              }
              break;
          }
        }
      });
      const priceArray = [];
      console.log($('div.price').text());
      $(/[pP]rice/)?.each((idx, el) => {
        priceArray[idx] = $(el).attr('class');
        console.log(priceArray);
        console.log($(el).attr('class'));
      });
      if (!wishItem.item_price) {
        // WishItem.item_price = $(/^.lowestPrice*/).html();
      }
    }
  });
  // console.log(`im general ${wishItem}`);
  return wishItem;
};

// TODO 구현 예정
const parsingForMusinsa = async (url) => {
  const wishItem = new WishItem();
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
              wishItem.item_name = ogValue;
              priceValue = ogValue.split(' ');
              break;
            case 'image':
              if (!wishItem.item_img) {
                wishItem.item_img = ogValue;
              }
              break;
          }
        }
      });
      wishItem.item_price = priceValue[priceValue.length - 4];
    }
  });
  // console.log(`im musinsa ${wishItem.item_img}`);
  return wishItem;
};

// const parsingForWconcept = async (url) => {
//   return wishItem;
// };

const parsingForNaver = async (url) => {
  // resetWishItem();
  const wishItem = new WishItem();
  await getHtml(url).then((html) => {
    if (html.status == 200) {
      const $ = cheerio.load(html.data);
      $('meta').each((_, el) => {
        const ogTag = $(el).attr('property')?.split(/^og:/)[1];
        if (ogTag) {
          const ogValue = $(el).attr('content');
          switch (ogTag) {
            case 'title':
              wishItem.item_name = ogValue;
              priceValue = ogValue.split(' ');
              break;
            case 'image':
              if (!wishItem.item_img) {
                wishItem.item_img = ogValue;
              }
              break;
          }
        }
      });
      //* 앞 smartStore, 뒤 search~
      if (!wishItem.item_price) {
        if (
          String(url).includes('smartstore') ||
          String(url).includes('brand')
        ) {
          wishItem.item_price = $('._1LY7DqCnwR').html();
        } else {
          wishItem.item_price = $('.lowestPrice_num__3AlQ-').text();
        }
      }
    }
  });
  // console.log(`im Naver ${wishItem}`);
  return wishItem;
};

// const parsingForCos = async (url) => {
//   return WishItem;
// };

module.exports = { onBindParsingType };
