import { Controller, useFormContext } from 'react-hook-form';

export default function FileField({ name, accept }: any) {
    const { control } = useFormContext();
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { ref, name, onBlur, onChange } }) => (
                <input
                    type="file"
                    ref={ref}
                    accept={accept}
                    name={name}
                    onBlur={onBlur}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file ? file : null);
                    }}
                />
            )}
        />
    );
}
