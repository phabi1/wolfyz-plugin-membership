import InputField from '../../forms/fields/InputField';
import UiCollection from '../../ui/Collection';
import { __ } from "@wordpress/i18n";

export function CreditCardXOptions({ value, onChange }: { value: { periods: string[] }; onChange: (value: { periods: string[] }) => void }) {
    const onAdd = () => onChange({ periods: [...(value.periods || []), ''] });
    const onRemove = (index: number) => {
        const updatedPeriods = [...(value.periods || [])];
        updatedPeriods.splice(index, 1);
        onChange({ periods: updatedPeriods });
    };
    const onUpdate = (index: number, newValue: string) => {
        const updatedPeriods = [...(value.periods || [])];
        updatedPeriods[index] = newValue;
        onChange({ periods: updatedPeriods });
    };
    
    return (
        <UiCollection
            items={value.periods || []}
            onAddItem={onAdd}
            onRemoveItem={onRemove}
            renderItem={(_, index) => (
                <InputField
                    name={`options.periods[${index}]`}
                    label={__("Period", "wolf-membership")}
                    onChange={(newValue: string) => onUpdate(index, newValue)}
                />
            )}
        />
    );
}