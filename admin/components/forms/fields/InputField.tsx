import { TextControl } from '@wordpress/components';
import { Controller, useFormContext } from 'react-hook-form';

export default function Input( { name, label, type }: any ) {
	const { control } = useFormContext();
	return (
		<Controller
			name={ name }
			control={ control }
			render={ ( { field, fieldState } ) => (
				<div style={ { marginBottom: 16 } }>
					<TextControl
						{ ...field }
						label={ label }
						type={ type }
						value={ field.value || '' }
						onChange={ ( value ) => {
							field.onChange( value );
						} }
						help={ fieldState.error ? fieldState.error.message : undefined }
					/>
				</div>
			) }
		/>
	);
}
