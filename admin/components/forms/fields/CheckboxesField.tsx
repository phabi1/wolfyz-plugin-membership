import { Controller, useFormContext } from 'react-hook-form';
import { CheckboxControl } from '@wordpress/components';

export default function CheckboxesField( { name, label, options }: any ) {
	const { control } = useFormContext();
	return (
		<Controller
			name={ name }
			control={ control }
			render={ ( { field, fieldState } ) => (
				<div style={ { marginBottom: 16 } }>
					<p style={ { margin: '0 0 8px', fontWeight: 600 } }>{ label }</p>
					{ options.map( ( option: any ) => (
						<CheckboxControl
							key={ option.value }
							label={ option.label }
							checked={
								field.value?.includes( option.value ) || false
							}
							onChange={ ( checked ) => {
								const newValue = checked
									? [ ...( field.value || [] ), option.value ]
									: field.value?.filter(
											( v: any ) => v !== option.value
									  );
								field.onChange( newValue );
							} }
						/>
					) ) }
					{ fieldState.error ? (
						<p style={ { margin: '6px 0 0', color: '#b32d2e' } }>
							{ fieldState.error.message }
						</p>
					) : null }
				</div>
			) }
		/>
	);
}
