import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker } from '@wordpress/components';

export default function DatePickerField( { name, label, options }: any ) {
    const { control } = useFormContext();
    return (
        <Controller
            name={ name }
            control={ control }
            render={ ( { field } ) => (
                <div style={ { marginBottom: 16 } }>
                    <DatePicker
                        currentDate={ field.value || '' }
                        onChange={ ( value ) => { field.onChange( value ); } }
                    />
                </div>
            ) }
        />
    );
}
