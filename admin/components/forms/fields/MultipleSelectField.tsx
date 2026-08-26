import { Controller, useFormContext } from 'react-hook-form';

export default function MultipleSelectField( { name, label, options }: any ) {
	const { control } = useFormContext();
	return (
		<Controller
			name={ name }
			control={ control }
			render={ ( { field, fieldState } ) => (
				<div style={ { marginBottom: 16 } }>
					<label style={ { display: 'block', marginBottom: 6, fontWeight: 600 } }>{ label }</label>
					<select
						multiple
						value={ field.value || [] }
						onChange={ ( e ) => {
							const values = Array.from( e.target.selectedOptions ).map(
								( option ) => option.value
							);
							field.onChange( values );
						} }
						style={ {
							width: '100%',
							minHeight: 120,
							padding: 8,
							border: '1px solid #949494',
							borderRadius: 4,
						} }
					>
						{ options.map( ( option: any ) => (
							<option key={ option.value } value={ option.value }>
								{ option.label }
							</option>
						) ) }
					</select>
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
