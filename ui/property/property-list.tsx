import PropertyCard from "@/components/PropertyCard";
import { PropertyService } from "@/lib/services/property";
import { Property } from "@/types/property";
import { Button } from "@heroui/react";
import Link from "next/link";

export default async function PropertyList() {
    let properties: Property[] = [];

    // try {
        properties = await PropertyService.getFeaturedProperties(6);
        // if (response.ok) {
        //     properties = await response.json() as Property[];
        // }
    // } catch (error) {
    //     console.error('Error fetching featured properties:', error);
    // }

  return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Biens en Vedette
            </h2>
            <p className="text-xl text-default-600 max-w-2xl mx-auto">
              Sélection de biens immobiliers les plus attractifs actuellement disponibles
            </p>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
                ))}
            </div>

          <div className="text-center mt-12">
            <Button variant="bordered" size="lg" className="px-8">
              <Link href="/properties">
                Voir Tous les Biens
              </Link>
            </Button>
          </div>
        </div>
      </section>
  );
}