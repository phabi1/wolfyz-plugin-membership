import { Controller, useFormContext } from 'react-hook-form';
import { SelectControl } from '@wordpress/components';

export default function SelectField( { name, label, options }: any ) {
	const { control } = useFormContext();
	return (
		<Controller
			name={ name }
			control={ control }
			render={ ( { field, fieldState } ) => (
				<div style={ { marginBottom: 16 } }>
					<SelectControl
						label={ label }
						value={ field.value || '' }
						options={ options.map( ( option: any ) => ( {
							label: option.label,
							value: option.value,
						} ) ) }
						onChange={ ( value ) => field.onChange( value ) }
						help={ fieldState.error ? fieldState.error.message : undefined }
					/>
				</div>
			) }
		/>
	);
}
