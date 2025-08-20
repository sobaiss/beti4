import { notFound } from 'next/navigation'
import Header from '@/components/Header';
import { getCities } from '@/lib/actions/location';
import DeposerUneAnnonceView from '@/ui/deposer-une-annonce/deposer-une-annonce';


// export async function generateStaticParams() {
//   return [{
//     id: '1',
//   }];
// }

export default async function Page() {

  let cities;
  try {
    cities = await getCities();
  } catch (error) {
    console.error('Error fetching cities:', error);
    cities = undefined;
  }

  if (!cities) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DeposerUneAnnonceView cities={cities} />
    </div>
  );
}