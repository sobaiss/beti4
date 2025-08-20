'use client'

import Header from '@/components/Header';
import DeposerUneAnnonceView from '@/ui/deposer-une-annonce/deposer-une-annonce';


// export async function generateStaticParams() {
//   return [{
//     id: '1',
//   }];
// }

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DeposerUneAnnonceView />
    </div>
  );
}