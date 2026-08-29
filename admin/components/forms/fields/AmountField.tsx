import { TextControl } from '@wordpress/components';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type AmountFieldProps = {
	name: string;
	label: string;
	scale?: number;
};

function formatIntegerAmount(value: unknown, scale: number): string {
	if (value === null || value === undefined || value === '') {
		return '';
	}

	const intValue = Number(value);
	if (!Number.isFinite(intValue)) {
		return '';
	}

	return (intValue / Math.pow(10, scale)).toFixed(scale);
}

function parseDecimalToInteger(value: string, scale: number): number | null {
	const normalized = value.trim().replace(',', '.');
	if (normalized === '') {
		return null;
	}

	const decimal = Number(normalized);
	if (!Number.isFinite(decimal)) {
		return null;
	}

	return Math.round(decimal * Math.pow(10, scale));
}

function AmountControl({ field, fieldState, label, scale }: any) {
	const [displayValue, setDisplayValue] = useState<string>(
		formatIntegerAmount(field.value, scale)
	);

	useEffect(() => {
		setDisplayValue(formatIntegerAmount(field.value, scale));
	}, [field.value, scale]);

	return (
		<div style={{ marginBottom: 16 }}>
			<TextControl
				label={label}
				type="text"
				inputMode="decimal"
				value={displayValue}
				onChange={(value) => {
					setDisplayValue(value);
					const parsed = parseDecimalToInteger(value, scale);
					if (parsed !== null) {
						field.onChange(parsed);
					}
				}}
				onBlur={() => {
					const parsed = parseDecimalToInteger(displayValue, scale);
					if (parsed === null) {
						if (displayValue.trim() === '') {
							field.onChange(null);
						}
						setDisplayValue(formatIntegerAmount(field.value, scale));
						return;
					}

					field.onChange(parsed);
					setDisplayValue(formatIntegerAmount(parsed, scale));
				}}
				help={fieldState.error ? fieldState.error.message : undefined}
			/>
		</div>
	);
}

export default function AmountField({ name, label, scale = 2 }: AmountFieldProps) {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<AmountControl
					field={field}
					fieldState={fieldState}
					label={label}
					scale={scale}
				/>
			)}
		/>
	);
}
