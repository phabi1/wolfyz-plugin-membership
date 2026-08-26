import { useFormContext, Controller } from 'react-hook-form';
import { ToggleControl } from '@wordpress/components';

export interface SwitchFieldProps {
	name: string;
	label: string;
}

export default function SwitchField( { name, label }: SwitchFieldProps ) {
	const { control } = useFormContext();
	return (
		<Controller
			name={ name }
			control={ control }
			defaultValue={ false }
			render={ ( { field } ) => (
				<div style={ { marginBottom: 16 } }>
					<ToggleControl
						label={ label }
						checked={ !! field.value }
						onChange={ ( value ) => field.onChange( value ) }
					/>
				</div>
			) }
		/>
	);
}
