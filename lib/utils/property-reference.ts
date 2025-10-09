/**
 * Property reference generation utility
 * Generates unique references for properties
 */

import { CreatePropertyInput } from '@/lib/validations/property'
import { Property } from '@/types/property'


function getReferencePrefix(type: string): string {
  return {
    appartement: 'APP',
    maison: 'MAI',
    villa: 'VIL',
    immeuble: 'IMM',
    bureau_commerce: 'BCO',
    terrain: 'TER',
    terrain_agricole: 'TERA'
  }[type] || 'PROP' // Default prefix if type is unknown
}

/**
 * Generate a unique property reference
 * Format: <PREFIX>-<YYYYMMDD>-<POSTAL_CODE>-<HHMMSS>
 */
export async function generatePropertyReference(property: Partial<CreatePropertyInput | Property>): Promise<string> {
  const currentDate = new Date()
  const currentYearMonthDay = currentDate.getFullYear() +
    (currentDate.getMonth() + 1).toString().padStart(2, '0') +
    currentDate.getDate().toString().padStart(2, '0');

  const currentHourMinuteSecond = currentDate.getHours().toString().padStart(2, '0') +
    currentDate.getMinutes().toString().padStart(2, '0') +
    currentDate.getSeconds().toString().padStart(2, '0');
  const zipCode = property.zipCode ?? '00000'

  return getReferencePrefix(property.propertyType || 'appartement') + `-${currentYearMonthDay}-${zipCode}-${currentHourMinuteSecond}`;
}
