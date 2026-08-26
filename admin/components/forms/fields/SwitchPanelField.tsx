import { Controller, useFormContext } from 'react-hook-form';
import { PropsWithChildren, useEffect } from 'react';
import { ToggleControl } from '@wordpress/components';

export type SwitchPanelFieldProps = PropsWithChildren< {
	name: string;
	label: string;
	onOpen?: () => void;
	onClose?: () => void;
} >;

export default function SwitchPanelField( {
	name,
	label,
	children,
	onOpen,
	onClose,
}: SwitchPanelFieldProps ) {
	const { control, watch } = useFormContext();

	const value = watch( name );

	useEffect( () => {
		if ( value && onOpen ) {
			onOpen();
		} else if ( ! value && onClose ) {
			onClose();
		}
	}, [ value, onOpen, onClose ] );

	return (
		<Controller
			name={ name }
			control={ control }
			defaultValue={ false }
			render={ ( { field } ) => (
				<>
					<ToggleControl
						label={ label }
						checked={ !! field.value }
						onChange={ ( checked ) => field.onChange( checked ) }
					/>
					{ field.value ? <div>{ children }</div> : null }
				</>
			) }
		/>
	);
}
