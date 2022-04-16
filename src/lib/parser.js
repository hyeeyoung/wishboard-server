const axios = require('axios');
const cheerio = require('cheerio');
const { NotFound } = require('../utils/errors');
const { ErrorMessage } = require('../utils/response');

let itemInfo;

const getHtml = async (url) => {
  try {
    return await axios.get(url);
  } catch (err) {
    throw new NotFound(ErrorMessage.itemParseFail);
  }
};

const onBindParsingType = async (url) => {
  const site = String(url); // startsWith쓰려고 String으로 형변환 url은 Any 데이터 타입이므로
  return await parsingForGeneral(url);
  //   switch (site) {
  //     case site.startsWith('https://store.musinsa.com/') ||
  //       site.startsWith('https://musinsaapp.page.link/'):
  //       return await parsingForMusinsa(site);
  //     case site.startsWith('https://m.wconcept.co.kr/'):
  //       return await parsingForWconcept(site);
  //     case site.startsWith('https://m.smartstore.naver.com/'):
  //       return await parsingForNaverStore(site);
  //     case site.startsWith('https://www.cosstores.com/'):
  //       return await parsingForCos(site);
  //     default:
  //       return await parsingForGeneral(site);
  //   }
};

const parsingForGeneral = async (url) => {
  itemInfo = { itemName: '', itemImage: '', itemPrice: '' }; // 초기화
  await getHtml(url).then((html) => {
    if (html.status == 200) {
      const $ = cheerio.load(html.data);
      $('meta').each((_, el) => {
        const key = $(el).attr('property')?.split(':')[1]; // split(':')[1]는 og 뒤 title / description 등 ...
        if (key) {
          const value = $(el).attr('content');
          switch (key) {
            case 'title':
              itemInfo.itemName = value;
              break;
            case 'image':
              if (itemInfo.itemImage == '') {
                itemInfo.itemImage = value;
              }
              break;
            case 'price':
            case 'Price':
              if (itemInfo.itemPrice == '') {
                itemInfo.itemPrice = value;
              }
              break;
          }
        }
      });
    }
  });
  console.log(itemInfo);
  return itemInfo;
};

// TODO 구현 예정
// const parsingForMusinsa = async (url) => {
//   return itemInfo;
// };

// const parsingForWconcept = async (url) => {
//   return itemInfo;
// };

// const parsingForNaverStore = async (url) => {
//   return itemInfo;
// };

// const parsingForCos = async (url) => {
//   return itemInfo;
// };

module.exports = { onBindParsingType };
