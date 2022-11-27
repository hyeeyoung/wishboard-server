const adjectiveWord = [
  '깜찍한',
  '귀여운',
  '아기자기한',
  '사랑스러운',
  '러블리한',
  '낭만있는',
  '순수한',
  '센치한',
  '당당한',
  '새침한',
  '시크한',
  '감각있는',
  '센스있는',
  '빈티지한',
  '심플한',
  '다정한',
  '귀여운',
  '신비로운',
  '알록달록한',
  '반짝이는',
  '아른거리는',
  '행복한',
  '발랄한',
  '해맑은',
  '따뜻한',
  '아늑한',
  '포근한',
  '동그란',
];

const nounWord = [
  '진주',
  '리본',
  '러그',
  '무드등',
  '캔들',
  '턴테이블',
  '헤드셋',
  '프리지아',
  '라벤더',
  '뽀글이',
  '볼캡',
  '베레모',
  '숄더백',
  '선글라스',
  '양말',
  '목걸이',
  '귀걸이',
  '니트',
  '장갑',
  '목도리',
  '청바지',
  '반지',
];

const getRandomNickname = () => {
  const random1 = Math.floor(Math.random() * adjectiveWord.length);
  const random2 = Math.floor(Math.random() * nounWord.length);
  return adjectiveWord[random1] + ' ' + nounWord[random2];
};

module.exports = { getRandomNickname };
