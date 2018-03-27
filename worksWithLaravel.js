// worksWithLaravelDesc = future.join('sentiment(positive: true)', 'topic(value: "laravel")', {
//   text: user.description
// })
//
// import sentiment from '@future/sentiment';
// worksWithLaravelSummary = future.join(sentiment(positive: true), topic(value: "laravel"), {
//   text: user.summary
// })
//
// customCheck = (age) => {
//   LSTME.predict(age);
//   // return age > 18;
// }
//
// export future.join(worksWithLaravelDesc, worksWithLaravelSummary, customCheck);
//

type Input {
  imageUrl: String
}

type Output {
  parts: [String!]
}

export ({ imageUrl }, labeledData) => {
  const network = nnn.train(labeledData);
  return {
    parts: network.predict(imageUrl);
  }
};
