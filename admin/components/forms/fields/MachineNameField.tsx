import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Button, TextControl } from '@wordpress/components';
import slugify from 'slugify';

export interface MachineNameFieldProps {
	name: string;
	label: string;
	fieldName: string;
}

export default function MachineNameField( {
	name,
	label,
	fieldName,
}: MachineNameFieldProps ) {
	const [ locked, setLocked ] = useState( true );
	const { watch, setValue, control } = useFormContext();

	useEffect( () => {
		const subscription = watch( ( value, { name: changedField } ) => {
			if ( changedField === fieldName && locked ) {
				const machineName = slugify( value[ fieldName ], {
					lower: true,
					strict: true,
				} );
				setValue( name, machineName );
			}
		} );
		return () => subscription.unsubscribe();
	}, [ watch, setValue, fieldName, name, locked ] );

	return (
		<Controller
			name={ name }
			control={ control }
			render={ ( { field, fieldState } ) => (
				<div style={ { marginBottom: 16 } }>
					<div style={ { display: 'flex', alignItems: 'flex-end', gap: 8 } }>
						<div style={ { flex: 1 } }>
							<TextControl
								{ ...field }
								label={ label }
								type="text"
								value={ field.value || '' }
								onChange={ ( value ) => {
									field.onChange( value );
								} }
								disabled={ locked }
								help={
									fieldState.error ? fieldState.error.message : undefined
								}
							/>
						</div>
						<Button
							variant="secondary"
							onClick={ () => setLocked( ! locked ) }
						>
							{ locked ? 'Unlock' : 'Lock' }
						</Button>
					</div>
				</div>
			) }
		/>
	);
}
