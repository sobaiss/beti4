import { propertyTypesConfig } from "@/lib/config";
import { Select, SelectItem } from "@heroui/react";

export default function SelectPropertyType({label, placeholder, propertyTypes, setPropertyTypes }: { label: string, placeholder: string, propertyTypes: string[], setPropertyTypes: (value: string[]) => void }) {
    return (
        <Select
            label={label}
            placeholder={placeholder}
            selectionMode="multiple"
            selectedKeys={propertyTypes.length > 0 ? propertyTypes : []}
            onSelectionChange={(keys) => setPropertyTypes(Array.from(keys) as string[])}
            className="w-full sm:w-40"
            size="lg"
            variant="bordered"
            radius="full"
            aria-label="Sélectionner le type de bien"
        >
            <SelectItem key="">Tous</SelectItem>
            <>
                {propertyTypesConfig.map((type) => (
                    <SelectItem key={type.value}>{type.label}</SelectItem>
                ))}
            </>
        </Select>
    );
}