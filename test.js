const future = require('./index');
const brain = require('brain.js')

const run = async () => {
  const loves = ({ text }) => {
    return !!text.match(/love/);
  };

  const mentionsLaravel = ({ text }) => {
    return !!text.match(/laravel/);
  };

  const wantsToWorkWithLaravel = future({
    name: 'wantsToWorkWithLaravel',
  }).and(loves, mentionsLaravel);

  console.log('wantsToWorkWithLaravel "i love laravel"',
    await wantsToWorkWithLaravel({ text: 'i love laravel' }));

  const isFromVilnius = ({ text }) => {
    return text.match(/Vilnius/);
  };

  const wantsToWorkWithLaravelAndIsFromVilnius = future({
    name: 'wantsToWorkWithLaravelAndIsFromVilnius',
  }).and(wantsToWorkWithLaravel, isFromVilnius);

  console.log('wantsToWorkWithLaravelAndIsFromVilnius "i love laravel and Im from Kaunas"',
    await wantsToWorkWithLaravelAndIsFromVilnius({ text: 'i love laravel and Im from Kaunas' }));

  console.log('wantsToWorkWithLaravelAndIsFromVilnius "i love laravel and Im from Vilnius"',
    await wantsToWorkWithLaravelAndIsFromVilnius({ text: 'i love laravel and Im from Vilnius' }));
};

run();
