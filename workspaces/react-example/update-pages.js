const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/<WhatToDoPage onOpenDetail={setSelectedItem} \/>/g, "<WhatToDoPage onOpenDetail={setSelectedItem} onGoBack={() => navigate('home')} />");
content = content.replace(/<WhereToStayPage onOpenDetail={setSelectedItem} \/>/g, "<WhereToStayPage onOpenDetail={setSelectedItem} onGoBack={() => navigate('home')} />");
content = content.replace(/<GastronomyPage onOpenDetail={setSelectedItem} \/>/g, "<GastronomyPage onOpenDetail={setSelectedItem} onGoBack={() => navigate('home')} />");
content = content.replace(/<ShoppingPage onOpenDetail={setSelectedItem} \/>/g, "<ShoppingPage onOpenDetail={setSelectedItem} onGoBack={() => navigate('home')} />");

content = content.replace(/function WhatToDoPage\(\{ onOpenDetail \}: \{ onOpenDetail: \(item: DetailItem\) => void \}\) \{/g, "function WhatToDoPage({ onOpenDetail, onGoBack }: { onOpenDetail: (item: DetailItem) => void, onGoBack: () => void }) {");
content = content.replace(/function WhereToStayPage\(\{ onOpenDetail \}: \{ onOpenDetail: \(item: DetailItem\) => void \}\) \{/g, "function WhereToStayPage({ onOpenDetail, onGoBack }: { onOpenDetail: (item: DetailItem) => void, onGoBack: () => void }) {");
content = content.replace(/function GastronomyPage\(\{ onOpenDetail \}: \{ onOpenDetail: \(item: DetailItem\) => void \}\) \{/g, "function GastronomyPage({ onOpenDetail, onGoBack }: { onOpenDetail: (item: DetailItem) => void, onGoBack: () => void }) {");
content = content.replace(/function ShoppingPage\(\{ onOpenDetail \}: \{ onOpenDetail: \(item: DetailItem\) => void \}\) \{/g, "function ShoppingPage({ onOpenDetail, onGoBack }: { onOpenDetail: (item: DetailItem) => void, onGoBack: () => void }) {");

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx updated');
