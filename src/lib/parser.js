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
  let itemImg;
  let itemName;
  let itemPrice;
  await getHtml(url).then((html) => {
    if (html.status == 200) {
      const $ = cheerio.load(html.data);
      $('meta').each((_, el) => {
        const ogTag = $(el).attr('property')?.split(/:/)[1];
        if (ogTag) {
          const ogValue = $(el).attr('content');
          switch (ogTag) {
            case 'title':
              itemName = ogValue;
              break;
            case 'image':
              if (!itemImg) {
                itemImg = ogValue;
              }
              break;
            case 'price':
            case 'Price':
              if (!itemPrice) {
                itemPrice = ogValue;
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
      if (itemPrice) {
        // itemPrice = $(/^.lowestPrice*/).html();
      }
    }
  });
  // console.log(`im general ${wishItem}`);
  return { item_img: itemImg, item_name: itemName, item_price: itemPrice };
};

// TODO 구현 예정
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
  // console.log(`im musinsa ${itemImg}`);
  return { item_img: itemImg, item_name: itemName, item_price: itemPrice };
};

// const parsingForWconcept = async (url) => {
//   return { item_img: itemImg, item_name: itemName, item_price: itemPrice };
// };

const parsingForNaver = async (url) => {
  let itemImg;
  let itemName;
  let itemPrice;
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
      //* 앞 smartStore, 뒤 search~
      if (!itemPrice) {
        if (
          String(url).includes('smartstore') ||
          String(url).includes('brand')
        ) {
          itemPrice = $('._1LY7DqCnwR').html();
        } else {
          itemPrice = $('.lowestPrice_num__3AlQ-').text();
        }
      }
    }
  });
  // console.log(`im Naver ${wishItem}`);
  return { item_img: itemImg, item_name: itemName, item_price: itemPrice };
};

// const parsingForCos = async (url) => {
//   return { item_img: itemImg, item_name: itemName, item_price: itemPrice };
// };

module.exports = { onBindParsingType };
