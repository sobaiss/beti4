export const transactionsConfig = [
  { value: 'achat', label: 'À vendre' },
  { value: 'location', label: 'À louer' },
];

export const propertyTypesConfig = [
  { value: 'appartement', label: 'Appartement' },
  { value: 'bureau_commerce', label: 'Bureaux & Commerces' },
  { value: 'immeuble', label: 'Immeuble' },
  { value: 'maison', label: 'Maison' },
  { value: 'terrain', label: 'Terrain' },
  { value: 'terrain_agricole', label: 'Terrain agricole' },
  { value: 'villa', label: 'Villa' },
];

export const ownerTypesConfig = [
  { value: 'particulier', label: 'Particulier' },
  { value: 'professionnel', label: 'Professionnel' },
];

export const rateTypesConfig = [
  { value: 'heure', label: 'Par heure' },
  { value: 'jour', label: 'Par jour' },
  { value: 'semaine', label: 'Par semaine' },
  { value: 'mois', label: 'Par mois' },
  { value: 'trimestre', label: 'Par trimestre' },
  { value: 'semestre', label: 'Par semestre' },
  { value: 'an', label: 'Par an' },
  { value: 'unique', label: 'Prix unique' },
];

export const amenitiesConfig = [
  { value: 'interieur', label: 'Intérieur' },
  { value: 'exterieur', label: 'Extérieur' },
  { value: 'equipement', label: 'Équipement' },
];

export const propertyStatusesConfig = [
  { value: 'available', label: 'Disponible' },
  { value: 'sold', label: 'Vendu' },
  { value: 'rented', label: 'Loué' },
  { value: 'reserved', label: 'Réservé' },
  { value: 'unavailable', label: 'Indisponible' },
];

export const sortOptionsConfig = [
  { value: 'pertinence', label: 'Pertinence' },
  { value: 'createdAt_asc', label: 'Les plus récentes' },
  { value: 'createdAt_desc', label: 'Les plus anciennes' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'rooms_asc', label: 'Nb pièces croissantes' },
  { value: 'rooms_desc', label: 'Nb pièces décroissantes' },
  { value: 'area_asc', label: 'Surface croissante' },
  { value: 'area_desc', label: 'Surface décroissante' },
];

export const ITEMS_PER_PAGE = 12;