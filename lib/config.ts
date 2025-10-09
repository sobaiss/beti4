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

export enum SortOrderEnum {
    ASC = 'asc',
    DESC = 'desc',
};

export enum PropertySortFieldEnum {
    PERTINENCE = 'pertinence',
    PRICE = 'price',
    AREA = 'area',
    CREATED_AT = 'createdAt',
    ROOMS = 'rooms',
};

export const sortOptionsConfig = [
  { value: 'pertinence', label: 'Pertinence', field: PropertySortFieldEnum.PERTINENCE, order: SortOrderEnum.ASC },
  { value: 'createdAt_asc', label: 'Les plus récentes', field: PropertySortFieldEnum.CREATED_AT, order: SortOrderEnum.ASC },
  { value: 'createdAt_desc', label: 'Les plus anciennes', field: PropertySortFieldEnum.CREATED_AT, order: SortOrderEnum.DESC },
  { value: 'price_asc', label: 'Prix croissant', field: PropertySortFieldEnum.PRICE, order: SortOrderEnum.ASC },
  { value: 'price_desc', label: 'Prix décroissant', field: PropertySortFieldEnum.PRICE, order: SortOrderEnum.DESC },
  { value: 'rooms_asc', label: 'Nb pièces croissantes', field: PropertySortFieldEnum.ROOMS, order: SortOrderEnum.ASC },
  { value: 'rooms_desc', label: 'Nb pièces décroissantes', field: PropertySortFieldEnum.ROOMS, order: SortOrderEnum.DESC },
  { value: 'area_asc', label: 'Surface croissante', field: PropertySortFieldEnum.AREA, order: SortOrderEnum.ASC },
  { value: 'area_desc', label: 'Surface décroissante', field: PropertySortFieldEnum.AREA, order: SortOrderEnum.DESC },
];

export const ITEMS_PER_PAGE = 3;

export const CURRENCY = 'FCFA';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_IMAGE_COUNT = 4;