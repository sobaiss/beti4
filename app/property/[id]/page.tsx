import { notFound } from 'next/navigation'
import Header from '@/components/Header';
import PropertyDetailsView from '@/ui/property/property-details';
import { PropertyService } from '@/lib/services/property';


// export async function generateStaticParams() {
//   return [{
//     id: '1',
//   }];
// }

export default async function PropertyDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  
  let property;
  try {
    property = await PropertyService.getPropertyByIdFromServer(id);
    if (property) {
      // Track property view on component mount
      PropertyService.incrementViewCount(property.id).catch(error => {
        console.error('Error tracking property view:', error);
      });
    }
  } catch (error) {
    console.error('Error fetching property:', error);
    property = null;
  }

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PropertyDetailsView property={property} />
    </div>
  );
}