const fs = require('fs');

const files = [
  'src/App.tsx',
  'src/components/InfoCard.tsx',
  'src/components/RestaurantesArticle.tsx',
  'src/components/Carousel.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/(?<!md:|lg:|sm:)py-24/g, 'py-10 md:py-24');
  content = content.replace(/(?<!md:|lg:|sm:)py-20/g, 'py-8 md:py-20');
  content = content.replace(/(?<!md:|lg:|sm:)py-16/g, 'py-8 md:py-16');
  content = content.replace(/(?<!md:|lg:|sm:)py-12/g, 'py-6 md:py-12');
  
  content = content.replace(/(?<!md:|lg:|sm:)pt-32/g, 'pt-20 md:pt-32');
  content = content.replace(/(?<!md:|lg:|sm:)pb-16/g, 'pb-8 md:pb-16');
  content = content.replace(/(?<!md:|lg:|sm:)pb-12/g, 'pb-6 md:pb-12');
  content = content.replace(/(?<!md:|lg:|sm:)pt-24/g, 'pt-12 md:pt-24');
  content = content.replace(/(?<!md:|lg:|sm:)pt-20/g, 'pt-10 md:pt-20');
  content = content.replace(/(?<!md:|lg:|sm:)pb-10/g, 'pb-6 md:pb-10');

  content = content.replace(/(?<!md:|lg:|sm:)mt-32/g, 'mt-16 md:mt-32');
  content = content.replace(/(?<!md:|lg:|sm:)mt-24/g, 'mt-12 md:mt-24');
  content = content.replace(/(?<!md:|lg:|sm:)mt-20/g, 'mt-10 md:mt-20');
  
  content = content.replace(/(?<!md:|lg:|sm:)mb-20/g, 'mb-10 md:mb-20');
  content = content.replace(/(?<!md:|lg:|sm:)mb-16/g, 'mb-8 md:mb-16');
  content = content.replace(/(?<!md:|lg:|sm:)mb-12/g, 'mb-6 md:mb-12');
  
  content = content.replace(/(?<!md:|lg:|sm:)gap-16/g, 'gap-6 md:gap-16');
  content = content.replace(/(?<!md:|lg:|sm:)gap-12/g, 'gap-6 md:gap-12');
  content = content.replace(/(?<!md:|lg:|sm:)gap-8/g, 'gap-4 md:gap-8');

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
